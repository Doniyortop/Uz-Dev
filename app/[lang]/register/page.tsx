'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Locale, Dictionary } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { signUpWithEmailAndPassword } from '@/lib/supabase/auth';

export async function generateStaticParams() {
  return [
    { lang: 'ru' },
    { lang: 'uz' }
  ];
}

export default function RegisterPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load dictionary on client
  useEffect(() => {
    getDictionary(lang).then(setDictionary);
  }, [lang]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { user, session } = await signUpWithEmailAndPassword(email, password);

      if (user && session) {
        // In a real application, you would also save the full name to a user_profiles table in Supabase
        // For now, after successful registration, redirect to onboarding
        router.push(`/${lang}/onboarding`);
      } else {
        setError("Registration failed.");
      }
    } catch (err: any) {
      setError(err.message);
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
            {dictionary.auth.register_welcome}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  {dictionary.auth.full_name}
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="Doniyor Uzakov"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">{dictionary.auth.email}</label>
                <input 
                  required
                  type="email" 
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  {dictionary.auth.password}
                </label>
                <input 
                  required
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button disabled={isLoading} className="w-full py-6 text-lg font-bold">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                dictionary.common.register
              )}
            </Button>
            <div className="text-center text-sm text-slate-400">
              {dictionary.auth.has_account} {' '}
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
