import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Locale, Dictionary } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bot, Code, Paintbrush, Gamepad2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { FadeIn } from '@/components/shared/fade-in';

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'ru';
  const dictionary = await getDictionary(lang);

  const categories = [
    { key: 'tg_bots', icon: Bot },
    { key: 'web_dev', icon: Code },
    { key: 'design', icon: Paintbrush },
    { key: 'game_servers', icon: Gamepad2 },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        
        <div className="container relative z-10 px-4 mx-auto text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-dark-700 bg-dark-800/50 text-sm text-primary mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              UzDev Hub - Marketplace for Uzbekistan
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight tracking-tight">
              {dictionary.hero.title.split(' ').map((word: string, i: number) => (
                <span key={i} className={word.toLowerCase().includes('it') ? 'text-primary' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              {dictionary.hero.subtitle}
            </p>
          </FadeIn>
          
          <FadeIn delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" href={`/${lang}/services`} className="w-full sm:w-auto group">
                {dictionary.hero.cta}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" href={`/${lang}/services`} className="w-full sm:w-auto">
                {dictionary.common.categories}
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-dark-900 relative">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="flex flex-col items-center mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {dictionary.common.categories}
              </h2>
              <div className="h-1.5 w-20 bg-primary rounded-full" />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map(({ key, icon: Icon }, index) => (
              <FadeIn key={key} delay={index * 0.1}>
                <Link href={`/${lang}/services?category=${key}`}>
                  <Card className="p-8 flex flex-col items-center text-center h-full">
                    <div className="w-16 h-16 bg-dark-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {dictionary.categories[key as keyof typeof dictionary.categories]}
                    </h3>
                    <p className="text-slate-400 text-sm mb-6">
                      {dictionary.categories.find_experts}
                    </p>
                    <div className="mt-auto pt-4 border-t border-dark-700 w-full group-hover:border-primary/20 transition-colors">
                      <span className="text-primary text-sm font-medium inline-flex items-center group-hover:gap-2 transition-all">
                        {dictionary.categories.view_services}
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </span>
                    </div>
                  </Card>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
