import { supabase } from "./supabaseClient";
import { Profile } from "@/types";

export const updateUserProfile = async (
  userId: string,
  updates: Partial<Omit<Profile, "id">>
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select();

  if (error) throw error;
  return data;
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  
  if (error) throw error;
  return data;
};
