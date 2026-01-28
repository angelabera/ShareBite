# ShareBite - Food Waste Reducer 🍽️

A beautiful, responsive web platform connecting restaurants and households with NGOs and volunteers to reduce food waste while fighting hunger in communities.

---


## 🌟 Features

### Core Functionality
- **Dual User Roles**: Switch between Donor (restaurants/households) and Collector (NGOs/volunteers)
- **Food Listings**: Create detailed listings with photos, quantities, freshness, and pickup details
- **Real-time Filtering**: Filter by category (restaurant, household, bakery, event) and search by location/food type
- **Interactive Claims**: One-click food claiming with contact information
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile devices

### User Experience
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Loading States**: Beautiful loading overlay and smooth transitions
- **Interactive Elements**: Hover effects, button animations, and scroll-triggered animations
- **Form Validation**: Comprehensive validation for food listings
- **Toast Notifications**: Success/error messages with smooth animations
- **Statistics Counter**: Animated impact statistics in the hero section

### Technical Features
- **Pure HTML/CSS/JavaScript**: No external frameworks, lightweight and fast
- **CSS Grid & Flexbox**: Modern layout techniques for responsive design
- **CSS Custom Properties**: Consistent theming and easy customization
- **ES6+ JavaScript**: Modern JavaScript with classes and modules
- **Intersection Observer API**: Efficient scroll-based animations
- **Local Storage Ready**: Architecture supports data persistence
- **PWA Ready**: Service worker registration included

## 🚀 Getting Started

1. **Clone/Download** the project to your local machine
2. **Open** `index.html` in your web browser
3. **Explore** the platform:
   - Switch between Donor and Collector roles
   - Browse existing food listings
   - Add new food listings (when in Donor mode)
   - Filter and search for specific items
   - Claim food items (when in Collector mode)


 ## 📁 Program Structure
```
ShareBite/
├── backend/ # Backend API (if added)
├── frontend/ # Frontend codebase
│ ├── index.html # Main HTML entry
│ ├── styles/ # CSS files
│ └── scripts/ # JS functionality
├── .dockerignore
├── .env.example # Environment variable template
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── INTEGRATION_GUIDE.md
├── LICENSE.md
├── PULL_REQUEST_TEMPLATE.md
├── README.md
├── SECURITY.md
└── TESTING_GUIDE.md
```

## 📱 Device Compatibility

- **Desktop**: Full-featured experience with all animations
- **Tablet**: Optimized layout with touch-friendly interactions
- **Mobile**: Mobile-first responsive design with hamburger menu


## 🎯 Key Components

### Navigation
- Fixed header with role switcher
- Smooth scroll navigation
- Mobile hamburger menu
- Login/register buttons


## 🛠️ Customization

### Colors
Update CSS custom properties in `:root` to change the color scheme:
```css
:root {
    --primary-color: #4CAF50;
    --secondary-color: #FF6B35;
    --accent-color: #FFC107;
    /* ... */
}
```

### Content
- Modify `generateSampleListings()` in JavaScript to change sample data
- Update hero text and statistics in HTML
- Customize feature descriptions and about content

### Styling
- Responsive breakpoints are defined in CSS media queries
- Animation timing can be adjusted via CSS custom properties
- Component styles are modular and easy to modify

## 🌐 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Features Used**:
  - CSS Grid and Flexbox
  - CSS Custom Properties
  - ES6+ JavaScript
  - Intersection Observer API
  - CSS Animations and Transforms

## 📋 Future Enhancements

- **Backend Integration**: Connect to API for real data persistence
- **User Authentication**: Login/register functionality
- **Geolocation**: Distance-based food discovery
- **Push Notifications**: Real-time updates for new listings
- **Image Upload**: Real photo upload for food items
- **Rating System**: User reviews and ratings
- **Chat System**: In-app messaging between donors and collectors
- **Analytics Dashboard**: Impact tracking and statistics

## 🤝 Contributing

This is a showcase project demonstrating modern web development techniques. Feel free to:
- Fork and modify for your own use
- Suggest improvements
- Report bugs or issues
- Submit enhancement ideas

## 📄 License

This project is created for educational and demonstration purposes. Feel free to use and modify as needed.

---

**Made with ❤️ for fighting food waste and hunger**

*ShareBite - Making a difference, one meal at a time.*
