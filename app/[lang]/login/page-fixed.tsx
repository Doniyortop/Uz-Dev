'use client';

import { use } from 'react';
import { Locale } from '@/types';
import SimpleLoginPage from './simple-login';

export default function LoginPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = use(params);
  
  return <SimpleLoginPage lang={lang} />;
}
