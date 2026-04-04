// Simple Authentication System
// No Supabase dependency - just localStorage

export interface SimpleUser {
  id: string;
  email: string;
  fullName: string;
  role: 'freelancer' | 'client';
  onboarded: boolean;
  is_online: boolean;
  rating: number;
  bio?: string;
}

export interface SimpleAuthState {
  user: SimpleUser | null;
  isAuthenticated: boolean;
}

// Mock users for demo
const MOCK_USERS: SimpleUser[] = [
  {
    id: '1',
    email: 'freelancer@example.com',
    fullName: 'John Doe',
    role: 'freelancer',
    onboarded: true,
    is_online: true,
    rating: 5.0,
    bio: 'Professional web developer with 5+ years of experience'
  },
  {
    id: '2',
    email: 'client@example.com',
    fullName: 'Jane Smith',
    role: 'client',
    onboarded: true,
    is_online: true,
    rating: 4.8,
    bio: 'Looking for talented developers for my projects'
  },
  {
    id: '3',
    email: 'admin@example.com',
    fullName: 'Admin User',
    role: 'freelancer',
    onboarded: true,
    is_online: true,
    rating: 5.0,
    bio: 'Platform administrator'
  }
];

export const simpleAuth = {
  // Get current user from localStorage
  getCurrentUser(): SimpleUser | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const authData = localStorage.getItem('simple_auth');
      if (!authData) return null;
      
      const { user, expires } = JSON.parse(authData);
      if (expires && Date.now() > expires) {
        this.logout();
        return null;
      }
      
      return user;
    } catch {
      return null;
    }
  },

  // Login with email/password
  async login(email: string, password: string): Promise<SimpleUser> {
    // Simple validation - accept any password for demo users
    // Check if user exists
    const existingUser = MOCK_USERS.find(u => u.email === email);
    if (existingUser) {
      return existingUser;
    }
  
    // If user doesn't exist in mock data, check localStorage for newly registered users
    const storedUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const registeredUser = storedUsers.find((u: any) => u.email === email);
  
    if (registeredUser && registeredUser.password === password) {
      const user = {
        id: registeredUser.id,
        email: registeredUser.email,
        fullName: registeredUser.fullName,
        role: registeredUser.role,
        onboarded: true,
        is_online: true,
        rating: 5.0,
        bio: registeredUser.bio || ''
      };
      
      localStorage.setItem('simple_auth', JSON.stringify({
        user,
        expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      }));
      
      return user;
    }
  
    throw new Error('Invalid email or password');
  },

  // Register new user
  async register(email: string, fullName: string, role: 'freelancer' | 'client'): Promise<SimpleUser> {
    // Check if user exists
    const existingUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      throw new Error('Пользователь уже существует');
    }
    
    // Create new user
    const newUser: SimpleUser = {
      id: Date.now().toString(),
      email,
      fullName,
      role,
      onboarded: true,
      is_online: true,
      rating: 5.0,
      bio: ''
    };
    
    // Save to localStorage
    const storedUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    storedUsers.push({
      ...newUser,
      password: 'registered' // We'll store this as a placeholder
    });
    localStorage.setItem('registered_users', JSON.stringify(storedUsers));
    
    const authData = {
      user: newUser,
      expires: Date.now() + (24 * 60 * 60 * 1000)
    };
    
    localStorage.setItem('simple_auth', JSON.stringify(authData));
    localStorage.setItem('is_auth', 'true');
    localStorage.setItem('onboarded', 'false');
    
    return newUser;
  },

  // Logout
  logout(): void {
    localStorage.removeItem('simple_auth');
    localStorage.removeItem('is_auth');
    localStorage.removeItem('onboarded');
  },

  // Check if authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },

  // Get demo users for testing
  getDemoUsers(): SimpleUser[] {
    return MOCK_USERS;
  }
};
