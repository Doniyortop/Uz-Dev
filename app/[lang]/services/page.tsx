'use client';

import { useState, useEffect, use } from 'react';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Locale, Service, Dictionary } from '@/types';
import { ServiceCard } from '@/components/shared/service-card';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function ServicesPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = use(params);
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getDictionary(lang).then(setDictionary);

    // Initial mock data
    const mockServices = [
      {
        id: '1',
        freelancer_id: 'f1',
        category_id: 'tg_bots',
        title_ru: 'Разработка Telegram бота для бизнеса',
        title_uz: 'Biznes uchun Telegram bot yaratish',
        description_ru: 'Создам надежного бота с интеграцией платежей и базой данных.',
        description_uz: 'To\'lovlar va ma\'lumotlar bazasi integratsiyasi bilan ishonchli bot yarataman.',
        price: 150,
        tags: ['Telegram', 'Node.js', 'Bot'],
        is_active: true,
        freelancer_name: 'Alex Dev',
        telegram: 'dev_alex'
      },
      {
        id: '2',
        freelancer_id: 'f2',
        category_id: 'web_dev',
        title_ru: 'Современный Landing Page на Next.js',
        title_uz: 'Next.js da zamonaviy Landing Page',
        description_ru: 'Быстрый, SEO-оптимизированный сайт для вашего продукта.',
        description_uz: 'Mahsulotingiz uchun tezkor, SEO-optimallashtirilgan sayt.',
        price: 300,
        tags: ['React', 'Next.js', 'Tailwind'],
        is_active: true,
        freelancer_name: 'Sarah Design',
        telegram: 'sarah_ui'
      },
    ];

    // Load user created services from localStorage
    const userServices = JSON.parse(localStorage.getItem('user_services') || '[]');
    
    // Map user services to catalog format
    const formattedUserServices = userServices.map((s: any) => ({
      id: s.id,
      freelancer_id: 'user',
      category_id: s.category,
      title_ru: s.title,
      title_uz: s.title,
      description_ru: s.description,
      description_uz: s.description,
      price: s.price,
      tags: s.tags.split(',').map((t: string) => t.trim()),
      is_active: true,
      freelancer_name: s.freelancer_name || 'Freelancer',
      telegram: s.telegram,
      image: s.image
    }));

    setServices([...formattedUserServices, ...mockServices]);
  }, [lang]);

  if (!dictionary) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {lang === 'ru' ? 'Каталог услуг' : 'Xizmatlar katalogi'}
          </h1>
          <p className="text-slate-400">
            {lang === 'ru' ? 'Найдите подходящего исполнителя для вашего проекта' : 'Loyihangiz uchun mos ijrochini toping'}
          </p>
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder={dictionary.common.search}
              className="w-full bg-dark-800 border border-dark-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            {lang === 'ru' ? 'Фильтры' : 'Filtrlar'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} lang={lang} />
        ))}
      </div>
    </div>
  );
}
