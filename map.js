// Theme management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'system';
        this.tileStyle = 'light';
        this.init();
    }

    init() {
        // Set initial theme
        this.applyTheme();
        
        // Listen for theme selector changes
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.value = this.currentTheme;
        themeToggle.addEventListener('change', (e) => {
            this.currentTheme = e.target.value;
            localStorage.setItem('theme', this.currentTheme);
            this.applyTheme();
            // Notify map to redraw with new theme
            if (window.inNOutMap) {
                window.inNOutMap.updateTheme(this.getEffectiveTheme());
            }
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (this.currentTheme === 'system') {
                this.applyTheme();
                if (window.inNOutMap) {
                    window.inNOutMap.updateTheme(this.getEffectiveTheme());
                }
            }
        });
    }

    getEffectiveTheme() {
        if (this.currentTheme === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return this.currentTheme;
    }

    applyTheme() {
        const theme = this.getEffectiveTheme();
        document.body.setAttribute('data-theme', theme);
        this.tileStyle = theme;
    }
}

// Leaflet-based map implementation with heat map overlay
class LeafletMap {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.tooltip = document.getElementById('tooltip');
        this.themeManager = new ThemeManager();
        
        // Click marker
        this.clickMarker = null;
        this.clickCircle = null;
        this.clickLine = null;
        
        // Initialize Leaflet map
        this.map = L.map(containerId, {
            center: [37.0902, -95.7129],
            zoom: 5,
            zoomControl: false // We'll use custom controls
        });
        
        // Add tile layer based on theme
        this.updateTileLayer();
        
        // Create a canvas overlay for heat map
        this.createHeatMapLayer();
        
        // Add In-N-Out location markers
        this.addLocationMarkers();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Disable default Leaflet zoom controls (we have custom ones)
        document.getElementById('zoom-in').addEventListener('click', () => {
            this.map.zoomIn();
        });
        
        document.getElementById('zoom-out').addEventListener('click', () => {
            this.map.zoomOut();
        });
        
        document.getElementById('reset').addEventListener('click', () => {
            this.map.setView([37.0902, -95.7129], 5);
            this.clearClickMarker();
        });
    }
    
    updateTileLayer() {
        // Remove existing tile layer if present
        if (this.tileLayer) {
            this.map.removeLayer(this.tileLayer);
        }
        
        const theme = this.themeManager.getEffectiveTheme();
        
        // Choose tile provider based on theme
        if (theme === 'dark') {
            // Use CartoDB Dark Matter for dark theme
            this.tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            });
        } else {
            // Use OpenStreetMap for light theme
            this.tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            });
        }
        
        this.tileLayer.addTo(this.map);
        
        // Redraw heat map with new theme
        if (this.heatMapLayer) {
            this.drawHeatMap();
        }
    }
    
    createHeatMapLayer() {
        // Create a canvas overlay for the heat map
        this.heatMapLayer = L.gridLayer({
            attribution: '',
            tileSize: 256,
            opacity: 0.3
        });
        
        this.heatMapLayer.createTile = (coords) => {
            const tile = document.createElement('canvas');
            const ctx = tile.getContext('2d');
            tile.width = 256;
            tile.height = 256;
            
            // Calculate the bounds of this tile
            const tileBounds = this._tileToBounds(coords);
            
            // Draw heat map for this tile
            this._drawTileHeatMap(ctx, tileBounds, coords.z);
            
            return tile;
        };
        
        this.heatMapLayer.addTo(this.map);
    }
    
    _tileToBounds(coords) {
        const nwPoint = [coords.x * 256, coords.y * 256];
        const sePoint = [(coords.x + 1) * 256, (coords.y + 1) * 256];
        
        const nw = this.map.unproject(nwPoint, coords.z);
        const se = this.map.unproject(sePoint, coords.z);
        
        return L.latLngBounds(se, nw);
    }
    
    _drawTileHeatMap(ctx, bounds, zoom) {
        // Draw heat map for this tile
        const gridSize = 32; // pixels per grid cell
        const numCols = Math.ceil(256 / gridSize);
        const numRows = Math.ceil(256 / gridSize);
        
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const px = col * gridSize;
                const py = row * gridSize;
                
                // Calculate lat/lng for center of this grid cell
                const centerPx = px + gridSize / 2;
                const centerPy = py + gridSize / 2;
                
                // Convert tile pixel to lat/lng
                const latLng = this._tilePixelToLatLng(centerPx, centerPy, bounds);
                
                // Calculate nearest In-N-Out and driving time
                const result = this.getNearestInNOut(latLng.lat, latLng.lng);
                if (result && result.time < 8) {
                    const color = this.getColorForTime(result.time);
                    ctx.fillStyle = color;
                    ctx.fillRect(px, py, gridSize, gridSize);
                }
            }
        }
    }
    
    _tilePixelToLatLng(px, py, bounds) {
        const lat = bounds.getNorth() - (py / 256) * (bounds.getNorth() - bounds.getSouth());
        const lng = bounds.getWest() + (px / 256) * (bounds.getEast() - bounds.getWest());
        return { lat, lng };
    }
    
    drawHeatMap() {
        // Trigger redraw of heat map layer
        if (this.heatMapLayer) {
            this.map.removeLayer(this.heatMapLayer);
            this.createHeatMapLayer();
        }
    }
    
    addLocationMarkers() {
        // Create custom icon for In-N-Out locations
        const inNOutIcon = L.divIcon({
            className: 'innout-marker',
            html: '<div style="background: #c8102e; border: 2px solid white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 16px;">🍔</div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
        
        inNOutLocations.forEach(location => {
            const marker = L.marker([location.lat, location.lng], { icon: inNOutIcon })
                .addTo(this.map)
                .bindTooltip(`<strong>In-N-Out Burger</strong><br>${location.city}`, {
                    direction: 'top',
                    offset: [0, -12]
                });
        });
    }
    
    setupEventListeners() {
        // Click event on map
        this.map.on('click', (e) => {
            this.handleMapClick(e);
        });
        
        // Zoom event to redraw heat map
        this.map.on('zoomend', () => {
            this.drawHeatMap();
        });
        
        // Move event to redraw heat map
        this.map.on('moveend', () => {
            this.drawHeatMap();
        });
    }
    
    handleMapClick(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        // Find nearest In-N-Out
        const result = this.getNearestInNOut(lat, lng);
        
        if (result) {
            this.clearClickMarker();
            
            // Create click marker
            const color = this.getColorForTime(result.time);
            this.clickMarker = L.circleMarker([lat, lng], {
                radius: 10,
                fillColor: color,
                fillOpacity: 1,
                color: 'white',
                weight: 3
            }).addTo(this.map);
            
            // Draw line to nearest location
            this.clickLine = L.polyline([
                [lat, lng],
                [result.location.lat, result.location.lng]
            ], {
                color: color,
                weight: 2,
                dashArray: '10, 5'
            }).addTo(this.map);
            
            // Show tooltip
            const html = `
                <strong>Selected Location</strong><br>
                Coordinates: ${lat.toFixed(4)}°, ${lng.toFixed(4)}°<br>
                <br>
                <strong>Nearest In-N-Out:</strong><br>
                ${result.location.city}<br>
                Distance: ${result.distance.toFixed(1)} miles<br>
                Estimated Driving Time: ${this.formatTime(result.time)}
            `;
            
            this.tooltip.innerHTML = html;
            this.tooltip.style.left = (e.originalEvent.clientX + 15) + 'px';
            this.tooltip.style.top = (e.originalEvent.clientY + 15) + 'px';
            this.tooltip.style.display = 'block';
        }
    }
    
    clearClickMarker() {
        if (this.clickMarker) {
            this.map.removeLayer(this.clickMarker);
            this.clickMarker = null;
        }
        if (this.clickLine) {
            this.map.removeLayer(this.clickLine);
            this.clickLine = null;
        }
        this.tooltip.style.display = 'none';
    }
    
    updateTheme(theme) {
        // Update tile layer for new theme
        this.updateTileLayer();
    }
    
    calculateDrivingDistance(lat1, lng1, lat2, lng2) {
        const R = 3959; // Earth's radius in miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        return distance * 1.4; // Road distance factor
    }
    
    calculateDrivingTime(distanceMiles) {
        return distanceMiles / 60; // Average 60 mph
    }
    
    getColorForTime(hours) {
        if (hours < 0.5) return '#00ff00';      // 0-30 min: Green
        if (hours < 1) return '#80ff00';        // 30-60 min: Yellow-Green
        if (hours < 2) return '#ffff00';        // 1-2 hours: Yellow
        if (hours < 4) return '#ff8000';        // 2-4 hours: Orange
        return '#ff0000';                        // 4+ hours: Red
    }
    
    getNearestInNOut(lat, lng) {
        let minDistance = Infinity;
        let nearestLocation = null;
        
        inNOutLocations.forEach(location => {
            const distance = this.calculateDrivingDistance(lat, lng, location.lat, location.lng);
            if (distance < minDistance) {
                minDistance = distance;
                nearestLocation = location;
            }
        });
        
        const drivingTime = this.calculateDrivingTime(minDistance);
        return {
            location: nearestLocation,
            distance: minDistance,
            time: drivingTime
        };
    }
    
    formatTime(hours) {
        if (hours < 1) {
            return Math.round(hours * 60) + ' minutes';
        } else if (hours < 24) {
            const h = Math.floor(hours);
            const m = Math.round((hours - h) * 60);
            if (m === 0) {
                return h + ' hour' + (h > 1 ? 's' : '');
            }
            return h + ' hour' + (h > 1 ? 's' : '') + ' ' + m + ' min';
        } else {
            const days = Math.floor(hours / 24);
            const h = Math.floor(hours % 24);
            return days + ' day' + (days > 1 ? 's' : '') + ' ' + h + ' hour' + (h > 1 ? 's' : '');
        }
    }
    
    searchCity(cityName) {
        const searchButton = document.getElementById('search-button');
        const searchResult = document.getElementById('search-result');
        
        // Show loading state
        searchButton.disabled = true;
        searchButton.textContent = 'Searching...';
        searchResult.textContent = 'Searching for location...';
        searchResult.className = '';
        
        // Normalize city name for lookup
        const normalizedCity = cityName.toLowerCase().trim();
        
        // Try to find city in database
        setTimeout(() => {
            searchButton.disabled = false;
            searchButton.textContent = 'Search';
            
            const cityData = citiesDatabase[normalizedCity];
            
            if (cityData) {
                const lat = cityData.lat;
                const lng = cityData.lng;
                const displayName = cityData.name;
                
                // Find nearest In-N-Out
                const result = this.getNearestInNOut(lat, lng);
                
                if (result) {
                    // Center map on searched location
                    this.map.setView([lat, lng], 8);
                    
                    // Clear previous click marker
                    this.clearClickMarker();
                    
                    // Create click marker at this location
                    const color = this.getColorForTime(result.time);
                    this.clickMarker = L.circleMarker([lat, lng], {
                        radius: 10,
                        fillColor: color,
                        fillOpacity: 1,
                        color: 'white',
                        weight: 3
                    }).addTo(this.map);
                    
                    // Draw line to nearest location
                    this.clickLine = L.polyline([
                        [lat, lng],
                        [result.location.lat, result.location.lng]
                    ], {
                        color: color,
                        weight: 2,
                        dashArray: '10, 5'
                    }).addTo(this.map);
                    
                    // Display result
                    searchResult.className = 'success';
                    searchResult.innerHTML = `
                        📍 <strong>${displayName}</strong><br>
                        Nearest In-N-Out: <strong>${result.location.city}</strong><br>
                        Distance: ${result.distance.toFixed(1)} miles | 
                        Drive time: ${this.formatTime(result.time)}
                    `;
                } else {
                    searchResult.className = 'error';
                    searchResult.textContent = 'Could not calculate distance to nearest In-N-Out.';
                }
            } else {
                searchResult.className = 'error';
                searchResult.textContent = 'City not found. Try a major US city like "New York, NY" or "Los Angeles, CA".';
            }
        }, 300);
    }
}

// Initialize the map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.inNOutMap = new LeafletMap('map');
    console.log('In-N-Out Desert Map loaded with', inNOutLocations.length, 'locations');
    console.log('Click anywhere on the map to see driving time to the nearest In-N-Out!');
    
    // Setup search functionality
    const searchButton = document.getElementById('search-button');
    const citySearch = document.getElementById('city-search');
    
    searchButton.addEventListener('click', () => {
        const cityName = citySearch.value.trim();
        if (cityName) {
            window.inNOutMap.searchCity(cityName);
        } else {
            const searchResult = document.getElementById('search-result');
            searchResult.className = 'error';
            searchResult.textContent = 'Please enter a city name.';
        }
    });
    
    // Allow Enter key to trigger search
    citySearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
});
