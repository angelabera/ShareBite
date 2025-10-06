// ShareBite 
// Complete working version with 28+ diverse food listings

class ShareBite {
  constructor() {
    this.currentRole = 'donor';
    this.foodListings = [];
    this.filteredListings = [];
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.init();
  }

  // Initialize theme, data, listeners, and UI
  init() {
    this.initTheme();
    this.generateSampleListings();
    this.filteredListings = [...this.foodListings];
    this.setupEventListeners();
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
      if (icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      }
    } else {
      root.classList.remove('dark');
      const icon = document.querySelector('#themeToggle i');
      if (icon) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
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

  // ENHANCED Sample Listings - 28 diverse food items for Hacktoberfest
  generateSampleListings() {
    const sampleListings = [
      // Original 6 listings (preserved exactly)
      {
        id: 1,
        foodType: 'Fresh Pizza Margherita',
        quantity: '8 slices',
        category: 'restaurant',
        description: 'Freshly made pizza with mozzarella, tomato sauce, and basil. Perfect condition, just from lunch service.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '18:00',
        location: 'Mario\'s Pizzeria, 123 Main Street',
        contact: '+1 (234) 567-8900',
        createdAt: new Date(Date.now() - 3600000),
        donor: 'Mario\'s Pizzeria'
      },
      {
        id: 2,
        foodType: 'Assorted Sandwiches',
        quantity: '15 sandwiches',
        category: 'event',
        description: 'Various sandwiches including turkey, ham, and vegetarian options from corporate catering event.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '16:30',
        location: 'Downtown Conference Center',
        contact: 'events@conference.com',
        createdAt: new Date(Date.now() - 7200000),
        donor: 'Conference Center'
      },
      {
        id: 3,
        foodType: 'Fresh Bread & Pastries',
        quantity: '20 items',
        category: 'bakery',
        description: 'End-of-day fresh bread, croissants, and pastries. All baked today and still perfectly fresh.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '20:00',
        location: 'Sunrise Bakery, Oak Avenue',
        contact: '+1 (234) 567-8901',
        createdAt: new Date(Date.now() - 1800000),
        donor: 'Sunrise Bakery'
      },
      {
        id: 4,
        foodType: 'Home-cooked Curry',
        quantity: '4-6 portions',
        category: 'household',
        description: 'Vegetarian curry with rice, made too much for family dinner. Spice level: medium.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '19:00',
        location: 'Residential Area, Pine Street',
        contact: '+1 (234) 567-8902',
        createdAt: new Date(Date.now() - 900000),
        donor: 'Local Family'
      },
      {
        id: 5,
        foodType: 'Fruit & Vegetable Box',
        quantity: '1 large box',
        category: 'restaurant',
        description: 'Fresh produce includes apples, oranges, carrots, and lettuce.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '17:00',
        location: 'Green Garden Restaurant',
        contact: '+1 (234) 567-8903',
        createdAt: new Date(Date.now() - 5400000),
        donor: 'Green Garden Restaurant'
      },
      {
        id: 6,
        foodType: 'Grilled Chicken Meals',
        quantity: '12 complete meals',
        category: 'restaurant',
        description: 'Grilled chicken with rice and vegetables. Prepared for cancelled catering order.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '18:30',
        location: 'Healthy Eats Cafe, Market Square',
        contact: '+1 (234) 567-8904',
        createdAt: new Date(Date.now() - 2700000),
        donor: 'Healthy Eats Cafe'
      },

      // NEW DIVERSE LISTINGS (22 more for Hacktoberfest enhancement)
      
      // Italian Cuisine
      {
        id: 7,
        foodType: 'Homemade Chicken Lasagna',
        quantity: '8 generous portions',
        category: 'restaurant',
        description: 'Layered pasta with ricotta, mozzarella, marinara sauce, and seasoned chicken. Made fresh this morning.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '18:00',
        location: 'Bella Vista Italian Kitchen, Downtown',
        contact: '+1 (555) 123-4567',
        createdAt: new Date(Date.now() - 2100000),
        donor: 'Bella Vista Restaurant'
      },
      {
        id: 8,
        foodType: 'Mushroom Risotto',
        quantity: '10 portions',
        category: 'restaurant',
        description: 'Creamy arborio rice with wild mushrooms, parmesan, and white wine. Vegetarian-friendly.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '19:30',
        location: 'Amore Trattoria, Little Italy',
        contact: '+1 (555) 234-5678',
        createdAt: new Date(Date.now() - 3600000),
        donor: 'Amore Trattoria'
      },

      // Indian Cuisine
      {
        id: 9,
        foodType: 'Chicken Biryani',
        quantity: '15 portions',
        category: 'restaurant',
        description: 'Fragrant basmati rice with spiced chicken, saffron, caramelized onions. Authentic Hyderabadi style.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '20:00',
        location: 'Spice Garden Indian Cuisine, East Side',
        contact: '+1 (555) 345-6789',
        createdAt: new Date(Date.now() - 1800000),
        donor: 'Spice Garden Restaurant'
      },
      {
        id: 10,
        foodType: 'Vegetable Samosas & Chutneys',
        quantity: '30 samosas + 4 chutneys',
        category: 'restaurant',
        description: 'Crispy pastries filled with spiced potatoes and peas, served with mint and tamarind chutneys.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '17:30',
        location: 'Taj Palace Indian Restaurant, Midtown',
        contact: '+1 (555) 456-7890',
        createdAt: new Date(Date.now() - 4500000),
        donor: 'Taj Palace'
      },

      // Chinese Cuisine
      {
        id: 11,
        foodType: 'Vegetable Chow Mein',
        quantity: '12 portions',
        category: 'restaurant',
        description: 'Stir-fried egg noodles with fresh vegetables, bean sprouts, and savory soy-based sauce.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '18:45',
        location: 'Golden Dragon Chinese Restaurant, Chinatown',
        contact: '+1 (555) 567-8901',
        createdAt: new Date(Date.now() - 2700000),
        donor: 'Golden Dragon'
      },
      {
        id: 12,
        foodType: 'Pork Dumplings (Pot Stickers)',
        quantity: '50 dumplings',
        category: 'restaurant',
        description: 'Handmade dumplings with seasoned pork filling. Can be steamed, boiled, or pan-fried.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '19:15',
        location: 'Dynasty Dim Sum House, University District',
        contact: '+1 (555) 678-9012',
        createdAt: new Date(Date.now() - 3300000),
        donor: 'Dynasty Dim Sum'
      },

      // Mexican Cuisine
      {
        id: 13,
        foodType: 'Beef Enchiladas with Sides',
        quantity: '20 enchiladas + rice & beans',
        category: 'event',
        description: 'Corn tortillas filled with seasoned ground beef, topped with red sauce and cheese. Includes Spanish rice and black beans.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '16:45',
        location: 'Corporate Event Center, Business District',
        contact: 'catering@eventscorp.com',
        createdAt: new Date(Date.now() - 1200000),
        donor: 'Event Catering Services'
      },
      {
        id: 14,
        foodType: 'Chicken Tacos & Guacamole',
        quantity: '25 tacos + sides',
        category: 'restaurant',
        description: 'Grilled chicken tacos with fresh salsa, guacamole, sour cream, and lime wedges.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '20:30',
        location: 'El Azteca Mexican Grill, South Bay',
        contact: '+1 (555) 789-0123',
        createdAt: new Date(Date.now() - 4800000),
        donor: 'El Azteca Grill'
      },

      // Mediterranean & Middle Eastern
      {
        id: 15,
        foodType: 'Mediterranean Mezze Platter',
        quantity: '12 servings',
        category: 'restaurant',
        description: 'Hummus, tabbouleh, falafel, pita bread, olives, stuffed grape leaves, and grilled vegetables.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '19:00',
        location: 'Olive Branch Mediterranean Cafe, Arts District',
        contact: '+1 (555) 890-1234',
        createdAt: new Date(Date.now() - 2400000),
        donor: 'Olive Branch Cafe'
      },
      {
        id: 16,
        foodType: 'Lamb Shawarma Wraps',
        quantity: '18 wraps',
        category: 'restaurant',
        description: 'Tender lamb shawarma in pita with tahini sauce, tomatoes, onions, and lettuce.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '18:15',
        location: 'Cedar Lebanese Kitchen, Harbor View',
        contact: '+1 (555) 901-2345',
        createdAt: new Date(Date.now() - 3900000),
        donor: 'Cedar Lebanese Kitchen'
      },

      // Asian Fusion & Sushi
      {
        id: 17,
        foodType: 'Sushi & Sashimi Platters',
        quantity: '8 large platters (80+ pieces)',
        category: 'event',
        description: 'Assorted fresh sushi rolls, sashimi, California rolls, and Philadelphia rolls from wedding reception.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '21:00',
        location: 'Grand Ballroom, Harbor View Hotel',
        contact: 'events@harborview.com',
        createdAt: new Date(Date.now() - 4200000),
        donor: 'Harbor View Events'
      },
      {
        id: 18,
        foodType: 'Thai Green Curry with Jasmine Rice',
        quantity: '14 portions',
        category: 'restaurant',
        description: 'Aromatic green curry with chicken, Thai basil, bamboo shoots, and coconut milk. Medium spice level.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '19:45',
        location: 'Bangkok Garden Thai Restaurant, College Town',
        contact: '+1 (555) 012-3456',
        createdAt: new Date(Date.now() - 1500000),
        donor: 'Bangkok Garden'
      },

      // American Comfort Food
      {
        id: 19,
        foodType: 'BBQ Pulled Pork Sandwiches',
        quantity: '20 sandwiches + coleslaw',
        category: 'restaurant',
        description: 'Slow-cooked pulled pork with BBQ sauce, served on brioche buns with homemade coleslaw.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '17:45',
        location: 'Smoky Joe\'s BBQ Pit, Industrial District',
        contact: '+1 (555) 123-7890',
        createdAt: new Date(Date.now() - 3000000),
        donor: 'Smoky Joe\'s BBQ'
      },
      {
        id: 20,
        foodType: 'Mac & Cheese with Garlic Bread',
        quantity: '16 portions',
        category: 'restaurant',
        description: 'Creamy four-cheese macaroni with crispy breadcrumb topping, served with buttery garlic bread.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '18:30',
        location: 'Comfort Kitchen, Family District',
        contact: '+1 (555) 234-8901',
        createdAt: new Date(Date.now() - 2100000),
        donor: 'Comfort Kitchen'
      },

      // Bakery Specialties
      {
        id: 21,
        foodType: 'Artisan Sourdough Loaves',
        quantity: '15 loaves',
        category: 'bakery',
        description: 'Fresh-baked sourdough with crispy crust and tangy flavor. Perfect for sandwiches or toast.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '20:00',
        location: 'Morning Glory Artisan Bakery, Historic District',
        contact: '+1 (555) 345-9012',
        createdAt: new Date(Date.now() - 4800000),
        donor: 'Morning Glory Bakery'
      },
      {
        id: 22,
        foodType: 'Assorted French Pastries',
        quantity: '35 pastries',
        category: 'bakery',
        description: 'Croissants, pain au chocolat, eclairs, and fruit tarts. All made fresh this morning.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '19:30',
        location: 'Le Petit Cafe Patisserie, University Area',
        contact: '+1 (555) 456-0123',
        createdAt: new Date(Date.now() - 5400000),
        donor: 'Le Petit Cafe'
      },
      {
        id: 23,
        foodType: 'Birthday Cake & Cupcakes',
        quantity: '1 large cake + 24 cupcakes',
        category: 'bakery',
        description: 'Chocolate birthday cake (serves 12) and vanilla cupcakes with buttercream frosting. Party was cancelled.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '16:00',
        location: 'Sweet Dreams Custom Cakes, Shopping Plaza',
        contact: '+1 (555) 567-1234',
        createdAt: new Date(Date.now() - 1800000),
        donor: 'Sweet Dreams Bakery'
      },

      // Household Contributions
      {
        id: 24,
        foodType: 'Thanksgiving Feast Leftovers',
        quantity: '12-15 portions',
        category: 'household',
        description: 'Roasted turkey, stuffing, mashed potatoes, green bean casserole, cranberry sauce, and pumpkin pie.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '18:00',
        location: 'Suburban Family Home, Riverside Drive',
        contact: '+1 (555) 678-2345',
        createdAt: new Date(Date.now() - 3600000),
        donor: 'Johnson Family'
      },
      {
        id: 25,
        foodType: 'Vegetarian Chili & Cornbread',
        quantity: '8 portions chili + 12 muffins',
        category: 'household',
        description: 'Hearty three-bean chili with bell peppers and corn, plus homemade cornbread muffins.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '19:30',
        location: 'Eco-Friendly Home, Green Valley Subdivision',
        contact: '+1 (555) 789-3456',
        createdAt: new Date(Date.now() - 2700000),
        donor: 'Green Family'
      },
      {
        id: 26,
        foodType: 'Homemade Shepherd\'s Pie',
        quantity: '10 generous portions',
        category: 'household',
        description: 'Traditional recipe with ground lamb, mixed vegetables, and creamy mashed potato topping.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '17:30',
        location: 'Traditional Home, Oak Park Neighborhood',
        contact: '+1 (555) 890-4567',
        createdAt: new Date(Date.now() - 4200000),
        donor: 'Thompson Family'
      },

      // Additional Event Surplus
      {
        id: 27,
        foodType: 'Corporate Lunch Surplus',
        quantity: 'Food for 40 people',
        category: 'event',
        description: 'Sandwich platters, garden salads, fruit trays, cookies, and beverages from executive meeting.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '15:30',
        location: 'Tech Innovation Campus, Silicon Valley',
        contact: 'facilities@techcorp.com',
        createdAt: new Date(Date.now() - 900000),
        donor: 'TechCorp Facilities'
      },

      // Healthy & Vegan Options
      {
        id: 28,
        foodType: 'Quinoa Buddha Bowls',
        quantity: '14 bowls',
        category: 'restaurant',
        description: 'Nutritious bowls with quinoa, roasted vegetables, chickpeas, avocado, and tahini dressing.',
        freshUntil: this.getRandomFutureDate(),
        pickupTime: '18:45',
        location: 'Green Goddess Health Cafe, Wellness District',
        contact: '+1 (555) 901-5678',
        createdAt: new Date(Date.now() - 2400000),
        donor: 'Green Goddess Cafe'
      }
    ];

    this.foodListings = sampleListings;
    this.filteredListings = [...sampleListings];
  }

  getRandomFutureDate() {
    const now = new Date();
    const hours = Math.floor(Math.random() * 48) + 2; // 2 to 50 hours from now
    const futureDate = new Date(now.getTime() + hours * 60 * 60 * 1000);
    return futureDate.toISOString().slice(0, 16);
  }

  renderFoodListings() {
    const foodGrid = document.getElementById('foodGrid');
    
    if (!foodGrid) {
      console.error('foodGrid element not found!');
      return;
    }

    if (this.filteredListings.length === 0) {
      foodGrid.innerHTML = `
        <div class="no-listings">
          <i class="fas fa-search" style="font-size: 3rem; color: var(--medium-gray, #666); margin-bottom: 1rem;"></i>
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
          ${listing.photo 
            ? `<img src="${URL.createObjectURL(listing.photo)}" alt="${listing.foodType}">` 
            : `<i class="fas fa-${this.getFoodIcon(listing.category)}"></i>`
          }
          <div class="food-category">${this.capitalizeFirst(listing.category)}</div>
        </div>
        
        <div class="food-details">
          <h3 class="food-title">${listing.foodType}</h3>
          <p class="food-description">${listing.description}</p>
          
          <div class="food-meta">
            <span class="quantity"><i class="fas fa-utensils"></i> ${listing.quantity}</span>
            <span class="freshness"><i class="fas fa-clock"></i> ${freshUntil}</span>
          </div>
        </div>
        
        <div class="food-location">
          <i class="fas fa-map-marker-alt"></i>
          <span>${listing.location}</span>
        </div>
        
        <div class="food-meta" style="margin-bottom: 1rem;">
          <span style="color: var(--medium-gray, #666); font-size: 0.9rem;">
            <i class="fas fa-user"></i> ${listing.donor}
          </span>
          <span style="color: var(--medium-gray, #666); font-size: 0.9rem;">
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
    const confirmed = confirm(`Claim "${listing.foodType}" from ${listing.donor}?\n\n${listing.location}\n${this.formatTime(listing.pickupTime)}\n\n${listing.contact}`);
    
    if (confirmed) {
      // Remove listing from available items
      this.foodListings = this.foodListings.filter(l => l.id !== listingId);
      this.filterListings();
      this.renderFoodListings();

      // Show success message
      this.showToast(`Successfully claimed ${listing.foodType}! Check your email for pickup details.`, 'success');

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
      'restaurant': 'store',
      'household': 'home',
      'bakery': 'bread-slice',
      'event': 'calendar-alt'
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
      background: ${type === 'success' ? '#4CAF50' : '#f44336'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      z-index: 3000;
      animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  }

  // Additional methods for full functionality
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

    if (roleSwitch && currentRoleSpan) {
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
  }

  updateUIForRole() {
    const donateBtn = document.getElementById('donateFood');
    const findBtn = document.getElementById('findFood');
    const addListingBtn = document.getElementById('addListingBtn');

    if (this.currentRole === 'collector') {
      if (donateBtn) donateBtn.innerHTML = '<i class="fas fa-search"></i> Find Food';
      if (findBtn) findBtn.innerHTML = '<i class="fas fa-heart"></i> Help Others';
      if (addListingBtn) addListingBtn.style.display = 'none';
    } else {
      if (donateBtn) donateBtn.innerHTML = '<i class="fas fa-heart"></i> Donate Food';
      if (findBtn) findBtn.innerHTML = '<i class="fas fa-search"></i> Find Food';
      if (addListingBtn) addListingBtn.style.display = 'flex';
    }
  }

  setupModal() {
    // Modal functionality (simplified)
    const modal = document.getElementById('addListingModal');
    const addListingBtn = document.getElementById('addListingBtn');
    const closeModalBtn = document.querySelector('.close-modal');

    if (addListingBtn && modal) {
      addListingBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
      });
    }

    if (closeModalBtn && modal) {
      closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
          document.body.style.overflow = 'auto';
        }
      });
    }
  }

  setupFormHandling() {
    // Basic form handling (can be expanded)
  }

  setupSmoothScrolling() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
          featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
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

  setupHeroButtons() {
    const donateBtn = document.getElementById('donateFood');
    const findBtn = document.getElementById('findFood');

    if (donateBtn) {
      donateBtn.addEventListener('click', () => {
        if (this.currentRole === 'donor') {
          const modal = document.getElementById('addListingModal');
          if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
          }
        } else {
          const listingsSection = document.getElementById('listings');
          if (listingsSection) {
            listingsSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }

    if (findBtn) {
      findBtn.addEventListener('click', () => {
        const listingsSection = document.getElementById('listings');
        if (listingsSection) {
          listingsSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
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
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.style.background = 'rgba(255, 255, 255, 0.98)';
          navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
          navbar.style.background = 'rgba(255, 255, 255, 0.95)';
          navbar.style.boxShadow = 'none';
        }
      }
    });
  }

  startAnimations() {
    // Add stagger animation to feature cards
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
      }, 1500); // Show loading for 1.5 seconds
    }
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
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @keyframes fadeOut {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.8); }
    }

    .no-listings {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem 2rem;
      color: #666;
    }

    .no-listings h3 {
      margin-bottom: 0.5rem;
      color: #333;
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
  window.shareApp = new ShareBite();
  console.log('ShareBite initialized with', window.shareApp.foodListings.length, 'food listings');
});

// Export for testing
if (typeof window !== 'undefined') {
  window.ShareBite = ShareBite;
}