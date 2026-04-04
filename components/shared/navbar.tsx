'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/types';
import { simpleAuth } from '@/lib/auth-simple';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, User, Briefcase } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  lang: Locale;
}

export default function Navbar({ lang }: NavbarProps) {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = simpleAuth.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      simpleAuth.logout();
      setUser(null);
      router.push(`/${lang}`);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-dark-900 border-b border-dark-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">UZ</span>
            </div>
            <span className="text-white font-bold text-lg">UzDev Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href={`/${lang}/services`}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {lang === 'ru' ? 'Услуги' : 'Xizmatlar'}
            </Link>
            <Link 
              href={`/${lang}/about`}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {lang === 'ru' ? 'О нас' : 'Biz haqimizda'}
            </Link>
            <Link 
              href={`/${lang}/help`}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {lang === 'ru' ? 'Помощь' : 'Yordam'}
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link href={`/${lang}/dashboard`}>
                  <Button variant="ghost" size="sm">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {lang === 'ru' ? 'Дашборд' : 'Boshqaruv paneli'}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  {lang === 'ru' ? 'Выход' : 'Chiqish'}
                </Button>
              </>
            ) : (
              <>
                <Link href={`/${lang}/login`}>
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    {lang === 'ru' ? 'Войти' : 'Kirish'}
                  </Button>
                </Link>
                <Link href={`/${lang}/register`}>
                  <Button variant="primary" size="sm">
                    {lang === 'ru' ? 'Регистрация' : 'Ro\'yxatdan o\'tish'}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-800">
            <div className="flex flex-col gap-4">
              <Link 
                href={`/${lang}/services`}
                className="text-slate-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {lang === 'ru' ? 'Услуги' : 'Xizmatlar'}
              </Link>
              <Link 
                href={`/${lang}/about`}
                className="text-slate-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {lang === 'ru' ? 'О нас' : 'Biz haqimizda'}
              </Link>
              <Link 
                href={`/${lang}/help`}
                className="text-slate-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {lang === 'ru' ? 'Помощь' : 'Yordam'}
              </Link>
              
              {user ? (
                <>
                  <Link 
                    href={`/${lang}/dashboard`}
                    className="text-slate-300 hover:text-white transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {lang === 'ru' ? 'Дашборд' : 'Boshqaruv paneli'}
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    className="w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {lang === 'ru' ? 'Выход' : 'Chiqish'}
                  </Button>
                </>
              ) : (
                <>
                  <Link 
                    href={`/${lang}/login`}
                    className="text-slate-300 hover:text-white transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {lang === 'ru' ? 'Войти' : 'Kirish'}
                  </Link>
                  <Link 
                    href={`/${lang}/register`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="primary" size="sm" className="w-full">
                      {lang === 'ru' ? 'Регистрация' : 'Ro\'yxatdan o\'tish'}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
