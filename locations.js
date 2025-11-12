// In-N-Out Burger locations
// Data compiled from public sources and official In-N-Out locations
// As of 2024, In-N-Out operates 400+ locations across 8 states
const inNOutLocations = [
    // California - Major cities (representative sample of 280+ CA locations)
    { lat: 34.0522, lng: -118.2437, city: "Los Angeles, CA" },
    { lat: 37.7749, lng: -122.4194, city: "San Francisco, CA" },
    { lat: 32.7157, lng: -117.1611, city: "San Diego, CA" },
    { lat: 33.7701, lng: -118.1937, city: "Long Beach, CA" },
    { lat: 33.6846, lng: -117.8265, city: "Irvine, CA" },
    { lat: 33.9425, lng: -117.2297, city: "Riverside, CA" },
    { lat: 34.1064, lng: -117.5931, city: "San Bernardino, CA" },
    { lat: 37.3382, lng: -121.8863, city: "San Jose, CA" },
    { lat: 33.6595, lng: -117.9988, city: "Costa Mesa, CA" },
    { lat: 38.5816, lng: -121.4944, city: "Sacramento, CA" },
    { lat: 34.4208, lng: -119.6982, city: "Ventura, CA" },
    { lat: 34.0522, lng: -117.4350, city: "Redlands, CA" },
    { lat: 33.8366, lng: -117.9143, city: "Anaheim, CA" },
    { lat: 36.7378, lng: -119.7871, city: "Fresno, CA" },
    { lat: 35.3733, lng: -119.0187, city: "Bakersfield, CA" },
    { lat: 34.1425, lng: -118.2551, city: "Pasadena, CA" },
    { lat: 33.5946, lng: -117.7197, city: "Laguna Beach, CA" },
    { lat: 37.9577, lng: -121.2908, city: "Stockton, CA" },
    { lat: 34.4208, lng: -118.5937, city: "Santa Clarita, CA" },
    { lat: 32.8328, lng: -116.9666, city: "La Mesa, CA" },
    { lat: 37.7342, lng: -122.2006, city: "Oakland, CA" },
    { lat: 37.6893, lng: -120.9559, city: "Modesto, CA" },
    { lat: 36.6751, lng: -121.6268, city: "Salinas, CA" },
    { lat: 34.4460, lng: -119.7714, city: "Santa Barbara, CA" },
    
    // Arizona - Representative sample of 35+ AZ locations
    { lat: 33.4484, lng: -112.0740, city: "Phoenix, AZ" },
    { lat: 33.3062, lng: -111.8413, city: "Tempe, AZ" },
    { lat: 33.4152, lng: -111.8315, city: "Mesa, AZ" },
    { lat: 32.2226, lng: -110.9747, city: "Tucson, AZ" },
    { lat: 33.5387, lng: -112.1860, city: "Glendale, AZ" },
    { lat: 33.3783, lng: -111.9651, city: "Scottsdale, AZ" },
    { lat: 35.1875, lng: -111.6599, city: "Flagstaff, AZ" },
    { lat: 33.3064, lng: -111.8918, city: "Chandler, AZ" },
    
    // Nevada - Representative sample of 21+ NV locations
    { lat: 36.1699, lng: -115.1398, city: "Las Vegas, NV" },
    { lat: 36.0840, lng: -115.1537, city: "Henderson, NV" },
    { lat: 39.5296, lng: -119.8138, city: "Reno, NV" },
    
    // Utah - Representative sample of 12+ UT locations
    { lat: 40.7608, lng: -111.8910, city: "Salt Lake City, UT" },
    { lat: 40.2338, lng: -111.6585, city: "Provo, UT" },
    { lat: 41.2230, lng: -111.9738, city: "Ogden, UT" },
    { lat: 40.5852, lng: -111.8783, city: "Murray, UT" },
    
    // Texas - Representative sample of 43+ TX locations
    { lat: 32.7767, lng: -96.7970, city: "Dallas, TX" },
    { lat: 29.7604, lng: -95.3698, city: "Houston, TX" },
    { lat: 30.2672, lng: -97.7431, city: "Austin, TX" },
    { lat: 29.4241, lng: -98.4936, city: "San Antonio, TX" },
    { lat: 32.7555, lng: -97.3308, city: "Fort Worth, TX" },
    { lat: 33.0192, lng: -96.7212, city: "Plano, TX" },
    
    // Oregon - All 4 OR locations
    { lat: 42.3347, lng: -122.8572, city: "Medford, OR" },
    { lat: 42.4410, lng: -123.3207, city: "Grants Pass, OR" },
    { lat: 43.2361, lng: -123.3630, city: "Roseburg, OR" },
    { lat: 44.9956, lng: -123.0224, city: "Keizer, OR" },
    
    // Colorado - Representative sample of 9+ CO locations
    { lat: 39.7392, lng: -104.9903, city: "Denver, CO" },
    { lat: 38.8339, lng: -104.8214, city: "Colorado Springs, CO" },
    { lat: 40.5853, lng: -105.0844, city: "Fort Collins, CO" },
    
    // Idaho - New location opened in 2024
    { lat: 43.6097, lng: -116.2831, city: "Boise, ID" }
];
