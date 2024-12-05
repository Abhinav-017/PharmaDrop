import axios from 'axios';

// Create axios instance with default config
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add retry logic for failed requests
instance.interceptors.response.use(
  response => response,
  async error => {
    const { config, response: { status } } = error;
    
    if (status === 408 || status === 500) {
      // Retry the request up to 2 times
      config.__retryCount = config.__retryCount || 0;
      
      if (config.__retryCount < 2) {
        config.__retryCount += 1;
        return instance(config);
      }
    }
    return Promise.reject(error);
  }
);

// Transform response data
instance.interceptors.response.use(
  response => {
    // Extract data from response
    if (response.data) {
      return {
        ...response,
        data: Array.isArray(response.data) 
          ? response.data.map(item => ({
              ...item,
              price: parseFloat(item.price) // Ensure price is a number
            }))
          : {
              ...response.data,
              price: parseFloat(response.data.price) // Ensure price is a number
            }
      };
    }
    return response;
  }
);

export default instance;
