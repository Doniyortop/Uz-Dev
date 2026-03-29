import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Locale } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Star, Send, ExternalLink } from 'lucide-react';

export default async function FreelancerProfile({
  params,
}: {
  params: Promise<{ lang: Locale; username: string }>;
}) {
  const { lang, username } = await params;
  const dictionary = await getDictionary(lang);

  // Mock data for profile
  const profile = {
    full_name: 'Doniyor Uzakov',
    avatar_url: 'https://github.com/shadcn.png',
    bio: lang === 'ru' 
      ? 'Senior Fullstack Developer. Специализируюсь на React, Next.js и Telegram ботах.' 
      : 'Senior Fullstack Developer. React, Next.js va Telegram botlar bo\'yicha mutaxassisman.',
    telegram_username: 'uzdev_hub',
    rating: 4.9,
    completed_orders: 124,
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Supabase'],
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="flex flex-col items-center pb-2">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-primary/20 p-1">
                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full rounded-full object-cover" />
              </div>
              <CardTitle className="text-2xl text-center mb-2">{profile.full_name}</CardTitle>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-bold">{profile.rating}</span>
                </div>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 text-sm">{profile.completed_orders} {lang === 'ru' ? 'заказов' : 'buyurtmalar'}</span>
              </div>
              <Badge variant="secondary" className="mb-6 uppercase tracking-wider">Senior Developer</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-300 text-center leading-relaxed">
                {profile.bio}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {profile.skills.map(skill => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
              </div>
              <div className="pt-6 border-t border-dark-700">
                <Button className="w-full gap-2 text-lg py-6" size="lg">
                  <Send className="w-5 h-5" />
                  {dictionary.common.contact_tg}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Portfolio & Services */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full" />
              {lang === 'ru' ? 'Портфолио' : 'Portfolyo'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden group">
                  <div className="h-48 bg-dark-800 relative">
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-300 flex items-center justify-center">
                      <ExternalLink className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-1">Project Name {i}</h3>
                    <p className="text-slate-400 text-sm">React, Next.js, Supabase</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 pt-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full" />
              {lang === 'ru' ? 'Мои услуги' : 'Mening xizmatlarim'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Cards will go here */}
              <Card className="p-6 border-dashed border-2 border-dark-700 hover:border-primary/50 flex flex-col items-center justify-center text-center group cursor-pointer h-48">
                <div className="w-12 h-12 rounded-full bg-dark-800 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                   <div className="w-6 h-6 bg-primary rounded-full opacity-50" />
                </div>
                <p className="text-slate-400 font-medium">
                  {lang === 'ru' ? 'Все услуги этого фрилансера' : 'Freelancerning barcha xizmatlari'}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
