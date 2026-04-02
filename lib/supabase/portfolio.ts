import { supabase } from "./supabaseClient";
import { PortfolioItem } from "@/types";

export const getPortfolioByFreelancerId = async (freelancerId: string) => {
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("freelancer_id", freelancerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as PortfolioItem[];
};

export const createPortfolioItem = async (item: Omit<PortfolioItem, "id" | "created_at">) => {
  const { data, error } = await supabase
    .from("portfolio_items")
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data as PortfolioItem;
};

export const updatePortfolioItem = async (itemId: string, updates: Partial<PortfolioItem>) => {
  const { data, error } = await supabase
    .from("portfolio_items")
    .update(updates)
    .eq("id", itemId)
    .select()
    .single();

  if (error) throw error;
  return data as PortfolioItem;
};

export const deletePortfolioItem = async (itemId: string) => {
  const { error } = await supabase
    .from("portfolio_items")
    .delete()
    .eq("id", itemId);

  if (error) throw error;
  return true;
};

export const uploadPortfolioImage = async (file: File, freelancerId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${freelancerId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('portfolio')
    .upload(fileName, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('portfolio')
    .getPublicUrl(fileName);

  return publicUrl;
};
