'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Locale, Dictionary } from '@/types';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save, Sparkles, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function NewServicePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getDictionary(lang).then(setDictionary);
    
    // Check if user is freelancer
    const role = localStorage.getItem('user_role');
    if (role !== 'freelancer') {
      router.push(`/${lang}/dashboard`);
    }
  }, [lang, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert(lang === 'ru' ? 'Услуга успешно добавлена!' : 'Xizmat muvaffaqiyatli qo\'shildi!');
      router.push(`/${lang}/dashboard`);
    }, 1500);
  };

  if (!dictionary) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link 
        href={`/${lang}/dashboard`}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        {dictionary.common.back}
      </Link>

      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          {dictionary.dashboard.add_service}
        </h1>
        <p className="text-slate-400">
          {lang === 'ru' 
            ? 'Заполните детали, чтобы вашу услугу увидели заказчики' 
            : 'Mijozlar xizmatingizni ko\'rishi uchun ma\'lumotlarni to\'ldiring'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-8 border-dark-700 bg-dark-800/50 backdrop-blur-sm">
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                {dictionary.dashboard.service_title}
              </label>
              <input 
                required
                type="text" 
                placeholder={lang === 'ru' ? 'Например: Бот для магазина' : 'Masalan: Do\'kon uchun bot'}
                className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                {dictionary.dashboard.service_category}
              </label>
              <select className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none">
                {Object.entries(dictionary.categories).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                {dictionary.dashboard.service_price}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input 
                  required
                  type="number" 
                  min="5"
                  placeholder="50"
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                {dictionary.dashboard.service_description}
              </label>
              <textarea 
                required
                rows={5}
                placeholder={lang === 'ru' ? 'Опишите, что входит в стоимость...' : 'Narxga nimalar kirishini tasvirlang...'}
                className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                {dictionary.dashboard.service_tags}
              </label>
              <input 
                type="text" 
                placeholder="Telegram, Node.js, API"
                className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Image Placeholder */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                {lang === 'ru' ? 'Обложка услуги' : 'Xizmat muqovasi'}
              </label>
              <div className="border-2 border-dashed border-dark-600 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-slate-500 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                <ImageIcon className="w-8 h-8" />
                <span className="text-sm">{lang === 'ru' ? 'Нажмите, чтобы загрузить изображение' : 'Rasm yuklash uchun bosing'}</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button 
            type="submit" 
            className="flex-grow py-4 h-auto text-lg font-bold shadow-lg shadow-primary/20"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {lang === 'ru' ? 'Создание...' : 'Yaratilmoqda...'}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-5 h-5" />
                {dictionary.dashboard.create}
              </span>
            )}
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            className="px-8"
            onClick={() => router.push(`/${lang}/dashboard`)}
          >
            {dictionary.common.cancel}
          </Button>
        </div>
      </form>
    </div>
  );
}
