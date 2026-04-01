'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale, Dictionary } from '@/types';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Button } from '@/components/ui/button';
import { Globe, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { getSession, signOut, getUser } from '@/lib/supabase/auth';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export default function Navbar({ lang }: { lang: Locale }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const getLangSwitchUrl = () => {
    const newLang = lang === 'ru' ? 'uz' : 'ru';
    if (!pathname) return `/${newLang}`;
    const segments = pathname.split('/');
    segments[1] = newLang;
    return segments.join('/');
  };

  useEffect(() => {
    const fetchSessionAndUser = async () => {
      const currentSession = await getSession();
      setSession(currentSession);
      if (currentSession) {
        const currentUser = await getUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }
    };
    
    fetchSessionAndUser();
    getDictionary(lang).then(setDictionary);

    const handleAuthChange = () => {
      fetchSessionAndUser();
    };

    window.addEventListener('auth-change', handleAuthChange);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [lang]);

  const handleLogout = async () => {
    try {
      await signOut();
      setSession(null);
      setUser(null);
      setIsMenuOpen(false);
      // No need to dispatch custom event, Supabase handles it internally
      window.location.href = `/${lang}`;
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!dictionary) return null;

  const isAuthenticated = !!session;
  const userName = user?.email || dictionary.auth.user_name;

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
            href={getLangSwitchUrl()} 
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group px-3 py-1.5 rounded-md hover:bg-dark-800"
          >
            <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-medium uppercase">
              {lang === 'ru' ? 'UZ' : 'RU'}
            </span>
          </Link>

          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full bg-dark-800 border border-dark-700 hover:border-primary/50 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                  {userName[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium text-white hidden sm:block">{userName}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 z-50">
                  <div className="p-2 space-y-1">
                    <Link 
                      href={`/${lang}/dashboard`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {dictionary.auth.dashboard}
                    </Link>
                    <Link 
                      href={`/${lang}/freelancers/${user?.id || 'doniyor'}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4" />
                      {dictionary.auth.my_profile}
                    </Link>
                    <div className="h-px bg-dark-700 my-1 mx-2" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {dictionary.auth.logout}
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
