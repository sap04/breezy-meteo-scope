
import { WeatherData, WeatherForecast, ForecastDay, WeatherCondition } from '@/types/weather';

// OpenWeather API key
const API_KEY = '1ff00422cd19027950da54450d08b94b'; // Replace this with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Map OpenWeather conditions to our app's conditions
const mapWeatherCondition = (condition: string): WeatherCondition => {
  if (condition.includes('clear')) return 'sunny';
  if (condition.includes('cloud')) return 'cloudy';
  if (condition.includes('rain') || condition.includes('drizzle')) return 'rainy';
  if (condition.includes('snow')) return 'snowy';
  return 'sunny'; // Default
};

// Map OpenWeather icon codes to Lucide icon names
const mapWeatherIcon = (iconCode: string): string => {
  const iconMap: Record<string, string> = {
    '01d': 'Sun', // clear sky day
    '01n': 'Moon', // clear sky night
    '02d': 'CloudSun', // few clouds day
    '02n': 'CloudMoon', // few clouds night
    '03d': 'Cloud', // scattered clouds
    '03n': 'Cloud',
    '04d': 'Cloud', // broken clouds (changed from 'Clouds' which doesn't exist in lucide)
    '04n': 'Cloud',
    '09d': 'CloudDrizzle', // shower rain
    '09n': 'CloudDrizzle',
    '10d': 'CloudRain', // rain day
    '10n': 'CloudRain', // rain night
    '11d': 'CloudLightning', // thunderstorm
    '11n': 'CloudLightning',
    '13d': 'CloudSnow', // snow
    '13n': 'CloudSnow',
    '50d': 'CloudFog', // mist
    '50n': 'CloudFog',
  };
  return iconMap[iconCode] || 'Cloud';
};

// Format the date for forecast display
const formatDay = (timestamp: number): { day: string; date: string } => {
  const date = new Date(timestamp * 1000);
  const day = date.toLocaleDateString('en-US', { weekday: 'short' });
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return { day, date: dateStr };
};

// Fetch current weather data
export const fetchCurrentWeather = async (location: string): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(location)}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const data = await response.json();
    
    return {
      location: data.name,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: mapWeatherCondition(data.weather[0].main.toLowerCase()),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      pressure: data.main.pressure,
      uvIndex: 0, // UV index not provided in this API endpoint
      visibility: Math.round(data.visibility / 1000), // Convert from meters to km
      icon: mapWeatherIcon(data.weather[0].icon),
    };
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

// Fetch 7-day forecast
export const fetchWeatherForecast = async (location: string): Promise<WeatherForecast> => {
  try {
    // First get coordinates from location name
    const geoResponse = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`
    );
    
    if (!geoResponse.ok) {
      throw new Error('Failed to geocode location');
    }
    
    const geoData = await geoResponse.json();
    
    if (!geoData.length) {
      throw new Error('Location not found');
    }
    
    const { lat, lon } = geoData[0];
    
    // Then get the 5-day forecast
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    if (!forecastResponse.ok) {
      throw new Error('Failed to fetch forecast data');
    }
    
    const forecastData = await forecastResponse.json();
    
    // Get current weather
    const currentWeather = await fetchCurrentWeather(location);
    
    // Process the forecast data to get daily forecasts
    // OpenWeather free API gives us forecast in 3-hour intervals, so we need to process it
    const forecastDays: ForecastDay[] = [];
    const dailyData: Record<string, any> = {};
    
    // Group forecast data by day
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toDateString();
      
      if (!dailyData[date]) {
        dailyData[date] = {
          temps: [],
          conditions: [],
          icons: [],
          dt: item.dt,
          precipitation: 0,
        };
      }
      
      dailyData[date].temps.push(item.main.temp);
      dailyData[date].conditions.push(item.weather[0].main.toLowerCase());
      dailyData[date].icons.push(item.weather[0].icon);
      
      // Calculate chance of precipitation
      if (item.pop) {
        dailyData[date].precipitation = Math.max(dailyData[date].precipitation, Math.round(item.pop * 100));
      }
    });
    
    // Convert grouped data to forecast days
    Object.keys(dailyData).forEach((date) => {
      const dayData = dailyData[date];
      const { day, date: dateStr } = formatDay(dayData.dt);
      
      // Calculate most common condition and icon
      const conditionCounts: Record<string, number> = {};
      dayData.conditions.forEach((condition: string) => {
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
      });
      
      const mostCommonCondition = Object.keys(conditionCounts).reduce((a, b) => 
        conditionCounts[a] > conditionCounts[b] ? a : b
      );
      
      const iconCounts: Record<string, number> = {};
      dayData.icons.forEach((icon: string) => {
        iconCounts[icon] = (iconCounts[icon] || 0) + 1;
      });
      
      const mostCommonIcon = Object.keys(iconCounts).reduce((a, b) => 
        iconCounts[a] > iconCounts[b] ? a : b
      );
      
      forecastDays.push({
        day,
        date: dateStr,
        temperature: {
          max: Math.round(Math.max(...dayData.temps)),
          min: Math.round(Math.min(...dayData.temps)),
        },
        condition: mapWeatherCondition(mostCommonCondition),
        icon: mapWeatherIcon(mostCommonIcon),
        precipitation: dayData.precipitation,
      });
    });
    
    // Limit to 7 days
    const limitedForecast = forecastDays.slice(0, 7);
    
    return {
      current: currentWeather,
      forecast: limitedForecast,
    };
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
};
