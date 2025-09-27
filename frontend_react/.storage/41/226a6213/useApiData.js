import { useState, useEffect } from 'react';
import ApiService from '../services/api';

// Custom hook for API data fetching with loading and error states
export const useApiData = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: () => fetchData() };
};

// Specific hooks for different API endpoints
export const useSummaryData = () => {
  return useApiData(() => ApiService.getSummary());
};

export const useFeedbackData = (limit = 200) => {
  return useApiData(() => ApiService.getFeedback(limit), [limit]);
};

export const useAlertsData = (urgency = '', feedbackType = '') => {
  return useApiData(() => ApiService.getAlerts(urgency, feedbackType), [urgency, feedbackType]);
};