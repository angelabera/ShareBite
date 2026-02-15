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


## 📸 UI Screenshots

### 🏠 Home Page
The landing page highlights ShareBite’s mission to reduce food waste and feed communities.

<img width="1900" height="922" alt="Screenshot 2026-01-28 220751" src="https://github.com/user-attachments/assets/f5c1184b-1fdf-4063-96ef-5fd7a43f9b68" />


---

### ⚙️ How It Works
A simple three-step flow explaining how donors and NGOs collaborate.


<img width="1891" height="911" alt="Screenshot 2026-01-28 220822" src="https://github.com/user-attachments/assets/bb1c1026-e814-4a37-a7da-0afd938a4da4" />

---

### 📋 Food Listings
Browse available food listings with category filters, search, and map view.


<img width="1901" height="918" alt="Screenshot 2026-01-28 220847" src="https://github.com/user-attachments/assets/c21caf7b-ec6f-44be-ae7e-70c72672cc1b" />


---

### 🗺️ Map View
Interactive map showing active food listings, donors, and NGOs by location.

<img width="1914" height="921" alt="Screenshot 2026-01-28 220905" src="https://github.com/user-attachments/assets/d62cac2d-dd82-4fa2-b7af-5e74735c7a84" />


---

### 🔐 User Login
Login screen for donors and general users with dark-mode support.


<img width="1916" height="919" alt="Screenshot 2026-01-28 220919" src="https://github.com/user-attachments/assets/7eb11901-48fe-44bf-8674-ba7d075430ff" />


---

### 🏢 NGO Login
Dedicated login interface for NGO partners to manage contributions.


<img width="1919" height="923" alt="Screenshot 2026-01-28 220943" src="https://github.com/user-attachments/assets/39a81917-9cdc-4d75-926b-b60c75571a66" />

---

### ❤️ Impact Gallery
Highlights real-world impact, volunteers, and community distribution moments.


<img width="1900" height="922" alt="Screenshot 2026-01-28 221006" src="https://github.com/user-attachments/assets/a463d334-8c8e-47ae-8c4b-2d1cd0abafa6" />

---

### ➕ Add Food Listing
Step-by-step modal for donors to add food details, pickup info, and photos.


<img width="1909" height="854" alt="Screenshot 2026-01-28 221130" src="https://github.com/user-attachments/assets/05c29fb2-ae85-4af0-a666-eae318c2591f" />


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

## 📂 Project Structure

frontend/  → Frontend UI (HTML, CSS, JavaScript)  
backend/   → Planned backend (not implemented yet)  
src/       → Shared utilities and assets  

## 📸 Screenshots
![Home Page](screenshots/home.png)



## 📄 License

This project is created for educational and demonstration purposes. Feel free to use and modify as needed.

---

**Made with ❤️ for fighting food waste and hunger**

*ShareBite - Making a difference, one meal at a time.*
