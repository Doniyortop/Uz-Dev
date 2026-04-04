import { supabase } from './supabaseClient';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  telegram_username?: string;
  rating?: number;
  is_online?: boolean;
  role: 'freelancer' | 'client';
  onboarded?: boolean;
  created_at: string;
}

export const getProfileById = async (id: string): Promise<Profile | null> => {
  if (!supabase) {
    // Fallback to mock data
    return {
      id: id,
      email: 'demo@example.com',
      full_name: 'Demo User',
      avatar_url: undefined,
      bio: 'Demo bio',
      telegram_username: 'demo_user',
      rating: 5.0,
      is_online: true,
      role: 'freelancer',
      onboarded: true,
      created_at: new Date().toISOString()
    };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting profile by ID:', error);
    return null;
  }
};

export const getProfileByUsername = async (username: string): Promise<Profile | null> => {
  if (!supabase) {
    // Fallback to mock data
    return {
      id: '1',
      email: 'demo@example.com',
      full_name: 'Demo User',
      avatar_url: undefined,
      bio: 'Demo bio',
      telegram_username: username,
      rating: 5.0,
      is_online: true,
      role: 'freelancer',
      onboarded: true,
      created_at: new Date().toISOString()
    };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('telegram_username', username)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting profile by username:', error);
    return null;
  }
};

export const updateProfile = async (id: string, updates: Partial<Profile>): Promise<Profile> => {
  if (!supabase) {
    throw new Error('Profile update not available in demo mode');
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const createProfile = async (profile: Omit<Profile, 'id' | 'created_at'>): Promise<Profile> => {
  if (!supabase) {
    throw new Error('Profile creation not available in demo mode');
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
};

export const getFreelancers = async (filters?: {
  search?: string;
  rating?: number;
  online?: boolean;
}): Promise<Profile[]> => {
  if (!supabase) {
    // Fallback to mock data
    return [
      {
        id: '1',
        email: 'freelancer@example.com',
        full_name: 'John Doe',
        avatar_url: undefined,
        bio: 'Professional web developer',
        telegram_username: 'john_doe',
        rating: 5.0,
        is_online: true,
        role: 'freelancer',
        onboarded: true,
        created_at: new Date().toISOString()
      }
    ];
  }

  try {
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('role', 'freelancer');

    if (filters?.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`);
    }

    if (filters?.rating) {
      query = query.gte('rating', filters.rating);
    }

    if (filters?.online !== undefined) {
      query = query.eq('is_online', filters.online);
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting freelancers:', error);
    return [];
  }
};
