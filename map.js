// Custom map implementation using Canvas
class SimpleMap {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.tooltip = document.getElementById('tooltip');
        
        // Map bounds (USA focused)
        this.minLat = 24.0;  // South
        this.maxLat = 50.0;  // North
        this.minLng = -125.0; // West
        this.maxLng = -66.0;  // East
        
        this.zoom = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        
        this.resize();
        this.setupEventListeners();
        this.draw();
    }
    
    resize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.draw();
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseleave', () => {
            this.tooltip.style.display = 'none';
        });
        
        let isDragging = false;
        let lastX, lastY;
        
        this.canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const dx = e.clientX - lastX;
                const dy = e.clientY - lastY;
                this.offsetX += dx;
                this.offsetY += dy;
                lastX = e.clientX;
                lastY = e.clientY;
                this.draw();
            }
        });
        
        this.canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // Zoom controls
        document.getElementById('zoom-in').addEventListener('click', () => {
            this.zoom *= 1.3;
            this.draw();
        });
        
        document.getElementById('zoom-out').addEventListener('click', () => {
            this.zoom /= 1.3;
            this.draw();
        });
        
        document.getElementById('reset').addEventListener('click', () => {
            this.zoom = 1;
            this.offsetX = 0;
            this.offsetY = 0;
            this.draw();
        });
    }
    
    latLngToPixel(lat, lng) {
        const x = ((lng - this.minLng) / (this.maxLng - this.minLng)) * this.canvas.width;
        const y = ((this.maxLat - lat) / (this.maxLat - this.minLat)) * this.canvas.height;
        
        // Apply zoom and offset
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        const zoomedX = (x - centerX) * this.zoom + centerX + this.offsetX;
        const zoomedY = (y - centerY) * this.zoom + centerY + this.offsetY;
        
        return { x: zoomedX, y: zoomedY };
    }
    
    pixelToLatLng(px, py) {
        // Reverse the zoom and offset
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        const x = (px - this.offsetX - centerX) / this.zoom + centerX;
        const y = (py - this.offsetY - centerY) / this.zoom + centerY;
        
        const lng = this.minLng + (x / this.canvas.width) * (this.maxLng - this.minLng);
        const lat = this.maxLat - (y / this.canvas.height) * (this.maxLat - this.minLat);
        
        return { lat, lng };
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.ctx.fillStyle = '#e8f4f8';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw state borders (simplified)
        this.drawStateBorders();
        
        // Draw In-N-Out locations
        this.drawLocations();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#d0d0d0';
        this.ctx.lineWidth = 0.5;
        
        // Latitude lines
        for (let lat = Math.ceil(this.minLat); lat <= this.maxLat; lat += 5) {
            const start = this.latLngToPixel(lat, this.minLng);
            const end = this.latLngToPixel(lat, this.maxLng);
            
            this.ctx.beginPath();
            this.ctx.moveTo(start.x, start.y);
            this.ctx.lineTo(end.x, end.y);
            this.ctx.stroke();
        }
        
        // Longitude lines
        for (let lng = Math.ceil(this.minLng); lng <= this.maxLng; lng += 5) {
            const start = this.latLngToPixel(this.minLat, lng);
            const end = this.latLngToPixel(this.maxLat, lng);
            
            this.ctx.beginPath();
            this.ctx.moveTo(start.x, start.y);
            this.ctx.lineTo(end.x, end.y);
            this.ctx.stroke();
        }
    }
    
    drawStateBorders() {
        // Simplified US outline
        this.ctx.strokeStyle = '#999';
        this.ctx.lineWidth = 1;
        
        // Draw a simple border around the map area
        const nw = this.latLngToPixel(this.maxLat, this.minLng);
        const ne = this.latLngToPixel(this.maxLat, this.maxLng);
        const sw = this.latLngToPixel(this.minLat, this.minLng);
        const se = this.latLngToPixel(this.minLat, this.maxLng);
        
        this.ctx.beginPath();
        this.ctx.moveTo(nw.x, nw.y);
        this.ctx.lineTo(ne.x, ne.y);
        this.ctx.lineTo(se.x, se.y);
        this.ctx.lineTo(sw.x, sw.y);
        this.ctx.closePath();
        this.ctx.stroke();
    }
    
    drawLocations() {
        inNOutLocations.forEach(location => {
            const pos = this.latLngToPixel(location.lat, location.lng);
            
            // Draw marker
            this.ctx.fillStyle = '#c8102e';
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, 6 * this.zoom, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            
            // Draw burger emoji
            this.ctx.font = `${10 * this.zoom}px Arial`;
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('🍔', pos.x, pos.y);
        });
    }
    
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        
        const { lat, lng } = this.pixelToLatLng(px, py);
        
        // Find nearest In-N-Out
        const result = this.getNearestInNOut(lat, lng);
        
        if (result) {
            // Draw marker at clicked location
            this.draw();
            
            const clickPos = this.latLngToPixel(lat, lng);
            const color = this.getColorForTime(result.time);
            
            this.ctx.fillStyle = color;
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            
            this.ctx.beginPath();
            this.ctx.arc(clickPos.x, clickPos.y, 8 * this.zoom, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            
            // Draw line to nearest In-N-Out
            const nearestPos = this.latLngToPixel(result.location.lat, result.location.lng);
            
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            
            this.ctx.beginPath();
            this.ctx.moveTo(clickPos.x, clickPos.y);
            this.ctx.lineTo(nearestPos.x, nearestPos.y);
            this.ctx.stroke();
            
            this.ctx.setLineDash([]);
            
            // Show tooltip
            this.showTooltip(e.clientX, e.clientY, result, lat, lng);
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
            
            if (dist < 10 * this.zoom) {
                this.canvas.style.cursor = 'pointer';
                this.showLocationTooltip(e.clientX, e.clientY, location);
                return;
            }
        }
        
        this.canvas.style.cursor = 'crosshair';
    }
    
    showLocationTooltip(x, y, location) {
        this.tooltip.innerHTML = `<strong>In-N-Out Burger</strong><br>${location.city}`;
        this.tooltip.style.left = (x + 15) + 'px';
        this.tooltip.style.top = (y + 15) + 'px';
        this.tooltip.style.display = 'block';
    }
    
    showTooltip(x, y, result, lat, lng) {
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
        this.tooltip.style.left = (x + 15) + 'px';
        this.tooltip.style.top = (y + 15) + 'px';
        this.tooltip.style.display = 'block';
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
    const map = new SimpleMap('map-canvas');
    console.log('In-N-Out Desert Map loaded with', inNOutLocations.length, 'locations');
    console.log('Click anywhere on the map to see driving time to the nearest In-N-Out!');
});
