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

Thanks to all the amazing contributors who have helped build and improve ShareBite. 💙

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/angelabera">
        <img src="https://github.com/angelabera.png" width="100px;" alt="USERNAME" /><br />
        <sub><b>Angela Bera</b></sub>
      </a>
    </td>
    <td align="center">
    <a href="https://github.com/VadluriThrisha">
      <img src="https://github.com/VadluriThrisha.png" width="100px;" alt="VadluriThrisha" /><br />
      <sub><b>Vadluri Thrisha</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/sarasinha1207">
      <img src="https://github.com/sarasinha1207.png" width="100px;" alt="sarasinha1207" /><br />
      <sub><b>Sara Sinha</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/theboringguy07">
      <img src="https://github.com/theboringguy07.png" width="100px;" alt="theboringguy07" /><br />
      <sub><b>Dhruv Ingale</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Gowthamimudam">
      <img src="https://github.com/Gowthamimudam.png" width="100px;" alt="Gowthamimudam" /><br />
      <sub><b>Gowthami Mudam</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/gyanshankar1708">
      <img src="https://github.com/gyanshankar1708.png" width="100px;" alt="gyanshankar1708" /><br />
      <sub><b>Gyanshankar Singh</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Tamjid17">
      <img src="https://github.com/Tamjid17.png" width="100px;" alt="Tamjid17" /><br />
      <sub><b>Towhidul Islam Tamjid</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/MethukuVinoothna">
      <img src="https://github.com/MethukuVinoothna.png" width="100px;" alt="MethukuVinoothna" /><br />
      <sub><b>Methuku Vinoothna</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Debashis-codes">
      <img src="https://github.com/Debashis-codes.png" width="100px;" alt="Debashis-codes" /><br />
      <sub><b>Debashis Kar</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/HifzaanDev">
      <img src="https://github.com/HifzaanDev.png" width="100px;" alt="HifzaanDev" /><br />
      <sub><b>Hifzaan</b></sub>
    </a>
  </td>
  </tr>
  <tr>
  <td align="center">
    <a href="https://github.com/Tusshh">
      <img src="https://github.com/Tusshh.png" width="100px;" alt="Tusshh" /><br />
      <sub><b>Tushar Kumar</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/pratyushjha06">
      <img src="https://github.com/pratyushjha06.png" width="100px;" alt="pratyushjha06" /><br />
      <sub><b>Pratyush Jha</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/TheSabari07">
      <img src="https://github.com/TheSabari07.png" width="100px;" alt="TheSabari07" /><br />
      <sub><b>Sabari07</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Nitya-003">
      <img src="https://github.com/Nitya-003.png" width="100px;" alt="Nitya-003" /><br />
      <sub><b>Nitya Gosain</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Kadam-Atharva">
      <img src="https://github.com/Kadam-Atharva.png" width="100px;" alt="Kadam-Atharva" /><br />
      <sub><b>Atharva Kadam</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/magic-peach">
      <img src="https://github.com/magic-peach.png" width="100px;" alt="magic-peach" /><br />
      <sub><b>Akanksha Trehun</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/sidk3">
      <img src="https://github.com/sidk3.png" width="100px;" alt="sidk3" /><br />
      <sub><b>Sidk3</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Dipanjana25">
      <img src="https://github.com/Dipanjana25.png" width="100px;" alt="Dipanjana25" /><br />
      <sub><b>Dipanjana Dasgupta</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/abhishree-k">
      <img src="https://github.com/abhishree-k.png" width="100px;" alt="abhishree-k" /><br />
      <sub><b>Abhishree</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/samarth5106">
      <img src="https://github.com/samarth5106.png" width="100px;" alt="samarth5106" /><br />
      <sub><b>Samarth Manish Rathod</b></sub>
    </a>
  </td>
  </tr>
  <tr>
  <td align="center">
    <a href="https://github.com/XYZChazan">
      <img src="https://github.com/XYZChazan.png" width="100px;" alt="XYZChazan" /><br />
      <sub><b>Vitor C Oliveira</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/roshankumar0036singh">
      <img src="https://github.com/roshankumar0036singh.png" width="100px;" alt="roshankumar0036singh" /><br />
      <sub><b>Roshan Kumar Singh</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/k4rth1k-h3gd3">
      <img src="https://github.com/k4rth1k-h3gd3.png" width="100px;" alt="k4rth1k-h3gd3" /><br />
      <sub><b>Karthik Hegde</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/aryanguptacsvtu">
      <img src="https://github.com/aryanguptacsvtu.png" width="100px;" alt="aryanguptacsvtu" /><br />
      <sub><b>Aryan Gupta</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/rimmon1234">
      <img src="https://github.com/rimmon1234.png" width="100px;" alt="rimmon1234" /><br />
      <sub><b>Rimmon Bhowmick</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/SRUTHIAGARWAL">
      <img src="https://github.com/SRUTHIAGARWAL.png" width="100px;" alt="SRUTHIAGARWAL" /><br />
      <sub><b>Sruthi Agarwal</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/habybheart1">
      <img src="https://github.com/habybheart1.png" width="100px;" alt="habybheart1" /><br />
      <sub><b>Habybheart1</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/DhruvJohri">
      <img src="https://github.com/DhruvJohri.png" width="100px;" alt="DhruvJohri" /><br />
      <sub><b>Dhruv Johri</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Sougata2006">
      <img src="https://github.com/Sougata2006.png" width="100px;" alt="Sougata2006" /><br />
      <sub><b>Sougata Paul</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Atharvverma1234">
      <img src="https://github.com/Atharvverma1234.png" width="100px;" alt="Atharvverma1234" /><br />
      <sub><b>Atharv Verma</b></sub>
    </a>
  </td>
</tr>
<tr>
  <td align="center">
    <a href="https://github.com/offsideDebugger">
      <img src="https://github.com/offsideDebugger.png" width="100px;" alt="offsideDebugger" /><br />
      <sub><b>Dakshh Thakurwani</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Yash-Atkari">
      <img src="https://github.com/Yash-Atkari.png" width="100px;" alt="Yash-Atkari" /><br />
      <sub><b>Yash Vikas Atkari</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/petetiharshitha">
      <img src="https://github.com/petetiharshitha.png" width="100px;" alt="petetiharshitha" /><br />
      <sub><b>Peteti Harshitha</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/kad-link">
      <img src="https://github.com/kad-link.png" width="100px;" alt="kad-link" /><br />
      <sub><b>Sri Charan Chittineni</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/themanjeetkr">
      <img src="https://github.com/themanjeetkr.png" width="100px;" alt="themanjeetkr" /><br />
      <sub><b>Manjeet Kumar</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Shubham-Rajpoot">
      <img src="https://github.com/Shubham-Rajpoot.png" width="100px;" alt="Shubham-Rajpoot" /><br />
      <sub><b>Shubham Rajpoot</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/caffeine-rohit">
      <img src="https://github.com/caffeine-rohit.png" width="100px;" alt="caffeine-rohit" /><br />
      <sub><b>Rohit Sharma</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/animeshmanna1976">
      <img src="https://github.com/animeshmanna1976.png" width="100px;" alt="animeshmanna1976" /><br />
      <sub><b>Animesh Manna</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/tarunkumar1504">
      <img src="https://github.com/tarunkumar1504.png" width="100px;" alt="tarunkumar1504" /><br />
      <sub><b>Tarun Kumar</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/rajanna-adhikary">
      <img src="https://github.com/rajanna-adhikary.png" width="100px;" alt="tarunkumar1504" /><br />
      <sub><b>Rajanna Adhikary</b></sub>
    </a>
  </td>
</tr>
<tr>
  <td align="center">
    <a href="https://github.com/Sunidhi037">
      <img src="https://github.com/Sunidhi037.png" width="100px;" alt="Sunidhi037" /><br />
      <sub><b>Sunidhi Singh</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Aditya-githubbb">
      <img src="https://github.com/Aditya-githubbb.png" width="100px;" alt="Aditya-githubbb" /><br />
      <sub><b>Aditya Verma</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Eshita-Badhe">
      <img src="https://github.com/Eshita-Badhe.png" width="100px;" alt="Eshita-Badhe" /><br />
      <sub><b>Eshita Badhe</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/rishima17">
      <img src="https://github.com/rishima17.png" width="100px;" alt="rishima17" /><br />
      <sub><b>Rishima</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Facelessism">
      <img src="https://github.com/Facelessism.png" width="100px;" alt="Facelessism" /><br />
      <sub><b>Lost_Fanatic</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Laikokwui">
      <img src="https://github.com/Laikokwui.png" width="100px;" alt="Laikokwui" /><br />
      <sub><b>Lai Kok Wui</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Udit-H">
      <img src="https://github.com/Udit-H.png" width="100px;" alt="Udit-H" /><br />
      <sub><b>Udit H</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/saurabhk9919">
      <img src="https://github.com/saurabhk9919.png" width="100px;" alt="saurabhk9919" /><br />
      <sub><b>Saurabh Kashyap</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Dipanita45">
      <img src="https://github.com/Dipanita45.png" width="100px;" alt="Dipanita45" /><br />
      <sub><b>Dipanita Mondal</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Piyush667-gif">
      <img src="https://github.com/Piyush667-gif.png" width="100px;" alt="Piyush667-gif" /><br />
      <sub><b>Piyush Pandey</b></sub>
    </a>
  </td>
</tr>
<tr>
  <td align="center">
    <a href="https://github.com/anandshukla15">
      <img src="https://github.com/anandshukla15.png" width="100px;" alt="anandshukla15" /><br />
      <sub><b>Anand Kumar Shukla</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Amangp">
      <img src="https://github.com/Amangp.png" width="100px;" alt="Amangp" /><br />
      <sub><b>Aman Gupta</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/tarun-tkp">
      <img src="https://github.com/tarun-tkp.png" width="100px;" alt="tarun-tkp" /><br />
      <sub><b>Tarun Kumar Pathak</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Vivan-1045">
      <img src="https://github.com/Vivan-1045.png" width="100px;" alt="Vivan-1045" /><br />
      <sub><b>Vivek</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Tanyasharma71">
      <img src="https://github.com/Tanyasharma71.png" width="100px;" alt="Tanyasharma71" /><br />
      <sub><b>Taniya Sharma</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Saatvik-GT">
      <img src="https://github.com/Saatvik-GT.png" width="100px;" alt="Saatvik-GT" /><br />
      <sub><b>Saatvik Sawarn</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/kayode96-max">
      <img src="https://github.com/kayode96-max.png" width="100px;" alt="kayode96-max" /><br />
      <sub><b>Usman Abdullahi Olukayode</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/rahulparihar-30">
      <img src="https://github.com/rahulparihar-30.png" width="100px;" alt="rahulparihar-30" /><br />
      <sub><b>Rahul Parihar</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/GitWizzz">
      <img src="https://github.com/GitWizzz.png" width="100px;" alt="GitWizzz" /><br />
      <sub><b>Shivam Kumar</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/EppaHarsha">
      <img src="https://github.com/EppaHarsha.png" width="100px;" alt="EppaHarsha" /><br />
      <sub><b>Eppa Harsha</b></sub>
    </a>
  </td>
</tr>
<tr>
  <td align="center">
    <a href="https://github.com/AyushGupta011">
      <img src="https://github.com/AyushGupta011.png" width="100px;" alt="AyushGupta011" /><br />
      <sub><b>Ayush Gupta</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Nsanjayboruds">
      <img src="https://github.com/Nsanjayboruds.png" width="100px;" alt="Nsanjayboruds" /><br />
      <sub><b>Nishant Sanjay Borude</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/samvit-srivastava">
      <img src="https://github.com/samvit-srivastava.png" width="100px;" alt="samvit-srivastava" /><br />
      <sub><b>Samvit Srivastava</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/saloni222444">
      <img src="https://github.com/saloni222444.png" width="100px;" alt="saloni222444" /><br />
      <sub><b>Saloni</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/FaridaSabrin">
      <img src="https://github.com/FaridaSabrin.png" width="100px;" alt="FaridaSabrin" /><br />
      <sub><b>Farida Sabrin</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/n0mmm">
      <img src="https://github.com/n0mmm.png" width="100px;" alt="n0mmm" /><br />
      <sub><b>Norm</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/tangyrine">
      <img src="https://github.com/tangyrine.png" width="100px;" alt="tangyrine" /><br />
      <sub><b>Tanisha Kharbe</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/amankumarsahani">
      <img src="https://github.com/amankumarsahani.png" width="100px;" alt="amankumarsahani" /><br />
      <sub><b>Aman Kumar Sahani</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/diyapratheep">
      <img src="https://github.com/diyapratheep.png" width="100px;" alt="diyapratheep" /><br />
      <sub><b>Diya</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/StephanosNikitis">
      <img src="https://github.com/StephanosNikitis.png" width="100px;" alt="StephanosNikitis" /><br />
      <sub><b>Stephanos Nikitis</b></sub>
    </a>
  </td>
</tr>
<tr>
  <td align="center">
    <a href="https://github.com/Vishwasverma1234">
      <img src="https://github.com/Vishwasverma1234.png" width="100px;" alt="Vishwasverma1234" /><br />
      <sub><b>Vishwas Verma</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/ankitadhara28">
      <img src="https://github.com/ankitadhara28.png" width="100px;" alt="ankitadhara28" /><br />
      <sub><b>Ankita Dhara</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/LakshitaAgg15">
      <img src="https://github.com/LakshitaAgg15.png" width="100px;" alt="LakshitaAgg15" /><br />
      <sub><b>Lakshita Aggarwal</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/nowsheen19jahan">
      <img src="https://github.com/nowsheen19jahan.png" width="100px;" alt="nowsheen19jahan" /><br />
      <sub><b>Nowsheen Jahan</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Kri01ceram">
      <img src="https://github.com/Kri01ceram.png" width="100px;" alt="Kri01ceram" /><br />
      <sub><b>Krishna Singh</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/universe-sm">
      <img src="https://github.com/universe-sm.png" width="100px;" alt="universe-sm" /><br />
      <sub><b>Universe-SM</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/nikhil-vermaa">
      <img src="https://github.com/nikhil-vermaa.png" width="100px;" alt="nikhil-vermaa" /><br />
      <sub><b>Nikhil Kumar Verma</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/PSUNAND">
      <img src="https://github.com/PSUNAND.png" width="100px;" alt="PSUNAND" /><br />
      <sub><b>PSUNAND</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/deepshikhatutorials">
      <img src="https://github.com/deepshikhatutorials.png" width="100px;" alt="deepshikhatutorials" /><br />
      <sub><b>Deepshikha Singh</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Ragini-Roy7">
      <img src="https://github.com/Ragini-Roy7.png" width="100px;" alt="Ragini-Roy7" /><br />
      <sub><b>Ragini Roy</b></sub>
    </a>
  </td>
</tr>
</table>

<br><b>Want to see your name here? If you merge a pull request then automatically you will become a contributor. 💫</b>

## 📄 License

This project is created for educational and demonstration purposes. Feel free to use and modify as needed.

---

**Made with ❤️ for fighting food waste and hunger**

*ShareBite - Making a difference, one meal at a time.*
