const API_BASE = import.meta.env.VITE_API_BASE;

fetch(`${API_BASE}/summary`)
  .then(res => res.json())
  .then(data => console.log(data));
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
    return this.fetchWithErrorHandling(`${API_BASE}/summary`);
  }

  // Get feedback data with optional limit
  async getFeedback(limit = 200) {
    return this.fetchWithErrorHandling(`${API_BASE}/feedback?limit=${limit}`);
  }

  // Get alerts with optional filters
  async getAlerts(urgency = '', feedbackType = '') {
    const params = new URLSearchParams();
    if (urgency) params.append('urgency', urgency);
    if (feedbackType) params.append('feedback_type', feedbackType);
    
    const queryString = params.toString();
    const url = `${API_BASE}/alerts${queryString ? `?${queryString}` : ''}`;
    
    return this.fetchWithErrorHandling(url);
  }

  // Health check
  async healthCheck() {
    return this.fetchWithErrorHandling(`${API_BASE}/health`);
  }
}

export default new ApiService();
