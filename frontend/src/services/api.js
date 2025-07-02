import axios from 'axios';

const API_BASE_URL = 'http://localhost:5003';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Student endpoints
  getStudents: () => api.get('/api/students'),
  
  // Course endpoints
  getCourses: () => api.get('/api/courses'),
  
  // Enhanced AI endpoints with rich context
  getAIRecommendation: (studentId, contextData) => {
    const payload = {
      student_id: studentId,
      context: typeof contextData === 'string' ? contextData : contextData.context,
      current_plan: contextData.current_plan || {}
    };
    
    return api.post('/api/ai/recommend', payload);
  },
  
  analyzeImpact: (studentId, action, courseCode, currentPlan = {}) =>
    api.post('/api/ai/analyze-impact', { 
      student_id: studentId, 
      action, 
      course_code: courseCode,
      current_plan: currentPlan
    }),

  // Health check
  healthCheck: () => api.get('/health'),
};

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    
    // Handle specific AI-related errors
    if (error.response?.status === 503) {
      console.warn('AI service temporarily unavailable');
    }
    
    return Promise.reject(error);
  }
);

export default api;