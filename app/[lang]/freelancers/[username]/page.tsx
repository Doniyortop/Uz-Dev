'use client';

import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Locale, Service, Dictionary } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ServiceCard } from '@/components/shared/service-card';
import { MessageCircle, Star, Send, ShieldCheck, Clock, RefreshCcw, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { use, useState, useEffect } from 'react';

export default function FreelancerProfile({
  params,
}: {
  params: Promise<{ lang: Locale; username: string }>;
}) {
  const { lang, username } = use(params);
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [profileData, setProfileName] = useState({
    name: 'Freelancer Name',
    bio: 'Senior Developer from Tashkent',
    services: [] as Service[]
  });

  useEffect(() => {
    getDictionary(lang).then(setDictionary);

    const savedName = localStorage.getItem('user_name') || 'Freelancer Name';
    const savedBio = localStorage.getItem('user_bio') || 'Senior Developer from Tashkent';
    const slug = savedName.toLowerCase().replace(/\s+/g, '-');
    
    // If viewing own profile
    if (username === slug || username === 'doniyor') {
      const userServices = JSON.parse(localStorage.getItem('user_services') || '[]');
      const formattedServices = userServices.map((s: any) => ({
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
        freelancer_name: savedName,
        telegram: s.telegram,
        image: s.image
      }));

      setProfileName({
        name: savedName,
        bio: savedBio,
        services: formattedServices
      });
    }
  }, [lang, username]);

  if (!dictionary) return null;

  // Mock data for profile
  const profile = {
    full_name: profileData.name,
    avatar_url: 'https://github.com/shadcn.png',
    bio: profileData.bio,
    telegram_username: 'uzdev_hub',
    rating: 4.9,
    completed_orders: 124,
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Supabase'],
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="flex flex-col items-center pb-2">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-primary/20 p-1 relative bg-dark-700 flex items-center justify-center text-4xl font-bold text-white">
                {profile.full_name.charAt(0).toUpperCase()}
                <div className="absolute bottom-1 right-1 bg-white rounded-full p-1.5 shadow-lg border-2 border-primary/20">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center mb-2">{profile.full_name}</CardTitle>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-bold">{profile.rating}</span>
                </div>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 text-sm">{profile.completed_orders} {lang === 'ru' ? 'заказов' : 'buyurtmalar'}</span>
              </div>
              <Badge variant="secondary" className="mb-6 uppercase tracking-wider">Senior Developer</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-300 text-center leading-relaxed">
                {profile.bio}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {profile.skills.map(skill => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
              </div>
              <div className="pt-6 border-t border-dark-700">
                <Button className="w-full gap-2 text-lg py-6" size="lg" href="#">
                  <Send className="w-5 h-5" />
                  {dictionary.common.contact_tg}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Portfolio & Services */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full" />
              {lang === 'ru' ? 'Портфолио' : 'Portfolyo'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden group">
                  <div className="h-48 bg-dark-800 relative">
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-300 flex items-center justify-center">
                      <ExternalLink className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-1">Project Name {i}</h3>
                    <p className="text-slate-400 text-sm">React, Next.js, Supabase</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

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
