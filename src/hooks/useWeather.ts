
import { useState, useEffect } from 'react';
import { WeatherForecast } from '@/types/weather';
import { mockWeatherData } from '@/data/mockWeather';
import { fetchWeatherForecast } from '@/services/weatherService';
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
      // Set transition state
      setWeather(prev => ({ ...prev, isTransitioning: true }));
      
      // Wait for transition animation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Fetch real weather data
      const data = await fetchWeatherForecast(searchLocation);
      
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      
      // Revert to non-transitioning state on error
      setWeather(prev => ({ ...prev, isTransitioning: false }));
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial weather fetch - start with real data
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
