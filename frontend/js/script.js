// ===== FOOD SAFETY BACKEND INTEGRATION =====

// ===== MAIN UI FUNCTIONS =====

// Show donate food modal
function showDonateModal() {
    const modal = document.getElementById('addListingModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    
    // Update icon
    const icon = document.querySelector('#darkModeToggle i');
    if (icon) {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Show notifications
function showNotifications() {
    // Simple notification display
    Swal.fire({
        icon: 'info',
        title: 'Notifications',
        html: '<p>No new notifications</p>',
        confirmButtonColor: '#4CAF50'
    });
}

// Setup event listeners when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Donate Food button
    const donateBtn = document.getElementById('donateFood');
    if (donateBtn) {
        donateBtn.addEventListener('click', showDonateModal);
    }
    
    // Dark mode toggle
    const darkModeToggle = document.getElementById('themeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Notification bell
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', showNotifications);
    }
    
    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Load dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('#darkModeToggle i');
        if (icon) icon.className = 'fas fa-sun';
    }
});

// Food Safety Form Submission Handler
document.addEventListener('DOMContentLoaded', function() {
    const listingForm = document.getElementById('listingForm');
    
    if (listingForm) {
        listingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate food safety first
            if (!validateFoodSafety()) {
                return;
            }
            
            await submitFoodListing();
        });
    }
});

// Submit food listing with safety data to backend
async function submitFoodListing() {
    try {
        // Show loading
        Swal.fire({
            title: 'Creating Listing...',
            html: 'Please wait while we save your food listing',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Get food safety data
        const foodSafetyData = getFoodSafetyData();
        
        // Get other form data
        const formData = {
            foodType: document.getElementById('foodType').value,
            quantity: document.getElementById('quantity').value,
            category: document.getElementById('category').value,
            description: document.getElementById('description').value,
            location: document.getElementById('location').value,
            contact: document.getElementById('contact').value,
            freshUntil: document.getElementById('freshUntil').value,
            pickupTime: document.getElementById('pickupTime').value,
            
            // Add food safety data
            ...foodSafetyData,
            
            // Get dietary preferences
            dietary: Array.from(document.querySelectorAll('input[name="dietary"]:checked'))
                .map(cb => cb.value)
        };

        // Get auth token
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token || localStorage.getItem('token');

        if (!token) {
            throw new Error('Please login to create a listing');
        }

        // Send to backend
        const response = await fetch('http://localhost:5000/api/food', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create listing');
        }

        if (data.success) {
            await Swal.fire({
                icon: 'success',
                title: 'Listing Created!',
                html: `
                    <p>Your food donation has been listed successfully with all safety information.</p>
                    <div style="background: #f0f8ff; padding: 12px; border-radius: 8px; margin-top: 12px; text-align: left;">
                        <strong>Safety Info Included:</strong>
                        <ul style="margin: 8px 0; padding-left: 20px;">
                            <li>Prepared: ${new Date(formData.preparedDateTime).toLocaleString()}</li>
                            <li>Expires: ${new Date(formData.expiryDateTime).toLocaleString()}</li>
                            <li>Storage: ${formatStorageCondition(formData.storageCondition)}</li>
                            ${formData.allergens.length > 0 ? `<li>Allergens: ${formData.allergens.join(', ')}</li>` : '<li>No allergens</li>'}
                        </ul>
                    </div>
                `,
                confirmButtonColor: '#4CAF50'
            });
            
            // Reset form
            document.getElementById('listingForm').reset();
            document.getElementById('addListingModal').style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Reload listings
            await loadFoodListingsFromBackend();
        }

    } catch (error) {
        console.error('Error creating listing:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Failed to create food listing. Please try again.',
            confirmButtonColor: '#4CAF50'
        });
    }
}

// Load food listings from backend
async function loadFoodListingsFromBackend() {
    try {
        const response = await fetch('http://localhost:5000/api/food');
        const data = await response.json();

        if (data.success) {
            displayBackendListings(data.data);
        }
    } catch (error) {
        console.error('Error loading listings:', error);
    }
}

// Display listings from backend
function displayBackendListings(listings) {
    const foodGrid = document.getElementById('foodGrid');
    if (!foodGrid) return;

    if (listings.length === 0) {
        foodGrid.innerHTML = `
            <div class="no-listings">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--medium-gray); margin-bottom: 1rem;"></i>
                <h3>No listings found</h3>
                <p>Be the first to donate food!</p>
            </div>
        `;
        return;
    }

    foodGrid.innerHTML = listings.map(listing => createBackendFoodCard(listing)).join('');
    setupFoodCardInteractions();
}

// Create food card from backend data
function createBackendFoodCard(listing) {
    const timeAgo = getTimeAgo(new Date(listing.createdAt));
    const isClaimed = sharebitePage.claimedItems?.includes(listing._id);

    // Use photoUrl if available, otherwise use default
    const imageHTML = listing.photoUrl 
        ? `<img src="${listing.photoUrl}" alt="${listing.foodType}">` 
        : `<i class="fas fa-utensils"></i>`;

    // Format dietary tags
    let tagsHTML = '';
    if (listing.dietary && listing.dietary.length > 0) {
        tagsHTML = `<div class="food-tags">` +
            listing.dietary.map(tag => `<span class="tag tag-${tag}">${tag}</span>`).join('') +
        `</div>`;
    }

    // Format allergens
    let allergensHTML = '';
    if (listing.allergens && listing.allergens.length > 0) {
        allergensHTML = `
            <div class="food-allergens" style="background: #fff3cd; padding: 8px; border-radius: 6px; margin: 8px 0;">
                <i class="fas fa-exclamation-triangle" style="color: #ff9800;"></i>
                <small style="color: #856404; font-weight: 600;">
                    Allergens: ${listing.allergens.join(', ')}
                </small>
            </div>
        `;
    }

    return `
        <div class="food-card ${isClaimed ? 'claimed' : ''}" 
             data-id="${listing._id}">
            <div class="food-image">
                ${imageHTML}
                <div class="food-category">${capitalizeFirst(listing.category)}</div>
            </div>
            <div class="food-details">
                <h3 class="food-title">${listing.foodType}</h3>
                ${tagsHTML}
                <p class="food-description">${listing.description || 'No description provided'}</p>
                
                <!-- Food Safety Info -->
                <div class="food-safety-info" style="background: #e8f5e9; padding: 12px; border-radius: 8px; margin: 12px 0; border-left: 4px solid #4CAF50;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <i class="fas fa-shield-alt" style="color: #4CAF50;"></i>
                        <strong style="color: #2e7d32;">Food Safety Information</strong>
                    </div>
                    <div style="font-size: 13px; color: #555;">
                        <div style="margin: 4px 0;">
                            <i class="fas fa-clock" style="color: #ff9800; width: 16px;"></i>
                            <strong>Prepared:</strong> ${new Date(listing.preparedDateTime).toLocaleString()}
                        </div>
                        <div style="margin: 4px 0;">
                            <i class="fas fa-hourglass-end" style="color: #f44336; width: 16px;"></i>
                            <strong>Expires:</strong> ${new Date(listing.expiryDateTime).toLocaleString()}
                        </div>
                        <div style="margin: 4px 0;">
                            <i class="fas fa-temperature-low" style="color: #2196F3; width: 16px;"></i>
                            <strong>Storage:</strong> ${formatStorageCondition(listing.storageCondition)}
                        </div>
                    </div>
                </div>
                
                ${allergensHTML}
                
                <div class="food-meta">
                    <span class="quantity"><i class="fas fa-utensils"></i> ${listing.quantity}</span>
                    <span class="freshness"><i class="fas fa-clock"></i> ${calculateTimeRemaining(listing.expiryDateTime)}</span>
                </div>
                <div class="food-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${listing.location}</span>
                </div>
                <div class="food-meta" style="margin-bottom: 1rem;">
                    <span style="color: var(--medium-gray); font-size: 0.9rem;">
                        <i class="fas fa-user"></i> ${listing.donor || 'Anonymous'}
                    </span>
                    <span style="color: var(--medium-gray); font-size: 0.9rem;">
                        <i class="fas fa-clock"></i> ${timeAgo}
                    </span>
                </div>
                <div class="food-actions">
                    ${createClaimButtonForBackend(listing)}
                    <button class="contact-btn" data-contact="${listing.contact}">
                        <i class="fas fa-phone"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Helper function to create claim button for backend listings
function createClaimButtonForBackend(listing) {
    const isClaimed = sharebitePage.claimedItems?.includes(listing._id);
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (isClaimed) {
        return `
            <button class="claim-btn claimed" disabled>
                <i class="fas fa-check-circle"></i> Claimed
            </button>
        `;
    } else if (user) {
        return `
            <button class="claim-btn" data-id="${listing._id}">
                <i class="fas fa-hand-paper"></i> Claim Food
            </button>
        `;
    } else {
        return `
            <button class="claim-btn" style="opacity: 0.5; cursor: not-allowed;" disabled>
                <i class="fas fa-hand-paper"></i> Login to Claim
            </button>
        `;
    }
}

// Helper functions
function formatStorageCondition(condition) {
    const conditions = {
        'refrigerated': 'Refrigerated (0-4°C)',
        'frozen': 'Frozen (-18°C or below)',
        'room_temp': 'Room Temperature',
        'hot_holding': 'Hot Holding (above 60°C)'
    };
    return conditions[condition] || condition;
}

function calculateTimeRemaining(expiryDateTime) {
    const now = new Date();
    const expiry = new Date(expiryDateTime);
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) {
        return `${hours}h left`;
    } else {
        const days = Math.floor(hours / 24);
        return `${days}d left`;
    }
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getTimeAgo(date) {
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

// Auto-load backend listings on page load
if (document.getElementById('foodGrid')) {
    loadFoodListingsFromBackend();
}

// Hide loading overlay - multiple methods to ensure it works
function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
        loadingOverlay.style.visibility = 'hidden';
        loadingOverlay.style.opacity = '0';
    }
}

// Try immediately
hideLoadingOverlay();

// Try when DOM is ready
document.addEventListener('DOMContentLoaded', hideLoadingOverlay);

// Try when window loads
window.addEventListener('load', hideLoadingOverlay);

// Fallback - force hide after 1 second
setTimeout(hideLoadingOverlay, 1000);