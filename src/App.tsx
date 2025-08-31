import { useState, useEffect } from 'react';
import Map from './components/Map';
import Navigation from './components/Navigation';
import CategoryView from './components/CategoryView';
import SubcategoryView from './components/SubcategoryView';
import SearchBox from './components/SearchBox';
import SearchResultsView from './components/SearchResultsView';
import About from './components/About';
import { fetchLocationsFromGoogleSheets } from './utils/googleSheets';
import { LocationData, CategoryFilter, ActiveView } from './types';
import './App.css';

function App(): React.JSX.Element {
  // Google Sheets URL - replace with your actual spreadsheet URL
  const googleSheetsUrl: string = "https://docs.google.com/spreadsheets/d/1PvOBObJktZaGqF9DdTqPUPD3yT_ygOy5u6LB-rzYuWk";

  const [activeView, setActiveView] = useState<ActiveView>('map');
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<CategoryFilter | null>(null);
  const [showSubcategoryView, setShowSubcategoryView] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [centerLocation, setCenterLocation] = useState<LocationData | null>(null);

  // Load locations data
  useEffect(() => {
    const loadLocations = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLocationsFromGoogleSheets(googleSheetsUrl);
        setLocations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, [googleSheetsUrl]);

  const handleViewChange = (view: ActiveView): void => {
    setActiveView(view);
    // Clear category filter when switching to map view to show all locations
    if (view === 'map') {
      setSelectedCategoryFilter(null);
      setShowSubcategoryView(false);
      setCenterLocation(null); // Clear center location to return to default view
    }
    // Only clear subcategory view when switching away from category views
    if (view !== 'category') {
      setShowSubcategoryView(false);
    }
  };

  const handleCategorySelect = (categoryFilter: CategoryFilter): void => {
    setSelectedCategoryFilter(categoryFilter);
    
    // If it's a subcategory selection, show subcategory view
    if (categoryFilter.subcategory && categoryFilter.showAsTable) {
      setShowSubcategoryView(true);
      setActiveView('category'); // Keep active view as category for navigation
    } else if (categoryFilter.showAsTable) {
      setShowSubcategoryView(false);
      setActiveView('category');
    }
  };

  const handleBackToCategories = (): void => {
    setShowSubcategoryView(false);
    setSelectedCategoryFilter(null);
    setActiveView('category');
  };

  const handleSearch = (term: string): void => {
    setSearchTerm(term);
    
    // Search in name, description, category, and subcategory
    const results = locations.filter(location => 
      location.name.toLowerCase().includes(term.toLowerCase()) ||
      location.description.toLowerCase().includes(term.toLowerCase()) ||
      location.category.toLowerCase().includes(term.toLowerCase()) ||
      (location.subcategory && location.subcategory.toLowerCase().includes(term.toLowerCase()))
    );
    
    setSearchResults(results);
    setActiveView('search');
  };

  const handleClearSearch = (): void => {
    setSearchTerm('');
    setSearchResults([]);
    setActiveView('map');
  };

  const handleLocationClick = (location: LocationData): void => {
    // Navigate to the subcategory page for this location
    if (location.subcategory) {
      setSelectedCategoryFilter({
        category: location.category,
        subcategory: location.subcategory,
        showAsTable: true
      });
      setShowSubcategoryView(true);
      setActiveView('category');
    } else {
      // If no subcategory, show the category page
      setSelectedCategoryFilter({
        category: location.category,
        showAsTable: true
      });
      setShowSubcategoryView(false);
      setActiveView('category');
    }
    
    // Clear search state
  };

  const handleBackToSearch = (): void => {
    setActiveView('search');
  };

  const handleViewMap = (location: LocationData): void => {
    // Clear any category filters to show all locations
    setSelectedCategoryFilter(null);
    setShowSubcategoryView(false);
    // Set the location to center the map on
    setCenterLocation(location);
    // Switch to map view
    setActiveView('map');
  };

  const renderActiveView = (): React.JSX.Element => {
    if (loading) {
      return (
        <div className="loading-overlay">
          <p>Loading locations from Google Sheets...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-overlay">
          <p>Error loading locations: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      );
    }

    switch (activeView) {
      case 'map':
        return (
          <Map 
            googleSheetsUrl={googleSheetsUrl} 
            locations={locations}
            categoryFilter={selectedCategoryFilter}
            centerLocation={centerLocation}
          />
        );
      case 'category':
        // Show subcategory view if we have a subcategory filter
        if (showSubcategoryView && selectedCategoryFilter?.subcategory) {
          return (
            <SubcategoryView 
              locations={locations}
              selectedCategoryFilter={selectedCategoryFilter}
              onBackToCategories={handleBackToCategories}
              onViewMap={handleViewMap}
            />
          );
        }
        // Otherwise show regular category view
        return (
          <CategoryView 
            locations={locations}
            onCategorySelect={handleCategorySelect}
            selectedCategoryFilter={selectedCategoryFilter}
            onViewMap={handleViewMap}
          />
        );
      case 'search':
        return (
          <SearchResultsView
            searchTerm={searchTerm}
            searchResults={searchResults}
            onLocationClick={handleLocationClick}
            onBackToSearch={handleBackToSearch}
          />
        );
      case 'about':
        return <About />;
      default:
        return (
          <Map 
            googleSheetsUrl={googleSheetsUrl} 
            locations={locations}
            categoryFilter={selectedCategoryFilter}
            centerLocation={centerLocation}
          />
        );
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>SVMBC Scout Outings</h1>
        <SearchBox 
          onSearch={handleSearch}
          onClear={handleClearSearch}
        />
      </header>
      <div className="app-body">
        <Navigation 
          activeView={activeView} 
          onViewChange={handleViewChange}
          locations={locations}
          onCategorySelect={handleCategorySelect}
        />
        <main className="main-content">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

export default App;