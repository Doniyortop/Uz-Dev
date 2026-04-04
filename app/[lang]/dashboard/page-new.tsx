'use client';

import { use } from 'react';
import { Locale } from '@/types';
import SimpleDashboardPage from './simple-dashboard';

export default function DashboardPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = use(params);
  
  return <SimpleDashboardPage lang={lang} />;
}
