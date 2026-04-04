import { supabase } from './supabaseClient';

export interface Category {
  id: string;
  name_ru: string;
  name_uz: string;
  slug: string;
  icon?: string;
  description_ru?: string;
  description_uz?: string;
  created_at: string;
}

export const getCategories = async (): Promise<Category[]> => {
  if (!supabase) {
    // Fallback to mock data
    return [
      {
        id: '1',
        name_ru: 'Веб-разработка',
        name_uz: 'Web dasturlash',
        slug: 'web-development',
        icon: 'code',
        description_ru: 'Создание веб-сайтов и приложений',
        description_uz: 'Veb-saytlar va ilovalarni yaratish',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name_ru: 'Мобильная разработка',
        name_uz: 'Mobil dasturlash',
        slug: 'mobile-development',
        icon: 'smartphone',
        description_ru: 'Разработка мобильных приложений',
        description_uz: 'Mobil ilovalarni ishlab chiqish',
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        name_ru: 'Дизайн',
        name_uz: 'Dizayn',
        slug: 'design',
        icon: 'palette',
        description_ru: 'Графический и UI/UX дизайн',
        description_uz: 'Grafik va UI/UX dizayn',
        created_at: new Date().toISOString()
      }
    ];
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name_ru');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  if (!supabase) {
    // Fallback to mock data
    return {
      id: '1',
      name_ru: 'Веб-разработка',
      name_uz: 'Web dasturlash',
      slug: slug,
      icon: 'code',
      description_ru: 'Создание веб-сайтов и приложений',
      description_uz: 'Veb-saytlar va ilovalarni yaratish',
      created_at: new Date().toISOString()
    };
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting category by slug:', error);
    return null;
  }
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  if (!supabase) {
    // Fallback to mock data
    return {
      id: id,
      name_ru: 'Веб-разработка',
      name_uz: 'Web dasturlash',
      slug: 'web-development',
      icon: 'code',
      description_ru: 'Создание веб-сайтов и приложений',
      description_uz: 'Veb-saytlar va ilovalarni yaratish',
      created_at: new Date().toISOString()
    };
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting category by ID:', error);
    return null;
  }
};
