'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Settings, Package, LogOut } from 'lucide-react';

export default function DashboardPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [lang, setLang] = useState<Locale | null>(null);

  useEffect(() => {
    params.then((p) => {
      setLang(p.lang);
      const savedRole = localStorage.getItem('user_role');
      if (!savedRole) {
        router.push(`/${p.lang}/login`);
      }
      setRole(savedRole);
    });
  }, [router, params]);

  const handleLogout = () => {
    if (!lang) return;
    localStorage.removeItem('is_auth');
    localStorage.removeItem('user_role');
    localStorage.removeItem('onboarded');
    window.dispatchEvent(new Event('auth-change'));
    router.push(`/${lang}`);
  };

  if (!lang) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-2">
          <Button variant="primary" className="w-full justify-start gap-3 py-6">
            <LayoutDashboard className="w-5 h-5" />
            {lang === 'ru' ? 'Дашборд' : 'Boshqaruv paneli'}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 py-6 text-slate-400">
            <Package className="w-5 h-5" />
            {role === 'freelancer' 
              ? (lang === 'ru' ? 'Мои услуги' : 'Mening xizmatlarim')
              : (lang === 'ru' ? 'Мои заказы' : 'Mening buyurtmalarim')}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 py-6 text-slate-400">
            <Settings className="w-5 h-5" />
            {lang === 'ru' ? 'Настройки' : 'Sozlamalar'}
          </Button>
          <div className="pt-8">
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="w-full justify-start gap-3 py-6 text-red-400 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/50"
            >
              <LogOut className="w-5 h-5" />
              {lang === 'ru' ? 'Выход' : 'Chiqish'}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">
              {lang === 'ru' ? 'Добро пожаловать!' : 'Xush kelibsiz!'}
            </h1>
            <div className="text-sm text-slate-400">
              Role: <span className="text-primary font-bold uppercase">{role}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  {lang === 'ru' ? 'Активные заказы' : 'Faol buyurtmalar'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">0</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  {lang === 'ru' ? 'Баланс' : 'Balans'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">$0.00</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  {lang === 'ru' ? 'Просмотры' : 'Ko\'rishlar'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">0</div>
              </CardContent>
            </Card>
          </div>

          <Card className="p-12 border-dashed border-2 border-dark-700 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mb-6">
              <Package className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {lang === 'ru' ? 'Здесь пока пусто' : 'Bu yerda hali bo\'sh'}
            </h3>
            <p className="text-slate-400 max-w-sm">
              {lang === 'ru' 
                ? 'У вас еще нет активных заказов или услуг. Начните работу прямо сейчас!' 
                : 'Sizda hali faol buyurtmalar yoki xizmatlar yo\'q. Ishni hoziroq boshlang!'}
            </p>
          </Card>
        </main>
      </div>
    </div>
  );
}
