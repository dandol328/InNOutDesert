# InNOutDesert 🍔

A map to show how far you are from the nearest In-N-Out Burger, color-coded by driving time.

## Features

- **Leaflet-Based Detailed Basemap**: Interactive map with high-quality OpenStreetMap tiles showing roads, cities, and geographic features
- **Dark & Light Modes**: 
  - 🌙 Dark mode with CartoDB Dark Matter tiles
  - ☀️ Light mode with OpenStreetMap tiles
  - 🖥️ System mode automatically detects your browser preference
  - Theme preference saved to localStorage
- **Interactive Map**: Click anywhere on the map to see the distance and driving time to the nearest In-N-Out location
- **City Search**: Search for any major US city to instantly see its distance from the nearest In-N-Out
- **Color-Coded Visualization**: Locations are color-coded based on driving time:
  - 🟢 Green: 0-30 minutes
  - 🟢 Yellow-Green: 30-60 minutes
  - 🟡 Yellow: 1-2 hours
  - 🟠 Orange: 2-4 hours
  - 🔴 Red: 4+ hours
- **Zoom & Pan**: Interactive Leaflet controls with smooth zoom and pan
- **Location Data**: Includes 44 In-N-Out locations across CA, AZ, NV, UT, TX, OR, and CO

## How to Use

1. Open `index.html` in a web browser
2. The map will load with detailed OpenStreetMap tiles
3. Select your preferred theme from the dropdown (System/Light/Dark)
4. Search for a city using the search bar to instantly see its distance from the nearest In-N-Out
5. Click anywhere on the map to see:
   - Your selected coordinates
   - The nearest In-N-Out location
   - Distance in miles
   - Estimated driving time
   - A line connecting your location to the nearest In-N-Out
6. Hover over In-N-Out markers (🍔) to see location details
7. Use the zoom controls or mouse wheel to get a closer view
8. Click "Reset View" to return to the default view

## Running Locally

Simply open the `index.html` file in a modern web browser. No build process or dependencies required!

Alternatively, use a local HTTP server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server
```

Then visit `http://localhost:8000` in your browser.

## Technical Details

- Built with Leaflet.js v1.9.4 for interactive mapping
- Uses OpenStreetMap tiles for light mode (high detail, roads, cities, terrain)
- Uses CartoDB Dark Matter tiles for dark mode
- Custom heat map overlay using Leaflet's GridLayer API
- Dark and light mode themes using CSS custom properties
- Theme detection using `prefers-color-scheme` media query
- Theme preference persisted to localStorage
- Includes Leaflet library locally (lib/leaflet/) for offline capability
- Uses Haversine formula for distance calculation with a 1.4x road factor
- Assumes average highway speed of 60 mph for time estimation
- Interactive tooltips and markers for In-N-Out locations
- Responsive design works on desktop and mobile devices

## Note

Distance and time calculations are estimates based on straight-line distance with a road factor multiplier. Actual driving times may vary based on traffic, road conditions, and routes.
