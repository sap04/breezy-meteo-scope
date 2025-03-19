
import { ForecastDay } from '@/types/weather';
import WeatherIcon from './WeatherIcon';
import { Umbrella } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ForecastListProps {
  forecast: ForecastDay[];
  className?: string;
}

const ForecastList = ({ forecast, className }: ForecastListProps) => {
  return (
    <div className={cn('p-6 max-w-4xl mx-auto w-full', className)}>
      <h2 className="text-2xl font-light mb-4">7-Day Forecast</h2>
      
      <div className="overflow-x-auto pb-2 -mx-6 px-6">
        <div className="flex space-x-3 min-w-max">
          {forecast.map((day, index) => (
            <div 
              key={index} 
              className="forecast-card min-w-[130px] animate-fade-in"
              style={{ animationDelay: `${0.2 + index * 0.05}s` }}
            >
              <div className="text-center mb-2">
                <div className="font-medium">{day.day}</div>
                <div className="text-xs text-gray-500">{day.date}</div>
              </div>
              
              <div className="flex justify-center mb-3">
                <WeatherIcon 
                  condition={day.condition} 
                  icon={day.icon} 
                  size={36}
                  animated={false}
                />
              </div>
              
              <div className="text-center mb-2">
                <div className="flex items-center justify-center text-sm">
                  <span className="font-medium">{day.temperature.max}°</span>
                  <span className="mx-1 text-gray-300">|</span>
                  <span className="text-gray-500">{day.temperature.min}°</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center text-xs text-gray-500">
                <Umbrella size={12} className="mr-1 text-blue-400" />
                {day.precipitation}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForecastList;
