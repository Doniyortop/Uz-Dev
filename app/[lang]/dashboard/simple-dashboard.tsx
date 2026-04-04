'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, Settings, Package, LogOut, User, Bell, CreditCard } from 'lucide-react';
import { simpleAuth } from '@/lib/auth-simple';

type Tab = 'overview' | 'items' | 'settings';

export default function SimpleDashboardPage({
  lang,
}: {
  lang: Locale;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useState(() => {
    const currentUser = simpleAuth.getCurrentUser();
    if (!currentUser) {
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
    setIsLoading(false);
  });

  const handleLogout = () => {
    simpleAuth.logout();
    router.push(`/${lang}`);
  };

  const handleSaveProfile = () => {
    if (!user) return;
    
    const updatedUser = { ...user, fullName: profileName, bio: profileBio };
    setUser(updatedUser);
    localStorage.setItem('simple_auth', JSON.stringify({
      user: updatedUser,
      expires: Date.now() + (24 * 60 * 60 * 1000)
    }));
    
    setIsEditing(false);
    alert(lang === 'ru' ? 'Профиль обновлен!' : 'Profil yangilandi!');
  };

  const handleRoleChange = (newRole: 'freelancer' | 'client') => {
    if (!user) return;
    
    const updatedUser = { ...user, role: newRole };
    setUser(updatedUser);
    localStorage.setItem('simple_auth', JSON.stringify({
      user: updatedUser,
      expires: Date.now() + (24 * 60 * 60 * 1000)
    }));
    window.location.reload();
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
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-bold text-white mb-8">
                {lang === 'ru' ? 'Настройки профиля' : 'Profil sozlamalari'}
              </h1>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">
                      {lang === 'ru' ? 'Информация профиля' : 'Profil ma\'lumotlari'}
                    </CardTitle>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant="outline"
                      size="sm"
                    >
                      {isEditing ? (lang === 'ru' ? 'Отмена' : 'Bekor qilish') : (lang === 'ru' ? 'Редактировать' : 'Tahrirlash')}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-slate-300 block mb-2">
                          {lang === 'ru' ? 'Имя' : 'Ism'}
                        </label>
                        <input
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-300 block mb-2">
                          {lang === 'ru' ? 'О себе' : 'O\'z haqingiz'}
                        </label>
                        <textarea
                          value={profileBio}
                          onChange={(e) => setProfileBio(e.target.value)}
                          rows={4}
                          className="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={handleSaveProfile}>
                          {lang === 'ru' ? 'Сохранить' : 'Saqlash'}
                        </Button>
                        <Button
                          onClick={() => setIsEditing(false)}
                          variant="outline"
                        >
                          {lang === 'ru' ? 'Отмена' : 'Bekor qilish'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-slate-400 mb-1">
                          {lang === 'ru' ? 'Имя' : 'Ism'}
                        </h3>
                        <p className="text-white">{user.fullName}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-400 mb-1">
                          {lang === 'ru' ? 'Email' : 'Email'}
                        </h3>
                        <p className="text-white">{user.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-400 mb-1">
                          {lang === 'ru' ? 'О себе' : 'O\'z haqingiz'}
                        </h3>
                        <p className="text-white">{user.bio || (lang === 'ru' ? 'Не указано' : 'Ko\'rsatilmagan')}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-400 mb-1">
                          {lang === 'ru' ? 'Роль' : 'Rol'}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-dark-800 text-primary">
                            {user.role}
                          </Badge>
                          <Button
                            onClick={() => handleRoleChange(user.role === 'freelancer' ? 'client' : 'freelancer')}
                            variant="outline"
                            size="sm"
                          >
                            {user.role === 'freelancer' 
                              ? (lang === 'ru' ? 'Стать клиентом' : 'Mijoz bo\'lish')
                              : (lang === 'ru' ? 'Стать фрилансером' : 'Freelanser bo\'lish')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
