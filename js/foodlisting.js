// ShareBite JavaScript - Food Listing System
class ShareBiteFoodListing {
    constructor() {
        this.currentRole = 'donor';
        this.foodListings = [];
        this.filteredListings = [];
        this.currentFilter = 'all';
        
        this.init();
        this.initTheme();
    }

    init() {
        this.setupEventListeners();
        this.generateSampleListings();
        this.renderFoodListings();
        this.startAnimations();
        this.hideLoadingOverlay();
    }

    initTheme() {
        const stored = localStorage.getItem('sharebite-theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = stored || (prefersDark ? 'dark' : 'light');
        this.applyTheme(theme);
        this.setupThemeToggle();
    }

    setupThemeToggle() {
        const btn = document.getElementById('themeToggle');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const newTheme = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
            this.applyTheme(newTheme);
            localStorage.setItem('sharebite-theme', newTheme);
        });
    }

    applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('theme-dark');
            document.body.classList.remove('theme-light');
            const icon = document.querySelector('#themeToggle i');
            if (icon) { 
                icon.classList.remove('fa-moon'); 
                icon.classList.add('fa-sun'); 
            }
        } else {
            document.body.classList.add('theme-light');
            document.body.classList.remove('theme-dark');
            const icon = document.querySelector('#themeToggle i');
            if (icon) { 
                icon.classList.remove('fa-sun'); 
                icon.classList.add('fa-moon'); 
            }
        }
    }

    setupEventListeners() {
        this.setupNavigation();
        this.setupRoleSwitch();
        this.setupModal();
        this.setupFormHandling();
        this.setupFilteringAndSearch();
        this.setupResponsiveNav();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }

    setupRoleSwitch() {
        const roleSwitch = document.getElementById('roleSwitch');
        const currentRoleSpan = document.getElementById('currentRole');
        
        if (roleSwitch && currentRoleSpan) {
            roleSwitch.addEventListener('click', () => {
                this.currentRole = this.currentRole === 'donor' ? 'collector' : 'donor';
                currentRoleSpan.textContent = this.currentRole.charAt(0).toUpperCase() + this.currentRole.slice(1);
                this.updateUIForRole();
            });
        }
    }

    updateUIForRole() {
        const addListingBtn = document.getElementById('addListingBtn');
        if (addListingBtn) {
            addListingBtn.style.display = this.currentRole === 'collector' ? 'none' : 'flex';
        }
    }

    setupModal() {
        const modal = document.getElementById('addListingModal');
        const addListingBtn = document.getElementById('addListingBtn');
        const closeModalBtn = document.querySelector('.close-modal');
        const cancelBtn = document.getElementById('cancelForm');

        if (!modal || !addListingBtn) return;

        this.currentStep = 1;
        this.totalSteps = 3;

        addListingBtn.addEventListener('click', () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            this.resetFormSteps();
        });

        const closeModal = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            this.resetForm();
            this.resetFormSteps();
        };

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        this.setupFormNavigation();
    }

    setupFormNavigation() {
        const nextBtn = document.getElementById('nextStep');
        const prevBtn = document.getElementById('prevStep');
        const submitBtn = document.getElementById('submitForm');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.validateCurrentStep()) {
                    this.goToStep(this.currentStep + 1);
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.goToStep(this.currentStep - 1);
            });
        }
    }

    goToStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > this.totalSteps) return;

        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });

        const newStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (newStep) {
            newStep.classList.add('active');
        }

        this.updateProgress(stepNumber);
        this.updateNavigationButtons(stepNumber);
        this.currentStep = stepNumber;
    }

    updateProgress(stepNumber) {
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((step, index) => {
            const stepNum = index + 1;
            if (stepNum < stepNumber) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNum === stepNumber) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }

    updateNavigationButtons(stepNumber) {
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const submitBtn = document.getElementById('submitForm');

        if (prevBtn) prevBtn.style.display = stepNumber === 1 ? 'none' : 'flex';
        if (nextBtn) nextBtn.style.display = stepNumber === this.totalSteps ? 'none' : 'flex';
        if (submitBtn) submitBtn.style.display = stepNumber === this.totalSteps ? 'flex' : 'none';
    }

    validateCurrentStep() {
        const currentStepEl = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        if (!currentStepEl) return false;

        const requiredInputs = currentStepEl.querySelectorAll('[required]');
        for (let input of requiredInputs) {
            if (!input.value.trim()) {
                input.focus();
                this.showToast(`Please fill in the required field: ${input.previousElementSibling?.textContent || 'this field'}`, 'error');
                return false;
            }
        }
        return true;
    }

    setupFormHandling() {
        const form = document.getElementById('listingForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }
    }

    handleFormSubmission() {
        const formData = this.getFormData();
        if (this.validateFormData(formData)) {
            this.addNewListing(formData);
            this.showSuccessMessage();
            this.closeModalAndReset();
        }
    }

    getFormData() {
        return {
            id: Date.now(),
            foodType: document.getElementById('foodType')?.value || '',
            quantity: document.getElementById('quantity')?.value || '',
            category: document.getElementById('category')?.value || '',
            description: document.getElementById('description')?.value || '',
            freshUntil: document.getElementById('freshUntil')?.value || '',
            pickupTime: document.getElementById('pickupTime')?.value || '',
            location: document.getElementById('location')?.value || '',
            contact: document.getElementById('contact')?.value || '',
            createdAt: new Date(),
            donor: 'Current User'
        };
    }

    validateFormData(data) {
        const requiredFields = ['foodType', 'quantity', 'category', 'freshUntil', 'pickupTime', 'location', 'contact'];
        for (let field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                this.showErrorMessage(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
                return false;
            }
        }
        return true;
    }

    addNewListing(data) {
        this.foodListings.unshift(data);
        this.filterListings();
        this.renderFoodListings();
    }

    showSuccessMessage() {
        this.showToast('Food listing added successfully!', 'success');
    }

    showErrorMessage(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4a9c2f' : '#ff6b6b'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 3000;
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }

    closeModalAndReset() {
        const modal = document.getElementById('addListingModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            this.resetForm();
        }
    }

    resetForm() {
        const form = document.getElementById('listingForm');
        if (form) form.reset();
    }

    resetFormSteps() {
        this.currentStep = 1;
        this.goToStep(1);
    }

    setupFilteringAndSearch() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const searchInput = document.querySelector('.search-box input');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.getAttribute('data-filter');
                this.filterListings();
                this.renderFoodListings();
            });
        });

        let searchTimeout;
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchQuery = e.target.value.toLowerCase();
                    this.filterListings();
                    this.renderFoodListings();
                }, 300);
            });
        }
    }

    filterListings() {
        this.filteredListings = this.foodListings.filter(listing => {
            const matchesFilter = this.currentFilter === 'all' || listing.category === this.currentFilter;
            const matchesSearch = !this.searchQuery || 
                listing.foodType.toLowerCase().includes(this.searchQuery) ||
                listing.location.toLowerCase().includes(this.searchQuery) ||
                listing.description.toLowerCase().includes(this.searchQuery);
            
            return matchesFilter && matchesSearch;
        });
    }

    setupResponsiveNav() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    }

    generateSampleListings() {
        const sampleListings = [
            {
                id: 1,
                foodType: "Fresh Pizza Margherita",
                quantity: "8 slices",
                category: "restaurant",
                description: "Freshly made pizza with mozzarella, tomato sauce, and basil. Perfect condition, just from lunch service.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "18:00",
                location: "Mario's Pizzeria, 123 Main Street",
                contact: "+1 234-567-8900",
                createdAt: new Date(Date.now() - 3600000),
                donor: "Mario's Pizzeria"
            },
            {
                id: 2,
                foodType: "Assorted Sandwiches",
                quantity: "15 sandwiches",
                category: "event",
                description: "Various sandwiches including turkey, ham, and vegetarian options from corporate catering event.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "16:30",
                location: "Downtown Conference Center",
                contact: "events@conference.com",
                createdAt: new Date(Date.now() - 7200000),
                donor: "Conference Center"
            },
            {
                id: 3,
                foodType: "Fresh Bread & Pastries",
                quantity: "20+ items",
                category: "bakery",
                description: "End-of-day fresh bread, croissants, and pastries. All baked today and still perfectly fresh.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "20:00",
                location: "Sunrise Bakery, Oak Avenue",
                contact: "+1 234-567-8901",
                createdAt: new Date(Date.now() - 1800000),
                donor: "Sunrise Bakery"
            },
            {
                id: 4,
                foodType: "Home-cooked Curry",
                quantity: "4-6 portions",
                category: "household",
                description: "Vegetarian curry with rice, made too much for family dinner. Spice level: medium.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "19:00",
                location: "Residential Area, Pine Street",
                contact: "+1 234-567-8902",
                createdAt: new Date(Date.now() - 900000),
                donor: "Local Family"
            },
            {
                id: 5,
                foodType: "Fruit & Vegetable Box",
                quantity: "1 large box",
                category: "restaurant",
                description: "Fresh produce includes apples, oranges, carrots, and lettuce.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "17:00",
                location: "Green Garden Restaurant",
                contact: "+1 234-567-8903",
                createdAt: new Date(Date.now() - 5400000),
                donor: "Green Garden Restaurant"
            },
            {
                id: 6,
                foodType: "Grilled Chicken Meals",
                quantity: "12 complete meals",
                category: "restaurant",
                description: "Grilled chicken with rice and vegetables. Prepared for cancelled catering order.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "18:30",
                location: "Healthy Eats Cafe, Market Square",
                contact: "+1 234-567-8904",
                createdAt: new Date(Date.now() - 2700000),
                donor: "Healthy Eats Cafe"
            }
        ];
        
        this.foodListings = sampleListings;
        this.filteredListings = sampleListings;
    }

    getRandomFutureDate() {
        const now = new Date();
        const hours = Math.floor(Math.random() * 48) + 2;
        const futureDate = new Date(now.getTime() + hours * 60 * 60 * 1000);
        return futureDate.toISOString().slice(0, 16);
    }

    renderFoodListings() {
        const foodGrid = document.getElementById('foodGrid') || document.getElementById('fullfoodGrid');
        if (!foodGrid) return;
        
        if (this.filteredListings.length === 0) {
            foodGrid.innerHTML = `
                <div class="no-listings">
                    <i class="fas fa-search" style="font-size: 3rem; color: #666; margin-bottom: 1rem;"></i>
                    <h3>No listings found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            `;
            return;
        }
        
        foodGrid.innerHTML = this.filteredListings.map(listing => this.createFoodCard(listing)).join('');
        this.setupFoodCardInteractions();
    }

    createFoodCard(listing) {
        const timeAgo = this.getTimeAgo(listing.createdAt);
        const freshUntil = this.formatDateTime(listing.freshUntil);
        const distance = this.getRandomDistance();
        const foodImage = this.getFoodImage(listing.foodType, listing.category);
        
        return `
            <div class="food-card" data-id="${listing.id}" data-category="${listing.category}">
                <div class="food-image-container">
                    <img src="${foodImage}" alt="${listing.foodType}" class="food-image">
                    <div class="category-icon">
                        <i class="${this.getCategoryIconClass(listing.category)}"></i>
                    </div>
                </div>
                <div class="food-content">
                    <h3 class="food-title">${listing.foodType}</h3>
                    <p class="food-description">${listing.description}</p>
                    <div class="food-meta">
                        <span class="category-badge" data-category="${listing.category}">
                            ${this.capitalizeFirst(listing.category)}
                        </span>
                        <span class="distance">
                            <i class="fas fa-map-marker-alt"></i> ${distance}
                        </span>
                    </div>
                    <div class="food-info">
                        <span class="quantity"><i class="fas fa-utensils"></i> ${listing.quantity}</span>
                        <span class="freshness"><i class="fas fa-clock"></i> ${freshUntil}</span>
                    </div>
                    <div class="food-donor">
                        <i class="fas fa-user"></i> ${listing.donor} • ${timeAgo}
                    </div>
                    <button class="claim-button" data-id="${listing.id}">
                        <i class="fas fa-hand-holding-heart"></i> Claim Food
                    </button>
                </div>
            </div>
        `;
    }

    getRandomDistance() {
        const distances = ['0.5 miles away', '0.8 miles away', '1.2 miles away', '1.5 miles away', '2.0 miles away'];
        return distances[Math.floor(Math.random() * distances.length)];
    }

    getFoodImage(foodType, category) {
        const foodImages = {
            'pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop',
            'fresh pizza margherita': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop',
            'sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&h=600&fit=crop',
            'sandwiches': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&h=600&fit=crop',
            'assorted sandwiches': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&h=600&fit=crop',
            'bread': 'https://plus.unsplash.com/premium_photo-1667806845059-51fa9165bda1?w=800&h=600&fit=crop',
            'pastries': 'https://plus.unsplash.com/premium_photo-1667806845059-51fa9165bda1?w=800&h=600&fit=crop',
            'bakery': 'https://plus.unsplash.com/premium_photo-1667806845059-51fa9165bda1?w=800&h=600&fit=crop',
            'fresh bread & pastries': 'https://plus.unsplash.com/premium_photo-1667806845059-51fa9165bda1?w=800&h=600&fit=crop'
        };

        const lowerFoodType = foodType.toLowerCase();
        for (const [key, image] of Object.entries(foodImages)) {
            if (lowerFoodType.includes(key)) {
                return image;
            }
        }

        const categoryImages = {
            'restaurant': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
            'household': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
            'bakery': 'https://plus.unsplash.com/premium_photo-1667806845059-51fa9165bda1?w=800&h=600&fit=crop',
            'event': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop'
        };

        return categoryImages[category] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop';
    }

    getCategoryIconClass(category) {
        const icons = {
            'restaurant': 'fas fa-utensils',
            'household': 'fas fa-home',
            'bakery': 'fas fa-bread-slice',
            'event': 'fas fa-calendar-alt'
        };
        return icons[category] || 'fas fa-utensils';
    }

    setupFoodCardInteractions() {
        const claimBtns = document.querySelectorAll('.claim-button');
        claimBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const listingId = parseInt(btn.getAttribute('data-id'));
                this.handleClaimFood(listingId);
            });
        });
    }

    handleClaimFood(listingId) {
        const listing = this.foodListings.find(l => l.id === listingId);
        if (!listing) return;
        
        const confirmed = confirm(`Claim "${listing.foodType}" from ${listing.donor}?\n\nPickup: ${listing.location}\nTime: ${this.formatTime(listing.pickupTime)}\nContact: ${listing.contact}`);
        
        if (confirmed) {
            const claimBtn = document.querySelector(`[data-id="${listingId}"] .claim-button`);
            if (claimBtn) {
                claimBtn.classList.add('claimed');
                claimBtn.innerHTML = '<i class="fas fa-check-circle"></i> Claimed';
                claimBtn.disabled = true;
            }
            this.showToast(`Successfully claimed "${listing.foodType}"!`, 'success');
        }
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    }

    formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        const now = new Date();
        const diff = date - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        
        if (hours < 24) return `${hours}h left`;
        return `${Math.floor(hours / 24)}d left`;
    }

    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    startAnimations() {
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
        });
    }

    hideLoadingOverlay() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 500);
            }, 1500);
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new ShareBiteFoodListing();
});

window.ShareBiteFoodListing = ShareBiteFoodListing;
