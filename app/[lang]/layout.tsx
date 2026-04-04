import '../globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';
import { Locale } from '@/types';
import { getDictionary } from '@/lib/i18n/get-dictionary';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return [{ lang: 'ru' }, { lang: 'uz' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  
  const title = lang === 'ru' 
    ? 'UzDev Hub - IT-маркетплейс Узбекистана' 
    : 'UzDev Hub - O\'zbekiston IT-marketpleysi';
  
  return {
    title,
    description: dictionary?.hero?.subtitle || '',
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'ru';
  const validLocale = (lang === 'ru' || lang === 'uz') ? lang : 'ru';

  return (
    <html lang={validLocale}>
      <body className={`${inter.className} min-h-screen bg-dark-900 text-foreground flex flex-col`}>
        <Navbar lang={validLocale as Locale} />
        <main className="flex-grow">{children}</main>
        <Footer lang={validLocale as Locale} />
      </body>
    </html>
  );
}
