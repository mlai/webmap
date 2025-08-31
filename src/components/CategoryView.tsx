import React, { useState, useMemo, useEffect } from 'react';
import type { CategoryViewProps, LocationData } from '../types';

const CategoryView: React.FC<CategoryViewProps> = ({ locations, onCategorySelect, selectedCategoryFilter, onViewMap }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Check if we should show a specific category based on selectedCategoryFilter
  useEffect(() => {
    if (selectedCategoryFilter?.showAsTable && selectedCategoryFilter?.category) {
      setSelectedCategory(selectedCategoryFilter.category);
    }
  }, [selectedCategoryFilter]);

  // Group locations by category and subcategory
  const categorizedData = useMemo(() => {
    const grouped: Record<string, { items: LocationData[]; subcategories: Record<string, LocationData[]> }> = {};
    
    locations.forEach(location => {
      if (!grouped[location.category]) {
        grouped[location.category] = {
          items: [],
          subcategories: {}
        };
      }
      
      grouped[location.category].items.push(location);
      
      if (location.subcategory) {
        if (!grouped[location.category].subcategories[location.subcategory]) {
          grouped[location.category].subcategories[location.subcategory] = [];
        }
        grouped[location.category].subcategories[location.subcategory].push(location);
      }
    });
    
    return grouped;
  }, [locations]);

  const handleCategoryClick = (category: string): void => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleSubcategoryClick = (category: string, subcategory: string): void => {
    onCategorySelect({ category, subcategory });
  };

  const handleBackToOverview = (): void => {
    setSelectedCategory(null);
    // Clear the category filter when going back to overview
    onCategorySelect({});
  };

  // Show single category or subcategory table view
  if (selectedCategory && selectedCategoryFilter?.showAsTable) {
    const categoryData = categorizedData[selectedCategory];
    if (!categoryData) return <div>Category not found</div>;
    
    // If we have a subcategory filter, show only those locations
    let filteredLocations = categoryData.items;
    let displayTitle = selectedCategory;
    
    if (selectedCategoryFilter.subcategory) {
      filteredLocations = categoryData.items.filter(
        location => location.subcategory === selectedCategoryFilter.subcategory
      );
      displayTitle = selectedCategoryFilter.subcategory;
    }
    
    return (
      <div className="category-table-view">
        <div className="category-table-header">
          <button 
            className="back-button"
            onClick={handleBackToOverview}
          >
            ← Back to Categories
          </button>
          <h2>{displayTitle} Locations</h2>
          <p>{filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''} found</p>
          {selectedCategoryFilter.subcategory && (
            <p className="subcategory-info">
              <span className="subcategory-badge">{selectedCategoryFilter.subcategory}</span>
              {' '}in {selectedCategory}
            </p>
          )}
        </div>
        
        <div className="locations-table-container">
          <table className="locations-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                {selectedCategoryFilter.subcategory && <th>URL</th>}
                {!selectedCategoryFilter.subcategory && <th>Subcategory</th>}
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
                  {selectedCategoryFilter.subcategory && (
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
                  )}
                  {!selectedCategoryFilter.subcategory && (
                    <td className="location-subcategory">
                      {location.subcategory ? (
                        <span className="subcategory-badge">{location.subcategory}</span>
                      ) : (
                        <span className="no-subcategory">—</span>
                      )}
                    </td>
                  )}
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
  }

  if (selectedCategory) {
    const categoryData = categorizedData[selectedCategory];
    return (
      <div className="category-detail-view">
        <div className="category-detail-header">
          <button 
            className="back-button"
            onClick={() => setSelectedCategory(null)}
          >
            ← Back to Categories
          </button>
          <h2>{selectedCategory}</h2>
        </div>
        
        <div className="category-content">
          {Object.keys(categoryData.subcategories).length > 0 ? (
            <div className="subcategories">
              <h3>Subcategories</h3>
              <div className="subcategory-grid">
                {Object.entries(categoryData.subcategories).map(([subcategory, items]) => (
                  <div 
                    key={subcategory}
                    className="subcategory-card"
                    onClick={() => handleSubcategoryClick(selectedCategory, subcategory)}
                  >
                    <h4>{subcategory}</h4>
                    <p>{items.length} location{items.length !== 1 ? 's' : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          
          <div className="all-locations">
            <h3>All {selectedCategory} Locations</h3>
            <div className="location-list">
              {categoryData.items.map(location => (
                <div key={location.id} className="location-item">
                  <h4>{location.name}</h4>
                  <p>{location.description}</p>
                  {location.subcategory && (
                    <span className="subcategory-tag">{location.subcategory}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-overview">
      <h2>Categories</h2>
      <p>Explore locations by category. Click on a category to see subcategories and details.</p>
      
      <div className="category-grid">
        {Object.entries(categorizedData).map(([category, data]) => (
          <div 
            key={category}
            className="category-card"
            onClick={() => handleCategoryClick(category)}
          >
            <h3>{category}</h3>
            <p>{data.items.length} location{data.items.length !== 1 ? 's' : ''}</p>
            {Object.keys(data.subcategories).length > 0 && (
              <p className="subcategory-count">
                {Object.keys(data.subcategories).length} subcategories
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryView;