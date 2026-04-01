import Link from 'next/link';
import { Locale, Dictionary } from '@/types';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Github, Twitter, Send } from 'lucide-react';

export default async function Footer({ lang }: { lang: Locale }) {
  const dictionary = await getDictionary(lang);

  if (!dictionary) return null;

  return (
    <footer className="border-t border-dark-700 bg-dark-900 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <Link href={`/${lang}`} className="text-2xl font-bold text-white mb-6 block">
              <span className="text-primary">Uz</span>Dev Hub
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {dictionary.hero.subtitle}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-slate-400 hover:text-primary transition-colors border border-dark-700">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-slate-400 hover:text-primary transition-colors border border-dark-700">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-slate-400 hover:text-primary transition-colors border border-dark-700">
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">{dictionary.common.categories}</h4>
            <ul className="space-y-4">
              {Object.entries(dictionary.categories).map(([key, value]: [string, string]) => (
                <li key={key}>
                  <Link href={`/${lang}/services?category=${key}`} className="text-slate-400 hover:text-primary text-sm transition-colors">
                    {value}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">{dictionary.footer.platform}</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href={`/${lang}/services`} className="hover:text-primary transition-colors">{dictionary.footer.all_services}</Link></li>
              <li><Link href={`/${lang}/freelancers`} className="hover:text-primary transition-colors">{dictionary.footer.freelancers}</Link></li>
              <li><Link href={`/${lang}/about`} className="hover:text-primary transition-colors">{dictionary.footer.about}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">{dictionary.footer.support}</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href={`/${lang}/help`} className="hover:text-primary transition-colors">{dictionary.footer.help}</Link></li>
              <li><Link href={`/${lang}/rules`} className="hover:text-primary transition-colors">{dictionary.footer.rules}</Link></li>
              <li><Link href={`/${lang}/privacy`} className="hover:text-primary transition-colors">{dictionary.footer.privacy}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} UzDev Hub. {dictionary.footer.rights}.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <span>Made with ❤️ in Uzbekistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
