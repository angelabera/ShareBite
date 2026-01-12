// Backend API base URL - update this when deploying
const API_BASE_URL = 'http://localhost:5000/api';

// Utility function to make API requests
async function apiRequest(endpoint, options = {}) {
  try {
    const token = localStorage.getItem('sharebite_token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'Request failed',
        errors: data.errors,
      };
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// User Registration (Volunteer)
async function registerUser(userData) {
  return apiRequest('/auth/register', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify(userData),
  });
}

// User Login (Volunteer)
async function loginUser(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify(credentials),
  });
}

// NGO Registration
async function registerNGO(ngoData) {
  return apiRequest('/ngo/register', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify(ngoData),
  });
}

// NGO Login
async function loginNGO(credentials) {
  return apiRequest('/ngo/login', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify(credentials),
  });
}

// Food Listing APIs
async function createFoodListing(listingData) {
  return apiRequest('/food', {
    method: 'POST',
    body: JSON.stringify(listingData),
  });
}

async function getAllFoodListings(filters = {}) {
  const queryParams = new URLSearchParams(filters).toString();
  return apiRequest(`/food${queryParams ? '?' + queryParams : ''}`, {
    method: 'GET',
    skipAuth: true,
  });
}

async function getFoodListingById(id) {
  return apiRequest(`/food/${id}`, {
    method: 'GET',
    skipAuth: true,
  });
}

async function updateFoodListing(id, updateData) {
  return apiRequest(`/food/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
}

async function deleteFoodListing(id) {
  return apiRequest(`/food/${id}`, {
    method: 'DELETE',
  });
}

async function claimFoodListing(id) {
  return apiRequest(`/food/${id}/claim`, {
    method: 'PUT',
  });
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    registerUser,
    loginUser,
    registerNGO,
    loginNGO,
    createFoodListing,
    getAllFoodListings,
    getFoodListingById,
    updateFoodListing,
    deleteFoodListing,
    claimFoodListing,
  };
}
