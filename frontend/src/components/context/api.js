import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:8000/api/v1/";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});


api.interceptors.request.use((config) => {
        const token = localStorage.getItem('access_token');
        if (token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            try{
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                throw new Error('No refresh token');
                }
                
                const response = await axios.post(`${API_BASE_URL}auth/token/refresh/`, {
                refresh: refreshToken
                });
                
                const newAccessToken = response.data.access;
                localStorage.setItem('access_token', newAccessToken);
                
                // If refresh tokens rotate, update it too
                if (response.data.refresh) {
                localStorage.setItem('refresh_token', response.data.refresh);
                }
                
                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, clear tokens and redirect to login
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                
                // Dispatch custom event for logout
                window.dispatchEvent(new CustomEvent('auth:logout'));
                
                return Promise.reject(refreshError);
            }
        }
    }
)



// API method 
export const authAPI = {
    getUser: () => api.get('auth/users/me/'),
    login: (credentials) => api.post('auth/token/', credentials),
    refresh: (refreshToken) => api.post('auth/token/refresh/', { refresh: refreshToken })
}

export const applicationsAPI = {
    getUserApplications: () => api.get('applications/'),
    deleteUserApplication: (id) => api.delete(`applications/${id}/`),
    createUserApplication: (data) => api.post('applications/', data),
    updateUserApplication: (id,data) => api.put(`applications/${id}/`, data),
    
}

export const meetingsApi = {
    getUserMeetings: () => api.get('meetings/by_month/?year=2025&month=8'),
    addUserMeeting: (data) => api.post('meetings/', data),
}

export default api