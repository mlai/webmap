import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fetchLocationsFromGoogleSheets } from '../utils/googleSheets';
import { LocationData, CategoryFilter } from '../types';

// Fix for default markers in React Leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

// Component to handle map view changes
interface MapControllerProps {
  centerLocation: LocationData | null;
}

const MapController: React.FC<MapControllerProps> = ({ centerLocation }) => {
  const map = useMap();
  
  useEffect(() => {
    if (centerLocation) {
      map.setView([centerLocation.latitude, centerLocation.longitude], 12);
    }
  }, [centerLocation, map]);
  
  return null;
};

// Define colors for different categories
const categoryColors: Record<string, string> = {
  'Camping': '#28a745',      // Green
  'Backpacking': '#6f42c1',  // Purple  
  'Winter activities': '#17a2b8', // Teal
  'Hiking': '#fd7e14',       // Orange
  'Water activities': '#007bff', // Blue
  'Rock climbing': '#dc3545', // Red
  'Cycling': '#20c997',      // Mint green
  'Educational': '#ffc107',   // Yellow
  'Service': '#6c757d'       // Gray
};

// Function to create colored marker icon
const createColoredIcon = (color: string): L.Icon => {
  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path fill="${color}" stroke="#000" stroke-width="1" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 7.4 12.5 28.5 12.5 28.5s12.5-21.1 12.5-28.5C25 5.6 19.4 0 12.5 0z"/>
        <circle fill="#fff" cx="12.5" cy="12.5" r="7"/>
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
  });
};

// Create icons for each category
const categoryIcons: Record<string, L.Icon> = Object.fromEntries(
  Object.entries(categoryColors).map(([category, color]) => [
    category,
    createColoredIcon(color)
  ])
);

interface MapProps {
  googleSheetsUrl: string;
  locations?: LocationData[];
  categoryFilter?: CategoryFilter | null;
  centerLocation?: LocationData | null;
}

const Map: React.FC<MapProps> = ({ googleSheetsUrl, locations = [], categoryFilter, centerLocation }) => {
  // Center map on Northern California by default, or on the specified location
  const defaultCenter: [number, number] = [38.5, -121.0];
  const center: [number, number] = centerLocation 
    ? [centerLocation.latitude, centerLocation.longitude] 
    : defaultCenter;
  const zoom: number = centerLocation ? 12 : 8; // Zoom in more when centering on a specific location

  // State for locations data (fallback if not provided via props)
  const [localLocations, setLocalLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Use provided locations or fetch them locally
  const effectiveLocations: LocationData[] = locations.length > 0 ? locations : localLocations;

  // Fetch locations from Google Sheets if not provided via props
  useEffect(() => {
    if (locations.length === 0) {
      const loadLocations = async (): Promise<void> => {
        if (!googleSheetsUrl) {
          setError('No Google Sheets URL provided');
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          setError(null);
          const data = await fetchLocationsFromGoogleSheets(googleSheetsUrl);
          setLocalLocations(data);
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
          setLoading(false);
        }
      };

      loadLocations();
    }
  }, [googleSheetsUrl, locations.length]);

  // Get unique categories from locations data
  const categories: string[] = useMemo(() => {
    return [...new Set(effectiveLocations.map(location => location.category))];
  }, [effectiveLocations]);

  // State for selected categories (all selected by default)
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  // Update selected categories when categories change or when no filter is applied
  useEffect(() => {
    if (!categoryFilter) {
      setSelectedCategories(new Set(categories));
    }
  }, [categories, categoryFilter]);

  // Apply category filter if provided
  useEffect(() => {
    if (categoryFilter) {
      if (categoryFilter.subcategory && categoryFilter.category) {
        // Filter by both category and subcategory
        setSelectedCategories(new Set([categoryFilter.category]));
      } else if (categoryFilter.category) {
        // Filter by category only
        setSelectedCategories(new Set([categoryFilter.category]));
      }
    } else {
      // No filter, show all categories
      setSelectedCategories(new Set(categories));
    }
  }, [categoryFilter, categories, effectiveLocations]);

  // Filter locations based on selected categories and category filter
  const filteredLocations: LocationData[] = useMemo(() => {
    let filtered = effectiveLocations.filter(location => selectedCategories.has(location.category));
    
    // Apply additional subcategory filter if specified
    if (categoryFilter?.subcategory) {
      filtered = filtered.filter(location => location.subcategory === categoryFilter.subcategory);
    }
    
    return filtered;
  }, [effectiveLocations, selectedCategories, categoryFilter]);

  // Handle checkbox change
  const handleCategoryChange = (category: string): void => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedCategories(newSelected);
  };

  return (
    <div className="map-wrapper">
      {loading && (
        <div className="loading-overlay">
          <p>Loading locations from Google Sheets...</p>
        </div>
      )}
      
      {error && (
        <div className="error-overlay">
          <p>Error loading locations: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}
      
      {!loading && !error && (
        <>
          <div className="filter-panel">
            <h3>Categories</h3>
            <div className="category-legend">
              {categories.map(category => {
                const color = categoryColors[category] || '#6c757d';
                return (
                  <label key={category} className="category-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCategories.has(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    <div className="category-indicator">
                      <div 
                        className="color-dot" 
                        style={{ backgroundColor: color }}
                      ></div>
                      <span>{category}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
          <div className="map-container">
            <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
              <MapController centerLocation={centerLocation || null} />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredLocations.map((location) => {
                const icon = categoryIcons[location.category] || categoryIcons['Service'];
                return (
                  <Marker
                    key={location.id}
                    position={[location.latitude, location.longitude]}
                    icon={icon}
                  >
                    <Popup>
                      <div>
                        <h3>{location.name}</h3>
                        <p>{location.description}</p>
                        <p><strong>Category:</strong> {location.category}</p>
                        {location.subcategory && (
                          <p><strong>Subcategory:</strong> {location.subcategory}</p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Map;