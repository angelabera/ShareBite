// ShareBite JavaScript - Interactive Food Waste Reduction Platform

// Note: Theme functionality is handled in theme.js to avoid conflicts

// Wait for DOM to be ready before setting up event listeners
document.addEventListener("DOMContentLoaded", () => {
    /* Navigation Menu */
    const menuToggle = document.getElementById("hamburger");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
        
        menuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                menuToggle.click();
            }
        });
    }

    /* Language Selector Setup */
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        const selectorButton = languageSelector.querySelector('.language-selector-button');
        const dropdown = languageSelector.querySelector('.language-dropdown');
        const options = languageSelector.querySelectorAll('.language-option');

        // Toggle dropdown on button click
        if (selectorButton) {
            selectorButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });
        }

        // Handle language option clicks
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const langCode = option.getAttribute('data-lang');
                
                // Use the language switcher
                if (window.languageSwitcher) {
                    const success = languageSwitcher.setLanguage(langCode);
                    if (success) {
                        // Update active state
                        options.forEach(opt => opt.classList.remove('active'));
                        option.classList.add('active');
                        
                        // Update button display
                        const flag = option.querySelector('.lang-flag');
                        if (flag) {
                            selectorButton.querySelector('.language-flag').textContent = flag.textContent;
                        }
                        
                        // Close dropdown
                        dropdown.classList.remove('show');
                    }
                }
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!languageSelector.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });

        // Set initial active state
        const currentLang = localStorage.getItem('sharebite_language') || 'en';
        const activeOption = languageSelector.querySelector(`[data-lang="${currentLang}"]`);
        if (activeOption) {
            options.forEach(opt => opt.classList.remove('active'));
            activeOption.classList.add('active');
            const flag = activeOption.querySelector('.lang-flag');
            if (flag) {
                selectorButton.querySelector('.language-flag').textContent = flag.textContent;
            }
        }
    }

    //App Initialization
    addDynamicStyles();
    new ShareBite();

    //Listing Succes Message
    const submitBtn = document.getElementById("submitForm");
    const successMsg = document.getElementById("listingSuccessMsg");

    if (submitBtn && successMsg) {
        submitBtn.addEventListener("click", (e) => {
            e.preventDefault();
            successMsg.style.display = "block";
            submitBtn.closest("form").reset();
            setTimeout(() => {
                successMsg.style.display = "none";
            }, 4000);
        });
    }
});

// Navbar scroll effect
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");

    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// Notification Toggle
const notificationBell = document.getElementById('notificationBell');
const notificationPanel = document.getElementById('notificationPanel');

if (notificationBell && notificationPanel) {
    notificationBell.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationPanel.classList.toggle('show');
    });
}

// Close notification panel when clicking outside
document.addEventListener('click', (e) => {
    if (notificationBell && notificationPanel && !notificationBell.contains(e.target)) {
        notificationPanel.classList.remove('show');
    }
});

// Clear Notifications
const clearNotifications = document.getElementById('clearNotifications');
const notificationList = document.getElementById('notificationList');
const notificationBadge = document.getElementById('notificationBadge');

if (clearNotifications && notificationList && notificationBadge) {
    clearNotifications.addEventListener('click', () => {
        notificationList.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-secondary);">No notifications</div>';
        notificationBadge.textContent = '0';
        notificationBadge.style.display = 'none';
        showToast('Notifications cleared');
        notificationPanel.classList.remove('show');
    });
}

// Role Switch
const roleSwitch = document.getElementById('roleSwitch');
const currentRole = document.getElementById('currentRole');

if (roleSwitch && currentRole) {
    roleSwitch.addEventListener('click', () => {
        if (currentRole.textContent === 'Donor') {
            currentRole.textContent = 'Receiver';
            showToast('Switched to Receiver mode');
        } else {
            currentRole.textContent = 'Donor';
            showToast('Switched to Donor mode');
        }
    });
}

// Toast Function (uses shared module when available)
function showToast(message) {
    if (typeof window.ShareBiteShared !== 'undefined' && window.ShareBiteShared.toast) {
        window.ShareBiteShared.toast.showToast(message, 'success');
        return;
    }
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3800);
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (window.innerWidth > 768 && navMenu && menuToggle) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});
class ShareBite {
    constructor() {
        this.contactEmail = 'sharebite@support.com.ng';
        this.currentRole = 'donor';
        this.foodListings = [];
        this.uploadedPhotoBase64 = null;
        this.filteredListings = [];
        this.currentFilter = 'all';
        var shared = window.ShareBiteShared || {};
        this.claimedItems = shared.storage ? shared.storage.loadClaimedItems() : [];
        this.notifications = shared.storage ? shared.storage.loadNotifications() : [];
        this.api = window;
        // Bind shared format/helpers so this.formatTime(), this.getFoodIcon(), etc. still work
        if (shared.format) {
            this.formatTime = shared.format.formatTime.bind(shared.format);
            this.getTimeAgo = shared.format.getTimeAgo.bind(shared.format);
            this.formatDateTime = shared.format.formatDateTime.bind(shared.format);
        } else {
            this.formatTime = function (t) { var m = (String(t).trim()).match(/(\d+)\s*:\s*(\d+)\s*(am|pm)?/i); if (m) { var h = parseInt(m[1], 10); var mn = parseInt(m[2], 10); var p = (m[3] || '').toLowerCase(); if (p === 'pm' && h !== 12) h += 12; if (p === 'am' && h === 12) h = 0; var d = new Date(); d.setHours(h, mn, 0, 0); return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); } var parts = String(t).split(':'); if (parts.length >= 2) { var d2 = new Date(); d2.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0); return d2.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); } return t; };
            this.getTimeAgo = function (d) { var now = new Date(); var dt = d instanceof Date ? d : new Date(d); var diff = now - dt; var mins = Math.floor(diff / 60000); var hrs = Math.floor(mins / 60); if (mins < 60) return mins + 'm ago'; if (hrs < 24) return hrs + 'h ago'; return Math.floor(hrs / 24) + 'd ago'; };
            this.formatDateTime = function (s) { var date = new Date(s); var now = new Date(); var hours = Math.floor((date - now) / (1000 * 60 * 60)); return hours < 24 ? hours + 'h left' : Math.floor(hours / 24) + 'd left'; };
        }
        if (shared.helpers) {
            this.getFoodIcon = shared.helpers.getFoodIcon.bind(shared.helpers);
            this.capitalizeFirst = shared.helpers.capitalizeFirst.bind(shared.helpers);
        } else {
            this.getFoodIcon = function (cat) { if (!cat) return 'utensils'; var i = { restaurant: 'store', household: 'home', bakery: 'bread-slice', event: 'calendar-alt' }; return i[String(cat).toLowerCase()] || 'utensils'; };
            this.capitalizeFirst = function (str) { if (!str) return ''; return String(str).charAt(0).toUpperCase() + String(str).slice(1); };
        }

        this.init();
        this.initTheme();



        // add theme initialization after base init
    }

    setupEventListeners() {
        this.setupHeroButtons();
    }

    init() {
        this.setupEventListeners();
        this.updateContactInfo();
        this.loadListingsFromDB();
        this.renderFoodListings();
        this.setupNotificationSystem();
        this.updateNotificationDisplay();
        this.startAnimations();
        this.hideLoadingOverlay();
    }

    updateContactInfo() {
        const emailAddressElement = document.getElementById('contact-email-address');
        const emailLinkElement = document.getElementById('contact-email-link');

        if (emailAddressElement) {
            emailAddressElement.textContent = this.contactEmail;
        }

        if (emailLinkElement) {
            emailLinkElement.href = `mailto:${this.contactEmail}`;
        }
    }

    initTheme() {
        if (window.ShareBiteShared && window.ShareBiteShared.theme) {
            window.ShareBiteShared.theme.initTheme();
            var btn = document.getElementById('themeToggle') || document.getElementById('theme-toggle');
            if (btn && btn.id === 'themeToggle') window.ShareBiteShared.theme.setupThemeToggle();
            return;
        }
        var stored = localStorage.getItem('sharebite-theme');
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        var theme = stored || (prefersDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', theme === 'dark');
        var btn = document.getElementById('themeToggle') || document.getElementById('theme-toggle');
        if (btn) {
            var icon = btn.querySelector('i');
            if (icon) icon.classList.toggle('fa-sun', theme === 'dark'), icon.classList.toggle('fa-moon', theme !== 'dark');
            btn.addEventListener('click', function () {
                var newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
                document.documentElement.classList.toggle('dark', newTheme === 'dark');
                localStorage.setItem('sharebite-theme', newTheme);
                if (icon) icon.classList.toggle('fa-sun', newTheme === 'dark'), icon.classList.toggle('fa-moon', newTheme !== 'dark');
            });
        }
    }

        setupEventListeners() {
        this.setupNavigation();
        this.setupRoleSwitch();
        this.setupModal();
        this.setupDateInputConfirmation();
        this.setupTimeInputConfirmation();
        this.setupFilteringAndSearch();
        this.setupSmoothScrolling();
        this.setupResponsiveNav();
        this.setupHeroButtons();
        this.setupStatsAnimation();
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

        if (!roleSwitch || !currentRoleSpan) return;

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

        if (!modal || !addListingBtn || !closeModalBtn || !cancelBtn) {
        return;
        }

        this.currentStep = 1;
        this.totalSteps = 3;

        addListingBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    this.resetFormSteps();

    // Ensure hidden location inputs exist
    if (!document.getElementById('latitude')) {
        const latInput = document.createElement('input');
        latInput.type = 'hidden';
        latInput.id = 'latitude';

        const lngInput = document.createElement('input');
        lngInput.type = 'hidden';
        lngInput.id = 'longitude';

        document.getElementById('listingForm').append(latInput, lngInput);
    }
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

    if (!nextBtn || !prevBtn) return;

    nextBtn.addEventListener('click', () => {
        // Step-level required field validation
        if (!this.validateCurrentStep()) return;

        // 🔴 ISSUE-416: Expiry vs Pickup validation
        const freshUntilValue = document.getElementById('freshUntil')?.value;
        const pickupTimeValue = document.getElementById('pickupTime')?.value;

        if (freshUntilValue && pickupTimeValue) {
            const expiry = new Date(freshUntilValue);

            // Parse "04 : 00 pm" / "09 : 00 am"
            const match = pickupTimeValue.match(/(\d+)\s*:\s*(\d+)\s*(am|pm)/i);

            if (match) {
                let hour = parseInt(match[1], 10);
                const minute = parseInt(match[2], 10);
                const period = match[3].toLowerCase();

                if (period === 'pm' && hour !== 12) hour += 12;
                if (period === 'am' && hour === 12) hour = 0;

                const pickup = new Date(expiry);
                pickup.setHours(hour, minute, 0, 0);

                // 🚫 BLOCK if pickup is after expiry
                if (pickup > expiry) {
                    this.showToast(
                        'Pickup time cannot be later than expiry time.',
                        'error'
                    );
                    return;
                }
            }
        }

        // ✅ Move to next step only if all validations pass
        this.goToStep(this.currentStep + 1);
    });

    prevBtn.addEventListener('click', () => {
        this.goToStep(this.currentStep - 1);
    });
}

goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > this.totalSteps) return;

    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });

    // Show current step
    const currentStepEl = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
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

    if (!nextBtn || !prevBtn || !submitBtn) return;

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
            this.showToast(
                `Please fill in the required field: ${input.previousElementSibling.textContent}`,
                'error'
            );
            return false;
        }

        if (input.id === 'quantity') {
            const quantity = parseInt(input.value.trim(), 10);
            if (isNaN(quantity) || quantity <= 0) {
                input.focus();
                this.showToast('Please enter a valid quantity greater than 0', 'error');
                return false;
            }
        }

        if (input.id === 'contact') {
            if (!this.validateContactInfo(input.value.trim())) {
                input.focus();
                this.showToast('Please enter a valid email address or phone number', 'error');
                return false;
            }
        }
    }
    return true;
}

setupFormHandling() {
    const form = document.getElementById('listingForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmission();
    });

    const useLocationBtn = document.getElementById('useCurrentLocationBtn');
    if (useLocationBtn) {
        useLocationBtn.addEventListener(
            'click',
            this.useCurrentLocation.bind(this)
        );
    }

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    // Expiry time must be future
    const freshUntilInput = document.getElementById('freshUntil');
    if (freshUntilInput) {
        freshUntilInput.min = now.toISOString().slice(0, 16);
    }
}

async handleFormSubmission() {
    const formData = this.getFormData();

    if (!this.validateFormData(formData)) return;

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
            latitude: Number(document.getElementById('latitude')?.value),
            longitude: Number(document.getElementById('longitude')?.value),
        };

        if (!backendData.latitude || !backendData.longitude) {
            this.showToast(
                'Please click "Use Current Location" to set pickup address',
                'error'
            );
            return;
        }

        const newListing = await this.api.createFoodListing(backendData);
        this.foodListings.unshift(newListing);
        this.loadListingsFromDB();
        this.showSuccessMessage();
        this.closeModalAndReset();

    } catch (error) {
        console.error('Error creating listing:', error);
        this.showToast(
            error?.message || 'Failed to create listing',
            'error'
        );
    }
}

    getFormData() {
        const selectedTags = [];
        document.querySelectorAll('input[name="dietary"]:checked').forEach(function (checkbox) {
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
            dietaryTags: selectedTags
        };
    }
    validateFormData(data) {
        const requiredFields = [
            'foodType',
            'quantity',
            'category',
            'freshUntil',
            'pickupTime',
            'location',
            'contact'
        ];

        for (let field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                this.showErrorMessage(
                    `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`
                );
                return false;
            }
        }

        const now = new Date();
        const freshUntilDate = new Date(data.freshUntil);

        // 1️⃣ Expiry must be in future
        if (freshUntilDate <= now) {
            this.showErrorMessage('Food expiry time must be in the future.');
            return false;
        }

        // 🔴 FIX: Parse pickup time with AM/PM correctly
        const pickupMatch = data.pickupTime.match(/(\d+)\s*:\s*(\d+)\s*(am|pm)/i);

        if (!pickupMatch) {
            this.showErrorMessage('Invalid pickup time format.');
            return false;
        }

        let hour = parseInt(pickupMatch[1]);
        const minute = parseInt(pickupMatch[2]);
        const meridiem = pickupMatch[3].toLowerCase();

        if (meridiem === 'pm' && hour !== 12) hour += 12;
        if (meridiem === 'am' && hour === 12) hour = 0;

        const pickupDateTime = new Date(freshUntilDate);
        pickupDateTime.setHours(hour, minute, 0, 0);

        // 2️⃣ Pickup must be future
        if (pickupDateTime <= now) {
            this.showErrorMessage('Pickup time must be in the future.');
            return false;
        }

        // 3️⃣ ISSUE-416: Pickup must be BEFORE expiry ✅
        if (pickupDateTime > freshUntilDate) {
            this.showErrorMessage('Pickup time cannot be later than expiry time.');
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
        if (window.ShareBiteShared && window.ShareBiteShared.toast) {
            window.ShareBiteShared.toast.showToast(message, type || 'success');
            return;
        }
        var toast = document.createElement('div');
        toast.className = 'toast toast-' + (type || 'success');
        toast.innerHTML = '<i class="fas fa-' + (type === 'success' ? 'check-circle' : 'exclamation-circle') + '"></i><span>' + String(message).replace(/</g, '&lt;') + '</span>';
        toast.style.cssText = 'position:fixed;top:100px;right:80px;max-width:400px;min-height:auto;background:var(--primary-color);color:white;padding:1rem 1.5rem;border-radius:var(--border-radius);display:flex;align-items:center;gap:0.5rem;z-index:3000;box-shadow:var(--shadow-heavy);';
        if (type === 'error') toast.style.background = 'var(--secondary-color)';
        document.body.appendChild(toast);
        setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 3000);
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
        if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.getAttribute('data-filter');
                this.filterListings();
                this.renderFoodListings();
            });
        });
    }

        // --- Existing Search Input Logic ---
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
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

        // --- NEW: Dropdown and Filtering Logic ---
        const dietaryBtn = document.getElementById('dietary-filter-btn');
        const dietaryDropdown = document.getElementById('dietary-dropdown');
        const dietaryCheckboxes = document.querySelectorAll('input[name="dietary-filter"]');

        if (dietaryBtn && dietaryDropdown) {
            // Toggle dropdown visibility
            dietaryBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dietaryDropdown.style.display = dietaryDropdown.style.display === 'block' ? 'none' : 'block';
                dietaryBtn.classList.toggle('active');
            });

            // Add event listeners to checkboxes
            if (dietaryCheckboxes.length > 0) {
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
        }
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
        const hamburger = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');

        if (hamburger && navMenu) {
            // Use a named function to prevent duplicate listeners
            const toggleMenu = (e) => {
                e.stopPropagation(); // Stops the click from reaching the "body" listener
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            };

            hamburger.removeEventListener('click', toggleMenu); // Clean up
            hamburger.addEventListener('click', toggleMenu);

            // Close menu when clicking a link
            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
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
async loadListingsFromDB() {
    const MIN_SPINNER_TIME = 300; // Minimum time spinner stays (ms)
    const startTime = Date.now();

    showSpinner(); // Show spinner immediately

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

 feature/loading-spinner
    } catch (error) {
        console.error("Failed to load listings:", error);
        this.foodListings = [];
        this.renderFoodListings();
        this.showToast("Failed to connect to database", "error");
    } finally {
        const elapsed = Date.now() - startTime;
        const remaining = MIN_SPINNER_TIME - elapsed;

        if (remaining > 0) {
            setTimeout(() => hideSpinner(), remaining);
        } else {
            hideSpinner();

    async loadListingsFromDB() {
        try {
            const listings = await getAllFoodListings();

            this.foodListings = listings.map(item => ({
                ...item,
                id: item._id,
                latitude: item.location?.coordinates?.[1],
                longitude: item.location?.coordinates?.[0],
                location: item.pickupLocation || item.location || 'Location not specified',
                contact: item.contactInfo || item.contact || 'No contact info',
                donor: item.donorId?.name || 'Anonymous Donor',
                photoUrl: (item.photos && item.photos.length > 0) ? item.photos[0] : null,
                category: item.category || 'general',
                dietaryTags: item.dietaryTags || [],
                createdAt: new Date(item.createdAt),
                status: item.status || "Available",

            }));

            this.foodListings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            this.filteredListings = this.foodListings;
            this.renderFoodListings();

        } catch (error) {
            console.error("Failed to load listings:", error);
            this.foodListings = [];
            this.renderFoodListings(); // Will render the "No listings found" state
            this.showToast("Failed to connect to database", "error");
main
        }








        
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
        this.setupFoodCardAccessibility();
    }

    createClaimButton(listing) {

        const isClaimedInDB = listing.status === 'reserved';
        const isClaimedLocally = this.claimedItems.includes(listing.id);
        const isClaimed = isClaimedInDB || isClaimedLocally;
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
        const isClaimed = this.claimedItems.includes(listing.id);

        // Image handling
        let imgSource = '';
        if (listing.photoUrl) {
            imgSource = listing.photoUrl;
        } else if (listing.photo && typeof listing.photo === 'object' && listing.photo instanceof File) {
            imgSource = URL.createObjectURL(listing.photo);
        }

        const imageHTML = imgSource
            ? `<img src="${imgSource}" alt="${listing.foodType}">`
            : `<i class="fas fa-${this.getFoodIcon(listing.category)}"></i>`;

        // Dietary tags
        let tagsHTML = '';
        if (listing.dietaryTags && listing.dietaryTags.length > 0) {
            tagsHTML = `
            <div class="food-tags">
                ${listing.dietaryTags.map(tag => `<span class="tag tag-${tag}">${tag}</span>`).join('')}
            </div>
        `;
        }

        // Navigation button (only if coords exist)
        const navigateButtonHTML =
            listing.latitude && listing.longitude
                ? `
                <button class="navigate-btn"
                        data-lat="${listing.latitude}"
                        data-lng="${listing.longitude}"
                        title="Navigate to pickup location">
                    <i class="fas fa-directions"></i>
                </button>
              `
                : '';

        return `
        <div class="food-card ${isClaimed ? 'claimed' : ''}"
             data-id="${listing.id}"
             data-tags="${listing.dietaryTags ? listing.dietaryTags.join(',') : ''}">
             
            <div class="food-image">
                ${imageHTML}
                <div class="food-category">${this.capitalizeFirst(listing.category)}</div>
            </div>

            <div class="food-details">
                <h3 class="food-title">${listing.foodType}</h3>
                ${tagsHTML}

                <p class="food-description">${listing.description}</p>

                <div class="food-meta">
                    <span class="quantity">
                        <i class="fas fa-utensils"></i> ${listing.quantity}
                    </span>
                    <span class="freshness">
                        <i class="fas fa-clock"></i> ${freshUntil}
                    </span>
                </div>

                <div class="food-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${location}</span>
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
                    <button class="contact-btn" data-contact="${contact}" title="Copy contact">
                        <i class="fas fa-phone"></i>
                    </button>
                    ${navigateButtonHTML}
                </div>
            </div>
        </div>
    `;
    }


setupFoodCardInteractions() {
    // Claim buttons
    const claimBtns = document.querySelectorAll('.claim-btn');
    claimBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const listingId = parseInt(btn.getAttribute('data-id'));
            this.handleClaimFood(listingId);
        });
    });

    // Contact buttons
    const contactBtns = document.querySelectorAll('.contact-btn');
    contactBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const contact = btn.getAttribute('data-contact');
            this.handleContactDonor(contact);
        });
    });

    // ✅ Navigate buttons (NEW)
    const navigateBtns = document.querySelectorAll('.navigate-btn');
    navigateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lat = btn.dataset.lat;
            const lng = btn.dataset.lng;

            if (!lat || !lng) {
                this.showToast('Location coordinates not available', 'error');
                return;
            }

            // Open Google Maps directions
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
                '_blank'
            );
        });
    });
}

async useCurrentLocation() {
    if (!navigator.geolocation) {
        this.showToast('Geolocation not supported', 'error');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const latInput = document.getElementById('latitude');
            const lonInput = document.getElementById('longitude');
            const locationInput = document.getElementById('location');

            if (latInput) latInput.value = latitude;
            if (lonInput) lonInput.value = longitude;

            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                    { headers: { 'User-Agent': 'ShareBite' } }
                );

                const data = await res.json();
                if (locationInput) {
                    locationInput.value = data.display_name || 'Current location';
                }
            } catch (err) {
                if (locationInput) {
                    locationInput.value = 'Current location';
                }
            }
        },
        () => {
            this.showToast('Location permission denied', 'error');
        }
    );
}

setupFoodCardAccessibility() {
    const foodCards = document.querySelectorAll('.food-card');

    foodCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'View food details');
    });
}





    setupFileUpload() {
        const dropzone = document.getElementById('photoUpload');
        const fileInput = document.getElementById('photoInput');
        if (!dropzone || !fileInput) return;

        const handleFiles = (files) => {
            const file = files[0];
            if (!file) return;


 

            if (!file.type.startsWith('image/')) {
                this.showToast('Please upload an image file', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.uploadedPhotoBase64 = e.target.result;
                dropzone.innerHTML = `
                    <img src="${this.uploadedPhotoBase64}" alt="Uploaded photo" class="uploaded-photo-preview" />
                `;
            };
            reader.readAsDataURL(file);
        };

        dropzone.addEventListener('click', () => fileInput.click());

        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('drag-over');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('drag-over');
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('drag-over');
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleFiles(e.dataTransfer.files);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files);
            }
        });
    }

    handleClaimFood(listingId) {
        const listing = this.foodListings.find(l => l.id === listingId);
        if (!listing) return;

        // Check if already claimed
        if (this.claimedItems.includes(listingId) || listing.status === 'reserved') {
            this.showToast('This item has already been claimed!', 'error');
            return;
        }

        const listingIndex = this.foodListings.findIndex(l => l.id === listingId);
        if (listingIndex !== -1) {
            this.foodListings[listingIndex].status = 'claimed';
        }

        const confirmed = confirm(
            `Claim "${listing.foodType}" from ${listing.donor}?\n\n` +
            `Pickup: ${listing.location}\n` +
            `Time: ${this.formatTime(listing.pickupTime)}\n` +
            `Contact: ${listing.contact}`
        );

        if (!confirmed) {
            return;
        }

        // Mark as assigned and persist on backend
        listing.status = 'assigned';
        this.api.deleteFoodListing(listingId);
        this.api.claimFoodListing(listingId);

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
            status: 'assigned'
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

        this.showToast(
            `Successfully claimed "${listing.foodType}"! Check notifications for pickup details.`,
            'success'
        );

        this.updateNotificationDisplay();
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

        // Note: Notification click handlers are set up in the main script.js file
        // to avoid duplicate event listeners

        // Prevent panel from closing when clicking inside
        if (notificationPanel) {
            notificationPanel.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    loadClaimedItems() {
        return (window.ShareBiteShared && window.ShareBiteShared.storage)
            ? window.ShareBiteShared.storage.loadClaimedItems() : (localStorage.getItem('sharebite-claimed-items') ? JSON.parse(localStorage.getItem('sharebite-claimed-items')) : []);
    }

    saveClaimedItems() {
        if (window.ShareBiteShared && window.ShareBiteShared.storage) {
            window.ShareBiteShared.storage.saveClaimedItems(this.claimedItems);
        } else {
            localStorage.setItem('sharebite-claimed-items', JSON.stringify(this.claimedItems));
        }
    }

    loadNotifications() {
        return (window.ShareBiteShared && window.ShareBiteShared.storage)
            ? window.ShareBiteShared.storage.loadNotifications() : (localStorage.getItem('sharebite-notifications') ? JSON.parse(localStorage.getItem('sharebite-notifications')) : []);
    }

    saveNotifications() {
        if (window.ShareBiteShared && window.ShareBiteShared.storage) {
            window.ShareBiteShared.storage.saveNotifications(this.notifications);
        } else {
            localStorage.setItem('sharebite-notifications', JSON.stringify(this.notifications));
        }
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


        notification.status = "Collected";
        this.saveNotifications();

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

class GalleryManager {
    setupKeyboardAccessibility() {
        this.galleryItems.forEach(item => {
            // 1️⃣ Allow Tab key to reach this card
            item.setAttribute('tabindex', '0');

            // 2️⃣ Tell screen readers this behaves like a button
            item.setAttribute('role', 'button');

            // 3️⃣ Accessible description
            item.setAttribute('aria-label', 'Open gallery item');
        });
    }
    constructor() {
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.init();
    }

    init() {
        this.setupScrollAnimation();
        this.setupHoverEffects();
        this.setupClickEvents();
        this.setupKeyboardAccessibility();
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

            // 🖱 Mouse click (already works)
            item.addEventListener('click', () => {
                const category = item.getAttribute('data-category');
                const title = item.querySelector('h3').textContent;
                const description = item.querySelector('p').textContent;

                this.showGalleryDetail(item, title, description, category);
            });

            // ⌨ Keyboard support (NEW)
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); // stop page scroll (Space key)

                    const category = item.getAttribute('data-category');
                    const title = item.querySelector('h3').textContent;
                    const description = item.querySelector('p').textContent;

                    this.showGalleryDetail(item, title, description, category);
                }
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

// ===== Lazy-load ShareBot Chatbot Launcher =====
function setupChatbotLauncher() {
    // Only run on pages where DOM exists
    if (!document.body) return;
    const LAUNCHER_ID = 'chatbot-launcher';
    if (document.getElementById(LAUNCHER_ID)) return;

    // Create launcher button
    const btn = document.createElement('button');
    btn.id = LAUNCHER_ID;
    btn.type = 'button';
    btn.title = 'Open ShareBot chat';
    btn.setAttribute('aria-label', 'Open ShareBot chat');
    btn.innerHTML = '<i class="fas fa-comment-dots"></i>';

    // Basic styles (keeps visual consistent with widget bubble)
    Object.assign(btn.style, {
        position: 'fixed',
        right: 'auto', // computed below to align with map icon
        bottom: 'auto', // computed below to sit above the map icon
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg,#4caf50,#2e7d32)',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        zIndex: '99999',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 6px 18px rgba(0,0,0,0.18)'
    });

    // Spinner styles injected once
    if (!document.getElementById('chatbot-launcher-styles')) {
        const s = document.createElement('style');
        s.id = 'chatbot-launcher-styles';
        s.textContent = `
            .chatbot-launcher-spinner{display:inline-block;width:18px;height:18px;border:2px solid rgba(255,255,255,0.4);border-top-color:#fff;border-radius:50%;animation:chatbot-launcher-spin .8s linear infinite}
            @keyframes chatbot-launcher-spin{to{transform:rotate(360deg)}}
        `;
        document.head.appendChild(s);
    }

    document.body.appendChild(btn);

    // Position the launcher directly above the map icon (#scrollTopWrapper) with a small gap.
    function positionLauncher() {
        const wrapper = document.getElementById('scrollTopWrapper');
        const gap = 12; // px gap between wrapper and launcher
        // default fallback values
        let leftPx = null;
        let bottomPx = 140;

        if (wrapper) {
            // Try to align to the map icon specifically (anchor with class .scroll-link)
            const mapEl = wrapper.querySelector('.scroll-link');
            let targetRect;

            if (mapEl) {
                targetRect = mapEl.getBoundingClientRect();
            } else {
                targetRect = wrapper.getBoundingClientRect();
            }

            const btnWidth = btn.offsetWidth || 56; // measured width of launcher
            // compute left so the launcher's left aligns to place its center on the target center
            const targetCenterX = targetRect.left + targetRect.width / 2;
            leftPx = Math.round(targetCenterX - btnWidth / 2);

            // compute bottom so the launcher's bottom sits just above targetRect.top minus gap
            bottomPx = Math.round(window.innerHeight - targetRect.top + gap);

            // keep sensible minimums and ensure it doesn't overflow
            if (leftPx < 8) leftPx = 8;
            if (leftPx + btnWidth > window.innerWidth - 8) leftPx = Math.max(8, window.innerWidth - btnWidth - 8);
            if (bottomPx < 12) bottomPx = 12;
        }

        // Prefer left positioning for pixel-accurate alignment above the target
        if (leftPx !== null) {
            btn.style.left = leftPx + 'px';
            btn.style.right = 'auto';
        } else {
            // fallback to right positioning
            btn.style.right = '24px';
            btn.style.left = 'auto';
        }
        btn.style.bottom = bottomPx + 'px';
    }

    // initial position and update on resize/scroll (throttle lightly)
    positionLauncher();
    let posTimer = null;
    ['resize', 'scroll'].forEach(evt => {
        window.addEventListener(evt, () => {
            if (posTimer) clearTimeout(posTimer);
            posTimer = setTimeout(() => positionLauncher(), 80);
        }, { passive: true });
    });

    let loaded = false;
    let loading = false;
    let isOpen = false;

    async function loadAndOpen() {
        if (loaded) {
            // toggle open/close
            if (window.ShareBot && typeof window.ShareBot.open === 'function' && typeof window.ShareBot.close === 'function') {
                if (isOpen) {
                    window.ShareBot.close();
                    isOpen = false;
                    btn.classList.remove('active');
                } else {
                    window.ShareBot.open();
                    isOpen = true;
                    btn.classList.add('active');
                }
            }
            return;
        }

        if (loading) return;
        loading = true;
        btn.disabled = true;
        const prev = btn.innerHTML;
        btn.innerHTML = '<span class="chatbot-launcher-spinner" aria-hidden="true"></span>';
        try {
            // dynamic import: resolve a URL relative to the current page to be robust
            const resolved = new URL('../src/chatbot/ChatbotWidget.js', window.location.href).href;
            try {
                await import(resolved);
            } catch (innerErr) {
                // fallback to absolute path (server root)
                const alt = new URL('/src/chatbot/ChatbotWidget.js', window.location.origin).href;
                if (alt !== resolved) {
                    await import(alt);
                } else {
                    throw innerErr;
                }
            }
            loaded = true;
            // open after small delay so widget finishes setup
            setTimeout(() => {
                if (window.ShareBot && typeof window.ShareBot.open === 'function') {
                    window.ShareBot.open();
                    isOpen = true;
                    btn.classList.add('active');
                }
            }, 250);
            // replace icon with chat icon
            btn.innerHTML = '<i class="fas fa-comment"></i>';
            // small user feedback using existing toast area if available
            if (typeof showToast === 'function') showToast('ShareBot loaded');
        } catch (err) {
            console.error('Failed to load ShareBot', err);
            // show error to user with more context
            const message = err && err.message ? `Failed to load chat: ${err.message}` : 'Failed to load chat';
            if (typeof showToast === 'function') showToast(message, 'error');
            // keep icon so user can retry
            btn.innerHTML = prev;
        } finally {
            loading = false;
            btn.disabled = false;
        }
    }

    btn.addEventListener('click', loadAndOpen);

btn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    loadAndOpen();
  }
});
}

setupChatbotLauncher();
    // If ShareBot loads itself or another script opens the widget, keep state in sync
    // (optional) listen for user interactions on the injected widget to update launcher state

    // No-op: the module exposes window.ShareBot.open/close which we call above


// No-op: the module exposes window.ShareBot.open/close which we call above


 // Offline / Online status handler
function updateOnlineStatus() {
  const banner = document.getElementById("offline-banner");
  if (!banner) return;

  if (navigator.onLine) {
    banner.style.display = "none";
  } else {
    banner.style.display = "block";
  }
}

window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);
window.addEventListener("load", updateOnlineStatus);

// Back to Top Button

(
    function () {
        const backToTopButton = document.getElementById("backToTop");

        // Exit silently if button is not present
        if (!backToTopButton) return;

        // Click → smooth scroll to top
        backToTopButton.addEventListener("click", () => {
            window.scrollTo({
            top: 0,
            behavior: "smooth",
            });
        });

        // Toggle visibility on scroll
        const toggleBackToTopVisibility = () => {
            if (window.scrollY > 300) {
            backToTopButton.classList.add("visible");
            } else {
            backToTopButton.classList.remove("visible");
            }
        };

        // Listen to scroll
        window.addEventListener("scroll", toggleBackToTopVisibility);

        // Run once on load (covers refresh + anchor cases)
        toggleBackToTopVisibility();
})();

