const dictionaries: Record<string, () => Promise<any>> = {
  ru: () => import('./dictionaries/ru.json').then((module) => module.default),
  uz: () => import('./dictionaries/uz.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  const dictionaryFn = dictionaries[locale] || dictionaries['ru'];
  return dictionaryFn();
};
