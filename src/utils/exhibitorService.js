const ALGOLIA_CONFIG = {
  baseUrl: 'https://xd0u5m6y4r-dsn.algolia.net/1/indexes/evt-f099659d-adb6-4cfb-9673-93482d1d5223-index/query',
  applicationId: 'XD0U5M6Y4R',
  apiKey: 'd5cd7d4ec26134ff4a34d736a7f9ad47',
  agent: 'Algolia for JavaScript (3.35.1); Browser'
};

/**
 * Fetches exhibitor details by objectId from Algolia
 * @param {string} objectId - The exhibitor object ID (e.g., "exh-6dcc038f-9122-457f-9cf8-08dcbe8fd3fe")
 * @param {string} locale - The locale suffix (default: "en-us")
 * @returns {Promise<Object|null>} Promise with exhibitor details or null if not found
 */
export async function fetchExhibitorByObjectId(objectId, locale = 'en-us') {
  try {
    const fullObjectId = `${objectId}_${locale}`;
    const filters = `objectID:"${fullObjectId}"`;
    
    const url = `${ALGOLIA_CONFIG.baseUrl}?x-algolia-agent=${encodeURIComponent(ALGOLIA_CONFIG.agent)}&x-algolia-application-id=${ALGOLIA_CONFIG.applicationId}&x-algolia-api-key=${ALGOLIA_CONFIG.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify({
        params: `filters=${encodeURIComponent(filters)}`
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.hits && data.hits.length > 0) {
      return extractExhibitorDetails(data.hits[0]);
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching exhibitor data:', error);
    throw error;
  }
}

/**
 * Extracts and formats exhibitor details from the Algolia response
 * @param {Object} exhibitor - Raw exhibitor data from Algolia
 * @returns {Object} Formatted exhibitor details
 */
function extractExhibitorDetails(exhibitor) {
  return {
    id: exhibitor.id,
    companyName: exhibitor.companyName,
    exhibitorName: exhibitor.exhibitorName,
    description: exhibitor.exhibitorDescription,
    logo: exhibitor.logo,
    coverImage: exhibitor.coverImage,
    website: exhibitor.website,
    email: exhibitor.email,
    phone: exhibitor.phone,
    standReference: exhibitor.standReference,
    showObjective: exhibitor.showObjective,
    countryName: exhibitor.countryName,
    ppsAnswers: exhibitor.ppsAnswers || [],
    products: exhibitor.products || [],
    documents: exhibitor.documents || []
  };
}
