import React, { useState, useMemo } from 'react';
import { LocationData, CategoryFilter, ActiveView } from '../types';

interface NavigationProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  locations?: LocationData[];
  onCategorySelect: (filter: CategoryFilter) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange, locations = [], onCategorySelect }) => {
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true); // Start expanded by default
  
  // Group locations by category (main categories from data source)
  const categorizedData = useMemo(() => {
    const grouped: Record<string, { items: LocationData[]; subcategories: Set<string> }> = {};
    
    locations.forEach(location => {
      const category = location.category; // This is the main category like "Camping", "Backpacking", etc.
      
      if (!grouped[category]) {
        grouped[category] = {
          items: [],
          subcategories: new Set()
        };
      }
      
      grouped[category].items.push(location);
      
      // Add subcategories if they exist
      if (location.subcategory) {
        grouped[category].subcategories.add(location.subcategory);
      }
    });
    
    // Convert subcategories Set to sorted Array and sort categories
    const sortedCategories: Record<string, { items: LocationData[]; subcategories: string[] }> = {};
    Object.keys(grouped).sort().forEach(category => {
      sortedCategories[category] = {
        ...grouped[category],
        subcategories: Array.from(grouped[category].subcategories).sort()
      };
    });
    
    return sortedCategories;
  }, [locations]);

  const navItems = [
    { id: 'map', label: 'Map' },
    { 
      id: 'category', 
      label: 'Category',
      hasSubmenu: true,
      submenu: Object.entries(categorizedData).map(([category, data]) => ({
        id: `category-${category}`,
        label: category, // This will be "Camping", "Backpacking", "Winter activities", etc.
        category: category,
        subcategories: data.subcategories.map(subcategory => ({
          id: `subcategory-${category}-${subcategory}`,
          label: subcategory,
          category: category,
          subcategory: subcategory
        }))
      }))
    },
    { id: 'about', label: 'About' }
  ];

  const handleMainItemClick = (item: { id: string; label: string; hasSubmenu?: boolean }): void => {
    if (item.hasSubmenu) {
      // Only toggle expansion when explicitly clicking Category
      setIsCategoryExpanded(!isCategoryExpanded);
      // If category is not already active, also switch to category view
      if (activeView !== 'category') {
        onViewChange('category');
      }
    } else {
      onViewChange(item.id as ActiveView);
      // Keep category submenu expanded even when switching to other views
      // Don't collapse it automatically
    }
  };

  const handleCategoryItemClick = (categoryItem: { category: string }): void => {
    // Switch to category view and show this specific category (e.g., "Camping")
    onCategorySelect({ category: categoryItem.category, showAsTable: true });
    onViewChange('category');
    // Keep menu expanded
  };

  const handleSubcategoryItemClick = (subcategoryItem: { category: string; subcategory: string }): void => {
    // Switch to category view and show this specific subcategory within the category
    onCategorySelect({ 
      category: subcategoryItem.category, 
      subcategory: subcategoryItem.subcategory, 
      showAsTable: true 
    });
    onViewChange('category');
    // Keep menu expanded
  };

  return (
    <nav className="navigation">
      <ul className="nav-list">
        {navItems.map(item => (
          <li key={item.id} className="nav-item">
            <button
              className={`nav-button ${activeView === item.id ? 'active' : ''} ${item.hasSubmenu ? 'has-submenu' : ''}`}
              onClick={() => handleMainItemClick(item)}
            >
              {item.label}
              {item.hasSubmenu && (
                <span className={`submenu-arrow ${isCategoryExpanded ? 'expanded' : ''}`}>
                  ▼
                </span>
              )}
            </button>
            
            {item.hasSubmenu && isCategoryExpanded && (
              <ul className="nav-submenu">
                {item.submenu.map(subItem => (
                  <li key={subItem.id} className="nav-subitem">
                    <button
                      className="nav-subbutton"
                      onClick={() => handleCategoryItemClick(subItem)}
                    >
                      {subItem.label}
                    </button>
                    
                    {subItem.subcategories && subItem.subcategories.length > 0 && (
                      <ul className="nav-subsubmenu">
                        {subItem.subcategories.map(subSubItem => (
                          <li key={subSubItem.id} className="nav-subsubitem">
                            <button
                              className="nav-subsubbutton"
                              onClick={() => handleSubcategoryItemClick(subSubItem)}
                            >
                              {subSubItem.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;