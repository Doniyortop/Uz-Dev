'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Locale, Dictionary } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Briefcase, Check } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getSession } from '@/lib/supabase/auth';
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
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDictionary(lang).then(setDictionary);
    const fetchUserSession = async () => {
      const session = await getSession();
      if (session) {
        setUserId(session.user.id);
      } else {
        // If no session, redirect to login
        router.push(`/${lang}/login`);
      }
    };
    fetchUserSession();
  }, [lang, router]);

  const handleComplete = async () => {
    if (!role || !userId) return;
    setIsLoading(true);
    setError(null);

    try {
      await updateUserProfile(userId, { role, onboarded: true });
      router.push(`/${lang}/dashboard`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!dictionary || !lang) return null;

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center">
      <Card className="w-full max-w-2xl p-8">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold text-white mb-2">
            {dictionary.onboarding.title}
          </CardTitle>
          <p className="text-slate-400">
            {dictionary.onboarding.subtitle}
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
                {dictionary.onboarding.freelancer_title}
              </h3>
              <p className="text-slate-400 text-sm">
                {dictionary.onboarding.freelancer_desc}
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
                {dictionary.onboarding.client_title}
              </h3>
              <p className="text-slate-400 text-sm">
                {dictionary.onboarding.client_desc}
              </p>
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
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
                {dictionary.onboarding.complete}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
