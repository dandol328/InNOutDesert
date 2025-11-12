# InNOutDesert 🍔

A map to show how far you are from the nearest In-N-Out Burger, color-coded by driving time.

## Features

- **Lightweight Custom Basemap**: Custom-built geographic basemap with simplified US geography
- **Dark & Light Modes**: 
  - 🌙 Dark mode with deep ocean and dark land colors
  - ☀️ Light mode with bright, clear colors
  - 🖥️ System mode automatically detects your browser preference
  - Theme preference saved to localStorage
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
2. Select your preferred theme from the dropdown (System/Light/Dark)
3. Click anywhere on the map to see:
   - Your selected coordinates
   - The nearest In-N-Out location
   - Distance in miles
   - Estimated driving time
4. Hover over In-N-Out markers (🍔) to see location details
5. Use the zoom controls to get a closer view
6. Click "Reset View" to return to the default view

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
- Custom lightweight basemap with simplified US geography (no external tile dependencies)
- Dark and light mode themes using CSS custom properties
- Theme detection using `prefers-color-scheme` media query
- Theme preference persisted to localStorage
- No external dependencies or CDN requirements
- Uses Haversine formula for distance calculation with a 1.4x road factor
- Assumes average highway speed of 60 mph for time estimation
- Fully self-contained and works offline

## Note

Distance and time calculations are estimates based on straight-line distance with a road factor multiplier. Actual driving times may vary based on traffic, road conditions, and routes.
