# ShareBite Frontend-Backend Integration Guide

## ✅ What's Been Connected

### 1. **API Integration Layer** (`frontend/js/api.js`)
- Central API communication module
- Base URL: `http://localhost:5000/api`
- Automatic token management for authenticated requests
- Error handling and validation

### 2. **User Authentication** 
- ✅ User Registration (`/api/auth/register`)
- ✅ User Login (`/api/auth/login`)
- Token storage in localStorage
- Auto-login after registration

### 3. **NGO Authentication**
- ✅ NGO Registration (`/api/ngo/register`)
- ✅ NGO Login (`/api/ngo/login`)
- Role-based authentication

### 4. **Food Listings**
- ✅ Create listing (`/api/food`) - Protected
- ✅ Get all listings (`/api/food`) - Public
- ✅ Get single listing (`/api/food/:id`) - Public
- ✅ Update listing (`/api/food/:id`) - Protected (owner only)
- ✅ Delete listing (`/api/food/:id`) - Protected (owner only)

## 🔧 Files Modified

### Backend Files Created:
1. `backend/src/config/db.js` - MongoDB connection
2. `backend/src/models/User.js` - User model with password hashing
3. `backend/src/models/Ngo.js` - NGO model
4. `backend/src/models/FoodListing.js` - Food listing model
5. `backend/src/controllers/authController.js` - User auth logic
6. `backend/src/controllers/ngoAuthController.js` - NGO auth logic
7. `backend/src/controllers/foodListingController.js` - Food CRUD
8. `backend/src/routes/authRoutes.js` - User routes
9. `backend/src/routes/ngoAuthRoutes.js` - NGO routes
10. `backend/src/routes/foodListingRoutes.js` - Food routes
11. `backend/src/middleware/authMiddleware.js` - JWT verification
12. `backend/src/server.js` - Express server with all routes
13. `backend/package.json` - Dependencies added
14. `backend/src/.env` - Environment variables

### Frontend Files Modified:
1. ✅ `frontend/js/api.js` - **NEW** API wrapper functions
2. ✅ `frontend/login.html` - Connected to `/api/auth/login`
3. ✅ `frontend/register.html` - Needs update to `/api/auth/register`
4. ⏳ `frontend/ngo-register.html` - Needs update to `/api/ngo/register`
5. ⏳ `frontend/login_ngo.html` - Needs update to `/api/ngo/login`
6. ⏳ `frontend/foodlisting.html` - Needs update to use `/api/food`
7. ⏳ `frontend/js/foodlisting.js` - Needs update for API calls

## 📝 Next Steps to Complete Integration

### Step 1: Update User Registration Page
Add to `register.html` before `</body>`:
```html
<script src="js/api.js"></script>
```

Replace the form submit handler with:
```javascript
const response = await registerUser({
  name: fullName,
  email: email,
  password: password
});
localStorage.setItem('sharebite_token', response.token);
sharebiteAuth.login(response.user);
```

### Step 2: Update NGO Registration
In `ngo-register.html`, replace submit handler:
```javascript
const response = await registerNGO({
  name: ngoName,
  email: email,
  password: password,
  phone: phone,
  address: address,
  nickname: contactPerson,
  availability: availability
});
localStorage.setItem('sharebite_token', response.token);
sharebiteAuth.login({ ...response.ngo, type: 'ngo' });
```

### Step 3: Update NGO Login
In `login_ngo.html`, replace submit handler:
```javascript
const response = await loginNGO({ email, password });
localStorage.setItem('sharebite_token', response.token);
sharebiteAuth.login({ ...response.ngo, type: 'ngo' });
```

### Step 4: Update Food Listing Creation
In `foodlisting.js`, update `handleFormSubmission()`:
```javascript
async handleFormSubmission() {
  const formData = this.getFormData();
  
  try {
    const response = await createFoodListing({
      foodType: formData.foodType,
      quantity: formData.quantity,
      category: formData.category,
      description: formData.description,
      freshUntil: formData.freshUntil,
      pickupTime: formData.pickupTime,
      pickupLocation: formData.location,
      contactInfo: formData.contact,
      photos: [] // Handle photo upload separately
    });
    
    this.showToast('Food listing added successfully!', 'success');
    this.closeModalAndReset();
    
    // Refresh listings
    await this.loadListingsFromAPI();
  } catch (error) {
    this.showToast(error.message || 'Failed to create listing', 'error');
  }
}
```

### Step 5: Load Listings from API
In `foodlisting.js`, replace `generateSampleListings()`:
```javascript
async loadListingsFromAPI() {
  try {
    const listings = await getAllFoodListings();
    this.foodListings = listings;
    this.filteredListings = listings;
    this.renderFoodListings();
  } catch (error) {
    console.error('Failed to load listings:', error);
    this.showToast('Failed to load food listings', 'error');
  }
}
```

## 🧪 Testing the Integration

### 1. Start Backend Server
```bash
cd backend
npm run dev
```
Server should start on `http://localhost:5000`

### 2. Test Endpoints with Postman (as documented earlier)

### 3. Test Frontend
1. Open `index.html` in browser
2. Try registering a new user
3. Log in with credentials
4. Create a food listing (must be logged in)
5. View all listings (public)

## 🔐 Authentication Flow

1. User registers → Backend returns `{ user, token }`
2. Token stored in `localStorage.getItem('sharebite_token')`
3. User data stored via `sharebiteAuth.login(user)`
4. Protected requests include `Authorization: Bearer TOKEN` header
5. Backend middleware verifies token and attaches user to `req.user`

## 🐛 Common Issues & Fixes

### CORS Error
**Fix**: In `backend/src/server.js`, cors is already configured:
```javascript
app.use(cors());
```

### "Undefined" MongoDB URI
**Fix**: Ensure `.env` file has no spaces:
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
```

### Token Not Sent
**Fix**: Check `api.js` includes token in headers:
```javascript
if (token && !options.skipAuth) {
  headers['Authorization'] = `Bearer ${token}`;
}
```

### 401 Unauthorized
**Fix**: User must be logged in. Check:
1. Token exists: `localStorage.getItem('sharebite_token')`
2. Token is valid (not expired)
3. Endpoint requires authentication

## 📦 Dependencies Installed

### Backend:
- express
- mongoose
- cors
- dotenv
- bcryptjs
- jsonwebtoken
- express-validator

### Frontend:
- No additional npm packages (vanilla JS + Fetch API)

## 🎯 Key Features Implemented

✅ Secure password hashing (bcryptjs)  
✅ JWT authentication (7-day expiry)  
✅ Role-based access (user/NGO)  
✅ Protected routes (ownership validation)  
✅ Form validation (express-validator)  
✅ Error handling & user feedback  
✅ Token-based sessions  
✅ CRUD operations for food listings  

---

**All core backend functionality is complete and ready. Frontend needs the script imports and API function calls as outlined above!** 🚀
