import axios from 'axios';

// Create Axios instances for different APIs
const weatherApi = axios.create({
    baseURL: import.meta.env.VITE_OPENWEATHER_BASEURL,
});

const geoApi = axios.create({
    baseURL: import.meta.env.VITE_OPENWEATHER_GEO_API,
});

const unsplashApi = axios.create({
    baseURL: 'https://api.unsplash.com',
});

// Add request interceptors
const addRequestInterceptors = (instance: any) => {
    instance.interceptors.request.use(
        (config) => {
            // Add any headers or configurations here
            if (instance === unsplashApi) { // Check if the instance is unsplashApi
                config.headers['Authorization'] = `Bearer ${import.meta.env.VITE_UNSPLASH_API}`;
            }
            return config;
        },
        (error) => {
            // Handle request error
            return Promise.reject(error);
        }
    );
};

// Add response interceptors
const addResponseInterceptors = (instance: any) => {
    instance.interceptors.response.use(
        (response) => {
            // Handle successful response
            return response.data; // Return only the data
        },
        (error) => {
            // Handle response error
            console.error('API Error:', error);
            return Promise.reject(error);
        }
    );
};

// Apply interceptors to each instance
addRequestInterceptors(weatherApi);
addResponseInterceptors(weatherApi);

addRequestInterceptors(geoApi);
addResponseInterceptors(geoApi);

addRequestInterceptors(unsplashApi);
addResponseInterceptors(unsplashApi);

// Export the instances
export { weatherApi, geoApi, unsplashApi }; 