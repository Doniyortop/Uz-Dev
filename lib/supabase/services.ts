import { supabase } from './supabaseClient';
import { Service } from '@/types';

export const getServices = async (filters?: {
  category?: string;
  priceRange?: [number, number];
  search?: string;
  tags?: string[];
}): Promise<Service[]> => {
  if (!supabase) {
    // Fallback to mock data
    return [
      {
        id: '1',
        title_ru: 'Веб-разработка',
        title_uz: 'Web dasturlash',
        description_ru: 'Создание современных веб-сайтов',
        description_uz: 'Zamonaviy veb-saytlarni yaratish',
        price: 100,
        freelancer_id: '1',
        category_id: 'web-development',
        tags: ['react', 'nodejs'],
        is_active: true
      }
    ];
  }

  try {
    let query = supabase
      .from('services')
      .select(`
        *,
        profiles!services_freelancer_id_fkey (
          id,
          full_name,
          avatar_url,
          rating,
          is_online
        ),
        categories!services_category_id_fkey (
          id,
          name_ru,
          name_uz,
          slug
        )
      `)
      .eq('is_active', true);

    if (filters?.category) {
      query = query.eq('category_id', filters.category);
    }

    if (filters?.priceRange) {
      query = query.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1]);
    }

    if (filters?.search) {
      query = query.or(`title_ru.ilike.%${filters.search}%,title_uz.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting services:', error);
    return [];
  }
};

export const getServiceById = async (id: string): Promise<Service | null> => {
  if (!supabase) {
    // Fallback to mock data
    return {
      id: '1',
      title_ru: 'Веб-разработка',
      title_uz: 'Web dasturlash',
      description_ru: 'Создание современных веб-сайтов',
      description_uz: 'Zamonaviy veb-saytlarni yaratish',
      price: 100,
      freelancer_id: '1',
      category_id: 'web-development',
      tags: ['react', 'nodejs'],
      is_active: true
    };
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        profiles!services_freelancer_id_fkey (
          id,
          full_name,
          avatar_url,
          rating,
          bio,
          telegram_username,
          is_online
        ),
        categories!services_category_id_fkey (
          id,
          name_ru,
          name_uz,
          slug
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting service by ID:', error);
    return null;
  }
};

export const getServicesByFreelancerId = async (freelancerId: string): Promise<Service[]> => {
  if (!supabase) {
    // Fallback to mock data
    return [
      {
        id: '1',
        title_ru: 'Веб-разработка',
        title_uz: 'Web dasturlash',
        description_ru: 'Создание современных веб-сайтов',
        description_uz: 'Zamonaviy veb-saytlarni yaratish',
        price: 100,
        freelancer_id: freelancerId,
        category_id: 'web-development',
        tags: ['react', 'nodejs'],
        is_active: true
      }
    ];
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        categories!services_category_id_fkey (
          id,
          name_ru,
          name_uz,
          slug
        )
      `)
      .eq('freelancer_id', freelancerId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting services by freelancer ID:', error);
    return [];
  }
};

export const createService = async (service: Omit<Service, 'id'>): Promise<Service> => {
  if (!supabase) {
    throw new Error('Service creation not available in demo mode');
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

export const updateService = async (id: string, updates: Partial<Service>): Promise<Service> => {
  if (!supabase) {
    throw new Error('Service update not available in demo mode');
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

export const deleteService = async (id: string): Promise<void> => {
  if (!supabase) {
    throw new Error('Service deletion not available in demo mode');
  }

  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};
