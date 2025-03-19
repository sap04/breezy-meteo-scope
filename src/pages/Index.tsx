
import { useState, useEffect } from 'react';
import { useWeather } from '@/hooks/useWeather';
import CurrentWeather from '@/components/CurrentWeather';
import ForecastList from '@/components/ForecastList';
import SearchBar from '@/components/SearchBar';
import WeatherBackground from '@/components/WeatherBackground';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

const Index = () => {
  const { weather, loading, error, location, fetchWeather } = useWeather();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll events to add effects to the search bar
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 10);
  };
  
  return (
    <WeatherBackground condition={weather.current.condition}>
      <div 
        className="h-full w-full overflow-auto pt-16 pb-8"
        onScroll={handleScroll}
      >
        {/* Search Bar */}
        <div className={cn(
          'search-container sticky top-0 z-10 px-4 py-3 transition-all duration-300',
          isScrolled ? 'bg-white/70 backdrop-blur-md shadow-sm' : 'bg-transparent'
        )}>
          <SearchBar 
            onSearch={fetchWeather} 
            initialValue={location}
            className="mx-auto transition-all duration-300 ease-in-out"
            isLoading={loading}
          />
        </div>
        
        {/* Content Area */}
        <div className="max-w-4xl mx-auto px-4">
          {error ? (
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-medium text-red-700 mb-2">Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => fetchWeather(location)}
                className="px-4 py-2 bg-primary text-white rounded-full"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className={cn(
              'transition-opacity duration-300 ease-in-out',
              loading ? 'opacity-50' : 'opacity-100',
              weather.isTransitioning ? 'opacity-0' : 'opacity-100'
            )}>
              {/* Current Weather */}
              <CurrentWeather data={weather.current} />
              
              {/* Forecast */}
              <ForecastList forecast={weather.forecast} />
            </div>
          )}
        </div>
      </div>
    </WeatherBackground>
  );
};

export default Index;
