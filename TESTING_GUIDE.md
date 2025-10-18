# ShareBite Testing Guide

## ✅ Backend Status
- **Server**: Running on http://localhost:5000
- **Database**: MongoDB Atlas connected
- **Status**: Ready for testing

## 🧪 Testing Steps

### 1. Verify Backend is Running

Open a new PowerShell terminal and run:
```powershell
cd C:\Users\dhruv\GitRepos\PR\ShareBite\backend
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ MongoDB connected
```

To test the API is responding:
```powershell
Invoke-RestMethod -Uri http://localhost:5000
```
Should return: "API is running"

### 2. Test User Registration

**Method 1: Using Browser**
1. Open `frontend/register.html` in your browser
2. Fill in the registration form:
   - Name: Test User
   - Email: testuser@example.com
   - Password: password123
3. Click "Register"
4. You should see a success message and be redirected

**Method 2: Using PowerShell**
```powershell
$body = @{
    name = "Test User"
    email = "testuser@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/auth/register -Method Post -Body $body -ContentType "application/json"
```

Expected Response:
```json
{
  "user": {
    "_id": "...",
    "name": "Test User",
    "email": "testuser@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Test User Login

**Method 1: Using Browser**
1. Open `frontend/login.html`
2. Enter credentials:
   - Email: testuser@example.com
   - Password: password123
3. Click "Login"
4. You should be redirected to the home page

**Method 2: Using PowerShell**
```powershell
$body = @{
    email = "testuser@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/auth/login -Method Post -Body $body -ContentType "application/json"
```

### 4. Test NGO Registration

**Using Browser:**
1. Open `frontend/ngo-register.html`
2. Make sure "NGO" toggle is selected
3. Fill in the form:
   - Organization Name: Test NGO
   - Email: testngo@example.com
   - Password: password123
   - Phone: 1234567890
   - Address: 123 Test Street
   - Nickname (optional): TestNGO
4. Click "Register"

**Using PowerShell:**
```powershell
$body = @{
    name = "Test NGO"
    email = "testngo@example.com"
    password = "password123"
    phone = "1234567890"
    address = "123 Test Street"
    nickname = "TestNGO"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/ngo/register -Method Post -Body $body -ContentType "application/json"
```

### 5. Test NGO Login

**Using Browser:**
1. Open `frontend/login_ngo.html`
2. Enter NGO credentials
3. Click "Login"

**Using PowerShell:**
```powershell
$body = @{
    email = "testngo@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/ngo/login -Method Post -Body $body -ContentType "application/json"
```

### 6. Test Food Listing Creation

First, login to get a token, then:

**Using PowerShell:**
```powershell
# Replace YOUR_TOKEN with the token from login response
$headers = @{
    Authorization = "Bearer YOUR_TOKEN"
}

$body = @{
    foodType = "Vegetarian"
    quantity = "10 servings"
    category = "Prepared Meals"
    description = "Fresh vegetarian meals"
    freshUntil = "2024-12-31T23:59:59.000Z"
    pickupTime = "2:00 PM - 4:00 PM"
    pickupLocation = "123 Main St, City"
    contactInfo = "contact@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/food -Method Post -Body $body -ContentType "application/json" -Headers $headers
```

### 7. Test Food Listing Retrieval

**Get All Listings (No auth required):**
```powershell
Invoke-RestMethod -Uri http://localhost:5000/api/food
```

**Get Single Listing:**
```powershell
# Replace LISTING_ID with actual ID
Invoke-RestMethod -Uri http://localhost:5000/api/food/LISTING_ID
```

### 8. Test Food Listing Update

```powershell
# Replace YOUR_TOKEN and LISTING_ID
$headers = @{
    Authorization = "Bearer YOUR_TOKEN"
}

$body = @{
    status = "reserved"
    quantity = "5 servings"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/food/LISTING_ID -Method Put -Body $body -ContentType "application/json" -Headers $headers
```

### 9. Test Food Listing Deletion

```powershell
# Replace YOUR_TOKEN and LISTING_ID
$headers = @{
    Authorization = "Bearer YOUR_TOKEN"
}

Invoke-RestMethod -Uri http://localhost:5000/api/food/LISTING_ID -Method Delete -Headers $headers
```

## 🔍 Troubleshooting

### Issue: "Cannot connect to server"
- **Solution**: Make sure the backend server is running
- Run: `cd backend && npm run dev`
- Wait for "Server running" message

### Issue: "MongoError: Authentication failed"
- **Solution**: Check `.env` file has correct MONGO_URI
- Verify MongoDB Atlas credentials

### Issue: "Token is not valid"
- **Solution**: Login again to get a fresh token
- Tokens expire after 7 days

### Issue: "CORS error in browser"
- **Solution**: CORS is already configured
- Make sure you're accessing via file:// protocol or use Live Server

### Issue: "Food listing page shows no data"
- **Known**: `foodlisting.js` still uses sample data
- **Fix needed**: Update `foodlisting.js` to call API (see INTEGRATION_GUIDE.md)

## 📝 Current Status

✅ **Fully Functional:**
- User registration and login
- NGO registration and login
- Food listing creation, retrieval, update, deletion via API
- JWT authentication and authorization
- Password hashing with bcrypt
- Token management in localStorage

⏳ **Needs Update:**
- `frontend/js/foodlisting.js` - Still uses sample data instead of API calls
- Photo upload functionality - Not yet implemented

## 🎯 Next Steps

1. **Test the authentication flows** using the browser
2. **Update foodlisting.js** to use the API (see example below)
3. **Test end-to-end** flow: Register → Login → Create Food Listing

### Example: Update foodlisting.js

Replace the sample data generation with:

```javascript
// At the top of foodlisting.js, after the imports
async function loadListingsFromAPI() {
    try {
        const listings = await getAllFoodListings();
        return listings;
    } catch (error) {
        console.error('Error loading listings:', error);
        Swal.fire({
            title: 'Error',
            text: 'Failed to load food listings',
            icon: 'error'
        });
        return [];
    }
}

// Replace generateSampleListings() call with:
loadListingsFromAPI().then(listings => {
    renderFoodListings(listings);
});

// Update form submission to call API:
async function handleFormSubmission(formData) {
    try {
        const newListing = await createFoodListing(formData);
        Swal.fire({
            title: 'Success!',
            text: 'Food listing created successfully',
            icon: 'success'
        });
        // Reload listings
        const listings = await loadListingsFromAPI();
        renderFoodListings(listings);
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error'
        });
    }
}
```

## 🚀 Quick Start for Testing

1. **Start backend:**
   ```powershell
   cd C:\Users\dhruv\GitRepos\PR\ShareBite\backend
   npm run dev
   ```

2. **Open frontend in browser:**
   - Right-click `frontend/register.html` → Open with → Browser
   - Or use VS Code Live Server extension

3. **Test the flow:**
   - Register a new user
   - Login with that user
   - Try to create a food listing (once foodlisting.js is updated)

That's it! Your ShareBite application is ready for testing. 🎉
