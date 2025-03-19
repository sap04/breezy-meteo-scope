
import { WeatherForecast, WeatherCondition } from '@/types/weather';

// Helper function to determine icon based on condition
const getIconForCondition = (condition: WeatherCondition): string => {
  switch (condition) {
    case 'sunny':
      return 'sun';
    case 'cloudy':
      return 'cloud';
    case 'rainy':
      return 'cloud-rain';
    case 'snowy':
      return 'cloud-snow';
    default:
      return 'sun';
  }
};

export const mockWeatherData: WeatherForecast = {
  current: {
    location: 'San Francisco',
    temperature: 21,
    feelsLike: 20,
    condition: 'sunny',
    humidity: 45,
    windSpeed: 8,
    pressure: 1012,
    uvIndex: 6,
    visibility: 16.1,
    icon: getIconForCondition('sunny'),
  },
  forecast: [
    {
      day: 'Today',
      date: 'Jul 12',
      temperature: {
        max: 23,
        min: 17
      },
      condition: 'sunny',
      icon: getIconForCondition('sunny'),
      precipitation: 0
    },
    {
      day: 'Tomorrow',
      date: 'Jul 13',
      temperature: {
        max: 21,
        min: 16
      },
      condition: 'cloudy',
      icon: getIconForCondition('cloudy'),
      precipitation: 10
    },
    {
      day: 'Wed',
      date: 'Jul 14',
      temperature: {
        max: 19,
        min: 15
      },
      condition: 'rainy',
      icon: getIconForCondition('rainy'),
      precipitation: 60
    },
    {
      day: 'Thu',
      date: 'Jul 15',
      temperature: {
        max: 18,
        min: 14
      },
      condition: 'rainy',
      icon: getIconForCondition('rainy'),
      precipitation: 80
    },
    {
      day: 'Fri',
      date: 'Jul 16',
      temperature: {
        max: 20,
        min: 15
      },
      condition: 'cloudy',
      icon: getIconForCondition('cloudy'),
      precipitation: 20
    },
    {
      day: 'Sat',
      date: 'Jul 17',
      temperature: {
        max: 22,
        min: 16
      },
      condition: 'sunny',
      icon: getIconForCondition('sunny'),
      precipitation: 0
    },
    {
      day: 'Sun',
      date: 'Jul 18',
      temperature: {
        max: 23,
        min: 17
      },
      condition: 'sunny',
      icon: getIconForCondition('sunny'),
      precipitation: 0
    }
  ]
};

// Function to generate mock weather data for any location
export const getWeatherForLocation = (location: string): WeatherForecast => {
  // For now, return the same data but with updated location
  return {
    ...mockWeatherData,
    current: {
      ...mockWeatherData.current,
      location
    }
  };
};
