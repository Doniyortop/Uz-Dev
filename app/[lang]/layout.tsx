import '../globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/shared/navbar';
import { Locale } from '@/types';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata = {
  title: 'UzDev Hub - IT-маркетплейс Узбекистана',
  description: 'Лучшие IT-специалисты Узбекистана: Telegram-боты, сайты, дизайн и игровые серверы.',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <body className={`${inter.className} min-h-screen bg-dark-900 text-foreground`}>
        <Navbar lang={lang as Locale} />
        <main>{children}</main>
        {/* Footer will go here */}
      </body>
    </html>
  );
}
