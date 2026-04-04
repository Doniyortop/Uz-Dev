// Simple Authentication System
// No Supabase dependency - just localStorage

export interface SimpleUser {
  id: string;
  email: string;
  fullName: string;
  role: 'freelancer' | 'client';
  avatar?: string;
  onboarded: boolean;
  bio?: string;
  rating?: number;
  is_online?: boolean;
  createdAt: string;
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
    fullName: 'Али Фрилансер',
    role: 'freelancer',
    onboarded: true,
    bio: 'Профессиональный веб-разработчик с 5-летним опытом',
    rating: 4.8,
    is_online: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'client@example.com',
    fullName: 'Боб Заказчик',
    role: 'client',
    onboarded: true,
    bio: 'Ищу надежных исполнителей для своих проектов',
    rating: 4.5,
    is_online: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    email: 'admin@example.com',
    fullName: 'Админ',
    role: 'freelancer',
    onboarded: true,
    bio: 'Администратор платформы',
    rating: 5.0,
    is_online: true,
    createdAt: new Date().toISOString()
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
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    
    // Save to localStorage
    const authData = {
      user,
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    
    localStorage.setItem('simple_auth', JSON.stringify(authData));
    localStorage.setItem('is_auth', 'true');
    localStorage.setItem('onboarded', 'true');
    
    return user;
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
      onboarded: false,
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage (in real app, save to database)
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
