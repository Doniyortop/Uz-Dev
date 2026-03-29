import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Locale } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center">
      <Card className="w-full max-w-md p-8">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold text-white mb-2">
            {dictionary.common.register}
          </CardTitle>
          <p className="text-slate-400">
            {lang === 'ru' ? 'Станьте частью сообщества UzDev Hub' : 'UzDev Hub hamjamiyatining a\'zosi bo\'ling'}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                {lang === 'ru' ? 'Имя и фамилия' : 'Ism va familiya'}
              </label>
              <input 
                type="text" 
                placeholder="Doniyor Uzakov"
                className="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <input 
                type="email" 
                placeholder="example@mail.com"
                className="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                {lang === 'ru' ? 'Пароль' : 'Parol'}
              </label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>
          <Button className="w-full py-6 text-lg font-bold">
            {dictionary.common.register}
          </Button>
          <div className="text-center text-sm text-slate-400">
            {lang === 'ru' ? 'Уже есть аккаунт?' : 'Hisobingiz bormi?'} {' '}
            <Link href={`/${lang}/login`} className="text-primary hover:underline font-medium">
              {dictionary.common.login}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
