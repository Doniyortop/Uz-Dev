import { supabase } from './supabaseClient';

export interface Review {
  id: string;
  service_id: string;
  client_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export const getReviewsByServiceId = async (serviceId: string): Promise<Review[]> => {
  if (!supabase) {
    // Fallback to mock data
    return [
      {
        id: '1',
        service_id: serviceId,
        client_id: '1',
        rating: 5,
        comment: 'Отличная работа!',
        created_at: new Date().toISOString()
      }
    ];
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles!reviews_client_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('service_id', serviceId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
};

export const createReview = async (review: Omit<Review, 'id' | 'created_at' | 'profiles'>): Promise<Review> => {
  if (!supabase) {
    throw new Error('Review creation not available in demo mode');
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select(`
        *,
        profiles!reviews_client_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const updateReview = async (id: string, updates: Partial<Review>): Promise<Review> => {
  if (!supabase) {
    throw new Error('Review update not available in demo mode');
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        profiles!reviews_client_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

export const deleteReview = async (id: string): Promise<void> => {
  if (!supabase) {
    throw new Error('Review deletion not available in demo mode');
  }

  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};
