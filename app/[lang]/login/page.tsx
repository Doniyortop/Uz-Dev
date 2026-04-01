'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Locale, Dictionary } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { signInWithEmailAndPassword, getSession } from '@/lib/supabase/auth';

export default function LoginPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load dictionary on client
  useEffect(() => {
    getDictionary(lang).then(setDictionary);
  }, [lang]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { user, session } = await signInWithEmailAndPassword(email, password);

      if (user && session) {
        // Instead of localStorage, we rely on Supabase session management
        // You might want to fetch user profile from Supabase and check onboarding status
        // For now, let's assume successful login leads to dashboard or onboarding
        const currentSession = await getSession();
        if (currentSession) {
          // In a real app, you'd check a user_profiles table for onboarding status
          // For now, redirect to dashboard as a default successful login
          router.push(`/${lang}/dashboard`);
        } else {
          // Handle case where session is not immediately available (shouldn't happen with signInWithPassword)
          setError("Login successful, but no session found. Please try again.");
        }
      } else {
        setError("Login failed. Please check your credentials.");
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
            {dictionary.common.login}
          </CardTitle>
          <p className="text-slate-400">
            {dictionary.auth.login_welcome}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
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
                dictionary.common.login
              )}
            </Button>
            <div className="text-center text-sm text-slate-400">
              {dictionary.auth.no_account} {' '}
              <Link href={`/${lang}/register`} className="text-primary hover:underline font-medium">
                {dictionary.common.register}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
