# InNOutDesert 🍔

A map to show how far you are from the nearest In-N-Out Burger, color-coded by driving time.

## Features

- **Interactive Map**: Click anywhere on the map to see the distance and driving time to the nearest In-N-Out location
- **Color-Coded Visualization**: Locations are color-coded based on driving time:
  - 🟢 Green: 0-30 minutes
  - 🟢 Yellow-Green: 30-60 minutes
  - 🟡 Yellow: 1-2 hours
  - 🟠 Orange: 2-4 hours
  - 🔴 Red: 4+ hours
- **Zoom & Pan**: Use the +/- buttons to zoom, or drag the map to pan
- **Location Data**: Includes 44 In-N-Out locations across CA, AZ, NV, UT, TX, OR, and CO

## How to Use

1. Open `index.html` in a web browser
2. Click anywhere on the map to see:
   - Your selected coordinates
   - The nearest In-N-Out location
   - Distance in miles
   - Estimated driving time
3. Hover over In-N-Out markers (🍔) to see location details
4. Use the zoom controls to get a closer view
5. Click "Reset View" to return to the default view

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

- Built with vanilla JavaScript and HTML5 Canvas
- No external dependencies or CDN requirements
- Uses Haversine formula for distance calculation with a 1.4x road factor
- Assumes average highway speed of 60 mph for time estimation
- Fully self-contained and works offline

## Note

Distance and time calculations are estimates based on straight-line distance with a road factor multiplier. Actual driving times may vary based on traffic, road conditions, and routes.
