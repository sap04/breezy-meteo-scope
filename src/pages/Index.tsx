
import { useState } from 'react';
import { useWeather } from '@/hooks/useWeather';
import CurrentWeather from '@/components/CurrentWeather';
import ForecastList from '@/components/ForecastList';
import SearchBar from '@/components/SearchBar';
import WeatherBackground from '@/components/WeatherBackground';
import { cn } from '@/lib/utils';

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
          'search-container',
          isScrolled ? 'bg-white/70 backdrop-blur-md shadow-sm' : 'bg-transparent'
        )}>
          <SearchBar 
            onSearch={fetchWeather} 
            initialValue={location}
            className="transition-all duration-300 ease-in-out"
          />
        </div>
        
        {/* Content Area */}
        <div className="max-w-4xl mx-auto px-4">
          {error ? (
            <div className="p-6 text-center text-red-500">
              <p>{error}</p>
              <button 
                onClick={() => fetchWeather(location)}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-full"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className={cn(
                'transition-opacity duration-300 ease-in-out',
                loading ? 'opacity-50' : 'opacity-100'
              )}>
                {/* Current Weather */}
                <CurrentWeather data={weather.current} />
                
                {/* Forecast */}
                <ForecastList forecast={weather.forecast} />
              </div>
            </>
          )}
        </div>
      </div>
    </WeatherBackground>
  );
};

export default Index;
