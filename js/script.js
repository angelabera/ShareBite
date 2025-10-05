// ShareBite JavaScript - Interactive Food Waste Reduction Platform

class ShareBite {
    constructor() {
        this.currentRole = 'donor';
        this.foodListings = [];
        this.filteredListings = [];
        this.currentFilter = 'all';
        
        this.init();
        this.initTheme(); // add theme initialization after base init
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
            const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
            this.applyTheme(newTheme);
            localStorage.setItem('sharebite-theme', newTheme);
        });
    }

    applyTheme(theme) {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            const icon = document.querySelector('#themeToggle i');
            if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
        } else {
            root.classList.remove('dark');
            const icon = document.querySelector('#themeToggle i');
            if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
        }
    }

    setupEventListeners() {
        // Navigation
        this.setupNavigation();
        
        // Role switching
        this.setupRoleSwitch();
        
        // Modal functionality
        this.setupModal();
        
        // Form handling
        this.setupFormHandling();
        
        // Filtering and search
        this.setupFilteringAndSearch();
        
        // Smooth scrolling
        this.setupSmoothScrolling();
        
        // Responsive navigation
        this.setupResponsiveNav();
        
        // Hero button interactions
        this.setupHeroButtons();
        
        // Statistics counter animation
        this.setupStatsAnimation();
        
        // Scroll effects
        this.setupScrollEffects();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    setupRoleSwitch() {
        const roleSwitch = document.getElementById('roleSwitch');
        const currentRoleSpan = document.getElementById('currentRole');
        
        roleSwitch.addEventListener('click', () => {
            this.currentRole = this.currentRole === 'donor' ? 'collector' : 'donor';
            currentRoleSpan.textContent = this.currentRole.charAt(0).toUpperCase() + this.currentRole.slice(1);
            
            // Update UI based on role
            this.updateUIForRole();
            
            // Add animation effect
            roleSwitch.style.transform = 'scale(0.9)';
            setTimeout(() => {
                roleSwitch.style.transform = 'scale(1)';
            }, 150);
        });
    }

    updateUIForRole() {
        const donateBtn = document.getElementById('donateFood');
        const findBtn = document.getElementById('findFood');
        const addListingBtn = document.getElementById('addListingBtn');
        
        if (this.currentRole === 'collector') {
            donateBtn.innerHTML = '<i class="fas fa-search"></i> Find Food';
            findBtn.innerHTML = '<i class="fas fa-heart"></i> Help Others';
            addListingBtn.style.display = 'none';
        } else {
            donateBtn.innerHTML = '<i class="fas fa-heart"></i> Donate Food';
            findBtn.innerHTML = '<i class="fas fa-search"></i> Find Food';
            addListingBtn.style.display = 'flex';
        }
    }

    setupModal() {
        const modal = document.getElementById('addListingModal');
        const addListingBtn = document.getElementById('addListingBtn');
        const closeModalBtn = document.querySelector('.close-modal');
        const cancelBtn = document.getElementById('cancelForm');

        addListingBtn.addEventListener('click', () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

        const closeModal = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            this.resetForm();
        };

        closeModalBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // File upload functionality
        this.setupFileUpload();
    }

    setupFileUpload() {
        const fileInput = document.getElementById('photo');
        const uploadArea = document.getElementById('photoUpload');

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.background = 'rgba(76, 175, 80, 0.1)';
            uploadArea.style.borderColor = 'var(--primary-color)';
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.style.background = '';
            uploadArea.style.borderColor = '';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                this.handleFileSelect(files[0]);
            }
            uploadArea.style.background = '';
            uploadArea.style.borderColor = '';
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelect(e.target.files[0]);
            }
        });
    }

    handleFileSelect(file) {
        const uploadArea = document.getElementById('photoUpload');
        if (file.type.startsWith('image/')) {
            uploadArea.innerHTML = `
                <i class="fas fa-check-circle" style="color: var(--primary-color);"></i>
                <span style="color: var(--primary-color);">${file.name}</span>
            `;
        }
    }

    setupFormHandling() {
        const form = document.getElementById('listingForm');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
        
        // Set minimum date/time for freshness
        const freshUntilInput = document.getElementById('freshUntil');
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        freshUntilInput.min = now.toISOString().slice(0, 16);
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
            foodType: document.getElementById('foodType').value,
            quantity: document.getElementById('quantity').value,
            category: document.getElementById('category').value,
            description: document.getElementById('description').value,
            freshUntil: document.getElementById('freshUntil').value,
            pickupTime: document.getElementById('pickupTime').value,
            location: document.getElementById('location').value,
            contact: document.getElementById('contact').value,
            photo: document.getElementById('photo').files[0],
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
        
        const freshDate = new Date(data.freshUntil);
        if (freshDate <= new Date()) {
            this.showErrorMessage('Fresh until date must be in the future.');
            return false;
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
        
        // Add toast styles
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--primary-color)' : 'var(--secondary-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 3000;
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
            box-shadow: var(--shadow-heavy);
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }

    closeModalAndReset() {
        document.getElementById('addListingModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.resetForm();
    }

    resetForm() {
        document.getElementById('listingForm').reset();
        document.getElementById('photoUpload').innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <span>Click to upload or drag and drop</span>
        `;
        
        // Reset minimum date
        const freshUntilInput = document.getElementById('freshUntil');
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        freshUntilInput.min = now.toISOString().slice(0, 16);
    }

    setupFilteringAndSearch() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const searchInput = document.querySelector('.search-box input');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Set current filter
                this.currentFilter = btn.getAttribute('data-filter');
                
                // Filter and render listings
                this.filterListings();
                this.renderFoodListings();
            });
        });

        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterListings();
                this.renderFoodListings();
            }, 300);
        });
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

    setupSmoothScrolling() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        scrollIndicator.addEventListener('click', () => {
            document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
        });
    }

    setupResponsiveNav() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    setupHeroButtons() {
        const donateBtn = document.getElementById('donateFood');
        const findBtn = document.getElementById('findFood');
        
        donateBtn.addEventListener('click', () => {
            if (this.currentRole === 'donor') {
                document.getElementById('addListingModal').style.display = 'block';
                document.body.style.overflow = 'hidden';
            } else {
                document.getElementById('listings').scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        findBtn.addEventListener('click', () => {
            document.getElementById('listings').scrollIntoView({ behavior: 'smooth' });
        });
    }

    setupStatsAnimation() {
        const stats = document.querySelectorAll('.stat-number');
        let animated = false;
        
        const animateStats = () => {
            if (animated) return;
            
            stats.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateStat = () => {
                    current += increment;
                    if (current < target) {
                        stat.textContent = Math.floor(current);
                        requestAnimationFrame(updateStat);
                    } else {
                        stat.textContent = target;
                    }
                };
                
                updateStat();
            });
            
            animated = true;
        };
        
        // Trigger animation when hero section is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(animateStats, 1000);
                }
            });
        });
        
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            observer.observe(heroStats);
        }
    }

    setupScrollEffects() {
        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = 'var(--shadow-light)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
        
        // Animate elements on scroll
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements to animate
        const elementsToAnimate = document.querySelectorAll('.feature-card, .food-card, .impact-item');
        elementsToAnimate.forEach(el => {
            observer.observe(el);
        });
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
                description: "Fresh produce that won't be used before expiry. Includes apples, oranges, carrots, and lettuce.",
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
        const hours = Math.floor(Math.random() * 48) + 2; // 2 to 50 hours from now
        const futureDate = new Date(now.getTime() + hours * 60 * 60 * 1000);
        return futureDate.toISOString().slice(0, 16);
    }

    renderFoodListings() {
        const foodGrid = document.getElementById('foodGrid');
        
        if (this.filteredListings.length === 0) {
            foodGrid.innerHTML = `
                <div class="no-listings">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--medium-gray); margin-bottom: 1rem;"></i>
                    <h3>No listings found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            `;
            return;
        }
        
        foodGrid.innerHTML = this.filteredListings.map(listing => this.createFoodCard(listing)).join('');
        
        // Add event listeners to food cards
        this.setupFoodCardInteractions();
    }

    createFoodCard(listing) {
        const timeAgo = this.getTimeAgo(listing.createdAt);
        const freshUntil = this.formatDateTime(listing.freshUntil);
        const pickupTime = this.formatTime(listing.pickupTime);
        
        return `
            <div class="food-card" data-id="${listing.id}">
                <div class="food-image">
                    ${listing.photo ? `<img src="${URL.createObjectURL(listing.photo)}" alt="${listing.foodType}">` : `<i class="fas fa-${this.getFoodIcon(listing.category)}"></i>`}
                    <div class="food-category">${this.capitalizeFirst(listing.category)}</div>
                </div>
                <div class="food-details">
                    <h3 class="food-title">${listing.foodType}</h3>
                    <p class="food-description">${listing.description}</p>
                    <div class="food-meta">
                        <span class="quantity"><i class="fas fa-utensils"></i> ${listing.quantity}</span>
                        <span class="freshness"><i class="fas fa-clock"></i> ${freshUntil}</span>
                    </div>
                    <div class="food-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${listing.location}</span>
                    </div>
                    <div class="food-meta" style="margin-bottom: 1rem;">
                        <span style="color: var(--medium-gray); font-size: 0.9rem;">
                            <i class="fas fa-user"></i> ${listing.donor}
                        </span>
                        <span style="color: var(--medium-gray); font-size: 0.9rem;">
                            <i class="fas fa-clock"></i> ${timeAgo}
                        </span>
                    </div>
                    <div class="food-actions">
                        <button class="claim-btn" data-id="${listing.id}">
                            <i class="fas fa-hand-paper"></i> Claim Food
                        </button>
                        <button class="contact-btn" data-contact="${listing.contact}">
                            <i class="fas fa-phone"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupFoodCardInteractions() {
        // Claim buttons
        const claimBtns = document.querySelectorAll('.claim-btn');
        claimBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const listingId = parseInt(btn.getAttribute('data-id'));
                this.handleClaimFood(listingId);
            });
        });
        
        // Contact buttons
        const contactBtns = document.querySelectorAll('.contact-btn');
        contactBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const contact = btn.getAttribute('data-contact');
                this.handleContactDonor(contact);
            });
        });
    }

    handleClaimFood(listingId) {
        const listing = this.foodListings.find(l => l.id === listingId);
        if (!listing) return;
        
        // Show confirmation dialog
        const confirmed = confirm(`Claim "${listing.foodType}" from ${listing.donor}?\n\nPickup: ${listing.location}\nTime: ${this.formatTime(listing.pickupTime)}\nContact: ${listing.contact}`);
        
        if (confirmed) {
            // Remove listing from available items
            this.foodListings = this.foodListings.filter(l => l.id !== listingId);
            this.filterListings();
            this.renderFoodListings();
            
            // Show success message
            this.showToast(`Successfully claimed "${listing.foodType}"! Check your email for pickup details.`, 'success');
            
            // Animate removal
            const card = document.querySelector(`[data-id="${listingId}"]`);
            if (card) {
                card.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    this.renderFoodListings();
                }, 300);
            }
        }
    }

    handleContactDonor(contact) {
        // Copy contact to clipboard
        navigator.clipboard.writeText(contact).then(() => {
            this.showToast('Contact information copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = contact;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('Contact information copied to clipboard!', 'success');
        });
    }

    getFoodIcon(category) {
        const icons = {
            restaurant: 'store',
            household: 'home',
            bakery: 'bread-slice',
            event: 'calendar-alt'
        };
        return icons[category] || 'utensils';
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        
        if (minutes < 60) {
            return `${minutes}m ago`;
        } else if (hours < 24) {
            return `${hours}h ago`;
        } else {
            const days = Math.floor(hours / 24);
            return `${days}d ago`;
        }
    }

    formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        const now = new Date();
        const diff = date - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        
        if (hours < 24) {
            return `${hours}h left`;
        } else {
            const days = Math.floor(hours / 24);
            return `${days}d left`;
        }
    }

    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    startAnimations() {
        // Add stagger animation to feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
        });
        
        // Add floating animation to hero elements
        this.startFloatingAnimations();
        
        // Add periodic pulse to CTA buttons
        this.startButtonPulse();
    }

    startFloatingAnimations() {
        const floatingElements = document.querySelectorAll('.floating-card');
        floatingElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.5}s`;
        });
    }

    startButtonPulse() {
        const ctaButtons = document.querySelectorAll('.btn-primary');
        setInterval(() => {
            ctaButtons.forEach((btn, index) => {
                setTimeout(() => {
                    btn.style.animation = 'pulse 0.6s ease';
                    setTimeout(() => {
                        btn.style.animation = '';
                    }, 600);
                }, index * 200);
            });
        }, 10000); // Pulse every 10 seconds
    }

    hideLoadingOverlay() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 500);
        }, 1500); // Show loading for 1.5 seconds
    }
}

// Additional CSS animations via JavaScript
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: scale(1);
            }
            to {
                opacity: 0;
                transform: scale(0.8);
            }
        }
        
        .animate-in {
            animation: slideInUp 0.6s ease forwards;
        }
        
        .no-listings {
            grid-column: 1 / -1;
            text-align: center;
            padding: 4rem 2rem;
            color: var(--medium-gray);
        }
        
        .no-listings h3 {
            margin-bottom: 0.5rem;
            color: var(--dark-gray);
        }
        
        /* Hamburger menu animation */
        .hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
        
        /* Mobile menu styles */
        @media (max-width: 768px) {
            .nav-menu.active {
                display: flex;
                position: fixed;
                top: 70px;
                left: 0;
                width: 100%;
                height: calc(100vh - 70px);
                background: rgba(255, 255, 255, 0.98);
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                padding-top: 2rem;
                backdrop-filter: blur(10px);
                animation: slideInUp 0.3s ease;
            }
            
            .nav-menu.active .nav-link {
                margin: 1rem 0;
                font-size: 1.2rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    addDynamicStyles();
    new ShareBite();
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for potential testing or external use
window.ShareBite = ShareBite;

// Clear caches and trigger SW skipWaiting for debugging updates
window.clearShareBiteCaches = async function() {
    if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
        console.log('[ShareBite] All caches cleared');
    }
    if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage('SKIP_WAITING');
        console.log('[ShareBite] Sent SKIP_WAITING to service worker');
    }
};

// Scroll to Top Button
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add("show");
    } else {
        scrollTopBtn.classList.remove("show");
    }
});

scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
