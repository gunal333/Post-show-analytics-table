/**
 * Visitor API Service - Fetches visitor data from ReedExpo GraphQL API
 */

const API_URL = 'https://api.reedexpo.com/v2/graphql';
const CLIENT_ID = 'qqFuCd5ROGzIZpdhZrIirvHUn4e6OpGm';
const EVENT_EDITION_ID = 'eve-419819ac-309e-4ba7-a49d-3f0c8dbd7d02';

/**
 * Fetch visitor data from the API
 * @param {string} badgeId - The badge ID (second part after first | in the badge string)
 * @returns {Promise<Object>} Visitor data with firstName and lastName
 */
export const fetchVisitorData = async (badgeId) => {
  // Construct the full badge string
  const badgeString = `PGAMR26|${badgeId}|3100382|T-3|61544|kHv7KJvDNayBhvQkHJ30ig==`;
  
  const query = `{
    customer(input: {badge: "${badgeString}", eventEditionId: "${EVENT_EDITION_ID}"}) {
      id
      person {
        firstName
        lastName
      }
      email
      registrationId
    }
  }`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-clientid': CLIENT_ID
      },
      mode: 'cors',
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors[0]?.message || 'GraphQL query failed');
    }

    if (!data.data?.customer) {
      throw new Error('No customer data found');
    }

    return {
      id: data.data.customer.id,
      firstName: data.data.customer.person.firstName,
      lastName: data.data.customer.person.lastName,
      email: data.data.customer.email,
      registrationId: data.data.customer.registrationId
    };
  } catch (error) {
    console.error('Error fetching visitor data:', error);
    throw error;
  }
};

/**
 * Get badge ID from URL query parameters
 * @returns {string|null} Badge ID or null if not found
 */
export const getBadgeIdFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('badgeId');
};
