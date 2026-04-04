import { supabase } from './supabaseClient';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export interface Session {
  user: User;
  access_token: string;
}

// Simple auth functions with fallback
export const getSession = async (): Promise<Session | null> => {
  if (!supabase) {
    // Fallback to localStorage for demo
    const authData = localStorage.getItem('simple_auth');
    if (!authData) return null;
    
    const { user, expires } = JSON.parse(authData);
    if (expires && Date.now() > expires) {
      localStorage.removeItem('simple_auth');
      return null;
    }
    
    return {
      user,
      access_token: 'demo-token'
    };
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    if (!session) return null;
    
    return {
      user: {
        id: session.user.id,
        email: session.user.email || '',
        full_name: session.user.user_metadata?.full_name,
        avatar_url: session.user.user_metadata?.avatar_url
      },
      access_token: session.access_token
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

export const signInWithEmailAndPassword = async (email: string, password: string) => {
  if (!supabase) {
    // Fallback to simple auth
    const { simpleAuth } = await import('../auth-simple');
    return { user: await simpleAuth.login(email, password) };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { user: data.user };
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signUpWithEmailAndPassword = async (email: string, password: string, fullName: string) => {
  if (!supabase) {
    // Fallback to simple auth
    const { simpleAuth } = await import('../auth-simple');
    return await simpleAuth.register(email, fullName, 'freelancer');
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signOut = async () => {
  if (!supabase) {
    // Fallback to simple auth
    const { simpleAuth } = await import('../auth-simple');
    simpleAuth.logout();
    return;
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  if (!supabase) {
    throw new Error('Password reset not available in demo mode');
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};
