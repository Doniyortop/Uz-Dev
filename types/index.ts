export type Locale = 'ru' | 'uz';

export interface Category {
  id: string;
  slug: string;
  name_ru: string;
  name_uz: string;
  icon_name: string;
}

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  telegram_username: string;
  rating: number;
  role?: 'freelancer' | 'client';
  onboarded?: boolean;
}

export interface Service {
  id: string;
  freelancer_id: string;
  category_id: string;
  title_ru: string;
  title_uz: string;
  description_ru: string;
  description_uz: string;
  price: number;
  tags: string[];
  is_active: boolean;
}

export interface Dictionary {
  common: {
    contact_tg: string;
    categories: string;
    search: string;
    login: string;
    register: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  categories: Record<string, string>;
  footer: {
    about: string;
    platform: string;
    all_services: string;
    freelancers: string;
    support: string;
    help: string;
    rules: string;
    privacy: string;
    rights: string;
  };
}
