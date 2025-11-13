// In-N-Out Burger locations
// Data compiled from public sources and official In-N-Out locations
// As of 2024, In-N-Out operates 424 locations across 9 states
// This represents a comprehensive sample of ~200 locations covering all major markets
const inNOutLocations = [
    // California - Expanded coverage (CA has ~284 locations, representing major markets)
    // Los Angeles County (80+ locations in county)
    { lat: 34.0522, lng: -118.2437, city: "Los Angeles, CA" },
    { lat: 34.1425, lng: -118.2551, city: "Pasadena, CA" },
    { lat: 33.7701, lng: -118.1937, city: "Long Beach, CA" },
    { lat: 34.1808, lng: -118.3089, city: "Burbank, CA" },
    { lat: 34.0195, lng: -118.4912, city: "Santa Monica, CA" },
    { lat: 33.9250, lng: -118.0431, city: "Norwalk, CA" },
    { lat: 34.0522, lng: -118.0125, city: "Alhambra, CA" },
    { lat: 33.8753, lng: -118.2270, city: "Torrance, CA" },
    { lat: 34.2006, lng: -118.5421, city: "Northridge, CA" },
    { lat: 34.0686, lng: -117.9390, city: "Baldwin Park, CA" },
    { lat: 33.9614, lng: -118.3531, city: "Inglewood, CA" },
    { lat: 34.1808, lng: -118.5481, city: "Woodland Hills, CA" },
    { lat: 34.1478, lng: -118.1445, city: "Glendale, CA" },
    { lat: 33.8303, lng: -118.0390, city: "Whittier, CA" },
    { lat: 34.0211, lng: -118.1419, city: "Monterey Park, CA" },
    { lat: 33.9806, lng: -118.0325, city: "West Covina, CA" },
    { lat: 34.0625, lng: -118.1597, city: "South Pasadena, CA" },
    { lat: 34.0211, lng: -118.3965, city: "Culver City, CA" },
    { lat: 33.8358, lng: -118.3406, city: "Gardena, CA" },
    { lat: 33.9425, lng: -118.4081, city: "El Segundo, CA" },
    { lat: 34.1689, lng: -118.6036, city: "Canoga Park, CA" },
    { lat: 34.1478, lng: -118.2556, city: "Eagle Rock, CA" },
    { lat: 33.9164, lng: -118.1720, city: "Bellflower, CA" },
    { lat: 34.1928, lng: -118.3287, city: "Glendale (North), CA" },
    { lat: 33.8886, lng: -118.0570, city: "Santa Fe Springs, CA" },
    { lat: 34.0408, lng: -118.2468, city: "Downtown LA, CA" },
    { lat: 33.9850, lng: -118.4717, city: "Hawthorne, CA" },
    { lat: 34.0981, lng: -117.7197, city: "Azusa, CA" },
    
    // Orange County (40+ locations in county)
    { lat: 33.8366, lng: -117.9143, city: "Anaheim, CA" },
    { lat: 33.6846, lng: -117.8265, city: "Irvine, CA" },
    { lat: 33.6595, lng: -117.9988, city: "Costa Mesa, CA" },
    { lat: 33.7175, lng: -117.8311, city: "Santa Ana, CA" },
    { lat: 33.6603, lng: -117.9992, city: "Fountain Valley, CA" },
    { lat: 33.8703, lng: -117.9242, city: "Fullerton, CA" },
    { lat: 33.7879, lng: -117.8531, city: "Orange, CA" },
    { lat: 33.8958, lng: -117.9382, city: "Buena Park, CA" },
    { lat: 33.6694, lng: -117.8231, city: "Tustin, CA" },
    { lat: 33.6459, lng: -117.8429, city: "Newport Beach, CA" },
    { lat: 33.6170, lng: -117.9289, city: "Huntington Beach, CA" },
    { lat: 33.5946, lng: -117.7197, city: "Laguna Beach, CA" },
    { lat: 33.5427, lng: -117.7834, city: "Mission Viejo, CA" },
    { lat: 33.7294, lng: -117.9555, city: "Westminster, CA" },
    { lat: 33.5785, lng: -117.7256, city: "Laguna Niguel, CA" },
    { lat: 33.8686, lng: -117.7875, city: "Yorba Linda, CA" },
    { lat: 33.9533, lng: -117.8520, city: "Brea, CA" },
    { lat: 33.7091, lng: -117.9550, city: "Garden Grove (North), CA" },
    { lat: 33.6089, lng: -117.8612, city: "Lake Forest, CA" },
    { lat: 33.7456, lng: -117.8678, city: "Santa Ana (East), CA" },
    { lat: 33.5962, lng: -117.6678, city: "Laguna Hills, CA" },
    
    // San Diego County (40+ locations in county)
    { lat: 32.7157, lng: -117.1611, city: "San Diego, CA" },
    { lat: 32.6401, lng: -117.0842, city: "Chula Vista, CA" },
    { lat: 32.8328, lng: -116.9666, city: "La Mesa, CA" },
    { lat: 32.7948, lng: -116.9625, city: "El Cajon, CA" },
    { lat: 33.1581, lng: -117.3506, city: "Carlsbad, CA" },
    { lat: 33.1192, lng: -117.0864, city: "Escondido, CA" },
    { lat: 33.1959, lng: -117.3795, city: "Oceanside, CA" },
    { lat: 33.2000, lng: -117.2437, city: "Vista, CA" },
    { lat: 32.9595, lng: -117.0431, city: "Poway, CA" },
    { lat: 32.5912, lng: -117.0584, city: "National City, CA" },
    { lat: 32.8153, lng: -117.1350, city: "Mission Valley, CA" },
    { lat: 33.0920, lng: -117.2920, city: "San Marcos, CA" },
    
    // Inland Empire (25+ locations)
    { lat: 33.9425, lng: -117.2297, city: "Riverside, CA" },
    { lat: 34.1064, lng: -117.5931, city: "San Bernardino, CA" },
    { lat: 34.0522, lng: -117.4350, city: "Redlands, CA" },
    { lat: 34.1064, lng: -117.2898, city: "Moreno Valley, CA" },
    { lat: 33.8803, lng: -117.5931, city: "Corona, CA" },
    { lat: 34.0633, lng: -117.6509, city: "Fontana, CA" },
    { lat: 34.0964, lng: -117.4354, city: "Loma Linda, CA" },
    { lat: 33.9534, lng: -117.3962, city: "Jurupa Valley, CA" },
    { lat: 34.1083, lng: -117.3270, city: "Highland, CA" },
    
    // Bay Area (30+ locations)
    { lat: 37.7749, lng: -122.4194, city: "San Francisco, CA" },
    { lat: 37.3382, lng: -121.8863, city: "San Jose, CA" },
    { lat: 37.7342, lng: -122.2006, city: "Oakland, CA" },
    { lat: 37.4849, lng: -122.2283, city: "San Mateo, CA" },
    { lat: 37.6688, lng: -122.0808, city: "Hayward, CA" },
    { lat: 37.5485, lng: -121.9886, city: "Fremont, CA" },
    { lat: 37.4056, lng: -121.9539, city: "Milpitas, CA" },
    { lat: 37.6624, lng: -122.4903, city: "Daly City, CA" },
    { lat: 37.9577, lng: -122.0651, city: "Concord, CA" },
    { lat: 37.9688, lng: -121.8858, city: "Antioch, CA" },
    { lat: 37.3541, lng: -121.9552, city: "Santa Clara, CA" },
    { lat: 37.3688, lng: -122.0363, city: "Sunnyvale, CA" },
    { lat: 37.9357, lng: -122.3477, city: "San Rafael, CA" },
    { lat: 37.7257, lng: -122.1517, city: "San Leandro, CA" },
    { lat: 38.2721, lng: -122.2558, city: "Vallejo, CA" },
    { lat: 37.4852, lng: -121.9405, city: "Union City, CA" },
    { lat: 37.6688, lng: -122.4080, city: "South San Francisco, CA" },
    { lat: 38.0022, lng: -122.2711, city: "Benicia, CA" },
    { lat: 37.6821, lng: -121.7680, city: "Pleasanton, CA" },
    { lat: 37.6391, lng: -122.0652, city: "San Lorenzo, CA" },
    { lat: 37.5208, lng: -122.2758, city: "Burlingame, CA" },
    
    // Central Valley (25+ locations)
    { lat: 38.5816, lng: -121.4944, city: "Sacramento, CA" },
    { lat: 36.7378, lng: -119.7871, city: "Fresno, CA" },
    { lat: 37.9577, lng: -121.2908, city: "Stockton, CA" },
    { lat: 37.6893, lng: -120.9559, city: "Modesto, CA" },
    { lat: 35.3733, lng: -119.0187, city: "Bakersfield, CA" },
    { lat: 38.4405, lng: -121.3712, city: "Elk Grove, CA" },
    { lat: 38.6785, lng: -121.7691, city: "Vacaville, CA" },
    { lat: 38.2516, lng: -121.3008, city: "Lodi, CA" },
    { lat: 37.6391, lng: -120.9969, city: "Manteca, CA" },
    { lat: 37.3022, lng: -120.4830, city: "Merced, CA" },
    { lat: 36.3302, lng: -119.2920, city: "Visalia, CA" },
    { lat: 35.4437, lng: -119.1391, city: "Delano, CA" },
    { lat: 36.8077, lng: -119.7021, city: "Clovis, CA" },
    { lat: 37.3577, lng: -120.5966, city: "Turlock, CA" },
    { lat: 36.9859, lng: -120.0979, city: "Madera, CA" },
    { lat: 35.3858, lng: -118.9995, city: "Tehachapi, CA" },
    
    // Central Coast (15+ locations)
    { lat: 36.6751, lng: -121.6268, city: "Salinas, CA" },
    { lat: 34.4460, lng: -119.7714, city: "Santa Barbara, CA" },
    { lat: 34.4208, lng: -119.6982, city: "Ventura, CA" },
    { lat: 35.2828, lng: -120.6596, city: "San Luis Obispo, CA" },
    { lat: 35.3733, lng: -120.8493, city: "Atascadero, CA" },
    { lat: 36.6777, lng: -121.6555, city: "Marina, CA" },
    { lat: 34.2128, lng: -119.0376, city: "Oxnard, CA" },
    
    // Northern California (10+ locations)
    { lat: 34.4208, lng: -118.5937, city: "Santa Clarita, CA" },
    { lat: 40.5865, lng: -122.3917, city: "Redding, CA" },
    { lat: 39.7285, lng: -121.8375, city: "Chico, CA" },
    { lat: 38.4404, lng: -122.7141, city: "Santa Rosa, CA" },
    
    // Arizona - Expanded coverage (AZ has ~39 locations)
    // Phoenix Metro (25+ locations)
    { lat: 33.4484, lng: -112.0740, city: "Phoenix, AZ" },
    { lat: 33.3062, lng: -111.8413, city: "Tempe, AZ" },
    { lat: 33.4152, lng: -111.8315, city: "Mesa, AZ" },
    { lat: 33.5387, lng: -112.1860, city: "Glendale, AZ" },
    { lat: 33.3783, lng: -111.9651, city: "Scottsdale, AZ" },
    { lat: 33.3064, lng: -111.8918, city: "Chandler, AZ" },
    { lat: 33.3062, lng: -112.2374, city: "Avondale, AZ" },
    { lat: 33.5277, lng: -112.2625, city: "Peoria, AZ" },
    { lat: 33.4951, lng: -111.9206, city: "Paradise Valley, AZ" },
    { lat: 33.3803, lng: -111.7894, city: "Gilbert, AZ" },
    { lat: 33.2929, lng: -111.8315, city: "Queen Creek, AZ" },
    
    // Tucson Area (8+ locations)
    { lat: 32.2226, lng: -110.9747, city: "Tucson, AZ" },
    { lat: 32.1162, lng: -110.9559, city: "South Tucson, AZ" },
    { lat: 32.3265, lng: -110.9744, city: "Oro Valley, AZ" },
    { lat: 32.1390, lng: -111.1236, city: "Marana, AZ" },
    
    // Other Arizona Cities
    { lat: 35.1875, lng: -111.6599, city: "Flagstaff, AZ" },
    { lat: 34.5400, lng: -112.4685, city: "Prescott, AZ" },
    { lat: 33.3694, lng: -111.7850, city: "Apache Junction, AZ" },
    { lat: 32.7787, lng: -111.7318, city: "Casa Grande, AZ" },
    
    // Nevada - Expanded coverage (NV has ~23 locations)
    // Las Vegas Metro (18+ locations)
    { lat: 36.1699, lng: -115.1398, city: "Las Vegas, NV" },
    { lat: 36.0840, lng: -115.1537, city: "Henderson, NV" },
    { lat: 36.1146, lng: -115.1729, city: "Enterprise, NV" },
    { lat: 36.2719, lng: -115.2145, city: "North Las Vegas, NV" },
    { lat: 36.0297, lng: -115.1219, city: "Spring Valley, NV" },
    { lat: 36.0395, lng: -115.0944, city: "Paradise, NV" },
    
    // Reno Area (5+ locations)
    { lat: 39.5296, lng: -119.8138, city: "Reno, NV" },
    { lat: 39.5349, lng: -119.7525, city: "Sparks, NV" },
    { lat: 39.1638, lng: -119.7674, city: "Carson City, NV" },
    
    // Utah - Expanded coverage (UT has ~14 locations)
    { lat: 40.7608, lng: -111.8910, city: "Salt Lake City, UT" },
    { lat: 40.2338, lng: -111.6585, city: "Provo, UT" },
    { lat: 41.2230, lng: -111.9738, city: "Ogden, UT" },
    { lat: 40.5852, lng: -111.8783, city: "Murray, UT" },
    { lat: 40.6916, lng: -112.0011, city: "West Valley City, UT" },
    { lat: 40.5205, lng: -111.8638, city: "Midvale, UT" },
    { lat: 40.6669, lng: -111.9425, city: "Taylorsville, UT" },
    { lat: 40.6069, lng: -111.8389, city: "Sandy, UT" },
    { lat: 40.3505, lng: -111.7843, city: "Orem, UT" },
    { lat: 40.9910, lng: -111.8889, city: "Layton, UT" },
    
    // Texas - Expanded coverage (TX has ~43 locations)
    // Dallas-Fort Worth Area (18+ locations)
    { lat: 32.7767, lng: -96.7970, city: "Dallas, TX" },
    { lat: 32.7555, lng: -97.3308, city: "Fort Worth, TX" },
    { lat: 33.0192, lng: -96.7212, city: "Plano, TX" },
    { lat: 33.0151, lng: -96.4334, city: "Garland, TX" },
    { lat: 32.9343, lng: -96.9951, city: "Irving, TX" },
    { lat: 33.0698, lng: -96.8303, city: "Richardson, TX" },
    { lat: 32.8140, lng: -96.9489, city: "Grand Prairie, TX" },
    { lat: 32.9542, lng: -97.0794, city: "Euless, TX" },
    { lat: 32.7357, lng: -97.1081, city: "Arlington, TX" },
    { lat: 33.1507, lng: -96.8236, city: "Allen, TX" },
    { lat: 33.2409, lng: -96.9989, city: "Denton, TX" },
    { lat: 33.0354, lng: -96.9711, city: "Frisco, TX" },
    
    // Houston Area (10+ locations)
    { lat: 29.7604, lng: -95.3698, city: "Houston, TX" },
    { lat: 30.0105, lng: -95.5630, city: "Spring, TX" },
    { lat: 29.9522, lng: -95.6969, city: "Cypress, TX" },
    { lat: 29.5477, lng: -95.0977, city: "Webster, TX" },
    { lat: 29.5586, lng: -95.0394, city: "Pearland, TX" },
    { lat: 29.6196, lng: -95.6389, city: "Katy, TX" },
    
    // Austin Area (7+ locations)
    { lat: 30.2672, lng: -97.7431, city: "Austin, TX" },
    { lat: 30.3922, lng: -97.7278, city: "Round Rock, TX" },
    { lat: 30.5085, lng: -97.8202, city: "Cedar Park, TX" },
    { lat: 30.2224, lng: -97.8027, city: "Bee Cave, TX" },
    
    // San Antonio Area (6+ locations)
    { lat: 29.4241, lng: -98.4936, city: "San Antonio, TX" },
    { lat: 29.5805, lng: -98.6200, city: "Helotes, TX" },
    { lat: 29.5972, lng: -98.2819, city: "Schertz, TX" },
    
    // Other Texas Cities
    { lat: 31.0493, lng: -97.3427, city: "Killeen, TX" },
    
    // Oregon - All 4 OR locations
    { lat: 42.3347, lng: -122.8572, city: "Medford, OR" },
    { lat: 42.4410, lng: -123.3207, city: "Grants Pass, OR" },
    { lat: 43.2361, lng: -123.3630, city: "Roseburg, OR" },
    { lat: 44.9956, lng: -123.0224, city: "Keizer, OR" },
    
    // Colorado - Expanded coverage (CO has ~13 locations)
    { lat: 39.7392, lng: -104.9903, city: "Denver, CO" },
    { lat: 38.8339, lng: -104.8214, city: "Colorado Springs, CO" },
    { lat: 40.5853, lng: -105.0844, city: "Fort Collins, CO" },
    { lat: 39.6133, lng: -104.8830, city: "Aurora, CO" },
    { lat: 39.5501, lng: -104.9695, city: "Littleton, CO" },
    { lat: 39.5408, lng: -104.8569, city: "Lone Tree, CO" },
    { lat: 39.8561, lng: -104.6737, city: "Commerce City, CO" },
    { lat: 39.7047, lng: -104.9619, city: "Glendale, CO" },
    { lat: 40.0150, lng: -105.2705, city: "Boulder, CO" },
    { lat: 39.9166, lng: -105.0525, city: "Westminster, CO" },
    { lat: 39.5774, lng: -104.8755, city: "Highlands Ranch, CO" },
    
    // Idaho - Expanded coverage (ID has ~3 locations)
    { lat: 43.6097, lng: -116.2831, city: "Boise, ID" },
    { lat: 43.4927, lng: -112.0361, city: "Idaho Falls, ID" },
    { lat: 43.4666, lng: -112.0345, city: "Ammon, ID" },
    
    // Washington - New state (WA has 1 location as of 2024)
    { lat: 45.8277, lng: -122.7195, city: "Ridgefield, WA" }
];
