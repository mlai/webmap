import React, { useState } from 'react';

interface SearchBoxProps {
  onSearch: (term: string) => void;
  onClear: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, onClear }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleClear = (): void => {
    setSearchTerm('');
    onClear();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear search if input is empty
    if (!value.trim()) {
      onClear();
    }
  };

  return (
    <div className="search-box">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search locations..."
            value={searchTerm}
            onChange={handleChange}
            className="search-input"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="search-clear"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <button type="submit" className="search-button">
          🔍
        </button>
      </form>
    </div>
  );
};

export default SearchBox;