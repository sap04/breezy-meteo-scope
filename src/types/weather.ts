
export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy';

export interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
  pressure: number;
  uvIndex: number;
  visibility: number;
  icon: string; // icon name from lucide-react
}

export interface ForecastDay {
  day: string; // e.g., "Mon", "Tue"
  date: string; // e.g., "Jul 12"
  temperature: {
    max: number;
    min: number;
  };
  condition: WeatherCondition;
  icon: string; // icon name from lucide-react
  precipitation: number; // % chance of precipitation
}

export interface WeatherForecast {
  current: WeatherData;
  forecast: ForecastDay[];
}
