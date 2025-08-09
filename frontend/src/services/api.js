const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://test-backend-deploy-svk3.onrender.com';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  setToken(token) {
    localStorage.setItem('access_token', token);
  }

  removeToken() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle different response types
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          this.removeToken();
          window.location.href = '/login';
        }
        
        const errorMessage = typeof data === 'object' ? 
          (data.message || data.error || data.detail || 'API request failed') : 
          data || 'API request failed';
        throw new Error(errorMessage);
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials) {
    const response = await this.request('/api/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.access) {
      this.setToken(response.access);
      localStorage.setItem('refresh_token', response.refresh);
    }
    
    return response;
  }

  async registerStudent(userData) {
    const response = await this.request('/api/register/student/', {
      method: 'POST',
      body: JSON.stringify({
        ...userData,
        role: 'student'
      }),
    });
    
    if (response.access) {
      this.setToken(response.access);
      localStorage.setItem('refresh_token', response.refresh);
    }
    
    return response;
  }

  async registerProvider(userData) {
    const response = await this.request('/api/register/provider/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.access) {
      this.setToken(response.access);
      localStorage.setItem('refresh_token', response.refresh);
    }
    
    return response;
  }

  async logout() {
    this.removeToken();
  }

  // Room methods
  async getRooms(filters = {}) {
    const queryParams = new URLSearchParams();
    
    // Map frontend filters to backend parameters
    if (filters.price_min) queryParams.append('price_min', filters.price_min);
    if (filters.price_max) queryParams.append('price_max', filters.price_max);
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.hostel_name) queryParams.append('hostel_name', filters.hostel_name);
    if (filters.is_available !== undefined) queryParams.append('is_available', filters.is_available);
    if (filters.search) queryParams.append('search', filters.search);
    
    const queryString = queryParams.toString();
    return this.request(`/api/rooms/${queryString ? `?${queryString}` : ''}`);
  }

  async getRoomDetails(roomId) {
    return this.request(`/api/rooms/${roomId}/`);
  }

  async getFacilities() {
    return this.request('/api/facilities/');
  }

  // Booking methods
  async createBooking(bookingData) {
    return this.request('/api/bookings/', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getMyBookings() {
    return this.request('/api/bookings/my/');
  }

  async cancelBooking(bookingId) {
    return this.request(`/api/bookings/${bookingId}/cancel/`, {
      method: 'POST',
    });
  }

  async updateBookingStatus(bookingId, status) {
    return this.request(`/api/bookings/${bookingId}/status/`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  }

  // Payment methods
  async initiatePayment(paymentData) {
    return this.request('/api/payments/initiate/', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Provider methods (for future use)
  async getProviderDashboard() {
    return this.request('/api/dashboard/provider/summary/');
  }

  async getRevenue() {
    return this.request('/api/revenue/');
  }

  // Password reset methods
  async requestPasswordReset(email) {
    return this.request('/api/password-reset/request/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async confirmPasswordReset(token, password) {
    return this.request('/api/password-reset/confirm/', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  async verifyResetToken(token) {
    return this.request('/api/password-reset/verify/', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }
}

export default new ApiService();