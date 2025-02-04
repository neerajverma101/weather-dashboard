import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { WeatherCard } from '@/components/WeatherCard';
import { useTheme } from '@/contexts/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import { LucideRainbow, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { WeatherResponse } from './../types/weather';
import { weatherApi, unsplashApi } from '@/lib/axiosInstances';

interface WeatherError {
    message: string;
    cod?: number | string;
}

const weatherKeywords: Record<string, string> = {
    Clear: 'sunny,clear-sky',
    Clouds: 'cloudy,clouds',
    Rain: 'rainy,rain',
    Snow: 'snow,winter',
    Thunderstorm: 'storm,lightning',
    Mist: 'foggy,mist',
};

function WeatherDashboard() {
    const [city, setCity] = useState('');
    const { theme, toggleTheme } = useTheme();

    const { data, error, isLoading } = useQuery<WeatherResponse | null, WeatherError>({
        queryKey: ['weather', city],
        queryFn: async (): Promise<WeatherResponse | null> => {
            if (!city) return null;

            // Get current weather
            const currentWeather = await weatherApi.get<WeatherResponse>(`/weather?q=${city}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`);
            if (currentWeather.data.cod !== '200') {
                throw new Error(currentWeather.data.message);
            }

            // Get hourly forecast data
            const forecast = await weatherApi.get<{ list: WeatherResponse['hourly'] }>(`/forecast?q=${city}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`);

            return {
                current: currentWeather.data,
                hourly: forecast.data.list
            };
        },
        enabled: !!city,
    });

    const { data: imageData } = useQuery({
        queryKey: ['background', data?.current?.weather[0]?.main],
        queryFn: async () => {
            if (!data?.current?.weather[0]?.main) return null;

            const keywords = weatherKeywords[data.current.weather[0].main] || 'natural,weather,day,evening,night';
            const response = await unsplashApi.get(`/photos/random?query=${keywords},day,night,evening&orientation=landscape`);
            const imageData = await response.data;
            return imageData.urls.regular;
        },
        enabled: !!data?.current?.weather[0]?.main,
    });

    const backgroundImage = imageData || '';
    const backgroundStyle = backgroundImage
        ? {
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        }
        : {};

    return (
        <div
            className={`min-h-screen ${!backgroundImage ? 'bg-gradient-to-br from-blue-400 to-blue-600' : ''} 
      dark:from-gray-900 dark:to-gray-800 p-6 md:p-8 transition-all duration-500 
      relative ${backgroundImage ? 'bg-cover bg-center bg-no-repeat' : ''}`}
            style={backgroundStyle}
        >
            <div
                className="absolute inset-0 transition-colors duration-500"
                style={{
                    backgroundColor: theme === "dark"
                        ? "rgba(0, 0, 0, 0.6)"  // Darker overlay (not too dark)
                        : "rgba(255, 255, 255, 0.3)", // Light overlay for visibility
                    backdropFilter: "blur(4px)",  // Subtle blur for readability
                }}
            ></div>
            <div className="relative z-1 max-w-6xl mx-auto " style={{
                filter: "brightness(1.1) contrast(1.2)", // Slight boost for clarity
                position: "relative",
                zIndex: 10
            }}>
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
                                <Sun className="text-white dark:text-white" size={24} />
                            ) : (
                                <Moon className="text-gray-800 dark:text-white" size={24} />
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
