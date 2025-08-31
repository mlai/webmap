# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SVMBC Scout Outings is a React web application that displays an interactive map with location markers for scout activities across Northern California. The application shows various outdoor locations including camping sites, hiking trails, backpacking areas, and other scouting activities loaded from Google Sheets with real-time data fetching, search functionality, and category filtering capabilities.

## Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Mapping Library**: React Leaflet (wrapper for Leaflet.js)
- **Map Tiles**: OpenStreetMap
- **Data Source**: Google Sheets (CSV export)
- **Typography**: Poppins font (Google Fonts)
- **Styling**: CSS3
- **Background**: Custom dog image with overlay
- **Type System**: TypeScript with strict type checking

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking only
npm run typecheck

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── Map.tsx              # Main map component with colored markers, filtering, and dynamic centering
│   ├── Navigation.tsx       # Left sidebar navigation with expandable categories
│   ├── CategoryView.tsx     # Category overview and detail views with map navigation
│   ├── SubcategoryView.tsx  # Dedicated subcategory table view with map navigation
│   ├── SearchBox.tsx        # Header search functionality
│   ├── SearchResultsView.tsx# Search results with keyword highlighting
│   └── About.tsx            # Application information page
├── types/
│   └── index.ts             # TypeScript type definitions and interfaces
├── utils/
│   └── googleSheets.ts      # Google Sheets integration utilities with enhanced CSV parsing
├── App.tsx                  # Main application component with routing and state management
├── App.css                  # Application styles with Poppins font and custom theming
├── index.css                # Global styles
└── main.tsx                 # React entry point with TypeScript
```

## Key Components

### Map Component (`src/components/Map.jsx`)
- Uses React Leaflet's MapContainer, TileLayer, Marker, and Popup components
- Loads location data from Google Sheets via CSV export
- Centers on Northern California (38.5, -121.0) with zoom level 8
- Displays markers with category-specific colors for easy identification
- Includes category filtering with checkboxes and color legend
- Shows loading and error states for data fetching
- Automatically filters locations based on selected categories

### Navigation Component (`src/components/Navigation.jsx`)
- Left sidebar navigation with expandable category structure
- Shows main categories (Camping, Backpacking, etc.) with subcategories
- Remains expanded by default for better user experience
- Color-coded indicators matching map marker colors
- Direct navigation to subcategory pages from menu items

### Search Functionality (`src/components/SearchBox.tsx` & `src/components/SearchResultsView.tsx`)
- Header-mounted search box with real-time search
- Searches across name, description, category, and subcategory fields
- Search results view with keyword highlighting (yellow background)
- Direct links to location websites and subcategory pages
- Card-based results layout with category badges

### Category Views (`src/components/CategoryView.tsx` & `src/components/SubcategoryView.tsx`)
- CategoryView: Overview and detailed category browsing with table views
- SubcategoryView: Dedicated table view for specific subcategories
- Tables include Name, Description, URL, and "View on Map" buttons
- "Visit Site" and "View on Map" buttons with consistent styling
- Map navigation: Click "View on Map" to center map on location
- Breadcrumb navigation and back buttons

### Google Sheets Integration (`src/utils/googleSheets.ts`)
- Converts Google Sheets sharing URLs to CSV export URLs
- Enhanced CSV parser handles quoted fields with special characters (commas, quotes)
- Validates required fields (id, name, description, latitude, longitude, category, subcategory, url)
- Handles errors gracefully with detailed error messages
- Supports real-time data updates from Google Sheets
- Full TypeScript support with proper type definitions

### Location Data
- **Primary Source**: Google Sheets (configured in App.tsx)
- Required columns: id, name, description, latitude, longitude, category, subcategory, url
- Data is fetched in real-time from Google Sheets CSV export
- Supports dynamic category filtering and real-time updates
- TypeScript interfaces ensure data type safety

## Visual Design

### Color-Coded Categories
- **Camping**: Green (#28a745)
- **Backpacking**: Purple (#6f42c1)
- **Winter activities**: Teal (#17a2b8)
- **Hiking**: Orange (#fd7e14)
- **Water activities**: Blue (#007bff)
- **Rock climbing**: Red (#dc3545)
- **Cycling**: Mint green (#20c997)
- **Educational**: Yellow (#ffc107)
- **Service**: Gray (#6c757d)

### Design Elements
- **Typography**: Poppins font family from Google Fonts
- **Header**: Blue background (#007bff) with white text
- **Background**: Subtle dog image with semi-transparent overlay
- **Layout**: Left sidebar navigation, main content area, filter panel
- **Interactive Elements**: Hover effects, smooth transitions, colored markers

## Features

### Navigation System
- **Left Sidebar**: Persistent navigation menu with Map, Category, About sections
- **Expandable Categories**: Category menu starts expanded showing all categories and subcategories
- **Color Legend**: Each category has a colored dot matching map markers
- **Direct Access**: Click subcategories to go directly to filtered table views

### Search Functionality
- **Global Search**: Header-mounted search box searches across all fields
- **Keyword Highlighting**: Search terms highlighted in yellow in results
- **Smart Results**: Card-based layout with category badges and action buttons
- **Dual Navigation**: External links to websites and internal subcategory navigation

### Interactive Map
- **Northern California Focus**: Centered on (38.5, -121.0) with zoom level 8
- **Color-Coded Markers**: Different colors for each category type
- **Category Filtering**: Checkboxes to show/hide specific categories
- **Enhanced Popups**: Show location details with category and subcategory info

### Data Management
- **Real-time Updates**: Data loaded from Google Sheets with live updates
- **Enhanced CSV Parsing**: Handles special characters, quotes, and commas properly
- **Error Handling**: Graceful error states with retry functionality
- **Validation**: Ensures all required fields are present

### Table Views
- **Category Tables**: Show all locations within a category
- **Subcategory Tables**: Focused view of specific subcategory locations
- **URL Integration**: Direct links to location websites
- **Responsive Design**: Tables adapt to different screen sizes

## Configuration

### Setting up Google Sheets Data Source

1. Create a Google Sheets document with the following columns:
   - `id`: Unique identifier for each location
   - `name`: Location name
   - `latitude`: Latitude coordinate (decimal degrees)
   - `longitude`: Longitude coordinate (decimal degrees)
   - `category`: Category for filtering (e.g., "Camping", "Backpacking", "Hiking")
   - `subcategory`: Optional subcategory for more specific filtering (e.g., "RV Parks", "Tent Camping")
   - `description`: Brief description of the location
   - `url`: Optional website URL for the location

2. Make the spreadsheet publicly viewable:
   - Click "Share" in the top right
   - Set to "Anyone with the link can view"
   - Copy the sharing URL

3. Update the `googleSheetsUrl` in `src/App.jsx` with your spreadsheet's sharing URL

## Adding New Locations

### Via Google Sheets (Recommended)
1. Add new rows to your Google Sheets document
2. Ensure all required columns are filled
3. Changes will appear automatically when the page is refreshed

### Via Static JSON (Legacy)
To add locations to the static fallback file, edit `src/data/locations.json` and include:
- Unique `id`
- `name` and `description`
- `latitude` and `longitude` coordinates
- `category` for organization