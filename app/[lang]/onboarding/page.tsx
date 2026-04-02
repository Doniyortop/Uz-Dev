'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Briefcase, Check } from 'lucide-react';

import { getUser } from '@/lib/supabase/auth';
import { updateUserProfile } from '@/lib/supabase/data';

export default function OnboardingPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const [role, setRole] = useState<'freelancer' | 'client' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    if (!role) return;
    setIsLoading(true);
    
    try {
      const user = await getUser();
      if (!user) {
        router.push(`/${lang}/login`);
        return;
      }

      await updateUserProfile(user.id, { 
        role, 
        onboarded: true,
        full_name: localStorage.getItem('user_name') || ''
      });

      // Update legacy localStorage
      localStorage.setItem('user_role', role);
      localStorage.setItem('onboarded', 'true');
      
      router.push(`/${lang}/dashboard`);
    } catch (err: any) {
      console.error('Onboarding error:', err);
      // Fallback to localStorage if Supabase fails (maybe table not created yet)
      localStorage.setItem('user_role', role);
      localStorage.setItem('onboarded', 'true');
      router.push(`/${lang}/dashboard`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center">
      <Card className="w-full max-w-2xl p-8">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold text-white mb-2">
            {lang === 'ru' ? 'Завершение профиля' : 'Profilni yakunlash'}
          </CardTitle>
          <p className="text-slate-400">
            {lang === 'ru' 
              ? 'Выберите вашу роль на платформе' 
              : 'Platformadagi rolingizni tanlang'}
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setRole('freelancer')}
              className={`p-6 rounded-2xl border-2 transition-all text-left group ${
                role === 'freelancer' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-dark-700 bg-dark-800 hover:border-dark-600'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                role === 'freelancer' ? 'bg-primary text-white' : 'bg-dark-700 text-slate-400 group-hover:text-white'
              }`}>
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {lang === 'ru' ? 'Я Фрилансер' : 'Men Frilanserman'}
              </h3>
              <p className="text-slate-400 text-sm">
                {lang === 'ru' 
                  ? 'Хочу предлагать свои услуги и находить заказы' 
                  : 'Xizmatlarimni taklif qilmoqchiman va buyurtmalar topmoqchiman'}
              </p>
            </button>

            <button
              onClick={() => setRole('client')}
              className={`p-6 rounded-2xl border-2 transition-all text-left group ${
                role === 'client' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-dark-700 bg-dark-800 hover:border-dark-600'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                role === 'client' ? 'bg-primary text-white' : 'bg-dark-700 text-slate-400 group-hover:text-white'
              }`}>
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {lang === 'ru' ? 'Я Заказчик' : 'Men Mijozman'}
              </h3>
              <p className="text-slate-400 text-sm">
                {lang === 'ru' 
                  ? 'Ищу профессионалов для реализации моих идей' 
                  : 'G\'oyalarimni amalga oshirish uchun professionallarni qidiryapman'}
              </p>
            </button>
          </div>

          <Button 
            onClick={handleComplete} 
            disabled={!role || isLoading} 
            className="w-full py-6 text-lg font-bold gap-2"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-5 h-5" />
                {lang === 'ru' ? 'Завершить' : 'Yakunlash'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
