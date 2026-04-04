'use client';

import { use } from 'react';
import { Locale } from '@/types';
import { getServiceById } from '@/lib/mock-services';
import { getReviewsByServiceId, createReview } from '@/lib/mock-services';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Clock, Mail, MessageCircle, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import ReviewForm from '@/components/shared/review-form';

export default function ServicePage({
  params,
}: {
  params: Promise<{ lang: Locale; id: string }>;
}) {
  const { lang, id } = use(params);
  const router = useRouter();
  const [service, setService] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactMessage, setContactMessage] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [serviceData, reviewsData] = await Promise.all([
          getServiceById(id),
          getReviewsByServiceId(id)
        ]);
        setService(serviceData);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleContact = () => {
    if (!contactMessage.trim()) return;
    
    // In a real app, this would send a message
    alert(lang === 'ru' 
      ? 'Сообщение отправлено!' 
      : 'Xabar yuborildi!');
    setContactMessage('');
  };

  const handleReviewSubmit = async (reviewData: any) => {
    try {
      const newReview = await createReview(reviewData);
      setReviews([newReview, ...reviews]);
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error creating review:', error);
      alert(lang === 'ru' 
        ? 'Ошибка при отправке отзыва' 
        : 'Sharxni yuborishda xatolik');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-dark-700 rounded w-3/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-dark-700 rounded"></div>
            <div className="h-96 bg-dark-700 rounded"></div>
          </div>
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
        <Button onClick={() => router.push(`/${lang}/services`)}>
          {lang === 'ru' ? 'Назад к услугам' : 'Xizmatlarga qaytish'}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Service Header */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">
                {service.categories?.name_ru || service.categories?.name_uz}
              </Badge>
              <Badge variant="outline" className="text-primary">
                {service.price.toLocaleString()} UZS
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              {lang === 'ru' ? service.title_ru : service.title_uz}
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              {lang === 'ru' ? service.description_ru : service.description_uz}
            </p>
          </div>

          {/* Service Image */}
          <div className="h-96 bg-dark-800 rounded-xl overflow-hidden">
            {service.image ? (
              <img 
                src={service.image} 
                alt={lang === 'ru' ? service.title_ru : service.title_uz}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600">
                <div className="text-center">
                  <div className="w-24 h-24 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🔧</span>
                  </div>
                  <span className="text-lg">
                    {lang === 'ru' ? 'Нет изображения' : 'Rasm yo\'q'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {service.tags && service.tags.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-white">
                {lang === 'ru' ? 'Навыки' : 'Mahoratlar'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="border-primary/50">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {lang === 'ru' ? 'Отзывы' : 'Sharhlar'}
              </h3>
              <Button 
                variant="outline" 
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm 
                  ? (lang === 'ru' ? 'Отменить' : 'Bekor qilish')
                  : (lang === 'ru' ? 'Оставить отзыв' : 'Sharx qoldirish')
                }
              </Button>
            </div>

            {showReviewForm && (
              <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
                <h3 className="text-white font-bold mb-4">
                  {lang === 'ru' ? 'Оставить отзыв' : 'Sharx qoldirish'}
                </h3>
                <p className="text-slate-400">
                  {lang === 'ru' ? 'Функция отзывов временно отключена' : 'Sharx funksiyasi vaqtincha o\'chirilgan'}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review.id} className="bg-dark-800 border-dark-700">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-dark-700 rounded-full flex items-center justify-center flex-shrink-0">
                          {review.profiles?.avatar_url ? (
                            <img 
                              src={review.profiles.avatar_url} 
                              alt={review.profiles.full_name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm">👤</span>
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-white">
                              {review.profiles?.full_name}
                            </span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${
                                    i < review.rating 
                                      ? 'text-yellow-500 fill-current' 
                                      : 'text-slate-600'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-300">{review.comment}</p>
                          <p className="text-slate-500 text-sm mt-2">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">
                    {lang === 'ru' ? 'Пока нет отзывов' : 'Hozircha sharhlar yo\'q'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Freelancer Info */}
          <Card className="bg-dark-800 border-dark-700">
            <CardHeader>
              <CardTitle className="text-white">
                {lang === 'ru' ? 'Исполнитель' : 'Ijrochi'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center">
                  {service.profiles?.avatar_url ? (
                    <img 
                      src={service.profiles.avatar_url} 
                      alt={service.profiles.full_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">👤</span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white">
                    {service.profiles?.full_name}
                  </h4>
                  {service.profiles?.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-white">
                        {service.profiles.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {service.profiles?.bio && (
                <p className="text-slate-300 text-sm">
                  {service.profiles.bio}
                </p>
              )}

              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className={`w-2 h-2 rounded-full ${
                  service.profiles?.is_online ? 'bg-green-500' : 'bg-slate-500'
                }`} />
                {service.profiles?.is_online 
                  ? (lang === 'ru' ? 'В сети' : 'Onlayn')
                  : (lang === 'ru' ? 'Офлайн' : 'Oflayn')
                }
              </div>

              <Link href={`/${lang}/freelancers/${service.profiles?.id}`}>
                <Button className="w-full" variant="outline">
                  {lang === 'ru' ? 'Посмотреть профиль' : 'Profildan ko\'rish'}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="bg-dark-800 border-dark-700">
            <CardHeader>
              <CardTitle className="text-white">
                {lang === 'ru' ? 'Связаться' : 'Aloqa qilish'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                placeholder={lang === 'ru' 
                  ? 'Опишите ваш проект...' 
                  : 'Loyihangizni tasvirlang...'}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-primary resize-none"
                rows={4}
              />
              <Button 
                onClick={handleContact}
                className="w-full"
                disabled={!contactMessage.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                {lang === 'ru' ? 'Отправить' : 'Yuborish'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
