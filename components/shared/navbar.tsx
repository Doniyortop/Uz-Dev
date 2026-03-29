'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Locale } from '@/types';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Button } from '@/components/ui/button';
import { Globe, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';

export default function Navbar({ lang }: { lang: Locale }) {
  const [isAuth, setIsAuth] = useState(false);
  const [dictionary, setDictionary] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Initial check
    setIsAuth(localStorage.getItem('is_auth') === 'true');
    getDictionary(lang).then(setDictionary);

    // Listen for auth changes
    const handleAuthChange = () => {
      setIsAuth(localStorage.getItem('is_auth') === 'true');
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, [lang]);

  const handleLogout = () => {
    localStorage.removeItem('is_auth');
    localStorage.removeItem('user_role');
    localStorage.removeItem('onboarded');
    setIsAuth(false);
    setIsMenuOpen(false);
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = `/${lang}`;
  };

  if (!dictionary) return null;

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
          {/* Language Switcher */}
          <Link 
            href={lang === 'ru' ? '/uz' : '/ru'} 
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group px-3 py-1.5 rounded-md hover:bg-dark-800"
          >
            <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-medium uppercase">
              {lang === 'ru' ? 'UZ' : 'RU'}
            </span>
          </Link>

          {isAuth ? (
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full bg-dark-800 border border-dark-700 hover:border-primary/50 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                  U
                </div>
                <span className="text-sm font-medium text-white hidden sm:block">User Name</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="p-2 space-y-1">
                    <Link 
                      href={`/${lang}/dashboard`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {lang === 'ru' ? 'Дашборд' : 'Boshqaruv paneli'}
                    </Link>
                    <Link 
                      href={`/${lang}/dashboard`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4" />
                      {lang === 'ru' ? 'Мой профиль' : 'Mening profilim'}
                    </Link>
                    <div className="h-px bg-dark-700 my-1 mx-2" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {lang === 'ru' ? 'Выход' : 'Chiqish'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button variant="ghost" href={`/${lang}/login`} className="hidden sm:inline-flex">
                {dictionary.common.login}
              </Button>
              <Button variant="primary" href={`/${lang}/register`}>
                {dictionary.common.register}
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
