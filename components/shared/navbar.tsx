import Link from 'next/link';
import { Locale } from '@/types';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export default async function Navbar({ lang }: { lang: Locale }) {
  const dictionary = await getDictionary(lang);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-dark-700 bg-dark-900/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href={`/${lang}`} className="text-2xl font-bold text-white group flex items-center gap-2">
            <span className="text-primary group-hover:scale-110 transition-transform">Uz</span>Dev Hub
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href={`/${lang}/services`} className="text-slate-300 hover:text-primary transition-colors">
              {dictionary.common.categories}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href={lang === 'ru' ? '/uz' : '/ru'} 
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group px-3 py-1.5 rounded-md hover:bg-dark-800"
          >
            <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-medium uppercase">
              {lang === 'ru' ? 'UZ' : 'RU'}
            </span>
          </Link>
          <Link href={`/${lang}/login`}>
            <Button variant="ghost" className="hidden sm:inline-flex">
              {dictionary.common.login}
            </Button>
          </Link>
          <Link href={`/${lang}/register`}>
            <Button variant="primary">
              {dictionary.common.register}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
