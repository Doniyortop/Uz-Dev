'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { simpleAuth } from '@/lib/auth-simple';

export default function SimpleLoginPage({
  lang,
}: {
  lang: Locale;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await simpleAuth.login(email, password);
      
      if (user.onboarded) {
        router.push(`/${lang}/dashboard`);
      } else {
        router.push(`/${lang}/onboarding`);
      }
    } catch (err: any) {
      setError(err.message || (lang === 'ru' ? 'Ошибка входа' : 'Kirishda xatolik'));
    } finally {
      setIsLoading(false);
    }
  };

  const demoUsers = simpleAuth.getDemoUsers();

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center">
      <Card className="w-full max-w-md p-8">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold text-white mb-2">
            {lang === 'ru' ? 'Вход' : 'Kirish'}
          </CardTitle>
          <p className="text-slate-400">
            {lang === 'ru' ? 'С возвращением в UzDev Hub' : 'UzDev Hub-ga xush kelibsiz'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email</label>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  {lang === 'ru' ? 'Пароль' : 'Parol'}
                </label>
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••••"
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <Button disabled={isLoading} className="w-full py-6 text-lg font-bold">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                lang === 'ru' ? 'Войти' : 'Kirish'
              )}
            </Button>

            <div className="text-center text-sm text-slate-400">
              {lang === 'ru' ? 'Нет аккаунта?' : 'Hisobingiz yo\'qmi?'} {' '}
              <Link href={`/${lang}/register`} className="text-primary hover:underline font-medium">
                {lang === 'ru' ? 'Регистрация' : 'Ro\'yxatdan o\'tish'}
              </Link>
            </div>
          </form>

          {/* Demo Users Section */}
          <div className="mt-8 pt-8 border-t border-dark-700">
            <h3 className="text-sm font-medium text-slate-400 mb-4">
              {lang === 'ru' ? 'Демо пользователи:' : 'Demo foydalanuvchilar:'}
            </h3>
            <div className="space-y-2">
              {demoUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 bg-dark-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user.is_online ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                    <span className="text-sm text-slate-300">
                      {user.fullName}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({user.role})
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEmail(user.email);
                      setPassword('demo123');
                    }}
                    className="text-xs px-2 py-1"
                  >
                    {lang === 'ru' ? 'Заполнить' : 'To\'ldirish'}
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4">
              {lang === 'ru' ? 'Пароль для всех демо: demo123' : 'Barcha demo uchun parol: demo123'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
