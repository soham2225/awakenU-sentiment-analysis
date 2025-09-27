// API service for connecting to FastAPI backend
const API_BASE_URL = 'http://localhost:8000'; // Adjust if your backend runs on different port

class ApiService {
  async fetchWithErrorHandling(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Get dashboard summary data
  async getSummary() {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/api/summary`);
  }

  // Get feedback data with optional limit
  async getFeedback(limit = 200) {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/api/feedback?limit=${limit}`);
  }

  // Get alerts with optional filters
  async getAlerts(urgency = '', feedbackType = '') {
    const params = new URLSearchParams();
    if (urgency) params.append('urgency', urgency);
    if (feedbackType) params.append('feedback_type', feedbackType);
    
    const queryString = params.toString();
    const url = `${API_BASE_URL}/api/alerts${queryString ? `?${queryString}` : ''}`;
    
    return this.fetchWithErrorHandling(url);
  }

  // Health check
  async healthCheck() {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/health`);
  }
}

export default new ApiService();