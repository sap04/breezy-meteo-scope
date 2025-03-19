
import { WeatherCondition } from '@/types/weather';
import { cn } from '@/lib/utils';

interface WeatherBackgroundProps {
  condition: WeatherCondition;
  children: React.ReactNode;
}

const WeatherBackground = ({ condition, children }: WeatherBackgroundProps) => {
  const getBackgroundClass = () => {
    switch (condition) {
      case 'sunny':
        return 'weather-bg-sunny';
      case 'cloudy':
        return 'weather-bg-cloudy';
      case 'rainy':
        return 'weather-bg-rainy';
      case 'snowy':
        return 'weather-bg-snowy';
      default:
        return 'weather-bg-sunny';
    }
  };
  
  return (
    <div className={cn(
      'min-h-full w-full transition-all duration-700 ease-in-out',
      getBackgroundClass()
    )}>
      <div className="min-h-full w-full weather-gradient">
        {children}
      </div>
    </div>
  );
};

export default WeatherBackground;
