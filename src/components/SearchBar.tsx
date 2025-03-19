
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (location: string) => void;
  initialValue?: string;
  className?: string;
}

const SearchBar = ({ onSearch, initialValue = '', className }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      // Don't clear input, just blur it
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    inputRef.current?.focus();
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        'relative flex items-center max-w-md w-full transition-all duration-300',
        isFocused ? 'scale-105' : 'scale-100',
        className
      )}
    >
      <div className="relative flex-1">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pr-10 pl-4 h-12 rounded-full border-transparent bg-white/80 backdrop-blur-md shadow-glass focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>
      <Button 
        type="submit" 
        size="icon" 
        className="ml-2 h-12 w-12 rounded-full bg-primary/90 text-white shadow-md hover:bg-primary transition-colors"
      >
        <Search size={18} />
      </Button>
    </form>
  );
};

export default SearchBar;
