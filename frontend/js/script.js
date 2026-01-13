// ShareBite JavaScript - Interactive Food Waste Reduction Platform

  
 

        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        const themeIcon = themeToggle.querySelector('i');

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                showToast('Dark mode enabled');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                showToast('Light mode enabled');
            }
        });
     


        const menuToggle = document.getElementById("menuToggle");
        const navMenu = document.getElementById("navMenu");

        menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        });
        menuToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        menuToggle.click();
    }
});


        document.addEventListener("DOMContentLoaded", () => {
            const menuToggle = document.getElementById("menuToggle");
            const navMenu = document.getElementById("navMenu");
          
            menuToggle.addEventListener("click", () => {
              navMenu.classList.toggle("active");
            });
          });
          
        window.addEventListener("scroll",()=>{
            if(window.scrollY > 50){
                navMenu.classList.add("scrolled");
            }
            else{
                navMenu.classList.remove("scrolled");       
            }
        })

        // Notification Toggle
        const notificationBell = document.getElementById('notificationBell');
        const notificationPanel = document.getElementById('notificationPanel');

        notificationBell.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationPanel.classList.toggle('show');
        });

        // Close notification panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!notificationBell.contains(e.target)) {
                notificationPanel.classList.remove('show');
            }
        });

        // Clear Notifications
        const clearNotifications = document.getElementById('clearNotifications');
        const notificationList = document.getElementById('notificationList');
        const notificationBadge = document.getElementById('notificationBadge');

        clearNotifications.addEventListener('click', () => {
            notificationList.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-secondary);">No notifications</div>';
            notificationBadge.textContent = '0';
            notificationBadge.style.display = 'none';
            showToast('Notifications cleared');
            notificationPanel.classList.remove('show');
        });

        // Role Switch
        const roleSwitch = document.getElementById('roleSwitch');
        const currentRole = document.getElementById('currentRole');

        roleSwitch.addEventListener('click', () => {
            if (currentRole.textContent === 'Donor') {
                currentRole.textContent = 'Receiver';
                showToast('Switched to Receiver mode');
            } else {
                currentRole.textContent = 'Donor';
                showToast('Switched to Donor mode');
            }
        });

        // Toast Function
        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3800);
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
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
        this.claimedItems = this.loadClaimedItems();
        this.notifications = this.loadNotifications();
        this.api = window;
        
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

    // ✅ Ensure hidden location inputs exist
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
                let hour = parseInt(match[1]);
                const minute = parseInt(match[2]);
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

        //Special validation for quantity
        if (input.id === 'quantity') {
            const quantity = parseInt(input.value.trim());
            if (isNaN(quantity) || quantity <= 0) {
                input.focus();
                this.showToast('Please enter a valid quantity greater than 0', 'error');
                return false;
            }
        }
        
        // Special validation for contact information
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

validateContactInfo(contact) {
    // Email regex
    if(!contact) return false;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Email check
    if (emailPattern.test(contact)) {
        return true;
    }

    // Phone structure: optional '+' followed by digits only
    const phonePattern = /^\+?\d+$/;

    if (!phonePattern.test(contact)) {
        return false;
    }

    // With country code
    if (contact.startsWith('+')) {
        const digitCount = contact.length - 1; // exclude '+'
        return digitCount >= 11 && digitCount <= 13;
    }

    // Without country code
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


    form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmission();
    });

    setupFormHandling() {
        const form = document.getElementById('listingForm');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
        const useLocationBtn = document.getElementById('useCurrentLocationBtn');

        if (useLocationBtn) {
            useLocationBtn.addEventListener('click', this.useCurrentLocation.bind(this));
        }

 main

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    // Expiry time must be future
    const freshUntilInput = document.getElementById('freshUntil');
    if (freshUntilInput) {
        freshUntilInput.min = now.toISOString().slice(0, 16);
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


    // OPTIONAL: Pickup time must be future
    const pickupTimeInput = document.getElementById('pickupTime');
    if (pickupTimeInput) {
        pickupTimeInput.min = now.toISOString().slice(0, 16);
    }
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
                status: "Available",

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
            if (error.status === 401) {
                this.showToast('You must be logged in to add a listing', 'error');
            } else {
                this.showToast(error.message || 'Failed to create listing', 'error');
            }
        }
    }
}

    
 



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
    console.error(error);
    this.showToast('Failed to create listing', 'error');
  }
}
 main

    getFormData() {
        const selectedTags = [];
        document.querySelectorAll('input[name="dietary"]:checked').forEach(function(checkbox) {
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
            right: 80px;
            max-width: 400px;
            height: 300px;
            background: ${type === 'success' ? 'var(--primary-color)' : 'var(--secondary-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 3000;
            animation: slideInRight 0.8s ease, fadeOut 0.8s ease 3s forwards;
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
        
        if(username) {
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
            btn.addEventListener('click', (e) => {
                const listingId = btn.getAttribute('data-id');
                // const listingId = parseInt(btn.getAttribute('data-id'));
                this.handleClaimFood(listingId);
            });
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

      document.getElementById('latitude').value = latitude;
      document.getElementById('longitude').value = longitude;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          { headers: { 'User-Agent': 'ShareBite' } }
        );

        const data = await res.json();
        document.getElementById('location').value =
          data.display_name || 'Current location';

      } catch (err) {
        document.getElementById('location').value = 'Current location';
      }
    },
    () => {
      this.showToast('Location permission denied', 'error');
    }

    setupFoodCardAccessibility() {
    const foodCards = document.querySelectorAll('.food-card');

    foodCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'View food details');
    });
}


  );
}

 main

    handleClaimFood(listingId) {
        const listing = this.foodListings.find(l => l.id === listingId);
        if (!listing) return;
        
        // Check if already claimed
        if (this.claimedItems.includes(listingId) || listing.status === 'reserved') {
            this.showToast('This item has already been claimed!', 'error');
            return;
        }

        const listingIndex = this.foodListings.findIndex(l => l.id === listingId);
            if(listingIndex !== -1) {
                this.foodListings[listingIndex].status = 'claimed';
            }
        
        // Show confirmation dialog
        const confirmed = confirm(`Claim "${listing.foodType}" from ${listing.donor}?\n\nPickup: ${listing.location}\nTime: ${this.formatTime(listing.pickupTime)}\nContact: ${listing.contact}`);
        
        if (confirmed) {

            listing.status = "Assigned";

            this.api.deleteFoodListing(listingId);
            // Add to claimed items

            this.api.claimFoodListing(listingId);
 main
            this.claimedItems.push(listingId);
            this.saveClaimedItems();
            listing.status = 'reserved';
            
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

                status: 'Assigned'

                status: 'reserved'
main
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
        this.setupKeyboardAccessibility();
    }

    setupScrollAnimation() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
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
(function setupChatbotLauncher() {
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
    


  







// some function
});
}

// another function


// end of file

      




    // If ShareBot loads itself or another script opens the widget, keep state in sync
    // (optional) listen for user interactions on the injected widget to update launcher state

 // No-op: the module exposes window.ShareBot.open/close which we call above
());

    // No-op: the module exposes window.ShareBot.open/close which we call above
})();

// Add Listing Success Message
document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submitForm");
  const successMsg = document.getElementById("listingSuccessMsg");

  if (submitBtn && successMsg) {
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Show success message
      successMsg.style.display = "block";

      // Reset the form
      submitBtn.closest("form").reset();

      // Hide message after 4 seconds
      setTimeout(() => {
        successMsg.style.display = "none";
      }, 4000);
    });
  }
});
 main
