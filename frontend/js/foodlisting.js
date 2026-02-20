// ShareBite JavaScript - Interactive Food Waste Reduction Platform


class ShareBiteFoodListing {
    constructor() {
        this.currentRole = 'donor';
        this.foodListings = [];
        this.uploadedPhotoBase64 = null;
        this.filteredListings = [];
        this.currentFilter = 'all';
        this.claimedItems = this.loadClaimedItems();
        this.notifications = this.loadNotifications();
        this.api = window;

        this.init();
        this.initTheme(); // add theme initialization after base init
    }

    init() {
        // Refresh expiry countdown every minute
        setInterval(() => {
            this.renderFoodListings();
        }, 60000);

        this.setupEventListeners();
        this.loadListingsFromDB();
        this.renderFoodListings();
        this.setupNotificationSystem();
        this.updateNotificationDisplay();
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

        // Date input confirmation functionality
        this.setupDateInputConfirmation();

        // Time input confirmation functionality
        this.setupTimeInputConfirmation();

        // Filtering and search
        this.setupFilteringAndSearch();

        // Responsive navigation
        this.setupResponsiveNav();

        // Statistics counter animation
        this.setupStatsAnimation();

        // Scroll effects
        this.setupScrollEffects();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                // If it's an anchor for current page, scroll smoothly
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                } else if (href && href.includes('.html#')) {
                    // If it's index.html#features or similar, navigate normally
                    // (let browser handle navigation)
                } else if (href && href.endsWith('.html')) {
                    // If it's a plain .html link, let browser handle navigation
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
        });
    }

    updateUIForRole() {
        const donateBtn = document.getElementById('donateFood');
        const findBtn = document.getElementById('findFood');
        const addListingBtn = document.getElementById('addListingBtn');
        const notificationBell = document.getElementById('notificationBell');

        if (this.currentRole === 'collector') {
            if (donateBtn) donateBtn.innerHTML = '<i class="fas fa-search"></i> Find Food';
            if (findBtn) findBtn.innerHTML = '<i class="fas fa-heart"></i> Help Others';
            if (addListingBtn) addListingBtn.style.display = 'none';

            // Show notification bell for collectors
            if (notificationBell) {
                notificationBell.style.display = 'block';
            }
        } else {
            if (donateBtn) donateBtn.innerHTML = '<i class="fas fa-heart"></i> Donate Food';
            if (findBtn) findBtn.innerHTML = '<i class="fas fa-search"></i> Find Food';
            if (addListingBtn) addListingBtn.style.display = 'flex';

            // Hide notification bell for donors (unless they have notifications)
            if (notificationBell && this.notifications.length === 0) {
                notificationBell.style.display = 'none';
            }
        }

        // Re-render food listings to update claim button states
        this.renderFoodListings();
    }

    setupModal() {
        const modal = document.getElementById('addListingModal');
        const addListingBtn = document.getElementById('addListingBtn');
        const closeModalBtn = document.querySelector('.close-modal');
        const cancelBtn = document.getElementById('cancelForm');

        const closeModal = () => {
            // Close modal and restore page state
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';

            // Reset form steps to initial state
            this.resetFormSteps();
        };

        // Cancel button
        if (cancelBtn) {
            cancelBtn.onclick = (event) => {
                event.preventDefault();
                event.stopImmediatePropagation();
                closeModal();
            };
        }

        closeModalBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Reset steps
        this.currentStep = 1;
        this.totalSteps = 3;

        // Open modal
        addListingBtn.addEventListener('click', () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            this.resetFormSteps();
        });

        this.setupFileUpload();
        this.setupFormNavigation();
    }

    setupFormNavigation() {
        const nextBtn = document.getElementById('nextStep');
        const prevBtn = document.getElementById('prevStep');
        const submitBtn = document.getElementById('submitForm');

        if (nextBtn) {
            nextBtn.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (nextBtn.disabled) return;
                nextBtn.disabled = true;

                console.log(`[Nav] Next clicked. Current step: ${this.currentStep}`);

                if (this.validateCurrentStep()) {
                    console.log('[Nav] Validation passed. Advancing...');
                    this.goToStep(this.currentStep + 1);
                } else {
                    console.log('[Nav] Validation failed.');
                }

                // Re-enable after delay to prevent double-clicks
                setTimeout(() => {
                    nextBtn.disabled = false;
                }, 500);
            };
        }

        if (prevBtn) {
            prevBtn.onclick = (e) => {
                e.preventDefault();
                this.goToStep(this.currentStep - 1);
            };
        }
    }

    goToStep(stepNumber) {
        console.log(`[goToStep] Switching to step ${stepNumber}`);
        if (stepNumber < 1 || stepNumber > this.totalSteps) return;

        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
            step.style.setProperty('display', 'none', 'important');
        });

        const newStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (newStep) {
            console.log(`[goToStep] Showing step ${stepNumber}`, newStep);
            newStep.classList.add('active');
            newStep.style.setProperty('display', 'block', 'important');

            // Initialize map if moving to step 2
            if (stepNumber === 2) {
                setTimeout(() => this.initMap(), 100); // Small delay for layout to settle
            }
        } else {
            console.error(`[goToStep] Could not find step ${stepNumber}`);
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
        const nextBtn = document.getElementById('nextStep');
        const prevBtn = document.getElementById('prevStep');
        const submitBtn = document.getElementById('submitForm');

        prevBtn.style.display = stepNumber === 1 ? 'none' : 'flex';
        nextBtn.style.display = stepNumber === this.totalSteps ? 'none' : 'flex';
        submitBtn.style.display = stepNumber === this.totalSteps ? 'flex' : 'none';
    }

    validateCurrentStep() {
        // Select the currently active/visible step
        const currentStepEl = document.querySelector('.form-step.active');
        if (!currentStepEl) {
            console.error(`Active form step not found`);
            return false;
        }

        // Define required fields per step
        const requiredFieldIds = {
            1: ['foodType', 'quantity', 'category'],
            2: ['freshUntil', 'pickupTime', 'location', 'contact'],
            3: [] // Step 3 (photo) is optional
        };

        const fieldsToCheck = requiredFieldIds[this.currentStep] || [];
        let isValid = true;

        for (let fieldId of fieldsToCheck) {
            const input = document.getElementById(fieldId);
            if (input && !input.value.trim()) {
                input.focus();
                // Safely get label text or fallback
                let labelText = fieldId;
                if (input.previousElementSibling && input.previousElementSibling.textContent) {
                    labelText = input.previousElementSibling.textContent.replace('*', '').trim();
                } else if (input.placeholder) {
                    labelText = input.placeholder;
                }

                this.showToast(`Please fill in the required field: ${labelText}`, 'error');
                isValid = false;
                break; // Stop at first error
            }

            // Special validation for contact information
            if (fieldId === 'contact' && input) {
                if (!this.validateContactInfo(input.value.trim())) {
                    input.focus();
                    this.showToast('Please enter a valid email address or phone number', 'error');
                    isValid = false;
                    break;
                }
            }
        }

        return isValid;
    }

    // Validate contact information (email or phone number)
    validateContactInfo(contact) {
        // Email regex pattern
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Check if it's a valid email
        if (emailPattern.test(contact)) {
            return true;
        }

        // Phone number regex pattern (Checks)
        const phonePattern = /^\+?\d+$/;

        // Check if it's a valid phone number
        if (!phonePattern.test(contact)) {
            return false;
        }

        // If phone number starts with '+', total digits (excluding '+') must be between 11 and 13
        if (contact.startsWith('+')) {
            const digitCount = contact.length - 1; // exclude '+'
            return digitCount >= 11 && digitCount <= 13;
        }

        // If phone number does not contain country code, then check only for length
        return contact.length === 10;
    }

    resetFormSteps() {
        this.currentStep = 1;
        this.goToStep(1);
    }

    setupFileUpload() {
        const fileInput = document.getElementById('photo');
        const uploadArea = document.getElementById('photoUpload');
        const imagePreview = document.getElementById('imagePreview');

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                fileInput.files = files;
                this.handleFileSelect(files[0]);
            } else {
                this.showToast('Please upload a valid image file', 'error');
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelect(e.target.files[0]);
            }
        });
    }

    handleFileSelect(file) {
        const imagePreview = document.getElementById('imagePreview');
        const uploadArea = document.getElementById('photoUpload');

        if (!file.type.startsWith('image/')) {
            this.showToast('Please select an image file', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this.showToast('Image size should be less than 5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.uploadedPhotoBase64 = e.target.result;
            imagePreview.innerHTML = `
            <img src="${e.target.result}" alt="Food preview">
            <button type="button" class="remove-image">
                <i class="fas fa-times"></i>
            </button>
        `;
            imagePreview.classList.add('active');
            uploadArea.style.display = 'none';

            // Add remove functionality
            const removeBtn = imagePreview.querySelector('.remove-image');
            removeBtn.addEventListener('click', () => {
                imagePreview.innerHTML = '';
                imagePreview.classList.remove('active');
                uploadArea.style.display = 'block';
                document.getElementById('photo').value = '';
                this.uploadedPhotoBase64 = null;
            });
        };
        reader.readAsDataURL(file);
    }



    setupFormHandling() {
        const form = document.getElementById('listingForm');
        const submitBtn = document.getElementById('submitForm');

        // Handle button click (since type="button")
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }

        // Keep form submit as backup (though unlikely to fire with type="button")
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });

        const freshUntilInput = document.getElementById('freshUntil');
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        freshUntilInput.min = now.toISOString().slice(0, 16);
    }

    handleFormSubmission() {
        const formData = this.getFormData();

        if (this.validateFormData(formData)) {
            try {
                const backendData = {
                    foodType: formData.foodType,
                    quantity: formData.quantity,
                    category: formData.category,
                    description: formData.description,
                    freshUntil: formData.freshUntil,
                    pickupTime: formData.pickupTime,
                    pickupLocation: formData.location,
                    contactInfo: formData.contact,
                    dietaryTags: formData.dietaryTags,
                    photos: formData.photos,
                    latitude: parseFloat(formData.latitude) || 0, // Ensure numeric
                    longitude: parseFloat(formData.longitude) || 0, // Ensure numeric
                };

                const newListing = this.api.createFoodListing(backendData);
                this.foodListings.unshift(newListing);
                this.filterListings();
                this.loadListingsFromDB();
                this.renderFoodListings();
                this.showSuccessMessage();
                this.closeModalAndReset();

            } catch (error) {
                console.error('Error creating listing:', error);
                // Handle auth errors specifically
                if (error.status === 401) {
                    this.showToast('You must be logged in to add a listing', 'error');
                } else {
                    this.showToast(error.message || 'Failed to create listing', 'error');
                }
            }

        }
    }

    getFormData() {

        const selectedTags = [];
        document.querySelectorAll('input[name="dietary"]:checked').forEach(checkbox => {
            selectedTags.push(checkbox.value);
        });
        return {
            foodType: document.getElementById('foodType').value,
            quantity: document.getElementById('quantity').value,
            category: document.getElementById('category').value,
            description: document.getElementById('description').value,
            freshUntil: document.getElementById('freshUntil').value,
            pickupTime: document.getElementById('pickupTime').value,
            location: document.getElementById('location').value,
            contact: document.getElementById('contact').value,
            photos: this.uploadedPhotoBase64 ? [this.uploadedPhotoBase64] : [],
            dietaryTags: selectedTags,
            latitude: document.getElementById('latitude').value,
            longitude: document.getElementById('longitude').value,
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

        // Validate contact information
        if (!this.validateContactInfo(data.contact)) {
            this.showErrorMessage('Please enter a valid email address or phone number for contact information.');
            return false;
        }

        return true;
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
        // --- Existing Category Filter Logic ---
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.getAttribute('data-filter');
                this.filterListings();
                this.renderFoodListings();
            });
        });

        // --- Existing Search Input Logic ---
        const searchInput = document.querySelector('.search-box input');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterListings();
                this.renderFoodListings();
            }, 300);
        });

        // --- NEW: Dropdown and Filtering Logic ---
        const dietaryBtn = document.getElementById('dietary-filter-btn');
        const dietaryDropdown = document.getElementById('dietary-dropdown');
        const dietaryCheckboxes = document.querySelectorAll('input[name="dietary-filter"]');

        if (dietaryBtn) {
            // Toggle dropdown visibility
            dietaryBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dietaryDropdown.style.display = dietaryDropdown.style.display === 'block' ? 'none' : 'block';
                dietaryBtn.classList.toggle('active');
            });

            // Add event listeners to checkboxes
            dietaryCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    this.filterListings();
                    this.renderFoodListings();

                    // Update button text to show selected count
                    const selectedCount = document.querySelectorAll('input[name="dietary-filter"]:checked').length;
                    const btnSpan = dietaryBtn.querySelector('span');
                    if (selectedCount > 0) {
                        btnSpan.textContent = `Dietary Filters (${selectedCount})`;
                    } else {
                        btnSpan.textContent = 'Dietary Filters';
                    }
                });
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                if (dietaryDropdown.style.display === 'block') {
                    dietaryDropdown.style.display = 'none';
                    dietaryBtn.classList.remove('active');
                }
            });

            // Prevent closing when clicking inside the dropdown
            dietaryDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    filterListings() {
        const activeDietaryFilters = [];
        document.querySelectorAll('input[name="dietary-filter"]:checked').forEach(checkbox => {
            activeDietaryFilters.push(checkbox.value);
        });

        this.filteredListings = this.foodListings.filter(listing => {
            const matchesFilter = this.currentFilter === 'all' || listing.category === this.currentFilter;

            const matchesSearch = !this.searchQuery ||
                listing.foodType.toLowerCase().includes(this.searchQuery) ||
                listing.location.toLowerCase().includes(this.searchQuery) ||
                listing.description.toLowerCase().includes(this.searchQuery);

            const matchesDietary = activeDietaryFilters.length === 0 ||
                (listing.dietaryTags && activeDietaryFilters.every(filter => listing.dietaryTags.includes(filter)));

            return matchesFilter && matchesSearch && matchesDietary;
        });
    }

    setupResponsiveNav() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const userActions = document.querySelector('.user-actions');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            if (userActions) userActions.classList.toggle('active');
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
        const handleScroll = () => {
            const navbar = document.querySelector('.navbar');
            if (!navbar) return;
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();

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

    async loadListingsFromDB() {
        try {
            const listings = await getAllFoodListings();

            this.foodListings = listings.map(item => ({
                ...item,
                id: item._id,
                location: item.pickupLocation || item.location || 'Location not specified',
                contact: item.contactInfo || item.contact || 'No contact info',
                donor: item.donorId?.name || 'Anonymous Donor',
                photoUrl: (item.photos && item.photos.length > 0) ? item.photos[0] : null,
                category: item.category || 'general',
                dietaryTags: item.dietaryTags || [],
                createdAt: new Date(item.createdAt),
            }));

            this.foodListings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            this.filteredListings = this.foodListings;
            this.renderFoodListings();

        } catch (error) {
            console.error("Failed to load listings:", error);
            this.foodListings = [];
            this.renderFoodListings(); // Will render the "No listings found" state
            this.showToast("Failed to connect to database", "error");
        }
    }


    getRandomFutureDate() {
        const now = new Date();
        const hours = Math.floor(Math.random() * 48) + 2; // 2 to 50 hours from now
        const futureDate = new Date(now.getTime() + hours * 60 * 60 * 1000);
        return futureDate.toISOString().slice(0, 16);
    }

    renderFoodListings() {
        const foodGrid = document.getElementById('foodGrid');

        // CASE 1: No food listings at all (backend empty / first load)
        if (!this.foodListings || this.foodListings.length === 0) {
            const emptyStateMsg = window.languageSwitcher ? window.languageSwitcher.getTranslation('listings.emptyState') : 'No food listings available right now 🍽️';
            const emptyStateSubtext = window.languageSwitcher ? window.languageSwitcher.getTranslation('listings.emptyStateSubtext') : 'Check back later!';
            foodGrid.innerHTML = `
         <div class="empty-state">
            <i class="fas fa-utensils" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
            <p>${emptyStateMsg}</p>
            <span>${emptyStateSubtext}</span>
        </div>
`       ;
            return;
        }

        // CASE 2: Listings exist, but filters remove all
        if (this.filteredListings.length === 0) {
            const noListingsMsg = window.languageSwitcher ? window.languageSwitcher.getTranslation('listings.noListingsFiltered') : 'No listings found';
            foodGrid.innerHTML = `
      <div class="no-listings">
        <i class="fas fa-search" style="font-size: 3rem; color: var(--medium-gray); margin-bottom: 1rem;"></i>
        <h3>${noListingsMsg}</h3>
        <p>Try adjusting your filters or search terms.</p>
      </div>
    `;
            return;
        }

        // ✅ CASE 3: Show listings
        foodGrid.innerHTML = this.filteredListings
            .map(listing => this.createFoodCard(listing))
            .join('');

        // Add event listeners to food cards
        this.setupFoodCardInteractions();
    }

    createClaimButton(listing) {
        const expiryStatus = this.getExpiryStatus(listing.freshUntil);

        if (expiryStatus.expired) {
            return `
        <button class="claim-btn expired" disabled>
            <i class="fas fa-times-circle"></i> Expired
        </button>
    `;
        }

        const isClaimed = this.claimedItems.includes(listing.id);
        const isCollector = this.currentRole === 'collector';
        const username = JSON.parse(localStorage.getItem('user'))?.name;

        if (username) {
            if (isClaimed) {
                return `
                <button class="claim-btn claimed" disabled>
                    <i class="fas fa-check-circle"></i> Claimed
                </button>
            `;
            } else if (isCollector) {
                return `
                    <button class="claim-btn" data-id="${listing.id}">
                        <i class="fas fa-hand-paper"></i> Claim Food
                    </button>
                `;
            } else {
                return `
                    <button class="claim-btn" style="opacity: 0.5; cursor: not-allowed;" disabled>
                        <i class="fas fa-hand-paper"></i> Switch to Collector
                    </button>
                `;
            }
        } else {
            return `
                <button class="claim-btn" style="opacity: 0.5; cursor: not-allowed;" disabled>
                    <i class="fas fa-hand-paper"></i> Login to Claim
                </button>
            `;
        }
    }

    createFoodCard(listing) {
        const listingId = listing._id || listing.id;
        const location = listing.pickupLocation || listing.location || 'Unknown Location';
        const contact = listing.contactInfo || listing.contact;
        const timeAgo = this.getTimeAgo(listing.createdAt);
        const freshUntil = this.formatDateTime(listing.freshUntil);
        const urgency = this.getUrgencyStatus(listing.freshUntil);
        const isClaimed = this.claimedItems.includes(listing.id);
        const expiryStatus = this.getExpiryStatus(listing.freshUntil);

        const statusClass = isClaimed ? 'reserved' : 'available';
        const statusText = isClaimed ? 'Reserved' : 'Available';

        let imgSource = '';
        if (listing.photoUrl) {
            imgSource = listing.photoUrl;
        } else if (listing.photo && typeof listing.photo === 'object' && listing.photo instanceof File) {
            imgSource = URL.createObjectURL(listing.photo);
        } else if (listing.photos && listing.photos.length > 0) {
            imgSource = listing.photos[0];
        }

        const imageHTML = imgSource
            ? `<img src="${imgSource}" alt="${listing.foodType}" style="width: 100%; height: 180px; object-fit: cover;">`
            : `<div style="width: 100%; height: 180px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: #ddd;"><i class="fas fa-${this.getFoodIcon(listing.category)}"></i></div>`;

        let tagsHTML = '';
        if (listing.dietaryTags && listing.dietaryTags.length > 0) {
            tagsHTML = `<div class="food-tags" style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.8rem;">` +
                listing.dietaryTags.map(tag => `<span class="tag tag-${tag}" style="font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; background: #e0e0e0; color: #555;">${tag}</span>`).join('') +
                `</div>`;
        }

        return `
        <div class="food-card ${isClaimed ? 'claimed' : ''} ${statusClass}"
             data-id="${listingId}" 
             data-tags="${listing.dietaryTags ? listing.dietaryTags.join(',') : ''}"
             style="display: flex; flex-direction: column; height: 100%; background: #fff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); overflow: hidden; transition: transform 0.3s ease;">
             
            <div class="food-image" style="position: relative;">
                ${imageHTML}
                <span class="status-badge ${statusClass}" style="position: absolute; top: 12px; right: 12px; z-index: 2; padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 0.8rem; background: ${isClaimed ? '#999' : '#28a745'}; color: white;">${statusText}</span>
                <div class="food-category" style="position: absolute; bottom: 12px; left: 12px; background: rgba(0,0,0,0.6); color: white; padding: 2px 10px; border-radius: 12px; font-size: 0.8rem;">${this.capitalizeFirst(listing.category)}</div>
            </div>
            
            <div class="food-details" style="display: flex; flex-direction: column; flex-grow: 1; padding: 1.25rem;">
                <div class="food-header-row" style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                    <h3 class="food-title" style="margin: 0; font-size: 1.25rem; font-weight: 700; color: #333;">${listing.foodType}</h3>
                </div>
                
                ${tagsHTML} 
                
                <p class="food-description" style="color: #666; margin-bottom: 1rem; flex-grow: 1; line-height: 1.5; font-size: 0.95rem;">${listing.description}</p>
                
                <div class="food-meta-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; font-size: 0.9rem; color: #555; margin-bottom: 1rem; background: #f9f9f9; padding: 0.8rem; border-radius: 8px;">
                    <div class="meta-item">
                        <i class="fas fa-utensils" style="color: var(--primary); width: 20px;"></i>
                        <span style="font-weight: 500;">Qty:</span> ${listing.quantity || "N/A"}
                    </div>
                    <div class="meta-item">
                         <i class="fas fa-clock" style="color: var(--primary); width: 20px;"></i>
                         <span style="font-weight: 500;">Exp:</span> ${freshUntil}
                    </div>
                </div>

                <div class="location-info" style="display: flex; align-items: flex-start; gap: 0.5rem; color: #555; font-size: 0.9rem; margin-bottom: 1rem;">
                    <i class="fas fa-map-marker-alt" style="color: var(--primary); margin-top: 3px;"></i>
                    <span style="line-height: 1.4;">
                        ${location}
                    </span>
                </div>
                
                <div class="donor-info" style="display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; border-top: 1px solid #eee; margin-top: auto; color: #888; font-size: 0.85rem;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <i class="fas fa-user-circle"></i>
                        <span>${listing.donorId?.name || 'Anonymous'}</span>
                    </div>
                    <span>${timeAgo}</span>
                </div>

                <div class="card-actions" style="margin-top: 1rem;">
                    ${this.getClaimButtonHTML(listing, expiryStatus)}
                </div>
            </div>
        </div>
        `;
    }

    getClaimButtonHTML(listing, isClaimed) {
        // Donors see "View to Claim" (disabled/info) or nothing specific for now? 
        // Requirements say: "Donors can see their listings"
        // Receivers can claim.

        // Actually, checking previous logic or standard logic:
        // If I am the donor, maybe I shouldn't claim my own food? 
        // But for now let's stick to the basic UI logic:

        if (this.currentUser && this.currentUser.role === 'donor' && listing.donorId === this.currentUser.id) {
            return `<button class="action-btn delete-btn" onclick="window.foodListingApp.deleteListing('${listing._id}')">Delete</button>`;
        }

        if (isClaimed) {
            // If claimed by ME, show Undo
            // We need to know who claimed it. The listing object should have 'claimedBy'
            // assuming listing.claimedBy matches currentUser.id
            // However, for safety, if just 'isClaimed' is true, show 'Claimed' disabled button unless logic permits undo.
            return `<button class="action-btn secondary-btn" disabled>Unavailable</button>`;
        }

        return `<button class="action-btn primary-btn" onclick="window.foodListingApp.claimFood('${listing._id}')">Claim Food</button>`;
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

        // Check if already claimed
        if (this.claimedItems.includes(listingId)) {
            this.showToast('This item has already been claimed!', 'error');
            return;
        }

        // Show confirmation dialog
        const confirmed = confirm(`Claim "${listing.foodType}" from ${listing.donor}?\n\nPickup: ${listing.location}\nTime: ${this.formatTime(listing.pickupTime)}\nContact: ${listing.contact}`);

        if (confirmed) {
            this.api.deleteFoodListing(listingId);
            // Add to claimed items
            this.claimedItems.push(listingId);
            this.saveClaimedItems();

            // Create notification
            const notification = {
                id: Date.now(),
                listingId: listingId,
                foodType: listing.foodType,
                donor: listing.donor,
                location: listing.location,
                pickupTime: listing.pickupTime,
                contact: listing.contact,
                claimedAt: new Date(),
                status: 'claimed'
            };

            this.addNotification(notification);

            // Update button appearance only
            const claimBtn = document.querySelector(`[data-id="${listingId}"]`);

            if (claimBtn) {
                claimBtn.classList.add('claimed');
                claimBtn.innerHTML = '<i class="fas fa-check-circle"></i> Claimed';
                claimBtn.disabled = true;
            }

            // Show success message
            this.showToast(`Successfully claimed "${listing.foodType}"! Check notifications for pickup details.`, 'success');

            // Update notification display
            this.updateNotificationDisplay();
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
        if (!category) return 'utensils';
        const icons = {
            restaurant: 'store',
            household: 'home',
            bakery: 'bread-slice',
            event: 'calendar-alt'
        };
        return icons[category.toLowerCase()] || 'utensils';
    }

    capitalizeFirst(str) {
        if (!str) return '';
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
    getUrgencyStatus(freshUntil) {
        const now = new Date();
        const expiry = new Date(freshUntil);
        const diffMs = expiry - now;
        const hoursLeft = diffMs / (1000 * 60 * 60);

        if (hoursLeft > 6) {
            return { label: "🟢 Fresh", className: "fresh" };
        } else if (hoursLeft > 2) {
            return { label: "🟡 Expiring Soon", className: "expiring" };
        } else {
            return { label: "🔴 Urgent", className: "urgent" };
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

    // Notification System Methods
    setupNotificationSystem() {
        const notificationBell = document.getElementById('notificationBell');
        const notificationPanel = document.getElementById('notificationPanel');

        if (!notificationBell) return;

        // Show notification bell when in collector mode or when there are notifications
        if (this.currentRole === 'collector' || this.notifications.length > 0) {
            notificationBell.style.display = 'block';
        }

        // Toggle notification panel
        notificationBell.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = notificationPanel.classList.contains('active');

            if (isActive) {
                notificationPanel.classList.remove('active');
                notificationBell.classList.remove('active');
            } else {
                notificationPanel.classList.add('active');
                notificationBell.classList.add('active');
            }
        });

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!notificationBell.contains(e.target)) {
                notificationPanel.classList.remove('active');
                notificationBell.classList.remove('active');
            }
        });

        // Prevent panel from closing when clicking inside
        if (notificationPanel) {
            notificationPanel.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    loadClaimedItems() {
        const stored = localStorage.getItem('sharebite-claimed-items');
        return stored ? JSON.parse(stored) : [];
    }

    saveClaimedItems() {
        localStorage.setItem('sharebite-claimed-items', JSON.stringify(this.claimedItems));
    }

    loadNotifications() {
        const stored = localStorage.getItem('sharebite-notifications');
        return stored ? JSON.parse(stored) : [];
    }

    saveNotifications() {
        localStorage.setItem('sharebite-notifications', JSON.stringify(this.notifications));
    }

    addNotification(notification) {
        notification.read = false; // Mark new notifications as unread
        this.notifications.unshift(notification);
        this.saveNotifications();
        this.updateNotificationDisplay();
        this.renderNotifications();
    }

    markNotificationAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
            notification.read = true;
            this.saveNotifications();
            this.updateNotificationDisplay();
        }
    }

    markAllNotificationsAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.saveNotifications();
        this.updateNotificationDisplay();
    }

    updateNotificationDisplay() {
        const notificationBell = document.getElementById('notificationBell');
        const notificationBadge = document.getElementById('notificationBadge');

        if (!notificationBell || !notificationBadge) return;

        const unreadCount = this.notifications.filter(n => !n.read).length;

        if (unreadCount > 0) {
            notificationBell.style.display = 'block';
            notificationBadge.style.display = 'flex';
            notificationBadge.textContent = unreadCount > 99 ? '99+' : unreadCount.toString();
        } else {
            notificationBadge.style.display = 'none';
            // Keep bell visible if in collector mode
            if (this.currentRole !== 'collector') {
                notificationBell.style.display = 'none';
            }
        }

        this.renderNotifications();
    }

    renderNotifications() {
        const notificationList = document.getElementById('notificationList');
        if (!notificationList) return;

        if (this.notifications.length === 0) {
            notificationList.innerHTML = `
                <div class="no-notifications">
                    <i class="fas fa-bell-slash"></i>
                    <h4>No claimed items yet</h4>
                    <p>Start claiming food items to see them here</p>
                </div>
            `;
            return;
        }

        notificationList.innerHTML = `
            <div class="notification-content">
                ${this.notifications.map(notification => this.createNotificationItem(notification)).join('')}
            </div>
        `;

        // Add event listeners for notification actions
        this.setupNotificationActions();
    }

    getExpiryStatus(expiryDate) {
        const now = new Date();
        const expiry = new Date(expiryDate);
        const hoursRemaining = (expiry - now) / (1000 * 60 * 60);

        if (hoursRemaining < 0) return 'expired';
        if (hoursRemaining < 2) return 'expiring-soon';
        return 'active';
    }

    createNotificationItem(notification) {
        const timeAgo = this.getTimeAgo(notification.claimedAt);
        const unreadClass = notification.read ? '' : 'unread';

        return `
            <div class="notification-item ${unreadClass}" data-id="${notification.id}">
                <div class="notification-item-header">
                    <div class="notification-item-icon">
                        <i class="fas fa-utensils"></i>
                    </div>
                    <div class="notification-item-content">
                        <h4>${notification.foodType}</h4>
                        <div class="notification-detail">
                            <i class="fas fa-store"></i>
                            <span>${notification.donor}</span>
                        </div>
                        <div class="notification-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${notification.location}</span>
                        </div>
                        <div class="notification-detail">
                            <i class="fas fa-clock"></i>
                            <span>Pickup: ${this.formatTime(notification.pickupTime)}</span>
                        </div>
                        <div class="notification-detail">
                            <i class="fas fa-phone"></i>
                            <span>${notification.contact}</span>
                        </div>
                    </div>
                </div>
                <div class="notification-meta">
                    <span class="notification-time">Claimed ${timeAgo}</span>
                    <span class="notification-status">${this.capitalizeFirst(notification.status)}</span>
                </div>
            </div>
        `;
    }

    setupNotificationActions() {
        const notificationItems = document.querySelectorAll('.notification-item');

        notificationItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const notificationId = parseInt(item.getAttribute('data-id'));
                this.viewNotificationDetails(notificationId);
            });
        });
    }

    viewNotificationDetails(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (!notification) return;

        // Mark as read when viewed
        this.markNotificationAsRead(notificationId);

        const details = `
Food: ${notification.foodType}
Donor: ${notification.donor}
Location: ${notification.location}
Pickup Time: ${this.formatTime(notification.pickupTime)}
Contact: ${notification.contact}
Claimed: ${new Date(notification.claimedAt).toLocaleString()}

Contact information has been copied to clipboard.
        `;

        // Copy contact to clipboard
        navigator.clipboard.writeText(notification.contact).then(() => {
            alert(details);
        }).catch(() => {
            alert(details);
        });
    }

    clearAllNotifications() {
        this.notifications = [];
        this.claimedItems = [];
        this.saveNotifications();
        this.saveClaimedItems();
        this.updateNotificationDisplay();
    }

    initMap() {
        if (this.map) {
            setTimeout(() => this.map.invalidateSize(), 100);
            return;
        }

        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;

        mapContainer.style.display = 'block';

        // Default to a central location (e.g., New York or based on IP if possible)
        const defaultLat = 40.7128;
        const defaultLng = -74.0060;

        this.map = L.map('map').setView([defaultLat, defaultLng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        this.marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(this.map);

        // Update inputs on drag end
        this.marker.on('dragend', (e) => {
            const position = this.marker.getLatLng();
            this.updateLocationInputs(position.lat, position.lng);
        });

        // Update marker on map click
        this.map.on('click', (e) => {
            this.marker.setLatLng(e.latlng);
            this.updateLocationInputs(e.latlng.lat, e.latlng.lng);
        });

        // Try to get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                this.map.setView([lat, lng], 15);
                this.marker.setLatLng([lat, lng]);
                this.updateLocationInputs(lat, lng);
            });
        }
    }

    updateLocationInputs(lat, lng) {
        document.getElementById('latitude').value = lat;
        document.getElementById('longitude').value = lng;

        // Reverse geocoding to set text address
        this.reverseGeocode(lat, lng);
    }

    async reverseGeocode(lat, lng) {
        try {
            // Using BigDataCloud API as it's friendlier regarding CORS/Loalhost than Nominatim
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
            const data = await response.json();

            if (data) {
                // Construct address from available fields
                const parts = [
                    data.locality,
                    data.city,
                    data.principalSubdivision,
                    data.countryName
                ].filter(part => part); // Remove empty/null values

                const address = parts.length > 0 ? parts.join(', ') : 'Location selected on map';

                document.getElementById('location').value = address;
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            // Fallback for user
            if (!document.getElementById('location').value) {
                document.getElementById('location').placeholder = "Please enter location name manually";
            }
        }
    }

    // Date Input Confirmation functionality
    setupDateInputConfirmation() {
        const freshUntilInput = document.getElementById('freshUntil');
        if (!freshUntilInput) return;

        const container = freshUntilInput.parentNode;
        const checkmarkIcon = container.querySelector('.checkmark-icon');

        if (!checkmarkIcon) return;

        let isDateConfirmed = false;
        let previousValue = freshUntilInput.value;

        // Helper function to show checkmark only after date selection
        const handleDateChange = () => {
            const currentValue = freshUntilInput.value;

            // If value has changed from previous, reset confirmation status
            if (currentValue !== previousValue) {
                isDateConfirmed = false;
            }

            // Only show checkmark if:
            // 1. There's a new value
            // 2. The value has changed from previous
            // 3. Date hasn't been confirmed yet
            if (currentValue && currentValue !== previousValue && !isDateConfirmed) {
                checkmarkIcon.classList.remove('hidden');
            }

            // If value is cleared, reset everything
            if (!currentValue) {
                checkmarkIcon.classList.add('hidden');
                isDateConfirmed = false;
            }

            previousValue = currentValue;
        };

        // Helper function to confirm date and hide checkmark
        const confirmDate = () => {
            if (freshUntilInput.value && !isDateConfirmed) {
                // Mark as confirmed
                isDateConfirmed = true;

                // Hide the checkmark
                checkmarkIcon.classList.add('hidden');

                // Show success toast
                this.showToast('Date confirmed successfully!', 'success');

                // Move focus to next input field if available
                const nextInput = freshUntilInput.closest('.form-group').parentElement.nextElementSibling?.querySelector('input');
                if (nextInput) {
                    setTimeout(() => nextInput.focus(), 200);
                } else {
                    freshUntilInput.blur(); // Remove focus from current input
                }
            }
        };

        // Initially hide checkmark
        checkmarkIcon.classList.add('hidden');

        // Listen for date selection changes
        freshUntilInput.addEventListener('change', handleDateChange);
        freshUntilInput.addEventListener('input', handleDateChange);

        // Checkmark click handler - confirm the date and hide checkmark
        checkmarkIcon.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            confirmDate();
        });

        // Click outside handler - hide checkmark when clicking outside
        document.addEventListener('click', (e) => {
            // Check if checkmark is currently visible
            if (!checkmarkIcon.classList.contains('hidden')) {
                // Check if click is outside the input container and not on the checkmark
                if (!container.contains(e.target)) {
                    // User clicked outside - confirm the date and hide checkmark
                    confirmDate();
                }
            }
        });

        // Also hide checkmark when input loses focus (blur event)
        freshUntilInput.addEventListener('blur', (e) => {
            // Small delay to allow checkmark click to register first
            setTimeout(() => {
                if (!checkmarkIcon.classList.contains('hidden') && freshUntilInput.value) {
                    confirmDate();
                }
            }, 100);
        });
    }

    // Time Input Confirmation functionality
    setupTimeInputConfirmation() {
        const pickupTimeInput = document.getElementById('pickupTime');
        if (!pickupTimeInput) return;

        const container = pickupTimeInput.parentNode;
        const checkmarkIcon = container.querySelector('.checkmark-icon-time');

        if (!checkmarkIcon) return;

        let isTimeConfirmed = false;
        let previousValue = pickupTimeInput.value;

        // Helper function to show checkmark only after time selection
        const handleTimeChange = () => {
            const currentValue = pickupTimeInput.value;

            // If value has changed from previous, reset confirmation status
            if (currentValue !== previousValue) {
                isTimeConfirmed = false;
            }

            // Only show checkmark if:
            // 1. There's a new value
            // 2. The value has changed from previous
            // 3. Time hasn't been confirmed yet
            if (currentValue && currentValue !== previousValue && !isTimeConfirmed) {
                checkmarkIcon.classList.remove('hidden');
            }

            // If value is cleared, reset everything
            if (!currentValue) {
                checkmarkIcon.classList.add('hidden');
                isTimeConfirmed = false;
            }

            previousValue = currentValue;
        };

        // Helper function to confirm time and hide checkmark
        const confirmTime = () => {
            if (pickupTimeInput.value && !isTimeConfirmed) {
                // Mark as confirmed
                isTimeConfirmed = true;

                // Hide the checkmark
                checkmarkIcon.classList.add('hidden');

                // Show success toast
                this.showToast('Time confirmed successfully!', 'success');

                // Move focus to next input field if available
                const nextInput = pickupTimeInput.closest('.form-group').parentElement.nextElementSibling?.querySelector('input');
                if (nextInput) {
                    setTimeout(() => nextInput.focus(), 200);
                } else {
                    pickupTimeInput.blur(); // Remove focus from current input
                }
            }
        };

        // Initially hide checkmark
        checkmarkIcon.classList.add('hidden');

        // Listen for time selection changes
        pickupTimeInput.addEventListener('change', handleTimeChange);
        pickupTimeInput.addEventListener('input', handleTimeChange);

        // Checkmark click handler - confirm the time and hide checkmark
        checkmarkIcon.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            confirmTime();
        });

        // Click outside handler - hide checkmark when clicking outside
        document.addEventListener('click', (e) => {
            // Check if checkmark is currently visible
            if (!checkmarkIcon.classList.contains('hidden')) {
                // Check if click is outside the input container and not on the checkmark
                if (!container.contains(e.target)) {
                    // User clicked outside - confirm the time and hide checkmark
                    confirmTime();
                }
            }
        });

        // Also hide checkmark when input loses focus (blur event)
        pickupTimeInput.addEventListener('blur', (e) => {
            // Small delay to allow checkmark click to register first
            setTimeout(() => {
                if (!checkmarkIcon.classList.contains('hidden') && pickupTimeInput.value) {
                    confirmTime();
                }
            }, 100);
        });
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
    // FORCE CLEAR CACHES AND SERVICE WORKERS FOR DEBUGGING
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
            for (let registration of registrations) {
                registration.unregister();
            }
        });
    }
    if ('caches' in window) {
        caches.keys().then(function (names) {
            for (let name of names) {
                caches.delete(name);
            }
        });
    }

    addDynamicStyles();
    
    // Initialize and store the food listing manager globally for language switching
    window.foodListingManager = new ShareBiteFoodListing();
});

// Service Worker registration for PWA capabilities (optional)
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('../sw.js')
//             .then(registration => {
//                 console.log('SW registered: ', registration);
//             })
//             .catch(registrationError => {
//                 console.log('SW registration failed: ', registrationError);
//             });
//     });
// }

// Export for potential testing or external use
window.ShareBiteFoodListing = ShareBiteFoodListing;

// Clear caches and trigger SW skipWaiting for debugging updates
window.clearShareBiteCaches = async function () {
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
// End of ShareBiteFoodListing class and initialization


