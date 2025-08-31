import React from 'react';
import type { SubcategoryViewProps } from '../types';

const SubcategoryView: React.FC<SubcategoryViewProps> = ({ locations, selectedCategoryFilter, onBackToCategories, onViewMap }) => {
  if (!selectedCategoryFilter?.category || !selectedCategoryFilter?.subcategory) {
    return <div>Invalid subcategory selection</div>;
  }

  // Filter locations by category and subcategory
  const filteredLocations = locations.filter(location => 
    location.category === selectedCategoryFilter.category && 
    location.subcategory === selectedCategoryFilter.subcategory
  );

  const handleBackClick = (): void => {
    onBackToCategories();
  };

  return (
    <div className="subcategory-view">
      <div className="subcategory-header">
        <button 
          className="back-button"
          onClick={handleBackClick}
        >
          ← Back to Categories
        </button>
        <h2>{selectedCategoryFilter.subcategory} Locations</h2>
        <p>{filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''} found</p>
        <p className="subcategory-info">
          <span className="subcategory-badge">{selectedCategoryFilter.subcategory}</span>
          {' '}in {selectedCategoryFilter.category}
        </p>
      </div>
      
      <div className="locations-table-container">
        <table className="locations-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>URL</th>
              <th>Map</th>
            </tr>
          </thead>
          <tbody>
            {filteredLocations.map(location => (
              <tr key={location.id} className="location-row">
                <td className="location-name">{location.name}</td>
                <td className="location-description">
                  <div className="description-content">
                    {location.description}
                  </div>
                </td>
                <td className="location-url">
                  {location.url ? (
                    <button
                      onClick={() => window.open(location.url, '_blank', 'noopener,noreferrer')}
                      className="map-link-button"
                    >
                      Visit Site
                    </button>
                  ) : (
                    <span className="no-url">—</span>
                  )}
                </td>
                <td className="location-map">
                  <button
                    onClick={() => onViewMap(location)}
                    className="map-link-button"
                  >
                    View on Map
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubcategoryView;