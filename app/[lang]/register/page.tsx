'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Locale, Dictionary } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

import { signUpWithEmailAndPassword } from '@/lib/supabase/auth';

export default function RegisterPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Load dictionary on client
  useEffect(() => {
    getDictionary(lang).then(setDictionary);
  }, [lang]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await signUpWithEmailAndPassword(email, password);
      
      // Save name and auth status for legacy compatibility
      localStorage.setItem('user_name', fullName);
      localStorage.setItem('is_auth', 'true');
      window.dispatchEvent(new Event('auth-change'));
      
      router.push(`/${lang}/onboarding`);
    } catch (err: any) {
      setError(err.message || (lang === 'ru' ? 'Ошибка регистрации' : 'Ro\'yxatdan o\'tishda xatolik'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!dictionary || !lang) return null;

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center">
      <Card className="w-full max-w-md p-8">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold text-white mb-2">
            {dictionary.common.register}
          </CardTitle>
          <p className="text-slate-400">
            {lang === 'ru' ? 'Станьте частью сообщества UzDev Hub' : 'UzDev Hub hamjamiyatining a\'zosi bo\'ling'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  {lang === 'ru' ? 'Имя и фамилия' : 'Ism va familiya'}
                </label>
                <input 
                  required
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Doniyor Uzakov"
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
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
                  placeholder="••••••••"
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
            <Button disabled={isLoading} className="w-full py-6 text-lg font-bold">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                dictionary.common.register
              )}
            </Button>
            <div className="text-center text-sm text-slate-400">
              {lang === 'ru' ? 'Уже есть аккаунт?' : 'Hisobingiz bormi?'} {' '}
              <Link href={`/${lang}/login`} className="text-primary hover:underline font-medium">
                {dictionary.common.login}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
