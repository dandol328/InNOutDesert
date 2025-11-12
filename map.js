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

// Lightweight tile-based map implementation
class SimpleMap {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        this.tooltip = document.getElementById('tooltip');
        this.themeManager = new ThemeManager();
        
        // Map state
        this.centerLat = 37.0902;
        this.centerLng = -95.7129;
        this.zoom = 5;
        this.tileSize = 256; // Keep this for coordinate calculations
        
        // Dragging state
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
        
        // Click marker
        this.clickMarker = null;
        
        // Cache for heat map to improve performance
        this.heatMapCache = null;
        this.lastZoom = null;
        this.lastCenterLat = null;
        this.lastCenterLng = null;
        
        this.resize();
        this.setupEventListeners();
        this.draw();
    }
    
    resize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        // Invalidate heat map cache on resize
        this.heatMapCache = null;
        this.draw();
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
            this.canvas.style.cursor = 'grabbing';
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const dx = e.clientX - this.lastX;
                const dy = e.clientY - this.lastY;
                
                // Update center based on drag
                const scale = this.getScale();
                this.centerLng -= dx / scale;
                this.centerLat += dy / scale;
                
                this.lastX = e.clientX;
                this.lastY = e.clientY;
                this.draw();
            } else {
                // Check hover over markers
                this.handleMouseMove(e);
            }
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.canvas.style.cursor = 'default';
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.isDragging = false;
            this.canvas.style.cursor = 'default';
            this.tooltip.style.display = 'none';
        });
        
        this.canvas.addEventListener('click', (e) => {
            if (!this.isDragging) {
                this.handleClick(e);
            }
        });
        
        // Wheel zoom
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomDelta = e.deltaY > 0 ? -0.5 : 0.5;
            this.zoom = Math.max(3, Math.min(10, this.zoom + zoomDelta));
            this.draw();
        });
        
        // Zoom controls
        document.getElementById('zoom-in').addEventListener('click', () => {
            this.zoom = Math.min(10, this.zoom + 1);
            this.draw();
        });
        
        document.getElementById('zoom-out').addEventListener('click', () => {
            this.zoom = Math.max(3, this.zoom - 1);
            this.draw();
        });
        
        document.getElementById('reset').addEventListener('click', () => {
            this.centerLat = 37.0902;
            this.centerLng = -95.7129;
            this.zoom = 5;
            this.clickMarker = null;
            this.draw();
        });
    }
    
    getScale() {
        return this.tileSize * Math.pow(2, this.zoom) / 360;
    }
    
    latLngToPixel(lat, lng) {
        const scale = this.getScale();
        
        // Convert to Web Mercator
        const x = (lng + 180) * scale;
        const latRad = lat * Math.PI / 180;
        const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
        const y = (180 - mercN * 180 / Math.PI) * scale;
        
        // Offset by center
        const centerX = (this.centerLng + 180) * scale;
        const centerLatRad = this.centerLat * Math.PI / 180;
        const centerMercN = Math.log(Math.tan(Math.PI / 4 + centerLatRad / 2));
        const centerY = (180 - centerMercN * 180 / Math.PI) * scale;
        
        return {
            x: this.canvas.width / 2 + (x - centerX),
            y: this.canvas.height / 2 + (y - centerY)
        };
    }
    
    pixelToLatLng(px, py) {
        const scale = this.getScale();
        
        // Calculate center in pixels
        const centerX = (this.centerLng + 180) * scale;
        const centerLatRad = this.centerLat * Math.PI / 180;
        const centerMercN = Math.log(Math.tan(Math.PI / 4 + centerLatRad / 2));
        const centerY = (180 - centerMercN * 180 / Math.PI) * scale;
        
        // Calculate clicked point
        const x = centerX + (px - this.canvas.width / 2);
        const y = centerY + (py - this.canvas.height / 2);
        
        const lng = (x / scale) - 180;
        const mercN = (180 - y / scale) * Math.PI / 180;
        const lat = (Math.atan(Math.exp(mercN)) - Math.PI / 4) * 2 * 180 / Math.PI;
        
        return { lat, lng };
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background (ocean/water color)
        const bgColor = this.themeManager.tileStyle === 'dark' ? '#0a1929' : '#a5c4d4';
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw land mass (basemap)
        this.drawLandMass();
        
        // Draw heat map (color-coded driving time overlay)
        this.drawHeatMap();
        
        // Draw grid
        this.drawGrid();
        
        // Draw state outlines
        this.drawStateOutlines();
        
        // Draw In-N-Out locations
        this.drawLocations();
        
        // Draw click marker if exists
        if (this.clickMarker) {
            this.drawClickMarker();
        }
    }
    
    drawLandMass() {
        // Draw USA land mass as a simplified polygon
        const landColor = this.themeManager.tileStyle === 'dark' ? '#1e1e1e' : '#e8e6e1';
        this.ctx.fillStyle = landColor;
        
        // Simplified US mainland boundary
        const usMainland = [
            { lat: 49, lng: -125 }, // Northwest
            { lat: 49, lng: -95 },  // North central
            { lat: 49, lng: -67 },  // Northeast
            { lat: 45, lng: -67 },  // Maine
            { lat: 41, lng: -70 },  // Cape Cod
            { lat: 40, lng: -74 },  // NYC area
            { lat: 37, lng: -76 },  // Chesapeake
            { lat: 33, lng: -78 },  // Carolina coast
            { lat: 30, lng: -81 },  // Florida
            { lat: 25, lng: -80 },  // South Florida
            { lat: 25, lng: -81 },  // Florida Keys
            { lat: 28, lng: -83 },  // Tampa
            { lat: 30, lng: -84 },  // Panhandle
            { lat: 30, lng: -88 },  // Gulf coast
            { lat: 29, lng: -95 },  // Houston
            { lat: 26, lng: -97 },  // South Texas
            { lat: 32, lng: -117 }, // San Diego
            { lat: 34, lng: -120 }, // Santa Barbara
            { lat: 38, lng: -123 }, // San Francisco
            { lat: 42, lng: -124 }, // Oregon
            { lat: 48, lng: -125 }, // Washington
        ];
        
        this.ctx.beginPath();
        const firstPoint = this.latLngToPixel(usMainland[0].lat, usMainland[0].lng);
        this.ctx.moveTo(firstPoint.x, firstPoint.y);
        
        for (let i = 1; i < usMainland.length; i++) {
            const point = this.latLngToPixel(usMainland[i].lat, usMainland[i].lng);
            this.ctx.lineTo(point.x, point.y);
        }
        
        this.ctx.closePath();
        this.ctx.fill();
        
        // Draw Alaska (simplified)
        const alaskaColor = this.themeManager.tileStyle === 'dark' ? '#2a2a2a' : '#f0f0f0';
        this.ctx.fillStyle = alaskaColor;
        const alaska = [
            { lat: 71, lng: -156 },
            { lat: 71, lng: -141 },
            { lat: 60, lng: -141 },
            { lat: 55, lng: -130 },
            { lat: 60, lng: -165 },
        ];
        
        this.ctx.beginPath();
        const alaskaFirst = this.latLngToPixel(alaska[0].lat, alaska[0].lng);
        this.ctx.moveTo(alaskaFirst.x, alaskaFirst.y);
        
        for (let i = 1; i < alaska.length; i++) {
            const point = this.latLngToPixel(alaska[i].lat, alaska[i].lng);
            this.ctx.lineTo(point.x, point.y);
        }
        
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawHeatMap() {
        // Check if we need to regenerate the heat map
        const needsRegeneration = !this.heatMapCache || 
                                  this.zoom !== this.lastZoom || 
                                  this.centerLat !== this.lastCenterLat || 
                                  this.centerLng !== this.lastCenterLng ||
                                  this.heatMapCache.width !== this.canvas.width ||
                                  this.heatMapCache.height !== this.canvas.height;
        
        if (needsRegeneration) {
            // Create a grid of pixels and calculate driving time for each
            // Use a lower resolution grid for performance
            const gridSize = 25; // pixels per grid cell (smaller = smoother)
            const numCols = Math.ceil(this.canvas.width / gridSize);
            const numRows = Math.ceil(this.canvas.height / gridSize);
            
            // Create an offscreen canvas for the heat map
            this.heatMapCache = document.createElement('canvas');
            this.heatMapCache.width = this.canvas.width;
            this.heatMapCache.height = this.canvas.height;
            const heatCtx = this.heatMapCache.getContext('2d');
            
            // Draw colored rectangles for each grid cell
            for (let row = 0; row < numRows; row++) {
                for (let col = 0; col < numCols; col++) {
                    const px = col * gridSize;
                    const py = row * gridSize;
                    
                    // Get the lat/lng for the center of this grid cell
                    const centerPx = px + gridSize / 2;
                    const centerPy = py + gridSize / 2;
                    const { lat, lng } = this.pixelToLatLng(centerPx, centerPy);
                    
                    // Calculate nearest In-N-Out and driving time
                    const result = this.getNearestInNOut(lat, lng);
                    if (result) {
                        const color = this.getColorForTime(result.time);
                        
                        // Draw the colored rectangle with transparency
                        heatCtx.fillStyle = color;
                        heatCtx.globalAlpha = 0.4; // Semi-transparent overlay
                        heatCtx.fillRect(px, py, gridSize, gridSize);
                        heatCtx.globalAlpha = 1.0; // Reset alpha
                    }
                }
            }
            
            // Store current state
            this.lastZoom = this.zoom;
            this.lastCenterLat = this.centerLat;
            this.lastCenterLng = this.centerLng;
        }
        
        // Draw the cached heat map
        this.ctx.drawImage(this.heatMapCache, 0, 0);
    }
    
    drawGrid() {
        const gridColor = this.themeManager.tileStyle === 'dark' ? '#333333' : '#d0d0d0';
        this.ctx.strokeStyle = gridColor;
        this.ctx.lineWidth = 0.5;
        
        // Draw latitude lines every 5 degrees
        for (let lat = 25; lat <= 50; lat += 5) {
            this.ctx.beginPath();
            const startX = this.latLngToPixel(lat, -125);
            const endX = this.latLngToPixel(lat, -65);
            this.ctx.moveTo(startX.x, startX.y);
            this.ctx.lineTo(endX.x, endX.y);
            this.ctx.stroke();
        }
        
        // Draw longitude lines every 10 degrees
        for (let lng = -120; lng <= -70; lng += 10) {
            this.ctx.beginPath();
            const startY = this.latLngToPixel(50, lng);
            const endY = this.latLngToPixel(24, lng);
            this.ctx.moveTo(startY.x, startY.y);
            this.ctx.lineTo(endY.x, endY.y);
            this.ctx.stroke();
        }
    }
    
    drawStateOutlines() {
        const outlineColor = this.themeManager.tileStyle === 'dark' ? '#555555' : '#999999';
        this.ctx.strokeStyle = outlineColor;
        this.ctx.lineWidth = 1;
        
        // Draw major state boundaries (simplified)
        const stateBorders = [
            // California-Nevada
            [{ lat: 42, lng: -120 }, { lat: 35, lng: -114.6 }],
            // Nevada-Arizona
            [{ lat: 37, lng: -114 }, { lat: 35, lng: -114 }],
            // Arizona-New Mexico
            [{ lat: 37, lng: -109 }, { lat: 31.5, lng: -109 }],
            // Texas-New Mexico
            [{ lat: 37, lng: -103 }, { lat: 32, lng: -103 }],
            // Colorado boundaries
            [{ lat: 41, lng: -109 }, { lat: 37, lng: -109 }],
            [{ lat: 41, lng: -102 }, { lat: 37, lng: -102 }],
        ];
        
        stateBorders.forEach(border => {
            this.ctx.beginPath();
            const start = this.latLngToPixel(border[0].lat, border[0].lng);
            const end = this.latLngToPixel(border[1].lat, border[1].lng);
            this.ctx.moveTo(start.x, start.y);
            this.ctx.lineTo(end.x, end.y);
            this.ctx.stroke();
        });
    }
    
    
    drawLocations() {
        inNOutLocations.forEach(location => {
            const pos = this.latLngToPixel(location.lat, location.lng);
            
            // Only draw if on screen
            if (pos.x >= -20 && pos.x <= this.canvas.width + 20 &&
                pos.y >= -20 && pos.y <= this.canvas.height + 20) {
                
                // Draw pin background
                this.ctx.fillStyle = '#c8102e';
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                
                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
                
                // Draw burger emoji
                this.ctx.font = '16px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('🍔', pos.x, pos.y);
            }
        });
    }
    
    drawClickMarker() {
        const pos = this.latLngToPixel(this.clickMarker.lat, this.clickMarker.lng);
        const color = this.getColorForTime(this.clickMarker.result.time);
        
        // Draw marker
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 3;
        
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Draw line to nearest location
        const nearestPos = this.latLngToPixel(
            this.clickMarker.result.location.lat,
            this.clickMarker.result.location.lng
        );
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 5]);
        
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
        this.ctx.lineTo(nearestPos.x, nearestPos.y);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
    }
    
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        
        const { lat, lng } = this.pixelToLatLng(px, py);
        
        // Find nearest In-N-Out
        const result = this.getNearestInNOut(lat, lng);
        
        if (result) {
            this.clickMarker = { lat, lng, result };
            this.draw();
            
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
            this.tooltip.style.left = (e.clientX + 15) + 'px';
            this.tooltip.style.top = (e.clientY + 15) + 'px';
            this.tooltip.style.display = 'block';
        }
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        
        // Check if hovering over a location
        for (const location of inNOutLocations) {
            const pos = this.latLngToPixel(location.lat, location.lng);
            const dist = Math.sqrt((px - pos.x) ** 2 + (py - pos.y) ** 2);
            
            if (dist < 15) {
                this.canvas.style.cursor = 'pointer';
                this.tooltip.innerHTML = `<strong>In-N-Out Burger</strong><br>${location.city}`;
                this.tooltip.style.left = (e.clientX + 15) + 'px';
                this.tooltip.style.top = (e.clientY + 15) + 'px';
                this.tooltip.style.display = 'block';
                return;
            }
        }
        
        // Only hide tooltip if not showing click result
        if (!this.clickMarker) {
            this.tooltip.style.display = 'none';
        }
        this.canvas.style.cursor = 'default';
    }
    
    updateTheme(theme) {
        // Redraw with new theme colors
        this.draw();
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
}

// Initialize the map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.inNOutMap = new SimpleMap('map');
    console.log('In-N-Out Desert Map loaded with', inNOutLocations.length, 'locations');
    console.log('Click anywhere on the map to see driving time to the nearest In-N-Out!');
});
