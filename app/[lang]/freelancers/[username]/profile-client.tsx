'use client';

import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Locale, Service, Dictionary, PortfolioItem, Review } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ServiceCard } from '@/components/shared/service-card';
import { PortfolioGallery } from '@/components/shared/portfolio-gallery';
import { Star, Send, ShieldCheck, ExternalLink, Circle } from 'lucide-react';
import { useState, useEffect } from 'react';

import { getServicesByFreelancerId } from '@/lib/supabase/services';
import { getProfile } from '@/lib/supabase/profiles';
import { getPortfolioByFreelancerId } from '@/lib/supabase/portfolio';
import { getReviewsByFreelancerId } from '@/lib/supabase/reviews';
import { getUser } from '@/lib/supabase/auth';

export default function FreelancerProfileClient({
  lang,
  username,
}: {
  lang: Locale;
  username: string;
}) {
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<{
    id?: string;
    full_name: string;
    bio: string;
    avatar_url: string;
    services: any[];
    rating: number;
    completed_orders: number;
    skills: string[];
    telegram_username?: string;
    is_online?: boolean;
    portfolio: PortfolioItem[];
    reviews: Review[];
  }>({
    full_name: 'Freelancer Name',
    bio: 'Senior Developer from Tashkent',
    avatar_url: 'https://github.com/shadcn.png',
    services: [],
    rating: 0,
    completed_orders: 0,
    skills: [],
    portfolio: [],
    reviews: []
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const dict = await getDictionary(lang);
        setDictionary(dict);

        // Try to get profile by username (assuming username is profile ID)
        let profile = null;
        try {
          profile = await getProfile(username);
        } catch (error) {
          console.log('Profile not found by ID, trying fallback...');
        }

        if (profile) {
          const [services, portfolio, reviews] = await Promise.all([
            getServicesByFreelancerId(profile.id),
            getPortfolioByFreelancerId(profile.id),
            getReviewsByFreelancerId(profile.id)
          ]);

          const averageRating = reviews.length > 0 
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
            : 0;

          setProfileData({
            id: profile.id,
            full_name: profile.full_name || 'Freelancer',
            bio: profile.bio || 'IT специалист',
            avatar_url: profile.avatar_url || 'https://github.com/shadcn.png',
            services: services,
            rating: averageRating,
            completed_orders: services.length,
            skills: [],
            telegram_username: profile.telegram_username,
            is_online: profile.is_online,
            portfolio: portfolio,
            reviews: reviews
          });
        } else {
          // Fallback data
          setProfileData({
            full_name: username.charAt(0).toUpperCase() + username.slice(1),
            bio: 'Профессиональный фрилансер из Ташкента',
            avatar_url: 'https://github.com/shadcn.png',
            services: [],
            rating: 4.9,
            completed_orders: 12,
            skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Supabase'],
            portfolio: [],
            reviews: []
          });
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [lang, username]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-dark-700 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="h-96 bg-dark-700 rounded"></div>
            <div className="lg:col-span-2 h-96 bg-dark-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!dictionary) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="sticky top-24">
            <CardHeader className="flex flex-col items-center pb-2">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-primary/20 p-1 relative bg-dark-700 flex items-center justify-center text-4xl font-bold text-white shadow-2xl shadow-primary/10">
                {profileData.avatar_url ? (
                  <img src={profileData.avatar_url} alt={profileData.full_name} className="w-full h-full object-cover" />
                ) : (
                  profileData.full_name.charAt(0).toUpperCase()
                )}
                <div className="absolute bottom-1 right-1 bg-white rounded-full p-1.5 shadow-lg border-2 border-primary/20">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                {profileData.is_online && (
                  <div className="absolute top-1 right-1">
                    <Circle className="w-4 h-4 fill-green-500 text-green-500" />
                  </div>
                )}
              </div>
              <CardTitle className="text-2xl text-center mb-2">{profileData.full_name}</CardTitle>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-bold">{profileData.rating.toFixed(1)}</span>
                </div>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 text-sm">{profileData.completed_orders} {lang === 'ru' ? 'услуг' : 'xizmat'}</span>
              </div>
              <Badge variant="secondary" className="mb-6 uppercase tracking-wider">
                {lang === 'ru' ? 'IT Специалист' : 'IT Mutaxassis'}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-300 text-center leading-relaxed italic">
                "{profileData.bio}"
              </p>
              {profileData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {profileData.skills.map(skill => (
                    <Badge key={skill} variant="outline" className="border-primary/30 text-primary/80">{skill}</Badge>
                  ))}
                </div>
              )}
              <div className="pt-6 border-t border-dark-700">
                <Button 
                  className="w-full gap-2 text-lg py-6 shadow-lg shadow-primary/20" 
                  size="lg" 
                  onClick={() => {
                    const tg = profileData.telegram_username || 'uzdev_hub';
                    window.open(`https://t.me/${tg.replace('@', '')}`, '_blank');
                  }}
                >
                  <Send className="w-5 h-5" />
                  {dictionary.common.contact_tg}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Mini Card */}
          {profileData.reviews.length > 0 && (
            <Card className="p-6 border-dark-700">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                {lang === 'ru' ? 'Последние отзывы' : 'Oxirgi sharhlar'}
              </h3>
              <div className="space-y-4">
                {profileData.reviews.slice(0, 3).map(review => (
                  <div key={review.id} className="border-b border-dark-700 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-white">{review.client_name}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-slate-600'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Portfolio & Services */}
        <div className="lg:col-span-2 space-y-8">
          {/* Portfolio Section */}
          {profileData.portfolio.length > 0 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <div className="w-2 h-8 bg-primary rounded-full" />
                {lang === 'ru' ? 'Портфолио' : 'Portfolyo'}
              </h2>
              <PortfolioGallery 
                items={profileData.portfolio} 
                lang={lang}
              />
            </div>
          )}

          {/* Services Section */}
          <div className="flex flex-col gap-6 pt-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full" />
              {lang === 'ru' ? 'Услуги' : 'Xizmatlar'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profileData.services.length > 0 ? (
                profileData.services.map((service) => (
                  <ServiceCard key={service.id} service={service} lang={lang} />
                ))
              ) : (
                <Card className="p-6 border-dashed border-2 border-dark-700 flex flex-col items-center justify-center text-center h-48">
                  <p className="text-slate-400">
                    {lang === 'ru' ? 'У этого фрилансера пока нет активных услуг' : 'Ushbu frilanserda hali faol xizmatlar yo\'q'}
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
