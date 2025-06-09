import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { BASE_API_URL } from '@env';
import { FirebaseAuth } from '@/FirebaseConfig';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    skipAuth?: boolean;
}

// For internal request handling
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    skipAuth?: boolean;
}

// Create an axios instance with default config
const apiClient = axios.create({
    baseURL: BASE_API_URL,
});

// Request interceptor to add auth token to all requests
apiClient.interceptors.request.use(
    async (config: CustomInternalAxiosRequestConfig) => {

        if (config.skipAuth) {
            return config;
        }
        // Only attach token if there's a current user
        if (FirebaseAuth.currentUser) {
            try {
                const token = await FirebaseAuth.currentUser.getIdToken(true);
                // console.log("token", token)
                config.headers.Authorization = `Bearer ${token}`;
            } catch (error) {
                console.error('Error getting Firebase token:', error);
            }
        }
        // console.log("Axios sending request to:", config.url, config.headers);
        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor to handle common error scenarios
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Handle token expiration (status code 401)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // Force refresh the token
                const token = await FirebaseAuth.currentUser?.getIdToken(true);
                if (token) {
                    // Update the auth header with new token
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    // Retry the original request
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

// Wrapper functions for API calls
export const api = {
    get: <T = any>(url: string, config?: CustomAxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return apiClient.get(url, config);
    },
    
    post: <T = any>(url: string, data?: any, config?: CustomAxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return apiClient.post(url, data, config);
    },
    
    put: <T = any>(url: string, data?: any, config?: CustomAxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return apiClient.put(url, data, config);
    },
    
    delete: <T = any>(url: string, config?: CustomAxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return apiClient.delete(url, config);
    }
};