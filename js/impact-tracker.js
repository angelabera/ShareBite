// ShareBite Impact Tracker - Dynamic Impact Statistics
class ImpactTracker {
    constructor() {
        this.impactData = {
            totalMealsSaved: 0,
            totalFoodWaste: 0,
            totalVolunteers: 0,
            totalDonors: 0,
            totalLocations: 0,
            totalCO2: 0,
            monthlyMeals: 0,
            monthlyWaste: 0,
            monthlyPeople: 0
        };
        
        this.activityFeed = [];
        this.init();
    }

    init() {
        this.loadImpactData();
        this.calculateImpactMetrics();
        this.updateImpactDisplay();
        this.setupActivityFeed();
        this.startRealTimeUpdates();
    }

    loadImpactData() {
        // Load data from localStorage or calculate from food listings
        const storedData = localStorage.getItem('sharebite-impact-data');
        if (storedData) {
            this.impactData = { ...this.impactData, ...JSON.parse(storedData) };
        }
        
        // Calculate from food listings data
        this.calculateFromFoodListings();
    }

    calculateFromFoodListings() {
        // Get food listings from the main application
        const foodListings = this.getFoodListings();
        const claimedItems = this.getClaimedItems();
        const notifications = this.getNotifications();
        
        // Calculate metrics based on actual data
        this.impactData.totalMealsSaved = this.calculateMealsSaved(foodListings, claimedItems);
        this.impactData.totalFoodWaste = this.calculateFoodWaste(foodListings, claimedItems);
        this.impactData.totalVolunteers = this.calculateVolunteers(notifications);
        this.impactData.totalDonors = this.calculateDonors(foodListings);
        this.impactData.totalLocations = this.calculateLocations(foodListings);
        this.impactData.totalCO2 = this.calculateCO2Saved(this.impactData.totalFoodWaste);
        
        // Calculate monthly metrics
        this.calculateMonthlyMetrics();
        
        // Save updated data
        this.saveImpactData();
    }

    getFoodListings() {
        // Try to get food listings from the main application
        if (window.ShareBiteFoodListing && window.ShareBiteFoodListing.foodListings) {
            return window.ShareBiteFoodListing.foodListings;
        }
        
        // Fallback: get from localStorage
        const stored = localStorage.getItem('sharebite-food-listings');
        return stored ? JSON.parse(stored) : [];
    }

    getClaimedItems() {
        const stored = localStorage.getItem('sharebite-claimed-items');
        return stored ? JSON.parse(stored) : [];
    }

    getNotifications() {
        const stored = localStorage.getItem('sharebite-notifications');
        return stored ? JSON.parse(stored) : [];
    }

    calculateMealsSaved(foodListings, claimedItems) {
        let totalMeals = 0;
        
        foodListings.forEach(listing => {
            if (claimedItems.includes(listing.id)) {
                // Extract quantity from listing
                const quantity = this.extractQuantity(listing.quantity);
                totalMeals += quantity;
            }
        });
        
        // Add base meals from hero stats
        return totalMeals + 1500;
    }

    calculateFoodWaste(foodListings, claimedItems) {
        let totalWaste = 0;
        
        foodListings.forEach(listing => {
            if (claimedItems.includes(listing.id)) {
                // Estimate waste based on quantity (rough calculation)
                const quantity = this.extractQuantity(listing.quantity);
                totalWaste += quantity * 0.5; // Assume 0.5kg per meal
            }
        });
        
        // Add base waste prevented
        return Math.round(totalWaste + 750);
    }

    calculateVolunteers(notifications) {
        // Count unique volunteers from notifications
        const uniqueVolunteers = new Set();
        notifications.forEach(notification => {
            if (notification.claimedBy) {
                uniqueVolunteers.add(notification.claimedBy);
            }
        });
        
        return uniqueVolunteers.size + 85; // Base volunteers
    }

    calculateDonors(foodListings) {
        // Count unique donors
        const uniqueDonors = new Set();
        foodListings.forEach(listing => {
            if (listing.donor) {
                uniqueDonors.add(listing.donor);
            }
        });
        
        return uniqueDonors.size + 25; // Base donors
    }

    calculateLocations(foodListings) {
        // Count unique locations
        const uniqueLocations = new Set();
        foodListings.forEach(listing => {
            if (listing.location) {
                const city = this.extractCity(listing.location);
                if (city) {
                    uniqueLocations.add(city);
                }
            }
        });
        
        return uniqueLocations.size + 12; // Base locations
    }

    calculateCO2Saved(foodWaste) {
        // CO2 emissions from food waste: approximately 2.5kg CO2 per kg of food waste
        return Math.round(foodWaste * 2.5);
    }

    calculateMonthlyMetrics() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        // Calculate monthly metrics (simplified)
        this.impactData.monthlyMeals = Math.round(this.impactData.totalMealsSaved * 0.15);
        this.impactData.monthlyWaste = Math.round(this.impactData.totalFoodWaste * 0.15);
        this.impactData.monthlyPeople = Math.round(this.impactData.monthlyMeals * 0.8);
    }

    extractQuantity(quantityString) {
        if (!quantityString) return 1;
        
        const match = quantityString.match(/(\d+)/);
        return match ? parseInt(match[1]) : 1;
    }

    extractCity(locationString) {
        if (!locationString) return null;
        
        // Simple city extraction (look for common patterns)
        const parts = locationString.split(',');
        if (parts.length > 1) {
            return parts[parts.length - 1].trim();
        }
        
        return locationString.split(' ')[0];
    }

    calculateImpactMetrics() {
        // Calculate waste reduction percentage
        const wasteReductionPercentage = Math.min(95, Math.round((this.impactData.totalFoodWaste / 1000) * 10));
        this.impactData.wasteReduced = wasteReductionPercentage;
    }

    updateImpactDisplay() {
        // Update all impact numbers with animation
        this.animateNumber('totalMealsSaved', this.impactData.totalMealsSaved);
        this.animateNumber('totalVolunteers', this.impactData.totalVolunteers);
        this.animateNumber('totalDonors', this.impactData.totalDonors);
        this.animateNumber('wasteReduced', this.impactData.wasteReduced, '%');
        
        // Update main impact section
        this.animateNumber('impactMealsSaved', this.impactData.totalMealsSaved);
        this.animateNumber('impactFoodWaste', this.impactData.totalFoodWaste);
        this.animateNumber('impactVolunteers', this.impactData.totalVolunteers);
        this.animateNumber('impactDonors', this.impactData.totalDonors);
        this.animateNumber('impactLocations', this.impactData.totalLocations);
        this.animateNumber('impactCO2', this.impactData.totalCO2);
        
        // Update monthly metrics
        this.animateNumber('monthlyMeals', this.impactData.monthlyMeals);
        this.animateNumber('monthlyWaste', this.impactData.monthlyWaste);
        this.animateNumber('monthlyPeople', this.impactData.monthlyPeople);
    }

    animateNumber(elementId, targetValue, suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const startValue = 0;
        const duration = 2000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(startValue + (targetValue - startValue) * easeOut);
            
            element.textContent = currentValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    setupActivityFeed() {
        this.generateActivityFeed();
        this.updateActivityDisplay();
    }

    generateActivityFeed() {
        const activities = [
            { icon: 'fas fa-utensils', text: 'New food listing added', time: '2 minutes ago' },
            { icon: 'fas fa-check-circle', text: 'Food item claimed successfully', time: '15 minutes ago' },
            { icon: 'fas fa-user-plus', text: 'New volunteer joined', time: '1 hour ago' },
            { icon: 'fas fa-building', text: 'New restaurant partner added', time: '2 hours ago' },
            { icon: 'fas fa-heart', text: 'Food distributed to community', time: '3 hours ago' },
            { icon: 'fas fa-leaf', text: 'CO2 emissions reduced', time: '4 hours ago' }
        ];
        
        // Shuffle and take first 3
        this.activityFeed = activities.sort(() => Math.random() - 0.5).slice(0, 3);
    }

    updateActivityDisplay() {
        const activityFeed = document.getElementById('activityFeed');
        if (!activityFeed) return;
        
        activityFeed.innerHTML = this.activityFeed.map(activity => `
            <div class="activity-item">
                <i class="${activity.icon}"></i>
                <div class="activity-content">
                    <span class="activity-text">${activity.text}</span>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    startRealTimeUpdates() {
        // Update metrics every 30 seconds
        setInterval(() => {
            this.updateRandomMetrics();
            this.updateImpactDisplay();
        }, 30000);
        
        // Update activity feed every 2 minutes
        setInterval(() => {
            this.generateActivityFeed();
            this.updateActivityDisplay();
        }, 120000);
    }

    updateRandomMetrics() {
        // Simulate real-time updates with small random increments
        const increment = () => Math.floor(Math.random() * 3) + 1;
        
        this.impactData.totalMealsSaved += increment();
        this.impactData.totalFoodWaste += increment();
        this.impactData.totalCO2 = this.calculateCO2Saved(this.impactData.totalFoodWaste);
        
        this.calculateMonthlyMetrics();
        this.saveImpactData();
    }

    saveImpactData() {
        localStorage.setItem('sharebite-impact-data', JSON.stringify(this.impactData));
    }

    // Method to add new impact data (called when food is claimed)
    addImpactData(mealsSaved, wastePrevented) {
        this.impactData.totalMealsSaved += mealsSaved;
        this.impactData.totalFoodWaste += wastePrevented;
        this.impactData.totalCO2 = this.calculateCO2Saved(this.impactData.totalFoodWaste);
        
        this.calculateMonthlyMetrics();
        this.updateImpactDisplay();
        this.saveImpactData();
        
        // Add to activity feed
        this.addActivityItem('fas fa-check-circle', 'Food item claimed and distributed', 'Just now');
    }

    addActivityItem(icon, text, time) {
        this.activityFeed.unshift({ icon, text, time });
        this.activityFeed = this.activityFeed.slice(0, 3); // Keep only latest 3
        this.updateActivityDisplay();
    }

    // Method to get current impact data
    getImpactData() {
        return this.impactData;
    }
}

// Initialize Impact Tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ImpactTracker = new ImpactTracker();
});

// Export for use in other scripts
window.ImpactTracker = ImpactTracker;
