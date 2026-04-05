'use client';

import { use } from 'react';
import { Locale } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, Briefcase, Star, MessageCircle, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { simpleAuth } from '@/lib/auth-simple';

export default function ProfilePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = simpleAuth.getCurrentUser();
        if (!currentUser) {
          router.push(`/${lang}/login`);
          return;
        }
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
        router.push(`/${lang}/login`);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [lang, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-pulse text-white">
          {lang === 'ru' ? 'Загрузка...' : 'Yuklanmoqda...'}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {lang === 'ru' ? 'Мой профиль' : 'Mening profilim'}
        </h1>
        <p className="text-slate-400">
          {lang === 'ru' ? 'Управление вашим профилем и настройками' : 'Profil va sozlamalaringizni boshqarish'}
        </p>
      </div>

      {/* Profile Card */}
      <Card className="bg-dark-800 border-dark-800 mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            {lang === 'ru' ? 'Информация о профиле' : 'Profil ma\'lumotlari'}
          </CardTitle>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            {lang === 'ru' ? 'Редактировать' : 'Tahrirlash'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                {user.fullName || user.full_name || 'Пользователь'}
              </h2>
              <div className="flex items-center gap-2 text-slate-400 mb-4">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>5.0</span>
                <span>•</span>
                <span>{lang === 'ru' ? 'Фрилансер' : 'Freelancer'}</span>
              </div>
              <p className="text-slate-300">
                {user.bio || (lang === 'ru' ? 'Описание профиля отсутствует' : 'Profil tavsifi mavjud emas')}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-slate-400">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Phone className="w-4 h-4" />
                <span>+998 90 123 45 67</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <MapPin className="w-4 h-4" />
                <span>{lang === 'ru' ? 'Ташкент, Узбекистан' : 'Toshkent, O\'zbekiston'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-slate-400">
                <Briefcase className="w-4 h-4" />
                <span>{lang === 'ru' ? 'Веб-разработка' : 'Web dasturlash'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <MessageCircle className="w-4 h-4" />
                <span>@username</span>
              </div>
            </div>
          </div>

          {/* Telegram Button */}
          <div className="pt-4 border-t border-dark-700">
            <Button 
              className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => window.open('https://t.me/your_username', '_blank')}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {lang === 'ru' ? 'Связаться через Telegram' : 'Telegram orqali bog\'lanish'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-dark-800 border-dark-800">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">12</div>
            <div className="text-slate-400">
              {lang === 'ru' ? 'Активных услуг' : 'Faol xizmatlar'}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-dark-800 border-dark-800">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">28</div>
            <div className="text-slate-400">
              {lang === 'ru' ? 'Заказов выполнено' : 'Buyurtmalar bajarildi'}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-dark-800 border-dark-800">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">4.9</div>
            <div className="text-slate-400">
              {lang === 'ru' ? 'Средний рейтинг' : 'O\'rtacha reyting'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
