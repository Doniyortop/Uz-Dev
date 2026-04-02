import { supabase } from "./supabaseClient";
import { Profile } from "@/types";

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as Profile;
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
};

export const createProfile = async (profile: Omit<Profile, "id" | "created_at" | "updated_at"> & { id: string }) => {
  const { data, error } = await supabase
    .from("profiles")
    .insert(profile)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
};

export const getFreelancers = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "freelancer")
    .order("rating", { ascending: false });

  if (error) throw error;
  return data as Profile[];
};

export const updateOnlineStatus = async (userId: string, isOnline: boolean) => {
  const { error } = await supabase
    .from("profiles")
    .update({ 
      is_online: isOnline,
      last_seen: new Date().toISOString()
    })
    .eq("id", userId);

  if (error) throw error;
};

export const searchFreelancers = async (query: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "freelancer")
    .or(`full_name.ilike.%${query}%,bio.ilike.%${query}%`)
    .order("rating", { ascending: false });

  if (error) throw error;
  return data as Profile[];
};
