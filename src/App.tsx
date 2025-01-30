import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { WeatherCard } from '@/components/WeatherCard';
import { useTheme } from '@/contexts/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import { LucideRainbow, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { WeatherResponse } from './types/weather';

interface WeatherError {
  message: string;
  cod?: number | string;
}

function WeatherDashboard() {
  const [city, setCity] = useState('');
  const { theme, toggleTheme } = useTheme();

  const { data, error, isLoading } = useQuery<WeatherResponse & { hourly: WeatherResponse['hourly'] }, WeatherError>({
    queryKey: ['weather', city],
    queryFn: async () => {
      if (!city) return null;

      // Get current weather
      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
      );
      const currentWeather = await currentWeatherResponse.json();

      if (currentWeather.cod !== 200) {
        throw new Error(currentWeather.message);
      }

      // Get hourly forecast data
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
      );
      const forecast = await forecastResponse.json();

      return {
        current: currentWeather,
        hourly: forecast.list
      };
    },
    enabled: !!city,
  });

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 dark:from-gray-900 dark:to-gray-800 p-6 md:p-8 transition-all duration-500"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center gap-4">
            <div id="logo" className="border border-white/20 px-4 py-1 rounded-lg">
              <LucideRainbow className="text-white" size={24} />
            </div>
            <div className="hidden md:block lg:hidden flex-1 max-w-md">
              <SearchBar onSearch={setCity} />
            </div>
            <Button id="toggle-mode" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <Sun className="text-white" size={24} />
              ) : (
                <Moon className="text-white" size={24} />
              )}
            </Button>
          </div>

          <div className={`block md:hidden lg:${data ? "hidden" : "block"}`}>
            <SearchBar onSearch={setCity} />
          </div>

          {isLoading && (
            <div className="text-white text-center">Loading weather data...</div>
          )}

          {error && (
            <div className="text-red-400 text-center bg-white/10 backdrop-blur-md rounded-lg p-4">
              {error.message}
            </div>
          )}

          {data && <WeatherCard data={{ ...data.current, hourly: data.hourly }} setCity={setCity} />}
        </div>
      </div>
    </div>
  );
}

export default WeatherDashboard;