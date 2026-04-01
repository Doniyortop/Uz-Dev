import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Locale, Dictionary } from '@/types';

export default async function RulesPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'ru';
  const dictionary = await getDictionary(lang);

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-white mb-8">{dictionary.footer.rules}</h1>
      <p className="text-slate-400 text-lg">
        {lang === 'ru' ? 'Это страница \'Правила\'. Здесь будут основные правила использования платформы.' : 'Bu \'Qoidalar\' sahifasi. Bu yerda platformadan foydalanishning asosiy qoidalari bo\'ladi.'}
      </p>
    </div>
  );
}
