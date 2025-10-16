// ShareBite Authentication System
// Handles user login state management, session persistence, and UI updates

class ShareBiteAuth {
    constructor() {
        this.currentUser = null;
        this.storageKey = 'sharebite_user';
        this.init();
    }

    init() {
        this.loadUserFromStorage();
        this.setupEventListeners();
    }

    // Load user data from localStorage on page load
    loadUserFromStorage() {
        const userData = localStorage.getItem(this.storageKey);
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.updateUIForLoggedInUser();
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
                this.logout(); // Clear invalid data
            }
        }
    }

    // Save user data to localStorage after successful login
    login(userData) {
        const userObj = {
            id: userData.id || Date.now(), // Generate ID if not provided
            name: userData.name,
            email: userData.email,
            type: userData.type || 'user', // 'user' or 'ngo'
            loginTime: new Date().toISOString()
        };

        this.currentUser = userObj;
        localStorage.setItem(this.storageKey, JSON.stringify(userObj));
        
        // Also store in the format expected by existing code
        localStorage.setItem('user', JSON.stringify(userObj));
        
        this.updateUIForLoggedInUser();
        return userObj;
    }

    // Clear user data and update UI
    logout() {
        this.currentUser = null;
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem('user'); // Remove the old format too
        this.updateUIForLoggedOutUser();
        
        // Show logout success message
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Logged Out Successfully',
                text: 'You have been logged out.',
                icon: 'success',
                confirmButtonColor: '#4CAF50',
                timer: 1500,
                showConfirmButton: false
            });
        }
        
        // Redirect to home page after logout
        setTimeout(() => {
            if (window.location.pathname !== '/index.html' && !window.location.pathname.endsWith('/')) {
                window.location.href = 'index.html';
            }
        }, 1500);
    }

    // Check if user is currently logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user data
    getCurrentUser() {
        return this.currentUser;
    }

    // Debug method to manually trigger UI update
    forceUIUpdate() {
        console.log('Force updating UI, current user:', this.currentUser);
        if (this.isLoggedIn()) {
            this.updateUIForLoggedInUser();
        } else {
            this.updateUIForLoggedOutUser();
        }
    }

    // Update navigation UI when user is logged in
    updateUIForLoggedInUser() {
        const userActionsContainer = document.querySelector('.user-actions');
        if (!userActionsContainer) {
            console.warn('User actions container not found');
            return;
        }

        // Find and remove existing login buttons
        const loginButtons = userActionsContainer.querySelectorAll('.login-btn');
        console.log('Removing', loginButtons.length, 'login buttons');
        loginButtons.forEach(btn => btn.remove());

        // Check if profile section already exists
        let profileSection = userActionsContainer.querySelector('.user-profile');
        
        if (!profileSection) {
            // Create profile section
            profileSection = document.createElement('div');
            profileSection.className = 'user-profile';
            
            // Create the dropdown structure
            const profileDropdown = document.createElement('div');
            profileDropdown.className = 'profile-dropdown';
            
            // Create the profile button
            const profileBtn = document.createElement('button');
            profileBtn.className = 'profile-btn';
            profileBtn.id = 'profileBtn';
            profileBtn.type = 'button';
            profileBtn.setAttribute('aria-expanded', 'false');
            profileBtn.setAttribute('aria-haspopup', 'true');
            
            // Create button content with proper structure
            const userIcon = document.createElement('i');
            userIcon.className = 'fas fa-user-circle';
            
            const userName = document.createElement('span');
            userName.className = 'user-name';
            userName.textContent = this.currentUser.name;
            
            const dropdownIcon = document.createElement('i');
            dropdownIcon.className = 'fas fa-chevron-down dropdown-icon';
            
            // Append elements to button
            profileBtn.appendChild(userIcon);
            profileBtn.appendChild(userName);
            profileBtn.appendChild(dropdownIcon);
            
            // Create the dropdown menu
            const profileMenu = document.createElement('div');
            profileMenu.className = 'profile-menu';
            profileMenu.id = 'profileMenu';
            profileMenu.innerHTML = `
                <div class="profile-header">
                    <div class="profile-info">
                        <strong>${this.currentUser.name}</strong>
                        <small>${this.currentUser.email}</small>
                        <span class="user-badge">${this.currentUser.type.toUpperCase()}</span>
                    </div>
                </div>
                <hr>
                <button class="profile-menu-item" id="logoutBtn" type="button">
                    <i class="fas fa-sign-out-alt"></i>
                    Logout
                </button>
            `;
            
            // Assemble the structure
            profileDropdown.appendChild(profileBtn);
            profileDropdown.appendChild(profileMenu);
            profileSection.appendChild(profileDropdown);
            
            // Insert before the hamburger menu
            const hamburger = userActionsContainer.querySelector('.hamburger');
            if (hamburger) {
                userActionsContainer.insertBefore(profileSection, hamburger);
            } else {
                userActionsContainer.appendChild(profileSection);
            }
        }

        // Setup profile dropdown functionality
        this.setupProfileDropdown();
    }

    // Update navigation UI when user is logged out
    updateUIForLoggedOutUser() {
        const userActionsContainer = document.querySelector('.user-actions');
        if (!userActionsContainer) return;

        // Remove profile section
        const profileSection = userActionsContainer.querySelector('.user-profile');
        if (profileSection) {
            profileSection.remove();
        }

        // Check if login buttons already exist
        const existingLoginBtns = userActionsContainer.querySelectorAll('.login-btn');
        if (existingLoginBtns.length === 0) {
            // Re-add login buttons
            const roleSwitch = userActionsContainer.querySelector('.role-switch');
            const loginButtonsHTML = `
                <button class="login-btn" onclick="window.location.href='login.html'">Login as User</button>
                <button class="login-btn" onclick="window.location.href='login_ngo.html'">Login as NGO</button>
            `;
            
            if (roleSwitch) {
                roleSwitch.insertAdjacentHTML('afterend', loginButtonsHTML);
            } else {
                const hamburger = userActionsContainer.querySelector('.hamburger');
                if (hamburger) {
                    hamburger.insertAdjacentHTML('beforebegin', loginButtonsHTML);
                } else {
                    userActionsContainer.insertAdjacentHTML('beforeend', loginButtonsHTML);
                }
            }
        }
    }

    // Setup profile dropdown toggle and click outside functionality
    setupProfileDropdown() {
        const profileBtn = document.getElementById('profileBtn');
        const profileMenu = document.getElementById('profileMenu');
        const profileDropdown = document.querySelector('.profile-dropdown');
        const logoutBtn = document.getElementById('logoutBtn');

        if (!profileBtn || !profileMenu || !logoutBtn) {
            console.warn('Profile dropdown elements not found');
            return;
        }

        // Toggle dropdown - multiple event listeners for better compatibility
        const toggleDropdown = (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            // Close any other open dropdowns first
            document.querySelectorAll('.profile-menu.show').forEach(menu => {
                if (menu !== profileMenu) {
                    menu.classList.remove('show');
                    const otherDropdown = menu.closest('.profile-dropdown');
                    if (otherDropdown) otherDropdown.classList.remove('show');
                }
            });
            
            // Toggle current dropdown
            const isShown = profileMenu.classList.contains('show');
            profileMenu.classList.toggle('show');
            if (profileDropdown) {
                profileDropdown.classList.toggle('show');
            }
            
            // Update aria attribute
            profileBtn.setAttribute('aria-expanded', !isShown);
            
            console.log('Profile dropdown', isShown ? 'closed' : 'opened');
        };
        
        profileBtn.addEventListener('click', toggleDropdown);
        profileBtn.addEventListener('touchend', toggleDropdown); // For mobile
        
        // Also add mousedown for immediate response
        profileBtn.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevent any focus issues
        });

        // Logout functionality
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Close dropdown first
            profileMenu.classList.remove('show');
            if (profileDropdown) {
                profileDropdown.classList.remove('show');
            }
            
            this.logout();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
                profileMenu.classList.remove('show');
                if (profileDropdown) {
                    profileDropdown.classList.remove('show');
                }
            }
        });

        // Close dropdown on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                profileMenu.classList.remove('show');
                if (profileDropdown) {
                    profileDropdown.classList.remove('show');
                }
            }
        });
    }

    // Setup general event listeners
    setupEventListeners() {
        // Listen for storage changes from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                if (e.newValue) {
                    try {
                        this.currentUser = JSON.parse(e.newValue);
                        this.updateUIForLoggedInUser();
                    } catch (error) {
                        console.error('Error parsing user data from storage event:', error);
                    }
                } else {
                    this.currentUser = null;
                    this.updateUIForLoggedOutUser();
                }
            }
        });
    }

    // Method for pages to check auth and redirect if needed
    requireAuth() {
        if (!this.isLoggedIn()) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Authentication Required',
                    text: 'Please log in to access this feature.',
                    icon: 'warning',
                    confirmButtonText: 'Go to Login',
                    confirmButtonColor: '#FF6B35'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = 'login.html';
                    }
                });
            } else {
                alert('Please log in to access this feature.');
                window.location.href = 'login.html';
            }
            return false;
        }
        return true;
    }
}

// Initialize authentication system (only if not already initialized)
if (typeof window.sharebiteAuth === 'undefined') {
    const sharebiteAuth = new ShareBiteAuth();
    
    // Make it globally available
    window.sharebiteAuth = sharebiteAuth;
    window.ShareBiteAuth = sharebiteAuth;
}

// Ensure DOM is ready before initializing UI
document.addEventListener('DOMContentLoaded', () => {
    if (window.sharebiteAuth) {
        // Force UI update in case the auth system loaded after DOM
        console.log('DOM loaded, updating auth UI');
        if (window.sharebiteAuth.isLoggedIn()) {
            console.log('User is logged in, showing profile');
            window.sharebiteAuth.updateUIForLoggedInUser();
        } else {
            console.log('User is not logged in, showing login buttons');
            window.sharebiteAuth.updateUIForLoggedOutUser();
        }
    }
});

// Also try to update UI after a short delay in case other scripts interfere
setTimeout(() => {
    if (window.sharebiteAuth) {
        if (window.sharebiteAuth.isLoggedIn()) {
            window.sharebiteAuth.updateUIForLoggedInUser();
        }
    }
}, 500);