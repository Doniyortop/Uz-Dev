import { supabase } from "./supabaseClient";
import { Service } from "@/types";

export const getServices = async (filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}) => {
  let query = supabase
    .from("services")
    .select(`
      *,
      profiles!services_freelancer_id_fkey (
        full_name,
        avatar_url,
        rating,
        telegram_username,
        is_online
      ),
      categories!services_category_id_fkey (
        name_ru,
        name_uz,
        slug
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (filters?.category) {
    query = query.eq("categories.slug", filters.category);
  }

  if (filters?.minPrice) {
    query = query.gte("price", filters.minPrice);
  }

  if (filters?.maxPrice) {
    query = query.lte("price", filters.maxPrice);
  }

  if (filters?.search) {
    query = query.or(`title_ru.ilike.%${filters.search}%,title_uz.ilike.%${filters.search}%,description_ru.ilike.%${filters.search}%,description_uz.ilike.%${filters.search}%`);
  }

  if (filters?.tags && filters.tags.length > 0) {
    query = query.contains("tags", filters.tags);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data as any[];
};

export const getServiceById = async (serviceId: string) => {
  const { data, error } = await supabase
    .from("services")
    .select(`
      *,
      profiles!services_freelancer_id_fkey (
        full_name,
        avatar_url,
        rating,
        telegram_username,
        bio,
        is_online
      ),
      categories!services_category_id_fkey (
        name_ru,
        name_uz,
        slug
      )
    `)
    .eq("id", serviceId)
    .single();
  
  if (error) throw error;
  return data as any;
};

export const createService = async (service: Omit<Service, "id" | "freelancer_id"> & { freelancer_id: string }) => {
  const { data, error } = await supabase
    .from("services")
    .insert(service)
    .select(`
      *,
      profiles!services_freelancer_id_fkey (
        full_name,
        avatar_url,
        rating,
        telegram_username
      )
    `)
    .single();

  if (error) throw error;
  return data as Service;
};

export const updateService = async (serviceId: string, updates: Partial<Omit<Service, "id" | "freelancer_id">>) => {
  const { data, error } = await supabase
    .from("services")
    .update(updates)
    .eq("id", serviceId)
    .select(`
      *,
      profiles!services_freelancer_id_fkey (
        full_name,
        avatar_url,
        rating,
        telegram_username
      )
    `)
    .single();

  if (error) throw error;
  return data as Service;
};

export const deleteService = async (serviceId: string) => {
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", serviceId);

  if (error) throw error;
  return true;
};

export const getServicesByFreelancerId = async (freelancerId: string) => {
  const { data, error } = await supabase
    .from("services")
    .select(`
      *,
      categories!services_category_id_fkey (
        name_ru,
        name_uz,
        slug
      )
    `)
    .eq("freelancer_id", freelancerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as any[];
};

export const searchServices = async (query: string, limit: number = 10) => {
  const { data, error } = await supabase
    .from("services")
    .select(`
      *,
      profiles!services_freelancer_id_fkey (
        full_name,
        avatar_url,
        rating
      )
    `)
    .eq("is_active", true)
    .or(`title_ru.ilike.%${query}%,title_uz.ilike.%${query}%,description_ru.ilike.%${query}%,description_uz.ilike.%${query}%,tags.cs.{${query}}`)
    .limit(limit);

  if (error) throw error;
  return data as any[];
};