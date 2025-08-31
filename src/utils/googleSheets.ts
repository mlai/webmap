import { LocationData } from '../types';

/**
 * Converts a Google Sheets sharing URL to a CSV export URL
 */
export const convertToCSVUrl = (shareUrl: string): string => {
  // Extract the spreadsheet ID from the sharing URL
  const match = shareUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) {
    throw new Error('Invalid Google Sheets URL');
  }
  
  const spreadsheetId = match[1];
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;
};

/**
 * Parses CSV text into JSON objects with proper handling of quoted fields
 */
export const parseCSV = (csvText: string): Record<string, any>[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must have at least a header row and one data row');
  }
  
  // Parse a single CSV line with proper quote handling
  const parseCsvLine = (line: string): string[] => {
    const result = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    
    while (i < line.length) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote within quoted field
          current += '"';
          i += 2;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator (not within quotes)
        result.push(current.trim());
        current = '';
        i++;
      } else {
        // Regular character
        current += char;
        i++;
      }
    }
    
    // Add the last field
    result.push(current.trim());
    return result;
  };
  
  const headers: string[] = parseCsvLine(lines[0]);
  const data: Record<string, any>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: Record<string, any> = {};
    
    headers.forEach((header, index) => {
      let value: string | number = values[index] || '';
      
      // Convert numeric strings to numbers (but not if they're in quotes or contain non-numeric chars)
      if (typeof value === 'string' && !isNaN(Number(value)) && value !== '' && !value.includes(' ')) {
        value = parseFloat(value);
      }
      
      row[header] = value;
    });
    
    data.push(row);
  }
  
  return data;
};

/**
 * Fetches location data from Google Sheets
 */
export const fetchLocationsFromGoogleSheets = async (shareUrl: string): Promise<LocationData[]> => {
  try {
    const csvUrl = convertToCSVUrl(shareUrl);
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    const csvText = await response.text();
    const locations: Record<string, any>[] = parseCSV(csvText);
    
    // Validate required fields
    const requiredFields: (keyof LocationData)[] = ['id', 'name', 'description', 'latitude', 'longitude', 'category'];
    const validLocations: LocationData[] = locations.filter(location => {
      return requiredFields.every(field => location.hasOwnProperty(field) && location[field] !== '');
    }) as LocationData[];
    
    if (validLocations.length === 0) {
      throw new Error('No valid locations found. Please ensure your spreadsheet has columns: id, name, description, latitude, longitude, category');
    }
    
    return validLocations;
  } catch (error) {
    console.error('Error fetching locations from Google Sheets:', error);
    throw error;
  }
};