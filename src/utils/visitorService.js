/**
 * Service to parse and query visitor recommendation data from CSV
 */

let visitorData = [];
let categoryHeaders = [];

/**
 * Parse CSV data and store in memory
 * @param {string} csvText - The raw CSV text content
 */
export function parseVisitorData(csvText) {
  const lines = csvText.split('\n');
  if (lines.length < 2) return;

  // Parse headers
  const headers = lines[0].split(',');
  
  // Extract category headers (columns after first 4 standard columns)
  categoryHeaders = headers.slice(4).map(h => h.trim());

  // Parse data rows
  visitorData = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const row = parseCSVLine(line);
    if (row.length < 4) continue;

    const visitor = {
      visitorId: row[0],
      totalConnections: parseInt(row[1]) || 0,
      recommendedExhibitors: parseArrayString(row[2]),
      connectedExhibitors: parseArrayString(row[3]),
      categories: {}
    };

    // Parse category counts
    for (let j = 4; j < row.length && j < headers.length; j++) {
      const categoryName = categoryHeaders[j - 4];
      const count = parseInt(row[j]) || 0;
      if (count > 0) {
        visitor.categories[categoryName] = count;
      }
    }

    visitorData.push(visitor);
  }
}

/**
 * Parse a CSV line handling quoted values
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

/**
 * Parse array string format like ["id1", "id2"]
 */
function parseArrayString(str) {
  if (!str || str === '[]') return [];
  
  try {
    // Remove brackets and split by comma
    const cleaned = str.replace(/[\[\]]/g, '').trim();
    if (!cleaned) return [];
    
    return cleaned.split(',')
      .map(item => item.trim().replace(/"/g, ''))
      .filter(item => item.length > 0);
  } catch (e) {
    console.error('Error parsing array string:', str, e);
    return [];
  }
}

/**
 * Find visitor by ID
 * @param {string} visitorId - The visitor ID to search for
 * @returns {Object|null} Visitor data or null if not found
 */
export function getVisitorById(visitorId) {
  const visitor = visitorData.find(v => v.visitorId === visitorId);
  return visitor || null;
}

/**
 * Search visitors by partial ID match
 * @param {string} searchTerm - The search term
 * @param {number} limit - Maximum results to return
 * @returns {Array} Array of matching visitor IDs
 */
export function searchVisitors(searchTerm, limit = 10) {
  if (!searchTerm) return [];
  
  const term = searchTerm.toLowerCase();
  return visitorData
    .filter(v => v.visitorId.toLowerCase().includes(term))
    .slice(0, limit)
    .map(v => ({
      visitorId: v.visitorId,
      totalConnections: v.totalConnections
    }));
}

/**
 * Get all unique visitor IDs
 * @returns {Array} Array of all visitor IDs
 */
export function getAllVisitorIds() {
  return visitorData.map(v => v.visitorId);
}

/**
 * Get category statistics for a visitor
 * @param {Object} visitor - The visitor object
 * @returns {Object} Categorized statistics
 */
export function getVisitorCategoryStats(visitor) {
  if (!visitor || !visitor.categories) return null;

  const categoryArray = Object.entries(visitor.categories)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    topCategories: categoryArray.slice(0, 10),
    allCategories: categoryArray,
    totalCategoryEngagements: categoryArray.reduce((sum, c) => sum + c.count, 0)
  };
}

/**
 * Get total count of visitors in dataset
 * @returns {number} Total visitor count
 */
export function getTotalVisitorCount() {
  return visitorData.length;
}

/**
 * Load CSV file from public folder
 * @returns {Promise<boolean>} Success status
 */
export async function loadVisitorDataFromFile() {
  try {
    const response = await fetch('/visitor_recommendations.csv');
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.status}`);
    }
    
    const csvText = await response.text();
    parseVisitorData(csvText);
    return true;
  } catch (error) {
    console.error('Error loading visitor data:', error);
    return false;
  }
}
