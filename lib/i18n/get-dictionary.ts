import { Dictionary } from '@/types';

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  ru: () => import('./dictionaries/ru.json').then((module) => module.default),
  uz: () => import('./dictionaries/uz.json').then((module) => module.default),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  const dictionaryFn = dictionaries[locale] || dictionaries['ru'];
  return dictionaryFn();
};
