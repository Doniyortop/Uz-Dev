import { supabase } from "./supabaseClient";
import { Service } from "@/types";

export const getServices = async () => {
  const { data, error } = await supabase
    .from("services")
    .select("*");
  
  if (error) throw error;
  return data as Service[];
};

export const getServiceById = async (serviceId: string) => {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", serviceId)
    .single();
  
  if (error) throw error;
  return data as Service;
};

export const createService = async (service: Omit<Service, "id" | "freelancer_id"> & { freelancer_id: string }) => {
  const { data, error } = await supabase
    .from("services")
    .insert(service)
    .select();

  if (error) throw error;
  return data ? data[0] as Service : null;
};

export const updateService = async (serviceId: string, updates: Partial<Omit<Service, "id" | "freelancer_id">>) => {
  const { data, error } = await supabase
    .from("services")
    .update(updates)
    .eq("id", serviceId)
    .select();

  if (error) throw error;
  return data ? data[0] as Service : null;
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
    .select("*")
    .eq("freelancer_id", freelancerId);

  if (error) throw error;
  return data as Service[];
};