
import { WeatherData } from '@/types/weather';
import WeatherIcon from './WeatherIcon';
import { Droplets, Wind, Gauge, Sun, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CurrentWeatherProps {
  data: WeatherData;
  className?: string;
}

const CurrentWeather = ({ data, className }: CurrentWeatherProps) => {
  const { location, temperature, feelsLike, condition, humidity, windSpeed, pressure, uvIndex, visibility, icon } = data;
  
  const metrics = [
    { label: 'Humidity', value: `${humidity}%`, icon: <Droplets size={22} className="text-blue-500" /> },
    { label: 'Wind Speed', value: `${windSpeed} km/h`, icon: <Wind size={22} className="text-blue-300" /> },
    { label: 'Pressure', value: `${pressure} hPa`, icon: <Gauge size={22} className="text-gray-500" /> },
    { label: 'UV Index', value: `${uvIndex}`, icon: <Sun size={22} className="text-yellow-500" /> },
    { label: 'Visibility', value: `${visibility} km`, icon: <Eye size={22} className="text-indigo-400" /> },
  ];
  
  return (
    <div className={cn('p-6 max-w-4xl mx-auto w-full animate-fade-in', className)}>
      {/* Location and Date */}
      <div className="text-center mb-8 animate-slide-down">
        <h1 className="text-3xl font-light">{location}</h1>
        <p className="text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
      </div>
      
      {/* Current Temperature and Condition */}
      <div className="flex flex-col items-center justify-center gap-4 mb-10">
        <WeatherIcon condition={condition} icon={icon} size={60} animated />
        
        <div className="text-center">
          <div className="text-7xl font-extralight mb-1">{temperature}°</div>
          <div className="text-gray-500 flex items-center justify-center gap-1">
            Feels like: {feelsLike}° • {condition.charAt(0).toUpperCase() + condition.slice(1)}
          </div>
        </div>
      </div>
      
      {/* Weather Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {metrics.map((metric, index) => (
          <div 
            key={index} 
            className="weather-metric hover:shadow-lg hover:scale-105 transition-all" 
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="mb-1">{metric.icon}</div>
            <div className="font-medium">{metric.value}</div>
            <div className="text-xs text-gray-500">{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentWeather;
