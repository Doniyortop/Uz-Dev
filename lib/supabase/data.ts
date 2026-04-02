import { supabase } from "./supabaseClient";
import { Profile, PortfolioItem, Review } from "@/types";

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

// Portfolio Functions
export const getPortfolioItems = async (freelancerId: string) => {
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("freelancer_id", freelancerId)
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data as PortfolioItem[];
};

export const createPortfolioItem = async (item: Omit<PortfolioItem, "id">) => {
  const { data, error } = await supabase
    .from("portfolio_items")
    .insert(item)
    .select()
    .single();
  
  if (error) throw error;
  return data as PortfolioItem;
};

// Review Functions
export const getReviews = async (freelancerId: string) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("freelancer_id", freelancerId)
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data as Review[];
};

export const createReview = async (review: Omit<Review, "id" | "created_at">) => {
  const { data, error } = await supabase
    .from("reviews")
    .insert(review)
    .select()
    .single();
  
  if (error) throw error;
  return data as Review;
};
