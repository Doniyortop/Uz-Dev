import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Locale, Service } from '@/types';
import { ServiceCard } from '@/components/shared/service-card';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  // Mock data for services
  const services: Service[] = [
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
    },
    {
      id: '3',
      freelancer_id: 'f3',
      category_id: 'design',
      title_ru: 'UI/UX Дизайн мобильного приложения',
      title_uz: 'Mobil ilova UI/UX dizayni',
      description_ru: 'Профессиональный дизайн в Figma с учетом последних трендов.',
      description_uz: 'So\'nggi trendlarni hisobga olgan holda Figma-da professional dizayn.',
      price: 200,
      tags: ['Figma', 'UI/UX', 'Mobile'],
      is_active: true,
    },
    {
      id: '4',
      freelancer_id: 'f4',
      category_id: 'tg_bots',
      title_ru: 'Бот-магазин в Telegram',
      title_uz: 'Telegram-da bot-do\'kon',
      description_ru: 'Полноценный магазин внутри мессенджера с корзиной и каталогом.',
      description_uz: 'Savatcha va katalogga ega messenjer ichidagi to\'liq do\'kon.',
      price: 180,
      tags: ['E-commerce', 'Bot', 'Python'],
      is_active: true,
    },
  ];

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
