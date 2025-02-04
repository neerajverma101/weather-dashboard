import { kelvinToCelsius } from '@/lib/utils';
import { WeatherResponse } from '@/types/weather';
import { getLocalTimeFromUTC } from '@/lib/utils';

interface HourlyForecastProps {
    data: Required<WeatherResponse>['hourly']
}

export function HourlyForecast({ data, timezone }: HourlyForecastProps) {
    return (
        <div className="mt-6">
            <div className="grid grid-cols-1 gap-2">
                {data.slice(0, 8).map((hour, index) => (
                    <div
                        key={index}
                        className="flex items-center py-3 justify-between"
                    >
                        <div className='flex'>
                            <img
                                src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                                alt={hour.weather[0].description}
                                className="w-12 h-12"
                            />
                            <div className='flex flex-col'>
                                <span className="text-white/80 text-sm">
                                    {getLocalTimeFromUTC(hour.dt, timezone, 'time')}
                                </span>
                                <span className='text-white/80 text-sm'>{hour.weather[0].main}</span>
                            </div>
                        </div>

                        <span className="text-white font-semibold">
                            {kelvinToCelsius(hour.main.temp)}&#176;
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
} 