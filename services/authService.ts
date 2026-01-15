import apiService from './apiService';

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    user: User;
}

export interface User {
    id: number;
    username: string;
    email: string;
    public_key?: string;
    created_at: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    public_key?: string;
    private_key_encrypted?: string;
}

class AuthService {
    async register(data: RegisterData): Promise<{ user: User; message: string }> {
        return apiService.post('/api/auth/register', data);
    }

    async login(username: string, password: string): Promise<LoginResponse> {
        const response = await apiService.post<LoginResponse>('/api/auth/login', {
            username,
            password,
        });

        // Store token and user in localStorage
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.user));

        return response;
    }

    async logout(): Promise<void> {
        try {
            await apiService.post('/api/auth/logout', {});
        } finally {
            // Clear local storage regardless of API response
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            sessionStorage.removeItem('securelink_auth');
            sessionStorage.removeItem('securelink_user');
        }
    }

    async verify(): Promise<{ user: User }> {
        return apiService.get('/api/auth/verify');
    }

    async generateKeypair(): Promise<{ private_key: string; public_key: string }> {
        return apiService.get('/api/auth/keypair');
    }

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('access_token');
    }
}

export const authService = new AuthService();
export default authService;
