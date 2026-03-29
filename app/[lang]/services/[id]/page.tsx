import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Locale, Service } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Star, Send, ShieldCheck, Clock, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export default async function ServicePage({
  params,
}: {
  params: Promise<{ lang: Locale; id: string }>;
}) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(lang);

  // Mock data for a single service
  const service: Service & { freelancer: { name: string; avatar: string; rating: number; reviews: number } } = {
    id: id,
    freelancer_id: 'f1',
    category_id: 'tg_bots',
    title_ru: 'Разработка Telegram бота для бизнеса',
    title_uz: 'Biznes uchun Telegram bot yaratish',
    description_ru: 'Создам надежного бота с интеграцией платежей и базой данных. Включает в себя панель администратора, рассылки, аналитику и полную поддержку после запуска.',
    description_uz: 'To\'lovlar va ma\'lumotlar bazasi integratsiyasi bilan ishonchli bot yarataman. Admin paneli, xabarlar yuborish, tahlil va ishga tushirilgandan keyin to\'liq qo\'llab-quvvatlashni o\'z ichiga oladi.',
    price: 150,
    tags: ['Telegram', 'Node.js', 'Bot', 'PostgreSQL'],
    is_active: true,
    freelancer: {
      name: 'Doniyor Uzakov',
      avatar: 'https://github.com/shadcn.png',
      rating: 4.9,
      reviews: 42,
    }
  };

  const title = lang === 'ru' ? service.title_ru : service.title_uz;
  const description = lang === 'ru' ? service.description_ru : service.description_uz;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <Badge variant="secondary" className="mb-4 uppercase tracking-wider text-primary">
              {service.category_id.replace('_', ' ')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>
            <div className="flex items-center gap-6 text-slate-400 border-b border-dark-700 pb-8">
              <Link href={`/${lang}/freelancers/doniyor`} className="flex items-center gap-2 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-dark-800">
                   <img src={service.freelancer.avatar} alt={service.freelancer.name} className="w-full h-full object-cover" />
                </div>
                <span className="font-medium">{service.freelancer.name}</span>
              </Link>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-white">{service.freelancer.rating}</span>
                <span className="text-slate-500 text-sm">({service.freelancer.reviews})</span>
              </div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mb-4">
              {lang === 'ru' ? 'Описание услуги' : 'Xizmat tavsifi'}
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              {description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
               <div className="flex items-start gap-3 p-4 bg-dark-800/50 rounded-xl border border-dark-700">
                  <ShieldCheck className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-bold text-white">{lang === 'ru' ? 'Гарантия качества' : 'Sifat kafolati'}</h4>
                    <p className="text-sm text-slate-400">{lang === 'ru' ? 'Полное соответствие ТЗ' : 'TZga to\'liq mos kelishi'}</p>
                  </div>
               </div>
               <div className="flex items-start gap-3 p-4 bg-dark-800/50 rounded-xl border border-dark-700">
                  <Clock className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-bold text-white">{lang === 'ru' ? 'Срок выполнения' : 'Bajarilish muddati'}</h4>
                    <p className="text-sm text-slate-400">3-5 {lang === 'ru' ? 'дней' : 'kun'}</p>
                  </div>
               </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">
              {lang === 'ru' ? 'Технологии' : 'Texnologiyalar'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {service.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-sm py-1.5 px-4">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Order Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 overflow-hidden border-2 border-primary/20">
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">{lang === 'ru' ? 'Стоимость' : 'Narxi'}</span>
                <span className="text-4xl font-black text-white">${service.price}</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-300">
                   <Clock className="w-5 h-5 text-primary" />
                   <span>3 {lang === 'ru' ? 'дня на доставку' : 'kun yetkazib berish'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                   <RefreshCcw className="w-5 h-5 text-primary" />
                   <span>2 {lang === 'ru' ? 'правки бесплатно' : 'tahrirlar bepul'}</span>
                </div>
              </div>

              <Button className="w-full gap-3 py-8 text-xl" size="lg" href="#">
                <Send className="w-6 h-6" />
                {dictionary.common.contact_tg}
              </Button>
              
              <p className="text-center text-xs text-slate-500">
                {lang === 'ru' ? 'Безопасное общение через Telegram' : 'Telegram orqali xavfsiz muloqot'}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
