import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { geoApi } from '@/lib/axiosInstances';

interface SearchBarProps {
  onSearch: (city: string) => void;
  className?: string;
}

interface Suggestion {
  name: string;
  country: string;
  state?: string;
  lat?: number;
  lon?: number;
}

export function SearchBar({ onSearch, className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });

  const addToRecentSearches = (searchTerm: string) => {
    const updatedSearches = [searchTerm, ...recentSearches.filter(item => item !== searchTerm)]
      .slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const data = await geoApi.get(`/direct?q=${query}&limit=5&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`);
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      addToRecentSearches(query.trim());
      setQuery('');
      setShowDropdown(false);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className={cn("relative max-w-md w-full mx-auto", className)}>
      <form onSubmit={handleSubmit} className="flex gap-2 border-b-2 border-b-[#ffffff94] border-solid pr-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search for a city..."
          className="dark:text-white bg-transparent border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button type="submit" className="dark:text-white bg-transparent">
          <Search size={20} />
        </Button>
      </form>

      {showDropdown && (suggestions.length > 0 || recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 backdrop-blur-md rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg z-50">
          <ul>
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      const searchTerm = `${suggestion.name}, ${suggestion.country}`;
                      onSearch(searchTerm);
                      addToRecentSearches(searchTerm);
                      setShowDropdown(false);
                      setQuery('');
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-white z-10"
                  >
                    {suggestion.name}, {suggestion.state && `${suggestion.state}, `}{suggestion.country}
                  </button>
                </li>
              ))
            ) : (
              <>
                <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  Recent Searches
                  {recentSearches.length > 0 && (
                    <button
                      onClick={clearRecentSearches}
                      className="float-right text-xs text-blue-500 hover:text-blue-700"
                    >
                      Clear
                    </button>
                  )}
                </li>
                {recentSearches.map((search, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        onSearch(search);
                        addToRecentSearches(search);
                        setShowDropdown(false);
                        setQuery('');
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-white"
                    >
                      {search}
                    </button>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}