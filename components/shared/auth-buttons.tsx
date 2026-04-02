'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Github, Mail } from 'lucide-react';
import { signInWithProvider, signInWithEmailAndPassword } from '@/lib/supabase/auth';
import { Locale } from '@/types';

interface AuthButtonsProps {
  lang: Locale;
  onClose?: () => void;
}

export function AuthButtons({ lang, onClose }: AuthButtonsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleProviderSignIn = async (provider: 'github' | 'google') => {
    setIsLoading(provider);
    try {
      await signInWithProvider(provider);
      onClose?.();
    } catch (error) {
      console.error('Error signing in with provider:', error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        className="w-full gap-2 border-dark-700 hover:bg-dark-800"
        onClick={() => handleProviderSignIn('github')}
        disabled={isLoading !== null}
      >
        {isLoading === 'github' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Github className="w-4 h-4" />
        )}
        {lang === 'ru' ? 'Войти через GitHub' : 'GitHub orqali kirish'}
      </Button>

      <Button
        variant="outline"
        className="w-full gap-2 border-dark-700 hover:bg-dark-800"
        onClick={() => handleProviderSignIn('google')}
        disabled={isLoading !== null}
      >
        {isLoading === 'google' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Mail className="w-4 h-4" />
        )}
        {lang === 'ru' ? 'Войти через Google' : 'Google orqali kirish'}
      </Button>
    </div>
  );
}
