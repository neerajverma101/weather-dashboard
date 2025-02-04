import { getLocalTime, kelvinToCelsius } from '@/lib/utils';
import { WeatherResponse } from '@/types/weather';
import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, Droplets, Sun, Thermometer, Wind } from 'lucide-react';
import React from 'react';
import { HourlyForecast } from './HourlyForecast';
import { SearchBar } from './SearchBar';

interface WeatherCardProps {
  data: WeatherResponse;
  setCity: (city: string) => void;
}

const weatherIcons: Record<string, React.FC> = {
  Clear: Sun,
  Clouds: Cloud,
  Rain: CloudRain,
  Snow: CloudSnow,
  Thunderstorm: CloudLightning,
  Mist: CloudFog
};

export function WeatherCard({ data, setCity }: WeatherCardProps) {
  const WeatherIcon = weatherIcons[data.weather[0].main] || Cloud;
  const temp = kelvinToCelsius(data.main.temp);
  const maxTemp = kelvinToCelsius(data.main.temp_max);
  const minTemp = kelvinToCelsius(data.main.temp_min);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="hidden lg:block lg:ml-0 lg:mr-0 mb-8">
        <div></div>
        <SearchBar onSearch={setCity} />
      </div>
      {/* Main Weather Display */}
      <div className='lg:flex gap-8'>
        <div className="flex flex-col md:flex-row items-start justify-between mb-8 md:justify-center">
          <div className="flex items-center gap-4 mb-4 md:mb-0 flex-wrap">
            <WeatherIcon size={48} className="text-white" />
            <div>
              <div className="flex items-baseline">
                <span className="text-7xl font-light text-white sm:text-3xl md:text-5xl">{temp}&#176;</span>
                <span className="text-5xl text-white/80 ml-1 sm:text-2xl md:text-xl">C</span>
              </div>
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-semibold text-white">{data.name}</h2>
              <div className="text-white/80">{getLocalTime(data.timezone, "time")}</div>
              <div className="text-white/80">{getLocalTime(data.timezone, 'date')}</div>
            </div>
          </div>
        </div>

        {/* Weather Details */}
        <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 flex-1 dark:bg-white/40">
          <p className="text-lg text-white/95 mb-4 text-center">
            {data.weather[0].description.toUpperCase()}
          </p>
          <div className="">
            <div className="flex items-center justify-between ">
              <span className="text-white/80">Max</span>
              <span className="text-xl text-white flex items-center gap-1 md:gap-2 lg:gap-4">{maxTemp}&#176; <Thermometer className="text-white/80" /></span>
            </div>
            <div className="flex items-center justify-between ">
              <span className="text-white/80">Min</span>
              <span className="text-xl text-white flex items-center gap-1 md:gap-2 lg:gap-4">{minTemp}&#176; <Thermometer className="text-white/80" /></span>
            </div>
            <div className="flex items-center justify-between ">
              <span className="text-white/80">Humidity</span>
              <span className="text-xl text-white flex items-center gap-1 md:gap-2 lg:gap-4">{data.main.humidity}% <Droplets className="text-white/80" /></span>
            </div>
            <div className="flex items-center justify-between ">
              <span className="text-white/80">Wind</span>
              <span className="text-xl text-white flex items-center gap-1 md:gap-2 lg:gap-4">{data.wind.speed}km/h <Wind className="text-white/80" /></span>
            </div>
          </div>
          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
          <HourlyForecast data={data.hourly} timezone={data.timezone} />
        </div>
      </div>
    </div>
  );
}