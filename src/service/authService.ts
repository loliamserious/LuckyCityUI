interface UserCreate {
  email: string;
  password: string;
  username: string;
}

interface UserLogin {
  email: string;
  password: string;
}

interface UserResponse {
  id: number;
  email: string;
  username: string;
}

interface Token {
  access_token: string;
  token_type: string;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Common fetch options for all requests
const fetchOptions = {
  mode: 'cors' as RequestMode,
  credentials: 'include' as RequestCredentials,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': 'http://localhost:3000',
  },
};

export const authService = {
  // Register new user
  async register(userData: UserCreate): Promise<UserResponse> {
    const response = await fetch(`${API_URL}/users/`, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
  },

  // Login user
  async login(credentials: UserLogin): Promise<Token> {
    const response = await fetch(`${API_URL}/users/login`, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    return response.json();
  },

  // Get current user
  async getCurrentUser(token: string): Promise<UserResponse> {
    const response = await fetch(`${API_URL}/users/me`, {
      ...fetchOptions,
      headers: {
        ...fetchOptions.headers,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch user profile');
    }

    return response.json();
  },

  // Request password reset (forgot password)
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/users/forgot-password`, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to request password reset');
    }

    return response.json();
  },

  // Reset password with token
  async resetPasswordWithToken(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/users/reset-password-with-token`, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify({
        token,
        new_password: newPassword,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to reset password with token');
    }

    return response.json();
  }
};