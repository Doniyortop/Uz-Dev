import { supabase } from "./supabaseClient";
import { Review } from "@/types";

export const getReviewsByFreelancerId = async (freelancerId: string) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("freelancer_id", freelancerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Review[];
};

export const getReviewsByServiceId = async (serviceId: string) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("service_id", serviceId)
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

export const updateReview = async (reviewId: string, updates: Partial<Review>) => {
  const { data, error } = await supabase
    .from("reviews")
    .update(updates)
    .eq("id", reviewId)
    .select()
    .single();

  if (error) throw error;
  return data as Review;
};

export const deleteReview = async (reviewId: string) => {
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId);

  if (error) throw error;
  return true;
};

export const getAverageRating = async (freelancerId: string) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("freelancer_id", freelancerId);

  if (error) throw error;
  
  if (!data || data.length === 0) return 0;
  
  const sum = data.reduce((acc, review) => acc + review.rating, 0);
  return sum / data.length;
};
