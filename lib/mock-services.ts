// Mock services for demo without Supabase

export interface Service {
  id: string;
  title?: string;
  title_ru?: string;
  title_uz?: string;
  description?: string;
  description_ru?: string;
  description_uz?: string;
  price: number;
  freelancer_id: string;
  category_id: string;
  tags: string[];
  is_active: boolean;
  images?: string[];
  image_url?: string;
}

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

export interface Review {
  id: string;
  service_id: string;
  client_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

// Mock data
const mockCategories: Category[] = [
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

const mockServices: Service[] = [
  {
    id: '1',
    title_ru: 'Веб-разработка',
    title_uz: 'Web dasturlash',
    description_ru: 'Создание современных веб-сайтов',
    description_uz: 'Zamonaviy veb-saytlarni yaratish',
    price: 100,
    freelancer_id: '1',
    category_id: '1',
    tags: ['react', 'nodejs'],
    is_active: true
  },
  {
    id: '2',
    title_ru: 'Мобильное приложение',
    title_uz: 'Mobil ilova',
    description_ru: 'Разработка мобильных приложений',
    description_uz: 'Mobil ilovalarni ishlab chiqish',
    price: 200,
    freelancer_id: '1',
    category_id: '2',
    tags: ['react-native', 'flutter'],
    is_active: true
  }
];

const mockReviews: Review[] = [
  {
    id: '1',
    service_id: '1',
    client_id: '1',
    rating: 5,
    comment: 'Отличная работа!',
    created_at: new Date().toISOString(),
    profiles: {
      id: '1',
      full_name: 'John Doe',
      avatar_url: undefined
    }
  }
];

// Export functions that mimic Supabase API
export const getCategories = async (): Promise<Category[]> => {
  return mockCategories;
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  return mockCategories.find(cat => cat.slug === slug) || null;
};

export const getServices = async (filters?: {
  category?: string;
  priceRange?: [number, number];
  search?: string;
  tags?: string[];
}): Promise<Service[]> => {
  let filtered = [...mockServices];
  
  if (filters?.category) {
    filtered = filtered.filter(s => s.category_id === filters.category);
  }
  
  if (filters?.priceRange) {
    filtered = filtered.filter(s => 
      s.price >= filters.priceRange![0] && s.price <= filters.priceRange![1]
    );
  }
  
  if (filters?.search) {
    filtered = filtered.filter(s => 
      (s.title_ru || '').toLowerCase().includes(filters.search!.toLowerCase()) ||
      (s.title_uz || '').toLowerCase().includes(filters.search!.toLowerCase()) ||
      (s.title || '').toLowerCase().includes(filters.search!.toLowerCase())
    );
  }
  
  return filtered;
};

export const getServiceById = async (id: string): Promise<Service | null> => {
  return mockServices.find(s => s.id === id) || null;
};

export const createService = async (service: Partial<Service>): Promise<Service> => {
  const newService: Service = {
    id: Date.now().toString(),
    title: service.title || '',
    title_ru: service.title || '',
    title_uz: service.title || '',
    description: service.description || '',
    description_ru: service.description || '',
    description_uz: service.description || '',
    price: service.price || 0,
    freelancer_id: service.freelancer_id || '',
    category_id: service.category_id || '',
    tags: service.tags || [],
    is_active: service.is_active ?? true,
    images: service.images || [],
    image_url: service.image_url
  };
  mockServices.push(newService);
  return newService;
};

export const getReviewsByServiceId = async (serviceId: string): Promise<Review[]> => {
  return mockReviews.filter(r => r.service_id === serviceId);
};

export const createReview = async (review: Omit<Review, 'id' | 'created_at' | 'profiles'>): Promise<Review> => {
  const newReview: Review = {
    ...review,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    profiles: {
      id: review.client_id,
      full_name: 'Demo User',
      avatar_url: undefined
    }
  };
  mockReviews.push(newReview);
  return newReview;
};
