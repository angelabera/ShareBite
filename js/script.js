// ShareBite JavaScript - Interactive Food Waste Reduction Platform

class ShareBite {
    constructor() {
    this.currentRole = 'donor';
    this.foodListings = [];
    this.filteredListings = [];
    this.currentFilter = 'all';
    this.isAuthenticated = false;
    this.userData = null;
    this.claimedItems = this.loadClaimedItems();
    this.notifications = this.loadNotifications();

    // Only call initAuth once — it will handle everything after authentication
    this.initAuth();
}

async initAuth() {
    await this.checkAuthentication();

    this.updateUIForAuthentication();
    this.showWelcomeMessage();

    // Initialize rest of the app *after* auth check
    this.init();
    this.initTheme();
}

showWelcomeMessage() {
    if (sessionStorage.getItem('justLoggedIn') === 'true') {
        const toast = document.getElementById('toast');

        if (this.userData && this.userData.name) {
            toast.textContent = `Welcome back, ${this.userData.name}! 🎉`;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // Remove the flag so it doesn't show again on refresh
        sessionStorage.removeItem('justLoggedIn');
    }
}


    async checkAuthentication() {
    try {
        console.log('=== Checking authentication ===');
        const res = await fetch('http://localhost:3000/api/current-user', {
            credentials: 'include'
        });

        console.log('Response status:', res.status);

        if (res.ok) {
            this.userData = await res.json();
            this.isAuthenticated = true;
            this.currentRole = this.userData.role;
            console.log('✓ User authenticated:', this.userData);
        } else {
            this.isAuthenticated = false;
            this.userData = null;
            this.currentRole = 'donor';
            console.log('✗ User not authenticated');
        }
    } catch (err) {
        console.error('Auth check error:', err);
        this.isAuthenticated = false;
        this.userData = null;
        this.currentRole = 'donor';
    }
}
    updateUIForAuthentication() {
    const roleDisplay = document.getElementById('currentRole');
    const roleSwitch = document.getElementById('roleSwitch');
    const userActions = document.querySelector('.user-actions');

    console.log('Updating UI. Authenticated:', this.isAuthenticated, 'User:', this.userData);

    if (this.isAuthenticated && this.userData) {
        // Update role display
        if (roleDisplay) {
            roleDisplay.textContent = this.capitalizeFirst(this.userData.role);
        }

        // Disable role switch
        if (roleSwitch) {
            roleSwitch.style.cursor = 'not-allowed';
            roleSwitch.style.opacity = '0.7';
            roleSwitch.title = 'Role is set based on your account';
            roleSwitch.classList.add('disabled');
        }

        // Remove ALL existing login buttons
        const loginButtons = document.querySelectorAll('.login-btn');
        loginButtons.forEach(btn => btn.remove());

        // Create logout button
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'login-btn logout-btn';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';

        // CRITICAL: Force the button to be clickable
        logoutBtn.style.cssText = `
            position: relative !important;
            z-index: 99999 !important;
            pointer-events: auto !important;
            cursor: pointer !important;
        `;

        // Add click event with multiple handlers
        logoutBtn.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Logout button clicked via onclick');
            await this.handleLogout();
        };

        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Logout button clicked via addEventListener');
            await this.handleLogout();
        }, true); // Use capture phase

        // Add logout button to user actions
        if (userActions) {
            userActions.appendChild(logoutBtn);
        }

        console.log('✓ Logout button created:', logoutBtn);

        // Test if button is actually clickable
        setTimeout(() => {
            const btn = document.querySelector('.logout-btn');
            console.log('Button in DOM:', btn);
            console.log('Button styles:', window.getComputedStyle(btn));
        }, 100);

        this.updateUIForRole();

    } else {
        console.log('User not authenticated - showing Login buttons');

        if (roleDisplay) {
            roleDisplay.textContent = 'Donor';
        }

        // Remove logout button if exists
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.remove();
        }

        // Remove any existing login buttons first
        const existingLoginButtons = document.querySelectorAll('.login-btn');
        existingLoginButtons.forEach(btn => btn.remove());

        // Create User Login button
        const loginUserBtn = document.createElement('button');
        loginUserBtn.className = 'login-btn';
        loginUserBtn.innerHTML = '<i class="fas fa-user"></i> Login as User';

        // CRITICAL: Force the button to be clickable
        loginUserBtn.style.cssText = `
            position: relative !important;
            z-index: 99999 !important;
            pointer-events: auto !important;
            cursor: pointer !important;
            margin-right: 10px !important;
        `;

        loginUserBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('User Login button clicked');
            window.location.href = 'login.html';
        };

        // Create NGO Login button
        const loginNGOBtn = document.createElement('button');
        loginNGOBtn.className = 'login-btn';
        loginNGOBtn.innerHTML = '<i class="fas fa-building"></i> Login as NGO';

        // CRITICAL: Force the button to be clickable
        loginNGOBtn.style.cssText = `
            position: relative !important;
            z-index: 99999 !important;
            pointer-events: auto !important;
            cursor: pointer !important;
        `;

        loginNGOBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('NGO Login button clicked');
            window.location.href = 'login_ngo.html';
        };

        // Add both login buttons to user actions
        if (userActions) {
            userActions.appendChild(loginUserBtn);
            userActions.appendChild(loginNGOBtn);
        }

        console.log('✓ Login buttons created and click handlers attached');

        // Re-enable role switch
        if (roleSwitch) {
            roleSwitch.style.cursor = 'pointer';
            roleSwitch.style.opacity = '1';
            roleSwitch.classList.remove('disabled');
        }
    }
}

capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
    async handleLogout() {
    try {
        const res = await fetch('http://localhost:3000/logout', {
            method: 'GET',
            credentials: 'include'
        });

        if (res.ok) {
            this.isAuthenticated = false;
            this.userData = null;
            this.currentRole = 'donor';

            this.showToast('Logged out successfully', 'success');

            setTimeout(async () => {
                if ('caches' in window) {
                    const keys = await caches.keys();
                    await Promise.all(keys.map(k => caches.delete(k)));
                    console.log('[ShareBite] All caches cleared on logout');
                }

                window.location.href = 'http://localhost:3000/';
            }, 1000);
        } else {
            throw new Error('Logout failed');
        }
    } catch (err) {
        console.error('Logout error:', err);
        this.showToast('Error logging out', 'error');
    }
}

    init() {
        this.setupEventListeners();
        this.generateSampleListings();
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

    // setupThemeToggle() {
    //     const btn = document.getElementById('themeToggle');
    //     if (!btn) return;
    //     btn.addEventListener('click', () => {
    //         const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    //         this.applyTheme(newTheme);
    //         localStorage.setItem('sharebite-theme', newTheme);
    //     });
    // }

    // applyTheme(theme) {
    //     const root = document.documentElement;
    //     if (theme === 'dark') {
    //         root.classList.add('dark');
    //         const icon = document.querySelector('#themeToggle i');
    //         if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
    //     } else {
    //         root.classList.remove('dark');
    //         const icon = document.querySelector('#themeToggle i');
    //         if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
    //     }
    // }

    setupEventListeners() {
        // Navigation
        this.setupNavigation();
        
       if (!this.isAuthenticated) {
            this.setupRoleSwitch();
        }

        
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
                const href = link.getAttribute('href');
                // Ignore .html links
                if (href && href.endsWith('.html')) return;
                e.preventDefault();
                const targetId = href.substring(1);
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
        });
    }

    updateUIForRole() {
        const donateBtn = document.getElementById('donateFood');
        const findBtn = document.getElementById('findFood');
        const addListingBtn = document.getElementById('addListingBtn');
        const notificationBell = document.getElementById('notificationBell');
        
        if (this.currentRole === 'collector') {
            donateBtn.innerHTML = '<i class="fas fa-search"></i> Find Food';
            findBtn.innerHTML = '<i class="fas fa-heart"></i> Help Others';
            addListingBtn.style.display = 'none';
            
            // Show notification bell for collectors
            if (notificationBell) {
                notificationBell.style.display = 'block';
            }
        } else {
            donateBtn.innerHTML = '<i class="fas fa-heart"></i> Donate Food';
            findBtn.innerHTML = '<i class="fas fa-search"></i> Find Food';
            addListingBtn.style.display = 'flex';
            
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

    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    this.setupFileUpload();
    this.setupFormNavigation();
}

setupFormNavigation() {
    const nextBtn = document.getElementById('nextStep');
    const prevBtn = document.getElementById('prevStep');
    const submitBtn = document.getElementById('submitForm');

    nextBtn.addEventListener('click', () => {
        if (this.validateCurrentStep()) {
            this.goToStep(this.currentStep + 1);
        }
    });

    prevBtn.addEventListener('click', () => {
        this.goToStep(this.currentStep - 1);
    });
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
    const nextBtn = document.getElementById('nextStep');
    const prevBtn = document.getElementById('prevStep');
    const submitBtn = document.getElementById('submitForm');

    prevBtn.style.display = stepNumber === 1 ? 'none' : 'flex';
    nextBtn.style.display = stepNumber === this.totalSteps ? 'none' : 'flex';
    submitBtn.style.display = stepNumber === this.totalSteps ? 'flex' : 'none';
}

validateCurrentStep() {
    const currentStepEl = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
    const requiredInputs = currentStepEl.querySelectorAll('[required]');
    
    for (let input of requiredInputs) {
        if (!input.value.trim()) {
            input.focus();
            this.showToast(`Please fill in the required field: ${input.previousElementSibling.textContent}`, 'error');
            return false;
        }
    }
    
    return true;
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
        });
    };
    reader.readAsDataURL(file);
}


    setupFormHandling() {
        const form = document.getElementById('listingForm');
        
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
            this.addNewListing(formData);
            this.showSuccessMessage();
            this.closeModalAndReset();
        }
    }

    getFormData() {
        const selectedTags = [];
        document.querySelectorAll('input[name="dietary"]:checked').forEach(function(checkbox) {
            selectedTags.push(checkbox.value);
        });

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
            donor: 'Current User',
            dietaryTags: selectedTags 
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
        // Apply initial state in case page loads scrolled (anchor/hash navigation)
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
                donor: "Mario's Pizzeria",
                dietaryTags: ["vegetarian"]
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
                donor: "Conference Center",
                dietaryTags: ["non-vegetarian"]
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
                donor: "Sunrise Bakery",
                dietaryTags: ["dairy-free"]
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
                donor: "Local Family",
                dietaryTags: ["vegetarian", "gluten-free"]
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
                donor: "Green Garden Restaurant",
                dietaryTags: ["vegan"]
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
                donor: "Green Garden Restaurant",
                dietaryTags: ["vegan"]
            },
            {
                id: 7,
                foodType: "Fruit & Vegetable Box",
                quantity: "1 large box",
                category: "restaurant",
                description: "Fresh produce includes apples, oranges, carrots, and lettuce.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "17:00",
                location: "Green Garden Restaurant",
                contact: "+1 234-567-8903",
                createdAt: new Date(Date.now() - 5400000),
                donor: "Green Garden Restaurant",
                dietaryTags: ["vegan"]
            },
            {
                id: 8,
                foodType: "Fruit & Vegetable Box",
                quantity: "1 large box",
                category: "restaurant",
                description: "Fresh produce includes apples, oranges, carrots, and lettuce.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "17:00",
                location: "Green Garden Restaurant",
                contact: "+1 234-567-8903",
                createdAt: new Date(Date.now() - 5400000),
                donor: "Green Garden Restaurant",
                dietaryTags: ["vegan"]
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
                donor: "Healthy Eats Cafe",
                dietaryTags: ["non-vegetarian", "dairy-free"]
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
        const listingsToShow = this.filteredListings.slice(0, 6);
        if (!foodGrid) {
            return; 
        }

        if (listingsToShow.length === 0) {
            foodGrid.innerHTML = `
                <div class="no-listings">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--medium-gray); margin-bottom: 1rem;"></i>
                    <h3>No listings found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            `;
            return;
        }

        foodGrid.innerHTML = listingsToShow.map(listing => this.createFoodCard(listing)).join('');

        // Add event listeners to food cards
        this.setupFoodCardInteractions();
    }

    createClaimButton(listing) {
        const isClaimed = this.claimedItems.includes(listing.id);
        const isCollector = this.currentRole === 'collector';
        
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
    }

   createFoodCard(listing) {
        const timeAgo = this.getTimeAgo(listing.createdAt);
        const freshUntil = this.formatDateTime(listing.freshUntil);
        const isClaimed = this.claimedItems.includes(listing.id);

        // This logic generates the HTML for the tags
        let tagsHTML = '';
        if (listing.dietaryTags && listing.dietaryTags.length > 0) {
            tagsHTML = `<div class="food-tags">` +
                listing.dietaryTags.map(tag => `<span class="tag tag-${tag}">${tag}</span>`).join('') +
            `</div>`;
        }
        
        // The return statement now correctly includes the tagsHTML
        return `
            <div class="food-card ${isClaimed ? 'claimed' : ''}" 
                 data-id="${listing.id}" 
                 data-tags="${listing.dietaryTags ? listing.dietaryTags.join(',') : ''}">
                <div class="food-image">
                    ${listing.photo ? `<img src="${URL.createObjectURL(listing.photo)}" alt="${listing.foodType}">` : `<i class="fas fa-${this.getFoodIcon(listing.category)}"></i>`}
                    <div class="food-category">${this.capitalizeFirst(listing.category)}</div>
                </div>
                <div class="food-details">
                    <h3 class="food-title">${listing.foodType}</h3>
                    ${tagsHTML} 
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
                        ${this.createClaimButton(listing)}
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
        
        // Check if already claimed
        if (this.claimedItems.includes(listingId)) {
            this.showToast('This item has already been claimed!', 'error');
            return;
        }
        
        // Show confirmation dialog
        const confirmed = confirm(`Claim "${listing.foodType}" from ${listing.donor}?\n\nPickup: ${listing.location}\nTime: ${this.formatTime(listing.pickupTime)}\nContact: ${listing.contact}`);
        
        if (confirmed) {
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
            
            // Update button and card appearance
            const claimBtn = document.querySelector(`[data-id="${listingId}"]`);
            const foodCard = document.querySelector(`.food-card[data-id="${listingId}"]`);
            
            if (claimBtn) {
                claimBtn.classList.add('claimed');
                claimBtn.innerHTML = '<i class="fas fa-check-circle"></i> Claimed';
                claimBtn.disabled = true;
            }
            
            if (foodCard) {
                foodCard.classList.add('claimed');
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
        notificationPanel.addEventListener('click', (e) => {
            e.stopPropagation();
        });
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
        this.notifications.unshift(notification);
        this.saveNotifications();
        this.updateNotificationDisplay();
        this.renderNotifications();
    }
    
    updateNotificationDisplay() {
        const notificationBell = document.getElementById('notificationBell');
        const notificationBadge = document.getElementById('notificationBadge');
        
        if (!notificationBell || !notificationBadge) return;
        
        const unreadCount = this.notifications.length;
        
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
    
    createNotificationItem(notification) {
        const timeAgo = this.getTimeAgo(notification.claimedAt);
        
        return `
            <div class="notification-item" data-id="${notification.id}">
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
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/sw.js')
//             .then(registration => {
//                 console.log('SW registered: ', registration);
//             })
//             .catch(registrationError => {
//                 console.log('SW registration failed: ', registrationError);
//             });
//     });
// }

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

// ===== Scroll to Top Button =====
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.addEventListener("scroll", () => {
  const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollPosition > 200) {
    scrollToTopBtn.classList.add("show");
  } else {
    scrollToTopBtn.classList.remove("show");
  }
});

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// ===== Gallery Animation and Interactivity =====
class GalleryManager {
    constructor() {
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.init();
    }

    init() {
        this.setupScrollAnimation();
        this.setupHoverEffects();
        this.setupClickEvents();
    }

    setupScrollAnimation() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('gallery-visible');
                }
            });
        }, observerOptions);

        this.galleryItems.forEach(item => {
            observer.observe(item);
        });
    }

    setupHoverEffects() {
        this.galleryItems.forEach(item => {
            // Add subtle parallax effect on mouse move
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const moveX = (x - centerX) / 20;
                const moveY = (y - centerY) / 20;

                const img = item.querySelector('img');
                if (img) {
                    img.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
                }
            });

            item.addEventListener('mouseleave', () => {
                const img = item.querySelector('img');
                if (img) {
                    img.style.transform = 'scale(1.1)';
                }
            });
        });
    }

    setupClickEvents() {
        this.galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const category = item.getAttribute('data-category');
                const title = item.querySelector('h3').textContent;
                const description = item.querySelector('p').textContent;

                // Optional: Open lightbox or show more details
                this.showGalleryDetail(item, title, description, category);
            });
        });
    }

    showGalleryDetail(item, title, description, category) {
        // Create a simple lightbox effect
        const imgSrc = item.querySelector('img').src;

        const lightbox = document.createElement('div');
        lightbox.className = 'gallery-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-content">
                <button class="lightbox-close">
                    <i class="fas fa-times"></i>
                </button>
                <div class="lightbox-image-container">
                    <img src="${imgSrc}" alt="${title}">
                </div>
                <div class="lightbox-info">
                    <span class="lightbox-category">
                        <i class="fas fa-tag"></i> ${category}
                    </span>
                    <h2>${title}</h2>
                    <p>${description}</p>
                </div>
            </div>
        `;

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        // Animate in
        setTimeout(() => {
            lightbox.classList.add('active');
        }, 10);

        // Close handlers
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const overlay = lightbox.querySelector('.lightbox-overlay');

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(lightbox);
                document.body.style.overflow = 'auto';
            }, 300);
        };

        closeBtn.addEventListener('click', closeLightbox);
        overlay.addEventListener('click', closeLightbox);

        // ESC key to close
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }
}

// Add lightbox styles dynamically
function addGalleryLightboxStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .gallery-lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }

        .gallery-lightbox.active {
            opacity: 1;
        }

        .lightbox-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            cursor: pointer;
        }

        .lightbox-content {
            position: relative;
            background: white;
            border-radius: 20px;
            max-width: 900px;
            width: 100%;
            max-height: 90vh;
            overflow: auto;
            z-index: 1;
            transform: scale(0.9);
            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .gallery-lightbox.active .lightbox-content {
            transform: scale(1);
        }

        .lightbox-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            color: #333;
            z-index: 2;
            transition: all 0.3s ease;
        }

        .lightbox-close:hover {
            background: var(--secondary-color);
            color: white;
            transform: rotate(90deg);
        }

        .lightbox-image-container {
            width: 100%;
            max-height: 500px;
            overflow: hidden;
            border-radius: 20px 20px 0 0;
        }

        .lightbox-image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        .lightbox-info {
            padding: 2rem;
        }

        .lightbox-category {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: var(--primary-gradient);
            color: white;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }

        .lightbox-info h2 {
            font-size: 2rem;
            font-weight: 700;
            color: var(--black);
            margin-bottom: 1rem;
        }

        .lightbox-info p {
            font-size: 1.1rem;
            color: var(--medium-gray);
            line-height: 1.6;
        }

        /* Dark mode support */
        :root.dark .lightbox-content {
            background: #1E1E1E;
            color: var(--black);
        }

        :root.dark .lightbox-info h2 {
            color: var(--black);
        }

        :root.dark .lightbox-close {
            background: rgba(42, 42, 42, 0.9);
            color: white;
        }

        :root.dark .lightbox-close:hover {
            background: var(--secondary-color);
        }

        @media (max-width: 768px) {
            .lightbox-content {
                margin: 1rem;
            }

            .lightbox-info h2 {
                font-size: 1.5rem;
            }

            .lightbox-info p {
                font-size: 1rem;
            }

            .lightbox-info {
                padding: 1.5rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize gallery when DOM is ready
if (document.querySelector('.gallery-showcase')) {
    addGalleryLightboxStyles();
    new GalleryManager();
}

// ===== Testimonials Carousel =====
class TestimonialsCarousel {
    constructor() {
        this.carousel = document.querySelector('.testimonials-carousel');
        if (!this.carousel) return;

        this.cards = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.testimonial-dot');
        this.prevBtn = document.querySelector('.testimonial-prev');
        this.nextBtn = document.querySelector('.testimonial-next');

        this.currentIndex = 0;
        this.isAnimating = false;
        this.autoPlayInterval = null;

        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupDots();
        this.setupKeyboardNavigation();
        this.setupTouchSwipe();
        this.startAutoPlay();
        this.animateStats();
        this.pauseOnHover();
    }

    setupNavigation() {
        this.prevBtn.addEventListener('click', () => this.goToPrevious());
        this.nextBtn.addEventListener('click', () => this.goToNext());
    }

    setupDots() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isInViewport()) return;

            if (e.key === 'ArrowLeft') {
                this.goToPrevious();
            } else if (e.key === 'ArrowRight') {
                this.goToNext();
            }
        });
    }

    setupTouchSwipe() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }

    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.goToNext();
            } else {
                this.goToPrevious();
            }
        }
    }

    goToNext() {
        if (this.isAnimating) return;

        const nextIndex = (this.currentIndex + 1) % this.cards.length;
        this.goToSlide(nextIndex);
    }

    goToPrevious() {
        if (this.isAnimating) return;

        const prevIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.goToSlide(prevIndex);
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentIndex) return;

        this.isAnimating = true;
        this.stopAutoPlay();

        // Remove all active classes
        this.cards.forEach(card => {
            card.classList.remove('active', 'prev');
        });

        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Set previous card
        this.cards[this.currentIndex].classList.add('prev');

        // Set active card
        setTimeout(() => {
            this.cards[index].classList.add('active');
            this.dots[index].classList.add('active');
            this.currentIndex = index;

            setTimeout(() => {
                this.isAnimating = false;
                this.startAutoPlay();
            }, 600);
        }, 50);
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.goToNext();
        }, 5000); // Change slide every 5 seconds
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    isInViewport() {
        const rect = this.carousel.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.testimonial-stat-number[data-target]');

        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    this.animateNumber(entry.target);
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        statNumbers.forEach(stat => observer.observe(stat));
    }

    animateNumber(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateNumber = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = target + '+';
            }
        };

        updateNumber();
    }

    // Pause autoplay when user hovers over carousel
    pauseOnHover() {
        this.carousel.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
        });

        this.carousel.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
    }
}

// Initialize testimonials carousel
if (document.querySelector('.testimonials-section')) {
    new TestimonialsCarousel();
}
