import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse, ApiResponse } from '@/types/api';
import { login as loginApi, register as registerApi, getUserInfo } from '@/service/function';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log('AuthProvider initialized');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in
    const validateToken = async () => {
      console.log('Validating token...');
      const storedToken = localStorage.getItem('token');
      console.log('Stored token:', storedToken ? 'exists' : 'none');
      
      if (storedToken) {
        try {
          // Set the token for API calls
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          console.log('Token set in axios headers');
          
          // Get user info
          const response = await getUserInfo();
          console.log('User info response:', response);
          
          // Check if response is an ApiResponse or direct User object
          if (typeof response === 'object' && 'success' in response && 'data' in response) {
            // ApiResponse format
            const apiResponse = response as ApiResponse<User>;
            if (apiResponse.success && apiResponse.data) {
              console.log('Setting user from ApiResponse');
              setUser(apiResponse.data);
            } else {
              // Invalid response
              console.log('Invalid ApiResponse, clearing token');
              localStorage.removeItem('token');
              setToken(null);
            }
          } else {
            // Direct User object
            console.log('Setting user from direct User object');
            setUser(response as User);
          }
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    validateToken();
  }, []);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    console.log('handleLogin called with:', email);
    try {
      const response = await loginApi({ email, password });
      console.log('Login response:', response);
      
      // Check if response is a direct AuthResponse (has user and token properties)
      if ('user' in response && 'token' in response) {
        // Direct AuthResponse format
        const authData = response as AuthResponse;
        console.log('Setting user after login:', authData.user);
        setUser(authData.user);
        setToken(authData.token);
        localStorage.setItem('token', authData.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
        return true;
      }
      
      // Check if response is an ApiResponse (has success and data properties)
      if ('success' in response && 'data' in response) {
        // ApiResponse format
        const apiResponse = response as ApiResponse<AuthResponse>;
        if (apiResponse.success && apiResponse.data) {
          const authData = apiResponse.data;
          console.log('Setting user after login (using standard format):', authData.user);
          setUser(authData.user);
          setToken(authData.token);
          localStorage.setItem('token', authData.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleRegister = async (name: string, email: string, password: string): Promise<boolean> => {
    console.log('handleRegister called with:', name, email);
    try {
      const response = await registerApi({ name, email, password });
      console.log('Register response:', response);
      
      // Check if response is a direct AuthResponse (has user and token properties)
      if ('user' in response && 'token' in response) {
        // Direct AuthResponse format
        const authData = response as AuthResponse;
        console.log('Setting user after register:', authData.user);
        setUser(authData.user);
        setToken(authData.token);
        localStorage.setItem('token', authData.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
        return true;
      }
      
      // Check if response is an ApiResponse (has success and data properties)
      if ('success' in response && 'data' in response) {
        // ApiResponse format
        const apiResponse = response as ApiResponse<AuthResponse>;
        if (apiResponse.success && apiResponse.data) {
          const authData = apiResponse.data;
          console.log('Setting user after register (using standard format):', authData.user);
          setUser(authData.user);
          setToken(authData.token);
          localStorage.setItem('token', authData.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const contextValue = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
  
  console.log('AuthContext value:', { 
    user: user ? 'exists' : 'null', 
    token: token ? 'exists' : 'null',
    isAuthenticated: !!user,
    isLoading
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth was called outside of AuthProvider!');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 