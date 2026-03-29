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
