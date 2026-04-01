'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  const [isEditing, setIsEditing] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [profileName, setProfileName] = useState('User Name');
  const [profileBio, setProfileBio] = useState('Senior Developer from Tashkent');
  const [userServices, setUserServices] = useState<any[]>([]);

  useEffect(() => {
    const savedRole = localStorage.getItem('user_role');
    const savedName = localStorage.getItem('user_name');
    const savedBio = localStorage.getItem('user_bio');
    const savedServices = JSON.parse(localStorage.getItem('user_services') || '[]');
    
    if (savedName) setProfileName(savedName);
    if (savedBio) setProfileBio(savedBio);
    setUserServices(savedServices);
    
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
                      {role === 'freelancer' 
                        ? (lang === 'ru' ? 'Всего услуг' : 'Jami xizmatlar')
                        : (lang === 'ru' ? 'Активные заказы' : 'Faol buyurtmalar')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">
                      {role === 'freelancer' ? userServices.length : 0}
                    </div>
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

              {((role === 'freelancer' && userServices.length === 0) || (role === 'client')) && (
                <Card className="p-12 border-dashed border-2 border-dark-700 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mb-6">
                    <Package className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {lang === 'ru' ? 'Здесь пока пусто' : 'Bu yerda hali bo\'sh'}
                  </h3>
                  <p className="text-slate-400 max-w-sm mb-6">
                    {role === 'freelancer' 
                      ? (lang === 'ru' ? 'У вас еще нет активных услуг. Добавьте первую услугу!' : 'Sizda hali faol xizmatlar yo\'q. Birinchi xizmatingizni qo\'shing!')
                      : (lang === 'ru' ? 'У вас еще нет активных заказов. Найдите исполнителя!' : 'Sizda hali faol buyurtmalar yo\'q. Ijrochi toping!')}
                  </p>
                  {role && (
                    <Button 
                      key={`overview-${role}`}
                      href={role === 'freelancer' ? `/${lang}/dashboard/services/new` : `/${lang}/services`}
                      className="px-8"
                    >
                      {role === 'freelancer' 
                        ? (lang === 'ru' ? 'Добавить услугу' : 'Xizmat qo\'shish')
                        : (lang === 'ru' ? 'Найти исполнителя' : 'Ijrochi topish')}
                    </Button>
                  )}
                </Card>
              )}

              {role === 'freelancer' && userServices.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white">
                    {lang === 'ru' ? 'Ваши последние услуги' : 'Oxirgi xizmatlaringiz'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userServices.slice(0, 3).map((service) => (
                      <Card key={service.id} className="overflow-hidden group border-dark-700 hover:border-primary/50 transition-all">
                        <div className="h-24 bg-dark-700 relative">
                          {service.image ? (
                            <img src={service.image} alt={service.title} className="w-full h-full object-cover opacity-60" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-dark-900/80 backdrop-blur-sm text-primary">
                              ${service.price}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-white text-sm line-clamp-1">{service.title}</h3>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-[10px] text-slate-500 uppercase font-bold">
                              {service.category}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'items' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">
                  {role === 'freelancer' 
                    ? (lang === 'ru' ? 'Мои услуги' : 'Mening xizmatlarim')
                    : (lang === 'ru' ? 'Мои заказы' : 'Mening buyurtmalarim')}
                </h1>
                {role === 'freelancer' && (
                  <Button href={`/${lang}/dashboard/services/new`} size="sm">
                    {lang === 'ru' ? 'Добавить' : 'Qo\'shish'}
                  </Button>
                )}
              </div>

              {userServices.length > 0 && role === 'freelancer' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userServices.map((service) => (
                    <Card key={service.id} className="overflow-hidden group border-dark-700 hover:border-primary/50 transition-all">
                      <div className="h-32 bg-dark-700 relative">
                        {service.image ? (
                          <img src={service.image} alt={service.title} className="w-full h-full object-cover opacity-60" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <Package className="w-8 h-8" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-dark-900/80 backdrop-blur-sm text-primary">
                            ${service.price}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-white mb-1 line-clamp-1">{service.title}</h3>
                        <p className="text-slate-400 text-xs line-clamp-2 mb-3">{service.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                            {service.category}
                          </span>
                          <Button variant="ghost" size="sm" className="h-8 text-xs">
                            {lang === 'ru' ? 'Изменить' : 'Tahrirlash'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 border-dashed border-2 border-dark-700 flex flex-col items-center justify-center text-center">
                  <Package className="w-12 h-12 text-slate-600 mb-4" />
                  <p className="text-slate-400">
                    {lang === 'ru' ? 'Список пуст' : 'Ro\'yxat bo\'sh'}
                  </p>
                  {role && (
                    <Button 
                      key={`items-${role}`}
                      href={role === 'freelancer' ? `/${lang}/dashboard/services/new` : `/${lang}/services`}
                      className="mt-6"
                    >
                      {role === 'freelancer' 
                        ? (lang === 'ru' ? 'Добавить услугу' : 'Xizmat qo\'shish')
                        : (lang === 'ru' ? 'Найти исполнителя' : 'Ijrochi topish')}
                    </Button>
                  )}
                </Card>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">
                  {lang === 'ru' ? 'Настройки профиля' : 'Profil sozlamalari'}
                </h1>
                {(isEditing || isConfiguring) && (
                  <Button variant="ghost" onClick={() => { setIsEditing(false); setIsConfiguring(false); }}>
                    {lang === 'ru' ? 'Назад' : 'Orqaga'}
                  </Button>
                )}
              </div>
              
              {!isEditing && !isConfiguring ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{profileName}</h3>
                        <p className="text-slate-400 text-sm line-clamp-1">{profileBio}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setIsEditing(true)}
                    >
                      {lang === 'ru' ? 'Редактировать' : 'Tahrirlash'}
                    </Button>
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
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setIsConfiguring(true)}
                    >
                      {lang === 'ru' ? 'Настроить' : 'Sozlash'}
                    </Button>
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
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => alert(lang === 'ru' ? 'Управление выплатами будет доступно в следующей версии!' : 'To\'lovlarni boshqarish keyingi versiyada mavjud bo\'ladi!')}
                    >
                      {lang === 'ru' ? 'Управление' : 'Boshqarish'}
                    </Button>
                  </Card>

                  <Card className="p-6 space-y-6 border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <LayoutDashboard className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{lang === 'ru' ? 'Смена роли' : 'Rolni o\'zgartirish'}</h3>
                        <p className="text-slate-400 text-sm">
                          {lang === 'ru' 
                            ? `Текущая роль: ${role === 'freelancer' ? 'Фрилансер' : 'Заказчик'}` 
                            : `Hozirgi rol: ${role === 'freelancer' ? 'Frilanser' : 'Mijoz'}`}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="primary" 
                      className="w-full"
                      onClick={() => {
                        const newRole = role === 'freelancer' ? 'client' : 'freelancer';
                        localStorage.setItem('user_role', newRole);
                        setRole(newRole);
                        window.dispatchEvent(new Event('auth-change'));
                        // Refresh to sync role properly
                        window.location.reload();
                      }}
                    >
                      {lang === 'ru' ? 'Переключить роль' : 'Rolni almashtirish'}
                    </Button>
                  </Card>
                </div>
              ) : isEditing ? (
                <Card className="p-8 max-w-2xl border-dark-700 bg-dark-800">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">
                        {lang === 'ru' ? 'Полное имя' : 'To\'liq ism'}
                      </label>
                      <input 
                        type="text" 
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">
                        {lang === 'ru' ? 'О себе' : 'Men haqimda'}
                      </label>
                      <textarea 
                        rows={4}
                        value={profileBio}
                        onChange={(e) => setProfileBio(e.target.value)}
                        className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary resize-none"
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button 
                        className="flex-grow"
                        onClick={() => {
                          localStorage.setItem('user_name', profileName);
                          localStorage.setItem('user_bio', profileBio);
                          window.dispatchEvent(new Event('auth-change'));
                          alert(lang === 'ru' ? 'Изменения сохранены!' : 'O\'zgarishlar saqlandi!');
                          setIsEditing(false);
                        }}
                      >
                        {lang === 'ru' ? 'Сохранить' : 'Saqlash'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => setIsEditing(false)}
                      >
                        {lang === 'ru' ? 'Отмена' : 'Bekor qilish'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-8 max-w-2xl border-dark-700 bg-dark-800">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-dark-700 rounded-xl">
                      <div>
                        <h4 className="text-white font-bold">{lang === 'ru' ? 'Email уведомления' : 'Email bildirishnomalar'}</h4>
                        <p className="text-slate-400 text-sm">{lang === 'ru' ? 'Получать письма о заказах' : 'Buyurtmalar haqida xat olish'}</p>
                      </div>
                      <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-dark-700 rounded-xl">
                      <div>
                        <h4 className="text-white font-bold">{lang === 'ru' ? 'Telegram бот' : 'Telegram bot'}</h4>
                        <p className="text-slate-400 text-sm">{lang === 'ru' ? 'Уведомления в мессенджер' : 'Messenjerga bildirishnomalar'}</p>
                      </div>
                      <div className="w-12 h-6 bg-dark-600 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button 
                        className="flex-grow"
                        onClick={() => {
                          alert(lang === 'ru' ? 'Настройки уведомлений сохранены!' : 'Bildirishnoma sozlamalari saqlandi!');
                          setIsConfiguring(false);
                        }}
                      >
                        {lang === 'ru' ? 'Сохранить' : 'Saqlash'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => setIsConfiguring(false)}
                      >
                        {lang === 'ru' ? 'Назад' : 'Orqaga'}
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
