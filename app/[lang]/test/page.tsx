'use client';

import { use } from 'react';
import { Locale } from '@/types';

export default function TestPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = use(params);

  return (
    <div className="min-h-screen bg-dark-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">
        {lang === 'ru' ? 'Тестовая страница' : 'Test sahifa'}
      </h1>
      <p className="text-xl">
        {lang === 'ru' ? 'Сайт работает без помех!' : 'Sayt to\'sizsiz ishlamoqda!'}
      </p>
      <div className="mt-8 space-y-4">
        <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
          <h2 className="text-green-400 font-bold mb-2">✅ Статус: OK</h2>
          <p className="text-green-300">
            {lang === 'ru' ? 'Все компоненты загружены успешно' : 'Barcha komponentlar muvaffaqiyatli yuklandi'}
          </p>
        </div>
        <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
          <h2 className="text-blue-400 font-bold mb-2">🔧 Техническая информация</h2>
          <ul className="text-blue-300 space-y-1">
            <li>• Next.js 15.5.14</li>
            <li>• TypeScript: ✅</li>
            <li>• Tailwind CSS: ✅</li>
            <li>• Framer Motion: ✅</li>
            <li>• Lucide Icons: ✅</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
