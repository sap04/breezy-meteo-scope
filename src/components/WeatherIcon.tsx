import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { WeatherCondition } from '@/types/weather';

interface WeatherIconProps {
  condition: WeatherCondition;
  icon: string;
  size?: number;
  className?: string;
  animated?: boolean;
}

const WeatherIcon = ({ condition, icon, size = 24, className, animated = true }: WeatherIconProps) => {
  const LucideIcon = LucideIcons[icon as keyof typeof LucideIcons] as React.ElementType;
  
  if (!LucideIcon) {
    console.warn(`Icon ${icon} not found`);
    return null;
  }
  
  // Color mapping based on condition
  const getIconColor = () => {
    switch (condition) {
      case 'sunny':
        return '#FF9800';
      case 'cloudy':
        return '#78909C';
      case 'rainy':
        return '#42A5F5';
      case 'snowy':
        return '#90CAF9';
      default:
        return 'currentColor';
    }
  };
  
  const getAnimation = () => {
    if (!animated) return '';
    
    switch (condition) {
      case 'sunny':
        return 'animate-pulse-light';
      case 'cloudy':
        return 'animate-float';
      case 'rainy':
        return 'animate-slide-down';
      case 'snowy':
        return 'animate-float';
      default:
        return '';
    }
  };
  
  return (
    <div className={cn(
      'weather-icon-container',
      getAnimation(),
      className
    )}>
      <LucideIcon 
        size={size} 
        color={getIconColor()} 
        strokeWidth={1.5} 
      />
    </div>
  );
};

export default WeatherIcon;
