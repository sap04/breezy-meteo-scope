
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
  // Color mapping based on condition
  const getIconColor = (weatherCondition: WeatherCondition) => {
    switch (weatherCondition) {
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

  // Convert to PascalCase for Lucide icon name format
  // This ensures that names like "cloud-rain" are properly converted to "CloudRain"
  const formatIconName = (name: string) => {
    // If the icon already follows PascalCase naming convention
    if (/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
      return name;
    }
    
    // Convert dash/hyphen format to PascalCase
    return name.split('-').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join('');
  };
  
  const iconName = formatIconName(icon);
  let IconComponent: React.ElementType | null = null;
  
  // Try to get the icon from Lucide
  if (iconName in LucideIcons) {
    IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ElementType;
  }
  
  // Fallback icons if the specified icon is not found
  if (!IconComponent) {
    console.warn(`Icon ${icon} (${iconName}) not found in Lucide, using fallback`);
    
    const fallbackMap: Record<WeatherCondition, keyof typeof LucideIcons> = {
      sunny: 'Sun',
      cloudy: 'Cloud',
      rainy: 'CloudRain',
      snowy: 'CloudSnow'
    };
    
    const fallbackIconName = fallbackMap[condition];
    IconComponent = LucideIcons[fallbackIconName] as React.ElementType;
  }
  
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
      <IconComponent 
        size={size} 
        color={getIconColor(condition)} 
        strokeWidth={1.5} 
      />
    </div>
  );
};

export default WeatherIcon;
