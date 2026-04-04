'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, Settings, Package, LogOut, User, Bell, CreditCard } from 'lucide-react';
import { simpleAuth } from '@/lib/auth-simple';

type Tab = 'overview' | 'items' | 'settings';

export default function DashboardPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = simpleAuth.getCurrentUser();
        if (!currentUser) {
          console.log('No user found, redirecting to login');
          router.push(`/${lang}/login`);
          return;
        }

        console.log('User found:', currentUser.email);
        setUser(currentUser);
        setProfileName(currentUser.fullName || '');
        setProfileBio(currentUser.bio || '');
        
        // Mock services for demo
        const mockServices = [
          { id: '1', title: 'Веб-разработка', price: 100, category: 'web-development' },
          { id: '2', title: 'Мобильное приложение', price: 200, category: 'mobile-development' }
        ];
        setServices(mockServices);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        router.push(`/${lang}/login`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router, lang]);

  const handleLogout = async () => {
    try {
      simpleAuth.logout();
      router.push(`/${lang}`);
    } catch (error) {
      console.error('Error logging out:', error);
      router.push(`/${lang}`);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      // In real app, save to backend
      const updatedUser = { ...user, fullName: profileName, bio: profileBio };
      setUser(updatedUser);
      localStorage.setItem('simple_auth', JSON.stringify({
        user: updatedUser,
        expires: Date.now() + (24 * 60 * 60 * 1000)
      }));
      
      setIsEditing(false);
      alert(lang === 'ru' ? 'Профиль обновлен!' : 'Profil yangilandi!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(lang === 'ru' ? 'Ошибка при обновлении профиля' : 'Profilni yangilashda xatolik');
    }
  };

  const handleRoleChange = async (newRole: 'freelancer' | 'client') => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem('simple_auth', JSON.stringify({
        user: updatedUser,
        expires: Date.now() + (24 * 60 * 60 * 1000)
      }));
      window.location.reload();
    } catch (error) {
      console.error('Error updating role:', error);
      alert(lang === 'ru' ? 'Ошибка при смене роли' : 'Rolni o\'zgartirishda xatolik');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-dark-700 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="h-96 bg-dark-700 rounded"></div>
            <div className="md:col-span-3 h-96 bg-dark-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">
          {lang === 'ru' ? 'Доступ запрещен' : 'Ruxsat berilmagan'}
        </h1>
        <Button onClick={() => router.push(`/${lang}/login`)}>
          {lang === 'ru' ? 'Войти' : 'Kirish'}
        </Button>
      </div>
    );
  }

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
            {user.role === 'freelancer' 
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
                  Role: <span className="text-primary font-bold uppercase">{user.role}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 text-base">
                      {user.role === 'freelancer' 
                        ? (lang === 'ru' ? 'Всего услуг' : 'Jami xizmatlar')
                        : (lang === 'ru' ? 'Активные заказы' : 'Faol buyurtmalar')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">
                      {user.role === 'freelancer' ? services.length : 0}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 text-base">
                      {lang === 'ru' ? 'Рейтинг' : 'Reyting'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">
                      {user.rating?.toFixed(1) || '0.0'}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 text-base">
                      {lang === 'ru' ? 'Онлайн статус' : 'Online status'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${user.is_online ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                      <span className="text-white font-medium">
                        {user.is_online ? (lang === 'ru' ? 'В сети' : 'Onlayn') : (lang === 'ru' ? 'Офлайн' : 'Oflayn')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {((user.role === 'freelancer' && services.length === 0) || (user.role === 'client')) && (
                <Card className="p-12 border-dashed border-2 border-dark-700 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mb-6">
                    <Package className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {lang === 'ru' ? 'Здесь пока пусто' : 'Bu yerda hali bo\'sh'}
                  </h3>
                  <p className="text-slate-400 max-w-sm mb-6">
                    {user.role === 'freelancer' 
                      ? (lang === 'ru' ? 'У вас еще нет активных услуг. Добавьте первую услугу!' : 'Sizda hali faol xizmatlar yo\'q. Birinchi xizmatingizni qo\'shing!')
                      : (lang === 'ru' ? 'У вас еще нет активных заказов. Найдите исполнителя!' : 'Sizda hali faol buyurtmalar yo\'q. Ijrochi toping!')}
                  </p>
                  <Button 
                    href={user.role === 'freelancer' ? `/${lang}/dashboard/services/new` : `/${lang}/services`}
                    className="px-8"
                  >
                    {user.role === 'freelancer' 
                      ? (lang === 'ru' ? 'Добавить услугу' : 'Xizmat qo\'shish')
                      : (lang === 'ru' ? 'Найти исполнителя' : 'Ijrochi topish')}
                  </Button>
                </Card>
              )}

              {user.role === 'freelancer' && services.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white">
                    {lang === 'ru' ? 'Ваши последние услуги' : 'Oxirgi xizmatlaringiz'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.slice(0, 3).map((service) => (
                      <Card key={service.id} className="overflow-hidden group border-dark-700 hover:border-primary/50 transition-all">
                        <div className="h-24 bg-dark-700 relative">
                          {service.image ? (
                            <img src={service.image} alt={service.title_ru} className="w-full h-full object-cover opacity-60" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-dark-900/80 backdrop-blur-sm text-primary">
                              {service.price.toLocaleString()} UZS
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-white text-sm line-clamp-1">
                            {lang === 'ru' ? service.title_ru : service.title_uz}
                          </h3>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-[10px] text-slate-500 uppercase font-bold">
                              {service.categories?.name_ru || service.category_id}
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
                  {user.role === 'freelancer' 
                    ? (lang === 'ru' ? 'Мои услуги' : 'Mening xizmatlarim')
                    : (lang === 'ru' ? 'Мои заказы' : 'Mening buyurtmalarim')}
                </h1>
                {user.role === 'freelancer' && (
                  <Button href={`/${lang}/dashboard/services/new`} size="sm">
                    {lang === 'ru' ? 'Добавить' : 'Qo\'shish'}
                  </Button>
                )}
              </div>

              {services.length > 0 && user.role === 'freelancer' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <Card key={service.id} className="overflow-hidden group border-dark-700 hover:border-primary/50 transition-all">
                      <div className="h-32 bg-dark-700 relative">
                        {service.image ? (
                          <img src={service.image} alt={service.title_ru} className="w-full h-full object-cover opacity-60" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <Package className="w-8 h-8" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-dark-900/80 backdrop-blur-sm text-primary">
                            {service.price.toLocaleString()} UZS
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-white mb-1 line-clamp-1">
                          {lang === 'ru' ? service.title_ru : service.title_uz}
                        </h3>
                        <p className="text-slate-400 text-xs line-clamp-2 mb-3">
                          {lang === 'ru' ? service.description_ru : service.description_uz}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                            {service.categories?.name_ru || service.category_id}
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
                  <Button 
                    href={user.role === 'freelancer' ? `/${lang}/dashboard/services/new` : `/${lang}/services`}
                    className="mt-6"
                  >
                    {user.role === 'freelancer' 
                      ? (lang === 'ru' ? 'Добавить услугу' : 'Xizmat qo\'shish')
                      : (lang === 'ru' ? 'Найти исполнителя' : 'Ijrochi topish')}
                  </Button>
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
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <User className="w-8 h-8 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{user.fullName}</h3>
                        <p className="text-slate-400 text-sm line-clamp-1">{user.bio}</p>
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
                            ? `Текущая роль: ${user.role === 'freelancer' ? 'Фрилансер' : 'Заказчик'}` 
                            : `Hozirgi rol: ${user.role === 'freelancer' ? 'Frilanser' : 'Mijoz'}`}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="primary" 
                      className="w-full"
                      onClick={() => handleRoleChange(user.role === 'freelancer' ? 'client' : 'freelancer')}
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
                        onClick={handleSaveProfile}
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
