/**
 * Company mapping service to convert exhibitor IDs to company names and URLs
 */

// Sample company data - maps exhibitor IDs to real company information
const COMPANY_DATABASE = {
  'exh-6dcc038f-9122-457f-9cf8-08dcbe8fd3fe': {
    name: 'TaylorMade Golf Company',
    website: 'https://www.taylormadegolf.com',
    category: 'Golf Equipment',
    description: 'Premium golf clubs and equipment manufacturer',
    logo: '🏌️'
  },
  'exh-374dd870-e107-4be1-a5b8-8a507302128c': {
    name: 'Callaway Golf',
    website: 'https://www.callawaygolf.com',
    category: 'Golf Equipment',
    description: 'Leading golf equipment and accessories',
    logo: '⛳'
  },
  'exh-b20f06aa-3a12-4084-a270-4fc5a810fc4b': {
    name: 'Titleist',
    website: 'https://www.titleist.com',
    category: 'Golf Balls & Clubs',
    description: 'Performance golf balls and equipment',
    logo: '🎯'
  },
  'exh-9a2e103d-86bc-4eaa-aff7-1254ccaf0efc': {
    name: 'Nike Golf',
    website: 'https://www.nike.com/golf',
    category: 'Golf Apparel',
    description: 'Athletic golf apparel and footwear',
    logo: '👕'
  },
  'exh-24183151-6427-4609-a5c2-f4fb154bf02d': {
    name: 'FootJoy',
    website: 'https://www.footjoy.com',
    category: 'Golf Footwear',
    description: 'Premium golf shoes and gloves',
    logo: '👟'
  },
  'exh-aae40de6-2fe7-4c6b-bfa7-28667775936d': {
    name: 'Ping Golf',
    website: 'https://www.ping.com',
    category: 'Custom Golf Clubs',
    description: 'Custom-fit golf clubs and equipment',
    logo: '🔧'
  },
  'exh-77a52c12-60a0-45e1-bfd4-f57b6367b484': {
    name: 'Cleveland Golf',
    website: 'https://www.clevelandgolf.com',
    category: 'Wedges & Putters',
    description: 'Specialized wedges and short game equipment',
    logo: '⛳'
  },
  'exh-56eae062-bbea-45e7-8f5c-de71ec2f281a': {
    name: 'Cobra Golf',
    website: 'https://www.cobragolf.com',
    category: 'Golf Clubs',
    description: 'Innovative golf club technology',
    logo: '🐍'
  },
  'exh-a04430c7-5eab-451e-bc76-8ce1c1f904d0': {
    name: 'Mizuno Golf',
    website: 'https://www.mizunogolf.com',
    category: 'Forged Irons',
    description: 'Premium forged golf irons',
    logo: '⚡'
  },
  'exh-b57009b5-7ff5-4368-a761-98c8a37a371f': {
    name: 'Adidas Golf',
    website: 'https://www.adidas.com/golf',
    category: 'Golf Apparel & Shoes',
    description: 'Performance golf clothing and footwear',
    logo: '👟'
  },
  'exh-d2811a56-aae6-4585-ae07-bafd6450b5b5': {
    name: 'Under Armour Golf',
    website: 'https://www.underarmour.com/golf',
    category: 'Performance Apparel',
    description: 'Technical golf performance wear',
    logo: '💪'
  },
  'exh-0096daf2-4997-44c9-95ca-6575b9a214f1': {
    name: 'Bridgestone Golf',
    website: 'https://www.bridgestonegolf.com',
    category: 'Golf Balls',
    description: 'Advanced golf ball technology',
    logo: '⚪'
  },
  'exh-41e8aafe-be8f-44da-ba22-b570cd37b10f': {
    name: 'Wilson Golf',
    website: 'https://www.wilson.com/golf',
    category: 'Golf Equipment',
    description: 'Classic golf equipment manufacturer',
    logo: '🏌️'
  },
  'exh-4e6d6e84-d0c6-48f5-80f2-82b2462bcd2b': {
    name: 'Srixon Golf',
    website: 'https://www.srixon.com',
    category: 'Golf Balls & Clubs',
    description: 'Tour-level golf balls and equipment',
    logo: '🎾'
  },
  'exh-ae157a86-c4a4-44cb-8749-752b4269b96d': {
    name: 'Odyssey Golf',
    website: 'https://www.odysseygolf.com',
    category: 'Putters',
    description: 'Premium putting technology',
    logo: '🎯'
  },
  'exh-e553328c-476e-473c-89fc-f6a27ae4a35d': {
    name: 'Scotty Cameron',
    website: 'https://www.scottycameron.com',
    category: 'Premium Putters',
    description: 'Luxury custom putters',
    logo: '💎'
  },
  'exh-3351a7c1-0865-413b-87fa-57c44d126760': {
    name: 'Bushnell Golf',
    website: 'https://www.bushnellgolf.com',
    category: 'Rangefinders',
    description: 'GPS and laser rangefinders',
    logo: '📡'
  },
  'exh-6fbd7ef9-53fc-40ae-8ebd-42dabcad90d6': {
    name: 'Garmin Golf',
    website: 'https://www.garmin.com/golf',
    category: 'GPS Technology',
    description: 'Smart golf watches and GPS devices',
    logo: '⌚'
  },
  'exh-32783a2b-87c4-42a7-8893-57036f1907b5': {
    name: 'SkyTrak',
    website: 'https://www.skytrakgolf.com',
    category: 'Launch Monitors',
    description: 'Personal launch monitor systems',
    logo: '📊'
  },
  'exh-b0f6e924-4d18-447f-b3e5-8d5a0fa7869a': {
    name: 'TrackMan',
    website: 'https://www.trackman.com',
    category: 'Launch Monitors',
    description: 'Professional launch monitor technology',
    logo: '📈'
  }
};

// Generate additional dummy companies for variety
const ADDITIONAL_COMPANIES = [
  { name: 'PXG Golf', website: 'https://www.pxg.com', category: 'Premium Golf Clubs', description: 'Luxury performance golf clubs', logo: '⭐' },
  { name: 'ECCO Golf', website: 'https://www.eccogolf.com', category: 'Golf Shoes', description: 'Comfort golf footwear', logo: '👞' },
  { name: 'Oakley Golf', website: 'https://www.oakley.com/golf', category: 'Golf Eyewear', description: 'Performance sunglasses', logo: '🕶️' },
  { name: 'Club Glove', website: 'https://www.clubglove.com', category: 'Golf Travel Gear', description: 'Premium golf travel bags', logo: '🧳' },
  { name: 'Golf Pride', website: 'https://www.golfpride.com', category: 'Golf Grips', description: 'Industry-leading golf grips', logo: '🤝' },
  { name: 'SuperStroke', website: 'https://www.superstrokeusa.com', category: 'Putter Grips', description: 'Innovative putter grip technology', logo: '✊' },
  { name: 'Zero Friction', website: 'https://www.zerofriction.com', category: 'Golf Tees & Accessories', description: 'Performance golf tees', logo: '📌' },
  { name: 'Sun Mountain', website: 'https://www.sunmountain.com', category: 'Golf Bags & Carts', description: 'Lightweight golf bags and carts', logo: '🎒' },
  { name: 'ProQuip Golf', website: 'https://www.proquipgolf.com', category: 'Golf Rainwear', description: 'Waterproof golf apparel', logo: '☔' },
  { name: 'Galvin Green', website: 'https://www.galvingreen.com', category: 'Golf Apparel', description: 'Technical golf clothing', logo: '🧥' }
];

/**
 * Get company information by exhibitor ID
 * @param {string} exhibitorId - The exhibitor ID
 * @returns {Object} Company information
 */
export function getCompanyInfo(exhibitorId) {
  if (COMPANY_DATABASE[exhibitorId]) {
    return COMPANY_DATABASE[exhibitorId];
  }

  // Generate a dummy company for unknown IDs
  const hash = exhibitorId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const companyIndex = hash % ADDITIONAL_COMPANIES.length;
  
  return {
    ...ADDITIONAL_COMPANIES[companyIndex],
    id: exhibitorId
  };
}

/**
 * Get multiple company information
 * @param {Array<string>} exhibitorIds - Array of exhibitor IDs
 * @returns {Array<Object>} Array of company information
 */
export function getCompaniesInfo(exhibitorIds) {
  return exhibitorIds.map(id => ({
    ...getCompanyInfo(id),
    id
  }));
}

/**
 * Get sample visitor profile with company names
 */
export function getSampleVisitorProfile() {
  return {
    visitorName: 'Michael Roberts',
    title: 'Purchasing Director',
    company: 'Pine Valley Golf Resort',
    companyWebsite: 'https://www.pinevalleygolf.com',
    location: 'Scottsdale, Arizona',
    industry: 'Golf Resort & Country Club',
    totalConnections: 11,
    eventAttendance: '3 years',
    interests: [
      'Premium Golf Equipment',
      'Golf Technology',
      'Performance Apparel',
      'Course Management Tools'
    ],
    connectedExhibitors: [
      'exh-b57009b5-7ff5-4368-a761-98c8a37a371f',
      'exh-b20f06aa-3a12-4084-a270-4fc5a810fc4b',
      'exh-d2811a56-aae6-4585-ae07-bafd6450b5b5',
      'exh-0096daf2-4997-44c9-95ca-6575b9a214f1',
      'exh-41e8aafe-be8f-44da-ba22-b570cd37b10f',
      'exh-4e6d6e84-d0c6-48f5-80f2-82b2462bcd2b',
      'exh-9a2e103d-86bc-4eaa-aff7-1254ccaf0efc',
      'exh-ae157a86-c4a4-44cb-8749-752b4269b96d',
      'exh-e553328c-476e-473c-89fc-f6a27ae4a35d',
      'exh-e6044a0c-ab28-4f63-b973-c0196606ec08',
      'exh-3351a7c1-0865-413b-87fa-57c44d126760'
    ],
    recommendedExhibitors: [
      'exh-6dcc038f-9122-457f-9cf8-08dcbe8fd3fe',
      'exh-374dd870-e107-4be1-a5b8-8a507302128c',
      'exh-56eae062-bbea-45e7-8f5c-de71ec2f281a',
      'exh-a04430c7-5eab-451e-bc76-8ce1c1f904d0',
      'exh-6fbd7ef9-53fc-40ae-8ebd-42dabcad90d6'
    ],
    topCategories: [
      { name: 'Apparel Accessories', count: 4 },
      { name: 'Headwear', count: 4 },
      { name: 'Men\'s Wear', count: 5 },
      { name: 'Fitness Apparel', count: 2 },
      { name: 'Footwear', count: 2 },
      { name: 'Golf Bags & Travel Bags', count: 1 },
      { name: 'GPS Systems', count: 1 },
      { name: 'Drinkware', count: 1 },
      { name: 'General Accessories', count: 1 },
      { name: 'Gloves', count: 1 }
    ]
  };
}

export default {
  getCompanyInfo,
  getCompaniesInfo,
  getSampleVisitorProfile
};
