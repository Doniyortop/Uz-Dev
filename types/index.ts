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
  auth: {
    login_welcome: string;
    register_welcome: string;
    email: string;
    password: string;
    full_name: string;
    no_account: string;
    has_account: string;
    dashboard: string;
    my_profile: string;
    logout: string;
    user_name: string;
  };
  footer: {
    platform: string;
    support: string;
    all_services: string;
    freelancers: string;
    about: string;
    help: string;
    rules: string;
    privacy: string;
    all_rights: string;
  };
  onboarding: {
    title: string;
    subtitle: string;
    freelancer_title: string;
    freelancer_desc: string;
    client_title: string;
    client_desc: string;
    complete: string;
  };
  dashboard: {
    welcome: string;
    overview: string;
    my_items: string;
    my_orders: string;
    settings: string;
    logout: string;
    active_orders: string;
    balance: string;
    views: string;
    empty_state_title: string;
    empty_state_desc: string;
    add_service: string;
    find_performer: string;
    list_empty: string;
    profile_settings: string;
    back: string;
    personal_data: string;
    edit_name_bio: string;
    notifications: string;
    configure_alerts: string;
    payments: string;
    wallet_history: string;
    manage: string;
    full_name: string;
    about_me: string;
    save: string;
    cancel: string;
    email_notifications: string;
    get_order_emails: string;
    telegram_bot: string;
    messenger_alerts: string;
    changes_saved: string;
    notifications_saved: string;
    payments_soon: string;
  };
}
