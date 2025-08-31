export interface LocationData {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  subcategory?: string;
  url?: string;
}

export interface CategoryFilter {
  category?: string;
  subcategory?: string;
  showAsTable?: boolean;
}

export interface CategoryData {
  items: LocationData[];
  subcategories: string[];
}

export interface CategorizedData {
  [category: string]: CategoryData;
}

export type ActiveView = 'map' | 'category' | 'search' | 'about';

export interface SearchProps {
  onSearch: (term: string) => void;
  onClear: () => void;
}

export interface NavigationProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  locations: LocationData[];
  onCategorySelect: (filter: CategoryFilter) => void;
}

export interface MapProps {
  googleSheetsUrl: string;
  locations: LocationData[];
  categoryFilter: CategoryFilter | null;
  centerLocation?: LocationData | null;
}

export interface CategoryViewProps {
  locations: LocationData[];
  onCategorySelect: (filter: CategoryFilter) => void;
  selectedCategoryFilter: CategoryFilter | null;
  onViewMap: (location: LocationData) => void;
}

export interface SubcategoryViewProps {
  locations: LocationData[];
  selectedCategoryFilter: CategoryFilter;
  onBackToCategories: () => void;
  onViewMap: (location: LocationData) => void;
}

export interface SearchResultsViewProps {
  searchTerm: string;
  searchResults: LocationData[];
  onLocationClick: (location: LocationData) => void;
  onBackToSearch: () => void;
}