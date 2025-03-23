
import { WeatherData, WeatherForecast, ForecastDay, WeatherCondition } from '@/types/weather';

// Open-Meteo API base URL
const BASE_URL = 'https://api.open-meteo.com/v1';
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';

// Map Open-Meteo WMO codes to our app's conditions
// WMO Weather interpretation codes: https://open-meteo.com/en/docs
const mapWeatherCondition = (code: number): WeatherCondition => {
  // Clear
  if (code === 0 || code === 1) return 'sunny';
  // Cloudy or partly cloudy
  if (code >= 2 && code <= 3) return 'cloudy';
  // Fog, drizzle, or rain
  if ((code >= 4 && code <= 10) || (code >= 45 && code <= 67)) return 'rainy';
  // Snow
  if (code >= 71 && code <= 86) return 'snowy';
  // Thunderstorm
  if (code >= 95 && code <= 99) return 'rainy';
  
  return 'sunny'; // Default
};

// Map WMO codes to Lucide icon names
const mapWeatherIcon = (code: number, isDay: boolean): string => {
  const iconMap: Record<number, string> = {
    // Clear sky
    0: isDay ? 'Sun' : 'Moon',
    // Mainly clear
    1: isDay ? 'SunDim' : 'MoonDim',
    // Partly cloudy
    2: isDay ? 'CloudSun' : 'CloudMoon',
    // Overcast
    3: 'Cloud',
    // Fog
    45: 'CloudFog',
    46: 'CloudFog',
    // Drizzle
    51: 'CloudDrizzle',
    53: 'CloudDrizzle',
    55: 'CloudDrizzle',
    // Freezing Drizzle
    56: 'CloudDrizzle',
    57: 'CloudDrizzle',
    // Rain
    61: 'CloudRain',
    63: 'CloudRain',
    65: 'CloudRain',
    // Freezing Rain
    66: 'CloudRain',
    67: 'CloudRain',
    // Snow
    71: 'CloudSnow',
    73: 'CloudSnow',
    75: 'CloudSnow',
    // Snow grains
    77: 'CloudSnow',
    // Shower
    80: 'CloudDrizzle',
    81: 'CloudRain',
    82: 'CloudRain',
    // Snow shower
    85: 'CloudSnow',
    86: 'CloudSnow',
    // Thunderstorm
    95: 'CloudLightning',
    96: 'CloudLightning',
    99: 'CloudLightning'
  };

  return iconMap[code] || 'Cloud';
};

// Format the date for forecast display
const formatDay = (dateStr: string): { day: string; date: string } => {
  const date = new Date(dateStr);
  const day = date.toLocaleDateString('en-US', { weekday: 'short' });
  const dateFormatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return { day, date: dateFormatted };
};

// Get coordinates from location name
const getLocationCoordinates = async (location: string): Promise<{ lat: number; lon: number; name: string }> => {
  try {
    const response = await fetch(
      `${GEO_URL}?name=${encodeURIComponent(location)}&count=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to geocode location');
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      throw new Error('Location not found');
    }
    
    const result = data.results[0];
    return {
      lat: result.latitude,
      lon: result.longitude,
      name: result.name
    };
  } catch (error) {
    console.error('Error geocoding location:', error);
    throw error;
  }
};

// Fetch current weather data and forecast
export const fetchWeatherForecast = async (location: string): Promise<WeatherForecast> => {
  try {
    // First get coordinates from location name
    const { lat, lon, name } = await getLocationCoordinates(location);
    
    // Fetch weather data from Open-Meteo
    const response = await fetch(
      `${BASE_URL}/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,visibility,is_day` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
      `&timezone=auto`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const data = await response.json();
    
    // Process current weather
    const currentWeather: WeatherData = {
      location: name,
      temperature: Math.round(data.current.temperature_2m),
      feelsLike: Math.round(data.current.apparent_temperature),
      condition: mapWeatherCondition(data.current.weather_code),
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      pressure: data.current.pressure_msl,
      uvIndex: 0, // UV index not provided in this API endpoint by default
      visibility: Math.round(data.current.visibility / 1000), // Convert from meters to km
      icon: mapWeatherIcon(data.current.weather_code, data.current.is_day === 1),
    };
    
    // Process 7-day forecast
    const forecastDays: ForecastDay[] = [];
    
    for (let i = 0; i < data.daily.time.length && i < 7; i++) {
      const { day, date } = formatDay(data.daily.time[i]);
      
      forecastDays.push({
        day,
        date,
        temperature: {
          max: Math.round(data.daily.temperature_2m_max[i]),
          min: Math.round(data.daily.temperature_2m_min[i]),
        },
        condition: mapWeatherCondition(data.daily.weather_code[i]),
        icon: mapWeatherIcon(data.daily.weather_code[i], true), // Assume daytime for forecast icons
        precipitation: data.daily.precipitation_probability_max[i],
      });
    }
    
    return {
      current: currentWeather,
      forecast: forecastDays,
    };
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
};

// For backward compatibility - uses the same function now
export const fetchCurrentWeather = async (location: string): Promise<WeatherData> => {
  const forecast = await fetchWeatherForecast(location);
  return forecast.current;
};
