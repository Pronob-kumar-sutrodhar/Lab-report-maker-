// This service handles communication with the backend API
// Ensure your backend is running on the URL specified below

const API_URL = 'http://localhost:3000/api/auth';

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  error?: string;
}

export const authService = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    try {
      // SIMULATION
      return new Promise((resolve) => {
        setTimeout(() => {
          if (data.email.includes('exists')) {
             resolve({ success: false, error: 'Email already exists' });
          } else {
             resolve({ 
               success: true, 
               // We don't return the full user yet because they aren't verified
               message: 'Verification email sent'
             });
          }
        }, 1500);
      });
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    }
  },

  verifyEmail: async (token: string): Promise<AuthResponse> => {
    try {
      /* UNCOMMENT FOR REAL BACKEND
      const response = await fetch(`${API_URL}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      return await response.json();
      */

      // SIMULATION
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simulate invalid token for testing
          if (token === 'invalid') {
            resolve({ success: false, error: 'This verification link is invalid or has expired.' });
          } else {
            resolve({ success: true, message: 'Email verified successfully!' });
          }
        }, 2000);
      });
    } catch (error) {
      return { success: false, error: 'Network error during verification' };
    }
  },

  resendVerification: async (email: string): Promise<AuthResponse> => {
    // SIMULATION
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'If an account exists, a new link has been sent.' });
      }, 1000);
    });
  }
};