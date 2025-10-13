// ShareBite JavaScript - Interactive Food Waste Reduction Platform

class ShareBiteFoodListing {
    constructor() {
    this.currentRole = "donor";
        this.foodListings = [];
        this.filteredListings = [];
    this.currentFilter = "all";
        this.claimedItems = this.loadClaimedItems();
        this.notifications = this.loadNotifications();
        
        this.init();
        this.initTheme(); // add theme initialization after base init
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
    const stored = localStorage.getItem("sharebite-theme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored || (prefersDark ? "dark" : "light");
        this.applyTheme(theme);
        this.setupThemeToggle();
    }

    setupThemeToggle() {
    const btn = document.getElementById("themeToggle");
        if (!btn) return;
    btn.addEventListener("click", () => {
      const newTheme = document.documentElement.classList.contains("dark")
        ? "light"
        : "dark";
            this.applyTheme(newTheme);
      localStorage.setItem("sharebite-theme", newTheme);
        });
    }

    applyTheme(theme) {
        const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      const icon = document.querySelector("#themeToggle i");
      if (icon) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
      }
        } else {
      root.classList.remove("dark");
      const icon = document.querySelector("#themeToggle i");
      if (icon) {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
      }
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
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
                // If it's an anchor for current page, scroll smoothly
        if (href && href.startsWith("#")) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
                    }
        } else if (href && href.includes(".html#")) {
                    // If it's index.html#features or similar, navigate normally
                    // (let browser handle navigation)
        } else if (href && href.endsWith(".html")) {
                    // If it's a plain .html link, let browser handle navigation
                }
            });
        });
    }

    setupRoleSwitch() {
    const roleSwitch = document.getElementById("roleSwitch");
    const currentRoleSpan = document.getElementById("currentRole");

    roleSwitch.addEventListener("click", () => {
      this.currentRole = this.currentRole === "donor" ? "collector" : "donor";
      currentRoleSpan.textContent =
        this.currentRole.charAt(0).toUpperCase() + this.currentRole.slice(1);
            
            // Update UI based on role
            this.updateUIForRole();
        });
    }

    updateUIForRole() {
    const donateBtn = document.getElementById("donateFood");
    const findBtn = document.getElementById("findFood");
    const addListingBtn = document.getElementById("addListingBtn");
    const notificationBell = document.getElementById("notificationBell");

    if (this.currentRole === "collector") {
      if (donateBtn)
        donateBtn.innerHTML = '<i class="fas fa-search"></i> Find Food';
      if (findBtn)
        findBtn.innerHTML = '<i class="fas fa-heart"></i> Help Others';
      if (addListingBtn) addListingBtn.style.display = "none";
            
            // Show notification bell for collectors
            if (notificationBell) {
        notificationBell.style.display = "block";
            }
        } else {
      if (donateBtn)
        donateBtn.innerHTML = '<i class="fas fa-heart"></i> Donate Food';
      if (findBtn)
        findBtn.innerHTML = '<i class="fas fa-search"></i> Find Food';
      if (addListingBtn) addListingBtn.style.display = "flex";
            
            // Hide notification bell for donors (unless they have notifications)
            if (notificationBell && this.notifications.length === 0) {
        notificationBell.style.display = "none";
            }
        }
        
        // Re-render food listings to update claim button states
        this.renderFoodListings();
    }

   setupModal() {
    const modal = document.getElementById("addListingModal");
    const addListingBtn = document.getElementById("addListingBtn");
    const closeModalBtn = document.querySelector(".close-modal");
    const cancelBtn = document.getElementById("cancelForm");

    this.currentStep = 1;
    this.totalSteps = 3;

    addListingBtn.addEventListener("click", () => {
      modal.style.display = "block";
      document.body.style.overflow = "hidden";
        this.resetFormSteps();
    });

    const closeModal = () => {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
        this.resetForm();
        this.resetFormSteps();
    };

    closeModalBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);
    
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    this.setupFileUpload();
    this.setupFormNavigation();
}

setupFormNavigation() {
    const nextBtn = document.getElementById("nextStep");
    const prevBtn = document.getElementById("prevStep");
    const submitBtn = document.getElementById("submitForm");

    nextBtn.addEventListener("click", () => {
        if (this.validateCurrentStep()) {
            this.goToStep(this.currentStep + 1);
        }
    });

    prevBtn.addEventListener("click", () => {
        this.goToStep(this.currentStep - 1);
    });
}

goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > this.totalSteps) return;

    document.querySelectorAll(".form-step").forEach((step) => {
      step.classList.remove("active");
    });

    const newStep = document.querySelector(
      `.form-step[data-step="${stepNumber}"]`
    );
    if (newStep) {
      newStep.classList.add("active");
    }

    this.updateProgress(stepNumber);

    this.updateNavigationButtons(stepNumber);

    this.currentStep = stepNumber;
}

updateProgress(stepNumber) {
    const steps = document.querySelectorAll(".progress-step");
    
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        
        if (stepNum < stepNumber) {
        step.classList.add("completed");
        step.classList.remove("active");
        } else if (stepNum === stepNumber) {
        step.classList.add("active");
        step.classList.remove("completed");
        } else {
        step.classList.remove("active", "completed");
        }
    });
}

updateNavigationButtons(stepNumber) {
    const nextBtn = document.getElementById("nextStep");
    const prevBtn = document.getElementById("prevStep");
    const submitBtn = document.getElementById("submitForm");

    prevBtn.style.display = stepNumber === 1 ? "none" : "flex";
    nextBtn.style.display = stepNumber === this.totalSteps ? "none" : "flex";
    submitBtn.style.display = stepNumber === this.totalSteps ? "flex" : "none";
}

validateCurrentStep() {
    const currentStepEl = document.querySelector(
      `.form-step[data-step="${this.currentStep}"]`
    );
    const requiredInputs = currentStepEl.querySelectorAll("[required]");
    
    for (let input of requiredInputs) {
        if (!input.value.trim()) {
            input.focus();
        this.showToast(
          `Please fill in the required field: ${input.previousElementSibling.textContent}`,
          "error"
        );
            return false;
        }
        
        // Special validation for contact information
      if (input.id === "contact") {
            if (!this.validateContactInfo(input.value.trim())) {
                input.focus();
          this.showToast(
            "Please enter a valid email address or phone number",
            "error"
          );
                return false;
            }
        }
    }
    
    return true;
}

// Validate contact information (email or phone number)
validateContactInfo(contact) {
    // Email regex pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Phone number regex pattern (supports various formats)
    const phonePattern = /^[\+]?[1-9]?[\d\s\-\(\)]{7,15}$/;
    
    // Remove spaces and common characters for phone validation
    const cleanedContact = contact.replace(/[\s\-\(\)]/g, "");
    
    // Check if it's a valid email
    if (emailPattern.test(contact)) {
        return true;
    }
    
    // Check if it's a valid phone number
    if (
      phonePattern.test(contact) &&
      cleanedContact.length >= 7 &&
      cleanedContact.length <= 15
    ) {
        return true;
    }
    
    return false;
}

resetFormSteps() {
    this.currentStep = 1;
    this.goToStep(1);
}

setupFileUpload() {
    const fileInput = document.getElementById("photo");
    const uploadArea = document.getElementById("photoUpload");
    const imagePreview = document.getElementById("imagePreview");

    uploadArea.addEventListener("click", () => {
        fileInput.click();
    });

    uploadArea.addEventListener("dragover", (e) => {
        e.preventDefault();
      uploadArea.classList.add("drag-over");
    });

    uploadArea.addEventListener("dragleave", (e) => {
        e.preventDefault();
      uploadArea.classList.remove("drag-over");
    });

    uploadArea.addEventListener("drop", (e) => {
        e.preventDefault();
      uploadArea.classList.remove("drag-over");
        const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type.startsWith("image/")) {
            fileInput.files = files;
            this.handleFileSelect(files[0]);
        } else {
        this.showToast("Please upload a valid image file", "error");
        }
    });

    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            this.handleFileSelect(e.target.files[0]);
        }
    });
}

handleFileSelect(file) {
    const imagePreview = document.getElementById("imagePreview");
    const uploadArea = document.getElementById("photoUpload");
    
    if (!file.type.startsWith("image/")) {
      this.showToast("Please select an image file", "error");
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.showToast("Image size should be less than 5MB", "error");
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
      imagePreview.classList.add("active");
      uploadArea.style.display = "none";

        // Add remove functionality
      const removeBtn = imagePreview.querySelector(".remove-image");
      removeBtn.addEventListener("click", () => {
        imagePreview.innerHTML = "";
        imagePreview.classList.remove("active");
        uploadArea.style.display = "block";
        document.getElementById("photo").value = "";
        });
    };
    reader.readAsDataURL(file);
}

    setupFormHandling() {
    const form = document.getElementById("listingForm");
        
    form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });

    const freshUntilInput = document.getElementById("freshUntil");
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
      foodType: document.getElementById("foodType").value,
      quantity: document.getElementById("quantity").value,
      category: document.getElementById("category").value,
      description: document.getElementById("description").value,
      freshUntil: document.getElementById("freshUntil").value,
      pickupTime: document.getElementById("pickupTime").value,
      location: document.getElementById("location").value,
      contact: document.getElementById("contact").value,
      photo: document.getElementById("photo").files[0],
            createdAt: new Date(),
      donor: "Current User",
        };
    }

    validateFormData(data) {
    const requiredFields = [
      "foodType",
      "quantity",
      "category",
      "freshUntil",
      "pickupTime",
      "location",
      "contact",
    ];
        
        for (let field of requiredFields) {
      if (!data[field] || data[field].trim() === "") {
        this.showErrorMessage(
          `Please fill in the ${field
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()}.`
        );
                return false;
            }
        }
        
        const freshDate = new Date(data.freshUntil);
        if (freshDate <= new Date()) {
      this.showErrorMessage("Fresh until date must be in the future.");
            return false;
        }
        
        // Validate contact information
        if (!this.validateContactInfo(data.contact)) {
      this.showErrorMessage(
        "Please enter a valid email address or phone number for contact information."
      );
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
    this.showToast("Food listing added successfully!", "success");
    }

    showErrorMessage(message) {
    this.showToast(message, "error");
    }

    showToast(message, type) {
    const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${
              type === "success" ? "check-circle" : "exclamation-circle"
            }"></i>
            <span>${message}</span>
        `;
        
        // Add toast styles
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${
              type === "success"
                ? "var(--primary-color)"
                : "var(--secondary-color)"
            };
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
    document.getElementById("addListingModal").style.display = "none";
    document.body.style.overflow = "auto";
        this.resetForm();
    }

    resetForm() {
    document.getElementById("listingForm").reset();
    document.getElementById("photoUpload").innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <span>Click to upload or drag and drop</span>
        `;
        
        // Reset minimum date
    const freshUntilInput = document.getElementById("freshUntil");
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        freshUntilInput.min = now.toISOString().slice(0, 16);
    }

    setupFilteringAndSearch() {
    // --- Existing Category Filter Logic ---
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentFilter = btn.getAttribute("data-filter");
            this.filterListings();
            this.renderFoodListings();
        });
    });

    // --- Existing Search Input Logic ---
    const searchInput = document.querySelector(".search-box input");
    let searchTimeout;
    searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            this.searchQuery = e.target.value.toLowerCase();
            this.filterListings();
            this.renderFoodListings();
        }, 300);
    });

    // --- NEW: Dropdown and Filtering Logic ---
    const dietaryBtn = document.getElementById("dietary-filter-btn");
    const dietaryDropdown = document.getElementById("dietary-dropdown");
    const dietaryCheckboxes = document.querySelectorAll(
      'input[name="dietary-filter"]'
    );

    if (dietaryBtn) {
        // Toggle dropdown visibility
      dietaryBtn.addEventListener("click", (e) => {
            e.stopPropagation();
        dietaryDropdown.style.display =
          dietaryDropdown.style.display === "block" ? "none" : "block";
        dietaryBtn.classList.toggle("active");
        });

        // Add event listeners to checkboxes
      dietaryCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
                this.filterListings();
                this.renderFoodListings();
                
                // Update button text to show selected count
          const selectedCount = document.querySelectorAll(
            'input[name="dietary-filter"]:checked'
          ).length;
          const btnSpan = dietaryBtn.querySelector("span");
                if (selectedCount > 0) {
                    btnSpan.textContent = `Dietary Filters (${selectedCount})`;
                } else {
            btnSpan.textContent = "Dietary Filters";
                }
            });
        });

        // Close dropdown when clicking outside
      document.addEventListener("click", () => {
        if (dietaryDropdown.style.display === "block") {
          dietaryDropdown.style.display = "none";
          dietaryBtn.classList.remove("active");
            }
        });
        
        // Prevent closing when clicking inside the dropdown
      dietaryDropdown.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }
}

    filterListings() {
        const activeDietaryFilters = [];
    document
      .querySelectorAll('input[name="dietary-filter"]:checked')
      .forEach((checkbox) => {
            activeDietaryFilters.push(checkbox.value);
        });

    this.filteredListings = this.foodListings.filter((listing) => {
      const matchesFilter =
        this.currentFilter === "all" || listing.category === this.currentFilter;
            
      const matchesSearch =
        !this.searchQuery ||
                listing.foodType.toLowerCase().includes(this.searchQuery) ||
                listing.location.toLowerCase().includes(this.searchQuery) ||
                listing.description.toLowerCase().includes(this.searchQuery);

      const matchesDietary =
        activeDietaryFilters.length === 0 ||
        (listing.dietaryTags &&
          activeDietaryFilters.every((filter) =>
            listing.dietaryTags.includes(filter)
          ));
            
            return matchesFilter && matchesSearch && matchesDietary;
        });
    }

    setupResponsiveNav() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const userActions = document.querySelector(".user-actions");
    const roleSwitch = document.getElementById("roleSwitch");
    const loginButtons = Array.from(document.querySelectorAll(".login-btn"));
    let moved = false;

    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");

      if (navMenu.classList.contains("active") && !moved) {
        const container = document.createElement("li");
        container.className = "nav-mobile-actions";
        const wrapper = document.createElement("div");
        wrapper.className = "nav-mobile-actions-wrapper";
        if (roleSwitch) wrapper.appendChild(roleSwitch);
        loginButtons.forEach((btn) => wrapper.appendChild(btn));
        container.appendChild(wrapper);
        navMenu.appendChild(container);
        moved = true;
      } else if (!navMenu.classList.contains("active") && moved) {
        if (roleSwitch) userActions.appendChild(roleSwitch);
        loginButtons.forEach((btn) => userActions.appendChild(btn));
        const mobileContainer = navMenu.querySelector(".nav-mobile-actions");
        if (mobileContainer) navMenu.removeChild(mobileContainer);
        moved = false;
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768 && moved) {
        if (roleSwitch) userActions.appendChild(roleSwitch);
        loginButtons.forEach((btn) => userActions.appendChild(btn));
        const mobileContainer = navMenu.querySelector(".nav-mobile-actions");
        if (mobileContainer) navMenu.removeChild(mobileContainer);
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
        moved = false;
      }
        });
    }

    setupStatsAnimation() {
    const stats = document.querySelectorAll(".stat-number");
        let animated = false;
        
        const animateStats = () => {
            if (animated) return;
            
      stats.forEach((stat) => {
        const target = parseInt(stat.getAttribute("data-count"));
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
      entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setTimeout(animateStats, 1000);
                }
            });
        });
        
    const heroStats = document.querySelector(".hero-stats");
        if (heroStats) {
            observer.observe(heroStats);
        }
    }

    setupScrollEffects() {
        // Navbar background on scroll
        const handleScroll = () => {
      const navbar = document.querySelector(".navbar");
            if (!navbar) return;
            if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
            } else {
        navbar.classList.remove("scrolled");
            }
        };
    window.addEventListener("scroll", handleScroll);
        handleScroll();
        
        // Animate elements on scroll
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
        };
        
        const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
                if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
                }
            });
        }, observerOptions);
        
        // Observe elements to animate
    const elementsToAnimate = document.querySelectorAll(
      ".feature-card, .food-card, .impact-item"
    );
    elementsToAnimate.forEach((el) => {
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
        description:
          "Freshly made pizza with mozzarella, tomato sauce, and basil. Perfect condition, just from lunch service.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "18:00",
                location: "Mario's Pizzeria, 123 Main Street",
                contact: "+1 234-567-8900",
                createdAt: new Date(Date.now() - 3600000),
                donor: "Mario's Pizzeria",
                dietaryTags: ["vegetarian"],
        photoUrl:
          "https://www.allrecipes.com/thmb/2rQA_OlnLbhidei70glz6HCCYAs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/1453815-authentic-pizza-margherita-Cynthia-Ross-4x3-1-7410c69552274163a9049342b60c22ff.jpg",
            },
            {
                id: 2,
                foodType: "Assorted Sandwiches",
                quantity: "15 sandwiches",
                category: "event",
        description:
          "Various sandwiches including turkey, ham, and vegetarian options from corporate catering event.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "16:30",
                location: "Downtown Conference Center",
                contact: "events@conference.com",
                createdAt: new Date(Date.now() - 7200000),
                donor: "Conference Center",
                dietaryTags: ["non-vegetarian"],
        photoUrl:
          "https://bangkok.mandarinorientalshop.com/cdn/shop/files/078-_3729_2048x.jpg?v=1690709512",
            },
            {
                id: 3,
                foodType: "Fresh Bread & Pastries",
                quantity: "20+ items",
                category: "bakery",
        description:
          "End-of-day fresh bread, croissants, and pastries. All baked today and still perfectly fresh.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "20:00",
                location: "Sunrise Bakery, Oak Avenue",
                contact: "+1 234-567-8901",
                createdAt: new Date(Date.now() - 1800000),
                donor: "Sunrise Bakery",
                dietaryTags: ["dairy-free"],
        photoUrl:
          "https://media.istockphoto.com/id/507021914/photo/assorted-croissand-and-bread.jpg?s=612x612&w=0&k=20&c=ruHrARluyF_yR1-hmrurOyz4sLPNeohj1zKKv8fHa8U=",
            },
            {
                id: 4,
                foodType: "Home-cooked Curry",
                quantity: "4-6 portions",
                category: "household",
        description:
          "Vegetarian curry with rice, made too much for family dinner. Spice level: medium.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "19:00",
                location: "Residential Area, Pine Street",
                contact: "+1 234-567-8902",
                createdAt: new Date(Date.now() - 900000),
                donor: "Local Family",
                dietaryTags: ["vegetarian", "gluten-free"],
        photoUrl:
          "https://www.tasteofhome.com/wp-content/uploads/2019/04/shutterstock_610126394.jpg",
            },
            {
                id: 5,
                foodType: "Fruit & Vegetable Box",
                quantity: "1 large box",
                category: "restaurant",
        description:
          "Fresh produce includes apples, oranges, carrots, and lettuce.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "17:00",
                location: "Green Garden Restaurant",
                contact: "+1 234-567-8903",
                createdAt: new Date(Date.now() - 5400000),
                donor: "Green Garden Restaurant",
                dietaryTags: ["vegan"],
        photoUrl:
          "https://www.firstchoiceproduce.com/wp-content/uploads/2020/03/small-produce-box.jpg",
            },
            {
                id: 6,
                foodType: "Grilled Chicken Meals",
                quantity: "12 complete meals",
                category: "restaurant",
        description:
          "Grilled chicken with rice and vegetables. Prepared for cancelled catering order.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "18:30",
                location: "Healthy Eats Cafe, Market Square",
                contact: "+1 234-567-8904",
                createdAt: new Date(Date.now() - 2700000),
                donor: "Healthy Eats Cafe",
                dietaryTags: ["non-vegetarian", "dairy-free"],
        photoUrl:
          "https://i0.wp.com/smittenkitchen.com/wp-content/uploads/2019/05/exceptional-grilled-chicken-scaled.jpg?fit=1200%2C800&ssl=1",
            },
            {
                id: 5,
                foodType: "Fruit & Vegetable Box",
                quantity: "1 large box",
                category: "restaurant",
        description:
          "Fresh produce includes apples, oranges, carrots, and lettuce.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "17:00",
                location: "Green Garden Restaurant",
                contact: "+1 234-567-8903",
                createdAt: new Date(Date.now() - 5400000),
                donor: "Green Garden Restaurant",
                dietaryTags: ["vegan"],
        photoUrl:
          "https://www.firstchoiceproduce.com/wp-content/uploads/2020/03/small-produce-box.jpg",
            },
            {
                id: 7,
                foodType: "Fruit & Vegetable Box",
                quantity: "1 large box",
                category: "restaurant",
        description:
          "Fresh produce includes apples, oranges, carrots, and lettuce.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "17:00",
                location: "Green Garden Restaurant",
                contact: "+1 234-567-8903",
                createdAt: new Date(Date.now() - 5400000),
                donor: "Green Garden Restaurant",
                dietaryTags: ["vegan"],
        photoUrl:
          "https://www.firstchoiceproduce.com/wp-content/uploads/2020/03/small-produce-box.jpg",
            },
            {
                id: 8,
                foodType: "Fruit & Vegetable Box",
                quantity: "1 large box",
                category: "restaurant",
        description:
          "Fresh produce includes apples, oranges, carrots, and lettuce.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "17:00",
                location: "Green Garden Restaurant",
                contact: "+1 234-567-8903",
                createdAt: new Date(Date.now() - 5400000),
                donor: "Green Garden Restaurant",
                dietaryTags: ["vegan"],
        photoUrl:
          "https://www.firstchoiceproduce.com/wp-content/uploads/2020/03/small-produce-box.jpg",
            },
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
    const foodGrid = document.getElementById("foodGrid");
        
        if (this.filteredListings.length === 0) {
      foodGrid.innerHTML = this.createNoResultsMessage();
            return;
        }
        
    foodGrid.innerHTML = this.filteredListings
      .map((listing) => this.createFoodCard(listing))
      .join("");
        
        // Add event listeners to food cards
        this.setupFoodCardInteractions();
    }

  createNoResultsMessage() {
    const hasSearchQuery = this.searchQuery && this.searchQuery.trim() !== "";
    const hasActiveFilters = this.currentFilter !== "all";
    const hasDietaryFilters =
      document.querySelectorAll('input[name="dietary-filter"]:checked').length >
      0;
    const totalListings = this.foodListings.length;

    // Determine the scenario and create appropriate message
    let icon = "fas fa-search";
    let title = "No Results Found";
    let message = "";
    let suggestions = [];
    let actionButton = "";

    if (totalListings === 0) {
      // No listings at all
      icon = "fas fa-utensils";
      title = "No Food Listings Available";
      message =
        "There are currently no food listings available. Be the first to share some food!";
      suggestions = [
        'Add a new food listing using the "Add Listing" button',
        "Check back later for new listings",
        "Share ShareBite with others to grow the community",
      ];
      actionButton =
        '<button class="btn btn-primary" onclick="document.getElementById(\'addListingBtn\').click()"><i class="fas fa-plus"></i> Add First Listing</button>';
    } else if (hasSearchQuery && hasActiveFilters) {
      // Search + filters applied
      title = "No Matching Results";
      message = `No food listings match your search "${this.searchQuery}" and current filters.`;
      suggestions = [
        "Try different search terms",
        "Clear some filters to see more results",
        "Check your spelling",
        "Try broader search terms",
      ];
      actionButton =
        '<button class="btn btn-secondary" onclick="window.shareBiteApp.clearSearchAndFilters()"><i class="fas fa-refresh"></i> Clear All Filters</button>';
    } else if (hasSearchQuery) {
      // Only search applied
      title = "No Search Results";
      message = `No food listings found for "${this.searchQuery}".`;
      suggestions = [
        "Try different keywords",
        "Check your spelling",
        "Try broader search terms",
        "Search by location or food type",
      ];
      actionButton =
        '<button class="btn btn-secondary" onclick="window.shareBiteApp.clearSearch()"><i class="fas fa-times"></i> Clear Search</button>';
    } else if (hasActiveFilters || hasDietaryFilters) {
      // Only filters applied
      title = "No Matching Listings";
      message = "No food listings match your current filter settings.";
      suggestions = [
        "Try different filter combinations",
        "Clear dietary restrictions",
        'Select "All" categories',
        "Check back later for new listings",
      ];
      actionButton =
        '<button class="btn btn-secondary" onclick="window.shareBiteApp.clearFilters()"><i class="fas fa-filter"></i> Clear Filters</button>';
    } else {
      // This shouldn't happen, but fallback
      title = "No Listings Found";
      message = "No food listings are currently available.";
      suggestions = [
        "Check back later",
        "Add a new listing",
        "Share ShareBite with others",
      ];
    }

    return `
            <div class="no-results-container">
                <div class="no-results-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="no-results-content">
                    <h3 class="no-results-title">${title}</h3>
                    <p class="no-results-message">${message}</p>
                    
                    <div class="no-results-suggestions">
                        <h4>Try these suggestions:</h4>
                        <ul class="suggestions-list">
                            ${suggestions
                              .map(
                                (suggestion) =>
                                  `<li><i class="fas fa-lightbulb"></i> ${suggestion}</li>`
                              )
                              .join("")}
                        </ul>
                    </div>
                    
                    ${
                      actionButton
                        ? `<div class="no-results-action">${actionButton}</div>`
                        : ""
                    }
                    
                    <div class="no-results-stats">
                        <small>
                            <i class="fas fa-info-circle"></i> 
                            Showing 0 of ${totalListings} total listings
                        </small>
                    </div>
                </div>
            </div>
        `;
  }

  clearSearchAndFilters() {
    // Clear search input
    const searchInput = document.querySelector(".search-box input");
    if (searchInput) {
      searchInput.value = "";
      this.searchQuery = "";
    }

    // Reset category filters
    const allFilterBtn = document.querySelector(
      '.filter-btn[data-filter="all"]'
    );
    if (allFilterBtn) {
      document
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("active"));
      allFilterBtn.classList.add("active");
      this.currentFilter = "all";
    }

    // Clear dietary filters
    document
      .querySelectorAll('input[name="dietary-filter"]:checked')
      .forEach((checkbox) => {
        checkbox.checked = false;
      });

    // Reset dietary filter button text
    const dietaryBtn = document.getElementById("dietary-filter-btn");
    if (dietaryBtn) {
      const btnSpan = dietaryBtn.querySelector("span");
      btnSpan.textContent = "Dietary Filters";
    }

    // Re-filter and re-render
    this.filterListings();
    this.renderFoodListings();

    this.showToast("All filters and search cleared!", "success");
  }

  clearSearch() {
    const searchInput = document.querySelector(".search-box input");
    if (searchInput) {
      searchInput.value = "";
      this.searchQuery = "";
      this.filterListings();
      this.renderFoodListings();
      this.showToast("Search cleared!", "success");
    }
  }

  clearFilters() {
    // Reset category filters
    const allFilterBtn = document.querySelector(
      '.filter-btn[data-filter="all"]'
    );
    if (allFilterBtn) {
      document
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("active"));
      allFilterBtn.classList.add("active");
      this.currentFilter = "all";
    }

    // Clear dietary filters
    document
      .querySelectorAll('input[name="dietary-filter"]:checked')
      .forEach((checkbox) => {
        checkbox.checked = false;
      });

    // Reset dietary filter button text
    const dietaryBtn = document.getElementById("dietary-filter-btn");
    if (dietaryBtn) {
      const btnSpan = dietaryBtn.querySelector("span");
      btnSpan.textContent = "Dietary Filters";
    }

    // Re-filter and re-render
    this.filterListings();
    this.renderFoodListings();

    this.showToast("Filters cleared!", "success");
  }

    createClaimButton(listing) {
        const isClaimed = this.claimedItems.includes(listing.id);
    const isCollector = this.currentRole === "collector";
    const username = JSON.parse(localStorage.getItem("user"))?.name;

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
    const timeAgo = this.getTimeAgo(listing.createdAt);
    const freshUntil = this.formatDateTime(listing.freshUntil);
    const isClaimed = this.claimedItems.includes(listing.id);

    // *** MODIFIED LOGIC START ***
    let imgSource = "";

    if (listing.photoUrl) {
        // 1. Use external/sample URL if provided
        imgSource = listing.photoUrl;
    } else if (
      listing.photo &&
      typeof listing.photo === "object" &&
      listing.photo instanceof File
    ) {
        // 2. Use temporary URL for newly uploaded file objects
        imgSource = URL.createObjectURL(listing.photo);
    } 
    // If neither photoUrl nor a valid File object exists, imgSource remains empty.
    
    // Create the image/icon HTML based on the determined source
    const imageHTML = imgSource 
        ? `<img src="${imgSource}" alt="${listing.foodType}">` 
        : `<i class="fas fa-${this.getFoodIcon(listing.category)}"></i>`;
    // *** MODIFIED LOGIC END ***

    // This logic generates the HTML for the tags
    let tagsHTML = "";
    if (listing.dietaryTags && listing.dietaryTags.length > 0) {
      tagsHTML =
        `<div class="food-tags">` +
        listing.dietaryTags
          .map((tag) => `<span class="tag tag-${tag}">${tag}</span>`)
          .join("") +
        `</div>`;
    }
    
    // The main HTML template now uses the correctly generated imageHTML
    return `
        <div class="food-card ${isClaimed ? "claimed" : ""}" 
             data-id="${listing.id}" 
             data-tags="${
               listing.dietaryTags ? listing.dietaryTags.join(",") : ""
             }">
            <div class="food-image">
                ${imageHTML}
                <div class="food-category">${this.capitalizeFirst(
                  listing.category
                )}</div>
            </div>
            <div class="food-details">
                <h3 class="food-title">${listing.foodType}</h3>
                ${tagsHTML} 
                <p class="food-description">${listing.description}</p>
                <div class="food-meta">
                    <span class="quantity"><i class="fas fa-utensils"></i> ${
                      listing.quantity
                    }</span>
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
                    <button class="contact-btn" data-contact="${
                      listing.contact
                    }">
                        <i class="fas fa-phone"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

    setupFoodCardInteractions() {
        // Claim buttons
    const claimBtns = document.querySelectorAll(".claim-btn");
    claimBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const listingId = parseInt(btn.getAttribute("data-id"));
                this.handleClaimFood(listingId);
            });
        });
        
        // Contact buttons
    const contactBtns = document.querySelectorAll(".contact-btn");
    contactBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const contact = btn.getAttribute("data-contact");
                this.handleContactDonor(contact);
            });
        });
    }

    handleClaimFood(listingId) {
    const listing = this.foodListings.find((l) => l.id === listingId);
        if (!listing) return;
        
        // Check if already claimed
        if (this.claimedItems.includes(listingId)) {
      this.showToast("This item has already been claimed!", "error");
            return;
        }
        
        // Show confirmation dialog
    const confirmed = confirm(
      `Claim "${listing.foodType}" from ${listing.donor}?\n\nPickup: ${
        listing.location
      }\nTime: ${this.formatTime(listing.pickupTime)}\nContact: ${
        listing.contact
      }`
    );
        
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
        status: "claimed",
            };
            
            this.addNotification(notification);
            
            // Update button appearance only
            const claimBtn = document.querySelector(`[data-id="${listingId}"]`);
            
            if (claimBtn) {
        claimBtn.classList.add("claimed");
                claimBtn.innerHTML = '<i class="fas fa-check-circle"></i> Claimed';
                claimBtn.disabled = true;
            }
            
            // Show success message
      this.showToast(
        `Successfully claimed "${listing.foodType}"! Check notifications for pickup details.`,
        "success"
      );
            
            // Update notification display
            this.updateNotificationDisplay();
        }
    }

    handleContactDonor(contact) {
        // Copy contact to clipboard
    navigator.clipboard
      .writeText(contact)
      .then(() => {
        this.showToast("Contact information copied to clipboard!", "success");
      })
      .catch(() => {
            // Fallback for older browsers
        const textArea = document.createElement("textarea");
            textArea.value = contact;
            document.body.appendChild(textArea);
            textArea.select();
        document.execCommand("copy");
            document.body.removeChild(textArea);
        this.showToast("Contact information copied to clipboard!", "success");
        });
    }

    getFoodIcon(category) {
        const icons = {
      restaurant: "store",
      household: "home",
      bakery: "bread-slice",
      event: "calendar-alt",
    };
    return icons[category] || "utensils";
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
    const [hours, minutes] = timeString.split(":");
        const date = new Date();
        date.setHours(hours, minutes);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    startAnimations() {
        // Add stagger animation to feature cards
    const featureCards = document.querySelectorAll(".feature-card");
        featureCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
        });
        
        // Add floating animation to hero elements
        this.startFloatingAnimations();
        
        // Add periodic pulse to CTA buttons
        this.startButtonPulse();
    }

    startFloatingAnimations() {
    const floatingElements = document.querySelectorAll(".floating-card");
        floatingElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.5}s`;
        });
    }

    startButtonPulse() {
    const ctaButtons = document.querySelectorAll(".btn-primary");
        setInterval(() => {
            ctaButtons.forEach((btn, index) => {
                setTimeout(() => {
          btn.style.animation = "pulse 0.6s ease";
                    setTimeout(() => {
            btn.style.animation = "";
                    }, 600);
                }, index * 200);
            });
        }, 10000); // Pulse every 10 seconds
    }

    hideLoadingOverlay() {
    const loadingOverlay = document.getElementById("loadingOverlay");
        setTimeout(() => {
      loadingOverlay.style.opacity = "0";
            setTimeout(() => {
        loadingOverlay.style.display = "none";
            }, 500);
        }, 1500); // Show loading for 1.5 seconds
    }

    // Notification System Methods
    setupNotificationSystem() {
    const notificationBell = document.getElementById("notificationBell");
    const notificationPanel = document.getElementById("notificationPanel");
        
        if (!notificationBell) return;
        
        // Show notification bell when in collector mode or when there are notifications
    if (this.currentRole === "collector" || this.notifications.length > 0) {
      notificationBell.style.display = "block";
        }
        
        // Toggle notification panel
    notificationBell.addEventListener("click", (e) => {
            e.stopPropagation();
      const isActive = notificationPanel.classList.contains("active");
            
            if (isActive) {
        notificationPanel.classList.remove("active");
        notificationBell.classList.remove("active");
            } else {
        notificationPanel.classList.add("active");
        notificationBell.classList.add("active");
            }
        });
        
        // Close panel when clicking outside
    document.addEventListener("click", (e) => {
            if (!notificationBell.contains(e.target)) {
        notificationPanel.classList.remove("active");
        notificationBell.classList.remove("active");
            }
        });
        
        // Prevent panel from closing when clicking inside
    notificationPanel.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }
    
    loadClaimedItems() {
    const stored = localStorage.getItem("sharebite-claimed-items");
        return stored ? JSON.parse(stored) : [];
    }
    
    saveClaimedItems() {
    localStorage.setItem(
      "sharebite-claimed-items",
      JSON.stringify(this.claimedItems)
    );
    }
    
    loadNotifications() {
    const stored = localStorage.getItem("sharebite-notifications");
        return stored ? JSON.parse(stored) : [];
    }
    
    saveNotifications() {
    localStorage.setItem(
      "sharebite-notifications",
      JSON.stringify(this.notifications)
    );
    }
    
    addNotification(notification) {
        this.notifications.unshift(notification);
        this.saveNotifications();
        this.updateNotificationDisplay();
        this.renderNotifications();
    }
    
    updateNotificationDisplay() {
    const notificationBell = document.getElementById("notificationBell");
    const notificationBadge = document.getElementById("notificationBadge");
        
        if (!notificationBell || !notificationBadge) return;
        
        const unreadCount = this.notifications.length;
        
        if (unreadCount > 0) {
      notificationBell.style.display = "block";
      notificationBadge.style.display = "flex";
      notificationBadge.textContent =
        unreadCount > 99 ? "99+" : unreadCount.toString();
        } else {
      notificationBadge.style.display = "none";
            // Keep bell visible if in collector mode
      if (this.currentRole !== "collector") {
        notificationBell.style.display = "none";
            }
        }
        
        this.renderNotifications();
    }
    
    renderNotifications() {
    const notificationList = document.getElementById("notificationList");
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
                ${this.notifications
                  .map((notification) =>
                    this.createNotificationItem(notification)
                  )
                  .join("")}
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
                            <span>Pickup: ${this.formatTime(
                              notification.pickupTime
                            )}</span>
                        </div>
                        <div class="notification-detail">
                            <i class="fas fa-phone"></i>
                            <span>${notification.contact}</span>
                        </div>
                    </div>
                </div>
                <div class="notification-meta">
                    <span class="notification-time">Claimed ${timeAgo}</span>
                    <span class="notification-status">${this.capitalizeFirst(
                      notification.status
                    )}</span>
                </div>
            </div>
        `;
    }
    
    setupNotificationActions() {
    const notificationItems = document.querySelectorAll(".notification-item");

    notificationItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        const notificationId = parseInt(item.getAttribute("data-id"));
                this.viewNotificationDetails(notificationId);
            });
        });
    }
    
    viewNotificationDetails(notificationId) {
    const notification = this.notifications.find(
      (n) => n.id === notificationId
    );
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
    navigator.clipboard
      .writeText(notification.contact)
      .then(() => {
            alert(details);
      })
      .catch(() => {
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

    // Date Input Confirmation functionality
    setupDateInputConfirmation() {
    const freshUntilInput = document.getElementById("freshUntil");
        if (!freshUntilInput) return;

        const container = freshUntilInput.parentNode;
    const checkmarkIcon = container.querySelector(".checkmark-icon");

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
        checkmarkIcon.classList.remove("hidden");
            }
            
            // If value is cleared, reset everything
            if (!currentValue) {
        checkmarkIcon.classList.add("hidden");
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
        checkmarkIcon.classList.add("hidden");
                
                // Show success toast
        this.showToast("Date confirmed successfully!", "success");
                
                // Move focus to next input field if available
        const nextInput = freshUntilInput
          .closest(".form-group")
          .parentElement.nextElementSibling?.querySelector("input");
                if (nextInput) {
                    setTimeout(() => nextInput.focus(), 200);
                } else {
                    freshUntilInput.blur(); // Remove focus from current input
                }
            }
        };

        // Initially hide checkmark
    checkmarkIcon.classList.add("hidden");

        // Listen for date selection changes
    freshUntilInput.addEventListener("change", handleDateChange);
    freshUntilInput.addEventListener("input", handleDateChange);

        // Checkmark click handler - confirm the date and hide checkmark
    checkmarkIcon.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent event bubbling
            confirmDate();
        });

        // Click outside handler - hide checkmark when clicking outside
    document.addEventListener("click", (e) => {
            // Check if checkmark is currently visible
      if (!checkmarkIcon.classList.contains("hidden")) {
                // Check if click is outside the input container and not on the checkmark
                if (!container.contains(e.target)) {
                    // User clicked outside - confirm the date and hide checkmark
                    confirmDate();
                }
            }
        });

        // Also hide checkmark when input loses focus (blur event)
    freshUntilInput.addEventListener("blur", (e) => {
            // Small delay to allow checkmark click to register first
            setTimeout(() => {
        if (
          !checkmarkIcon.classList.contains("hidden") &&
          freshUntilInput.value
        ) {
                    confirmDate();
                }
            }, 100);
        });
    }

    // Time Input Confirmation functionality
    setupTimeInputConfirmation() {
    const pickupTimeInput = document.getElementById("pickupTime");
        if (!pickupTimeInput) return;

        const container = pickupTimeInput.parentNode;
    const checkmarkIcon = container.querySelector(".checkmark-icon-time");

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
        checkmarkIcon.classList.remove("hidden");
            }
            
            // If value is cleared, reset everything
            if (!currentValue) {
        checkmarkIcon.classList.add("hidden");
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
        checkmarkIcon.classList.add("hidden");
                
                // Show success toast
        this.showToast("Time confirmed successfully!", "success");
                
                // Move focus to next input field if available
        const nextInput = pickupTimeInput
          .closest(".form-group")
          .parentElement.nextElementSibling?.querySelector("input");
                if (nextInput) {
                    setTimeout(() => nextInput.focus(), 200);
                } else {
                    pickupTimeInput.blur(); // Remove focus from current input
                }
            }
        };

        // Initially hide checkmark
    checkmarkIcon.classList.add("hidden");

        // Listen for time selection changes
    pickupTimeInput.addEventListener("change", handleTimeChange);
    pickupTimeInput.addEventListener("input", handleTimeChange);

        // Checkmark click handler - confirm the time and hide checkmark
    checkmarkIcon.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent event bubbling
            confirmTime();
        });

        // Click outside handler - hide checkmark when clicking outside
    document.addEventListener("click", (e) => {
            // Check if checkmark is currently visible
      if (!checkmarkIcon.classList.contains("hidden")) {
                // Check if click is outside the input container and not on the checkmark
                if (!container.contains(e.target)) {
                    // User clicked outside - confirm the time and hide checkmark
                    confirmTime();
                }
            }
        });

        // Also hide checkmark when input loses focus (blur event)
    pickupTimeInput.addEventListener("blur", (e) => {
            // Small delay to allow checkmark click to register first
            setTimeout(() => {
        if (
          !checkmarkIcon.classList.contains("hidden") &&
          pickupTimeInput.value
        ) {
                    confirmTime();
                }
            }, 100);
        });
    }
}

// Additional CSS animations via JavaScript
function addDynamicStyles() {
  const style = document.createElement("style");
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
        
        .no-results-container {
            grid-column: 1 / -1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 4rem 2rem;
            text-align: center;
            background: var(--light-gray);
            border-radius: var(--border-radius);
            margin: 2rem 0;
            box-shadow: var(--shadow-light);
        }
        
        .no-results-icon {
            margin-bottom: 1.5rem;
        }
        
        .no-results-icon i {
            font-size: 4rem;
            color: var(--medium-gray);
            opacity: 0.7;
        }
        
        .no-results-content {
            max-width: 500px;
        }
        
        .no-results-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--dark-gray);
            margin-bottom: 0.5rem;
        }
        
        .no-results-message {
            font-size: 1rem;
            color: var(--medium-gray);
            margin-bottom: 2rem;
            line-height: 1.5;
        }
        
        .no-results-suggestions {
            margin-bottom: 2rem;
            text-align: left;
        }
        
        .no-results-suggestions h4 {
            font-size: 1rem;
            font-weight: 500;
            color: var(--dark-gray);
            margin-bottom: 1rem;
            text-align: center;
        }
        
        .suggestions-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .suggestions-list li {
            display: flex;
            align-items: center;
            padding: 0.5rem 0;
            color: var(--medium-gray);
            font-size: 0.9rem;
        }
        
        .suggestions-list li i {
            color: var(--primary-color);
            margin-right: 0.75rem;
            font-size: 0.8rem;
        }
        
        .no-results-action {
            margin-bottom: 1.5rem;
        }
        
        .no-results-action .btn-secondary {
            color: var(--success-color, #28a745) !important;
            border-color: var(--success-color, #28a745) !important;
        }
        
        .no-results-action .btn-secondary:hover {
            background-color: var(--success-color, #28a745) !important;
            color: white !important;
        }
        
        .no-results-stats {
            padding-top: 1rem;
            border-top: 1px solid var(--light-gray);
            color: var(--medium-gray);
            font-size: 0.85rem;
        }
        
        .no-results-stats i {
            margin-right: 0.5rem;
            color: var(--primary-color);
        }
        
        /* Dark mode styles */
        .dark .no-results-container {
            background: var(--dark-bg-secondary);
            border: 1px solid var(--dark-border);
        }
        
        .dark .no-results-title {
            color: var(--light-text);
        }
        
        .dark .no-results-message {
            color: var(--medium-gray);
        }
        
        .dark .no-results-suggestions h4 {
            color: var(--light-text);
        }
        
        .dark .no-results-stats {
            border-top-color: var(--dark-border);
            color: var(--medium-gray);
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
            .no-results-container {
                padding: 2rem 1rem;
                margin: 1rem 0;
            }
            
            .no-results-icon i {
                font-size: 3rem;
            }
            
            .no-results-title {
                font-size: 1.25rem;
            }
            
            .no-results-suggestions {
                text-align: center;
            }
            
            .suggestions-list {
                text-align: left;
            }
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
document.addEventListener("DOMContentLoaded", () => {
    addDynamicStyles();
  window.shareBiteApp = new ShareBiteFoodListing();
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
  if ("caches" in window) {
        const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    console.log("[ShareBite] All caches cleared");
    }
    if (navigator.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage("SKIP_WAITING");
    console.log("[ShareBite] Sent SKIP_WAITING to service worker");
    }
};
