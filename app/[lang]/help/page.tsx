import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Locale, Dictionary } from '@/types';

export default async function HelpPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'ru';
  const dictionary = await getDictionary(lang);

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-white mb-8">{dictionary.footer.help}</h1>
      <p className="text-slate-400 text-lg">
        {lang === 'ru' ? 'Это страница \'Помощь\'. Здесь будет информация о том, как использовать платформу.' : 'Bu \'Yordam\' sahifasi. Bu yerda platformadan qanday foydalanish haqida ma\'lumot bo\'ladi.'}
      </p>
    </div>
  );
}
