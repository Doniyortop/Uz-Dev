import '../globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';
import { Locale } from '@/types';
import { getDictionary } from '@/lib/i18n/get-dictionary';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  
  return {
    title: `UzDev Hub - ${lang === 'ru' ? 'IT-маркетплейс Узбекистана' : 'O\'zbekiston IT-marketpleysi'}`,
    description: dictionary.hero.subtitle,
  };
}

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
      <body className={`${inter.className} min-h-screen bg-dark-900 text-foreground flex flex-col`}>
        <Navbar lang={lang as Locale} />
        <main className="flex-grow">{children}</main>
        <Footer lang={lang as Locale} />
      </body>
    </html>
  );
}
