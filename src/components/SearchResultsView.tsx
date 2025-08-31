import React from 'react';
import type { SearchResultsViewProps, LocationData } from '../types';

const SearchResultsView: React.FC<SearchResultsViewProps> = ({ searchTerm, searchResults, onLocationClick, onBackToSearch }) => {
  const handleLocationClick = (location: LocationData): void => {
    onLocationClick(location);
  };

  const highlightSearchTerm = (text: string, term: string): React.ReactNode => {
    if (!term || !text) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="search-highlight">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="search-results-view">
      <div className="search-results-header">
        <button 
          className="back-button"
          onClick={onBackToSearch}
        >
          ← Back to Search
        </button>
        <h2>Search Results</h2>
        <p>
          Found {searchResults.length} location{searchResults.length !== 1 ? 's' : ''} 
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>
      
      {searchResults.length === 0 ? (
        <div className="no-results">
          <p>No locations found matching your search.</p>
          <p>Try different keywords or check your spelling.</p>
        </div>
      ) : (
        <div className="search-results-container">
          <div className="search-results-grid">
            {searchResults.map(location => (
              <div key={location.id} className="search-result-card">
                <div className="result-header">
                  <h3 className="result-name">
                    {highlightSearchTerm(location.name, searchTerm)}
                  </h3>
                  <div className="result-category-info">
                    <span className="category-badge">{location.category}</span>
                    {location.subcategory && (
                      <span className="subcategory-badge">{location.subcategory}</span>
                    )}
                  </div>
                </div>
                
                <div className="result-description">
                  {highlightSearchTerm(location.description, searchTerm)}
                </div>
                
                <div className="result-footer">
                  <div className="result-coordinates">
                    📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </div>
                  
                  <div className="result-actions">
                    {location.url && (
                      <a 
                        href={location.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="result-external-link"
                      >
                        Visit Site ↗
                      </a>
                    )}
                    
                    <button
                      onClick={() => handleLocationClick(location)}
                      className="result-view-category"
                    >
                      View {location.subcategory || location.category}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultsView;