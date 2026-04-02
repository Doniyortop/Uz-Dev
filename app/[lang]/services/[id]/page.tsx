'use client';

import { useState, useEffect } from 'react';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Locale, Service } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Star, Send, ShieldCheck, Clock, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { getServiceById } from '@/lib/supabase/services';
import { getReviewsByServiceId } from '@/lib/supabase/reviews';
import { ReviewForm } from '@/components/shared/review-form';
import { getSession } from '@/lib/supabase/auth';
import { Review } from '@/types';

export default function ServicePage({
  params,
}: {
  params: Promise<{ lang: Locale; id: string }>;
}) {
  const [resolvedParams, setResolvedParams] = useState<{ lang: Locale; id: string } | null>(null);
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const p = await params;
      setResolvedParams(p);
      const dict = await getDictionary(p.lang);
      setDictionary(dict);
    };
    resolveParams();
  }, [params]);

  const lang = resolvedParams?.lang || 'ru';
  const id = resolvedParams?.id;

  const [service, setService] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        const [serviceData, reviewsData, sessionData] = await Promise.all([
          getServiceById(id),
          getReviewsByServiceId(id),
          getSession()
        ]);
        
        setService(serviceData);
        setReviews(reviewsData);
        setSession(sessionData);
      } catch (error) {
        console.error('Error loading service data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-dark-700 rounded w-1/4 mb-4"></div>
          <div className="h-16 bg-dark-700 rounded w-3/4 mb-8"></div>
          <div className="h-64 bg-dark-700 rounded mb-8"></div>
          <div className="h-4 bg-dark-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-dark-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">
          {lang === 'ru' ? 'Услуга не найдена' : 'Xizmat topilmadi'}
        </h1>
        <Link href={`/${lang}/services`}>
          <Button>
            {lang === 'ru' ? 'Вернуться к услугам' : 'Xizmatlarga qaytish'}
          </Button>
        </Link>
      </div>
    );
  }

  const title = lang === 'ru' ? service.title_ru : service.title_uz;
  const description = lang === 'ru' ? service.description_ru : service.description_uz;
  const freelancerName = service.profiles?.full_name || service.freelancer_name || 'Freelancer';
  const freelancerAvatar = service.profiles?.avatar_url || 'https://github.com/shadcn.png';
  const freelancerRating = service.profiles?.rating || 0;
  const telegram = service.profiles?.telegram_username || service.telegram;

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const handleReviewSubmit = () => {
    setShowReviewForm(false);
    // Reload reviews
    if (id) {
      getReviewsByServiceId(id).then(setReviews);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <Badge variant="secondary" className="mb-4 uppercase tracking-wider text-primary">
              {lang === 'ru' ? service.categories?.name_ru : service.categories?.name_uz || service.category_id?.replace('_', ' ')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>
            <div className="flex items-center gap-6 text-slate-400 border-b border-dark-700 pb-8">
              <Link href={`/${lang}/freelancers/${service.freelancer_id}`} className="flex items-center gap-2 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-dark-800 relative">
                   <img src={freelancerAvatar} alt={freelancerName} className="w-full h-full object-cover" />
                   {service.profiles?.is_online && (
                     <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-800"></div>
                   )}
                </div>
                <span className="font-medium">{freelancerName}</span>
              </Link>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-white">{averageRating.toFixed(1)}</span>
                <span className="text-slate-500 text-sm">({reviews.length})</span>
              </div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            {service.image && (
              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-dark-700 mb-8">
                <img src={service.image} alt={title} className="w-full h-full object-cover" />
              </div>
            )}
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
                    <p className="text-sm text-slate-400">{service.delivery_days || 3} {lang === 'ru' ? 'дней' : 'kun'}</p>
                  </div>
               </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">
              {lang === 'ru' ? 'Технологии' : 'Texnologiyalar'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {service.tags?.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-sm py-1.5 px-4">{tag}</Badge>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-dark-700 pt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {lang === 'ru' ? 'Отзывы' : 'Fikrlar'} ({reviews.length})
              </h2>
              {session && !showReviewForm && (
                <Button onClick={() => setShowReviewForm(true)}>
                  {lang === 'ru' ? 'Оставить отзыв' : 'Fikr qoldirish'}
                </Button>
              )}
            </div>

            {showReviewForm && session && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <ReviewForm
                    serviceId={id || ''}
                    freelancerId={service.freelancer_id || ''}
                    clientId={session.user.id}
                    clientName={session.user.user_metadata?.full_name || 'User'}
                    lang={lang}
                    onSubmit={handleReviewSubmit}
                  />
                </CardContent>
              </Card>
            )}

            {reviews.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p>{lang === 'ru' ? 'Пока нет отзывов' : 'Hozircha fikrlar yo\'q'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-white">{review.client_name}</h4>
                          <div className="flex items-center gap-1 text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-slate-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-300">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Order Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 overflow-hidden border-2 border-primary/20">
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">{lang === 'ru' ? 'Стоимость' : 'Narxi'}</span>
                <span className="text-4xl font-black text-white">{service.price.toLocaleString()} UZS</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-300">
                   <Clock className="w-5 h-5 text-primary" />
                   <span>{service.delivery_days || 3} {lang === 'ru' ? 'дня на доставку' : 'kun yetkazib berish'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                   <RefreshCcw className="w-5 h-5 text-primary" />
                   <span>2 {lang === 'ru' ? 'правки бесплатно' : 'tahrirlar bepul'}</span>
                </div>
              </div>

              {telegram ? (
                <a
                  href={`https://t.me/${telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full gap-3 py-6 text-lg inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-8 py-6 text-lg font-medium transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  {dictionary?.common?.contact_tg || 'Contact'}
                </a>
              ) : (
                <button
                  disabled
                  className="w-full gap-3 py-6 text-lg inline-flex items-center justify-center bg-dark-700 text-slate-500 rounded-md px-8 py-6 text-lg font-medium opacity-50 cursor-not-allowed"
                >
                  <MessageCircle className="w-5 h-5" />
                  {lang === 'ru' ? 'Контакт не указан' : 'Kontakt ko\'rsatilmagan'}
                </button>
              )}
              
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
