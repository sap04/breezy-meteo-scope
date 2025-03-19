
import { useState, useEffect } from 'react';
import { WeatherForecast } from '@/types/weather';
import { mockWeatherData, getWeatherForLocation } from '@/data/mockWeather';
import { useToast } from '@/components/ui/use-toast';

export function useWeather() {
  const [weather, setWeather] = useState<WeatherForecast>(mockWeatherData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('San Francisco');
  const { toast } = useToast();

  const fetchWeather = async (searchLocation: string = location) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, we would call an actual weather API here
      const data = getWeatherForLocation(searchLocation);
      
      // Animate transition by fading out current data
      setWeather(prev => ({ ...prev, isTransitioning: true }));
      
      // Wait for transition
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update with new data
      setWeather({ ...data, isTransitioning: false });
      setLocation(searchLocation);
      
      toast({
        title: "Weather Updated",
        description: `Showing weather for ${searchLocation}`,
        duration: 2000,
      });
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again.');
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial weather fetch
    fetchWeather();
  }, []);

  return {
    weather,
    loading,
    error,
    location,
    setLocation,
    fetchWeather
  };
}
