'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Locale, Dictionary } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Settings, Package, LogOut, User, Bell, CreditCard } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getSession, signOut } from '@/lib/supabase/auth';
import { getProfile, updateUserProfile } from '@/lib/supabase/data';

type Tab = 'overview' | 'items' | 'settings';

export default function DashboardPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [userRole, setUserRole] = useState<'freelancer' | 'client' | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isConfiguringNotifications, setIsConfiguringNotifications] = useState(false);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    getDictionary(lang).then(setDictionary);

    const fetchUserAndProfile = async () => {
      const session = await getSession();
      if (!session) {
        router.push(`/${lang}/login`);
        return;
      }
      setUserId(session.user.id);

      const profile = await getProfile(session.user.id);
      if (profile) {
        setUserRole(profile.role || null);
        setFullName(profile.full_name || '');
        setBio(profile.bio || '');
      } else {
        // If no profile, user needs to go through onboarding
        router.push(`/${lang}/onboarding`);
      }
    };
    fetchUserAndProfile();
  }, [router, lang]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push(`/${lang}`);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!userId) return;
    setProfileError(null);
    try {
      await updateUserProfile(userId, { full_name: fullName, bio: bio });
      setIsEditingProfile(false);
      if (dictionary) {
        alert(dictionary.dashboard.changes_saved);
      }
    } catch (error: any) {
      setProfileError(error.message);
    }
  };

  if (!dictionary || !userRole) return null;

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
            {dictionary.dashboard.overview}
          </Button>
          <Button 
            variant={activeTab === 'items' ? 'primary' : 'ghost'} 
            onClick={() => setActiveTab('items')}
            className={`w-full justify-start gap-3 py-6 ${activeTab !== 'items' ? 'text-slate-400' : ''}`}
          >
            <Package className="w-5 h-5" />
            {userRole === 'freelancer' 
              ? dictionary.dashboard.my_items
              : dictionary.dashboard.my_orders}
          </Button>
          <Button 
            variant={activeTab === 'settings' ? 'primary' : 'ghost'} 
            onClick={() => setActiveTab('settings')}
            className={`w-full justify-start gap-3 py-6 ${activeTab !== 'settings' ? 'text-slate-400' : ''}`}
          >
            <Settings className="w-5 h-5" />
            {dictionary.dashboard.settings}
          </Button>
          
          <div className="pt-8">
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="w-full justify-start gap-3 py-6 text-red-400 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/50"
            >
              <LogOut className="w-5 h-5" />
              {dictionary.dashboard.logout}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">
                  {dictionary.dashboard.welcome}
                </h1>
                <div className="text-sm text-slate-400">
                  Role: <span className="text-primary font-bold uppercase">{userRole}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 text-base">
                      {dictionary.dashboard.active_orders}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">0</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 text-base">
                      {dictionary.dashboard.balance}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">$0.00</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 text-base">
                      {dictionary.dashboard.views}
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
                  {dictionary.dashboard.empty_state_title}
                </h3>
                <p className="text-slate-400 max-w-sm mb-6">
                  {dictionary.dashboard.empty_state_desc}
                </p>
                <Button 
                  key={`overview-${userRole}`}
                  onClick={() => router.push(`/${lang}/services`)}
                  className="px-8"
                >
                  {userRole === 'freelancer' 
                    ? dictionary.dashboard.add_service
                    : dictionary.dashboard.find_performer}
                </Button>
              </Card>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-bold text-white">
                {userRole === 'freelancer' 
                  ? dictionary.dashboard.my_items
                  : dictionary.dashboard.my_orders}
              </h1>
              <Card className="p-12 border-dashed border-2 border-dark-700 flex flex-col items-center justify-center text-center">
                <Package className="w-12 h-12 text-slate-600 mb-4" />
                <p className="text-slate-400">
                  {dictionary.dashboard.list_empty}
                </p>
                <Button 
                  key={userRole}
                  onClick={() => router.push(`/${lang}/services`)}
                  className="mt-6"
                >
                  {userRole === 'freelancer' 
                    ? dictionary.dashboard.add_service
                    : dictionary.dashboard.find_performer}
                </Button>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">
                  {dictionary.dashboard.profile_settings}
                </h1>
                {(isEditingProfile || isConfiguringNotifications) && (
                  <Button variant="ghost" onClick={() => { setIsEditingProfile(false); setIsConfiguringNotifications(false); }}>
                    {dictionary.dashboard.back}
                  </Button>
                )}
              </div>
              
              {!isEditingProfile && !isConfiguringNotifications ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{dictionary.dashboard.personal_data}</h3>
                        <p className="text-slate-400 text-sm">{dictionary.dashboard.edit_name_bio}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      {dictionary.dashboard.manage}
                    </Button>
                  </Card>

                  <Card className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Bell className="w-8 h-8 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{dictionary.dashboard.notifications}</h3>
                        <p className="text-slate-400 text-sm">{dictionary.dashboard.configure_alerts}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setIsConfiguringNotifications(true)}
                    >
                      {dictionary.dashboard.configure_alerts}
                    </Button>
                  </Card>

                  <Card className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <CreditCard className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{dictionary.dashboard.payments}</h3>
                        <p className="text-slate-400 text-sm">{dictionary.dashboard.wallet_history}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => alert(dictionary.dashboard.payments_soon)}
                    >
                      {dictionary.dashboard.manage}
                    </Button>
                  </Card>
                </div>
              ) : isEditingProfile ? (
                <Card className="p-8 max-w-2xl border-dark-700 bg-dark-800">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">
                        {dictionary.dashboard.full_name}
                      </label>
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">
                        {dictionary.dashboard.about_me}
                      </label>
                      <textarea 
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary resize-none"
                      />
                    </div>
                    {profileError && <p className="text-red-500 text-sm text-center">{profileError}</p>}
                    <div className="flex gap-4 pt-4">
                      <Button 
                        className="flex-grow"
                        onClick={handleSaveProfile}
                      >
                        {dictionary.dashboard.save}
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          setIsEditingProfile(false);
                        }}
                      >
                        {dictionary.dashboard.cancel}
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-8 max-w-2xl border-dark-700 bg-dark-800">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-dark-700 rounded-xl">
                      <div>
                        <h4 className="text-white font-bold">{dictionary.dashboard.email_notifications}</h4>
                        <p className="text-slate-400 text-sm">{dictionary.dashboard.get_order_emails}</p>
                      </div>
                      {/* Toggle for Email Notifications */}
                      <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-dark-700 rounded-xl">
                      <div>
                        <h4 className="text-white font-bold">{dictionary.dashboard.telegram_bot}</h4>
                        <p className="text-slate-400 text-sm">{dictionary.dashboard.messenger_alerts}</p>
                      </div>
                      {/* Toggle for Telegram Bot Notifications */}
                      <div className="w-12 h-6 bg-dark-600 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button 
                        className="flex-grow"
                        onClick={() => {
                          alert(dictionary.dashboard.notifications_saved);
                          setIsConfiguringNotifications(false);
                        }}
                      >
                        {dictionary.dashboard.save}
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => setIsConfiguringNotifications(false)}
                      >
                        {dictionary.dashboard.back}
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
