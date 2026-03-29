'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Settings, Package, LogOut, User, Bell, CreditCard } from 'lucide-react';

type Tab = 'overview' | 'items' | 'settings';

export default function DashboardPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    const savedRole = localStorage.getItem('user_role');
    if (!savedRole) {
      router.push(`/${lang}/login`);
    }
    setRole(savedRole);
  }, [router, lang]);

  const handleLogout = () => {
    localStorage.removeItem('is_auth');
    localStorage.removeItem('user_role');
    localStorage.removeItem('onboarded');
    window.dispatchEvent(new Event('auth-change'));
    router.push(`/${lang}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-2">
          <Button 
            variant={activeTab === 'overview' ? 'primary' : 'ghost'} 
            onClick={() => setActiveTab('overview')}
            className={`w-full justify-start gap-3 py-6 ${activeTab !== 'overview' ? 'text-slate-400' : ''}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            {lang === 'ru' ? 'Дашборд' : 'Boshqaruv paneli'}
          </Button>
          <Button 
            variant={activeTab === 'items' ? 'primary' : 'ghost'} 
            onClick={() => setActiveTab('items')}
            className={`w-full justify-start gap-3 py-6 ${activeTab !== 'items' ? 'text-slate-400' : ''}`}
          >
            <Package className="w-5 h-5" />
            {role === 'freelancer' 
              ? (lang === 'ru' ? 'Мои услуги' : 'Mening xizmatlarim')
              : (lang === 'ru' ? 'Мои заказы' : 'Mening buyurtmalarim')}
          </Button>
          <Button 
            variant={activeTab === 'settings' ? 'primary' : 'ghost'} 
            onClick={() => setActiveTab('settings')}
            className={`w-full justify-start gap-3 py-6 ${activeTab !== 'settings' ? 'text-slate-400' : ''}`}
          >
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
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                    <CardTitle className="text-sm font-medium text-slate-400 text-base">
                      {lang === 'ru' ? 'Активные заказы' : 'Faol buyurtmalar'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">0</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 text-base">
                      {lang === 'ru' ? 'Баланс' : 'Balans'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">$0.00</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 text-base">
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
            </div>
          )}

          {activeTab === 'items' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-bold text-white">
                {role === 'freelancer' 
                  ? (lang === 'ru' ? 'Мои услуги' : 'Mening xizmatlarim')
                  : (lang === 'ru' ? 'Мои заказы' : 'Mening buyurtmalarim')}
              </h1>
              <Card className="p-12 border-dashed border-2 border-dark-700 flex flex-col items-center justify-center text-center">
                <Package className="w-12 h-12 text-slate-600 mb-4" />
                <p className="text-slate-400">
                  {lang === 'ru' ? 'Список пуст' : 'Ro\'yxat bo\'sh'}
                </p>
                <Button className="mt-6">
                  {role === 'freelancer' 
                    ? (lang === 'ru' ? 'Добавить услугу' : 'Xizmat qo\'shish')
                    : (lang === 'ru' ? 'Найти исполнителя' : 'Ijrochi topish')}
                </Button>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-bold text-white">
                {lang === 'ru' ? 'Настройки профиля' : 'Profil sozlamalari'}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{lang === 'ru' ? 'Личные данные' : 'Shaxsiy ma\'lumotlar'}</h3>
                      <p className="text-slate-400 text-sm">{lang === 'ru' ? 'Измените ваше имя и био' : 'Ismingiz va bioni o\'zgartiring'}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">{lang === 'ru' ? 'Редактировать' : 'Tahrirlash'}</Button>
                </Card>

                <Card className="p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Bell className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{lang === 'ru' ? 'Уведомления' : 'Bildirishnomalar'}</h3>
                      <p className="text-slate-400 text-sm">{lang === 'ru' ? 'Настройте оповещения' : 'Bildirishnomalarni sozlang'}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">{lang === 'ru' ? 'Настроить' : 'Sozlash'}</Button>
                </Card>

                <Card className="p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <CreditCard className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{lang === 'ru' ? 'Выплаты' : 'To\'lovlar'}</h3>
                      <p className="text-slate-400 text-sm">{lang === 'ru' ? 'Кошелек и история' : 'Hamyon va tarix'}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">{lang === 'ru' ? 'Управление' : 'Boshqarish'}</Button>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
