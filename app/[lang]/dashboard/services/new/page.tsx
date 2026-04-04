'use client';

import { use } from 'react';
import { Locale } from '@/types';
import { getCategories } from '@/lib/supabase/categories';
import { createService } from '@/lib/supabase/services';
import { getSession } from '@/lib/supabase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewServicePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title_ru: '',
    title_uz: '',
    description_ru: '',
    description_uz: '',
    price: '',
    category_id: '',
    tags: [] as string[],
    image_url: ''
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const session = await getSession();
        if (!session) {
          router.push(`/${lang}/login`);
          return;
        }

        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [lang, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title_ru || !formData.title_uz || !formData.description_ru || 
        !formData.description_uz || !formData.price || !formData.category_id) {
      alert(lang === 'ru' ? 'Заполните все обязательные поля' : 'Barcha majburiy maydonlarni to\'ldiring');
      return;
    }

    setSubmitting(true);
    
    try {
      const session = await getSession();
      if (!session) {
        router.push(`/${lang}/login`);
        return;
      }

      const serviceData = {
        title_ru: formData.title_ru,
        title_uz: formData.title_uz,
        description_ru: formData.description_ru,
        description_uz: formData.description_uz,
        price: parseInt(formData.price),
        freelancer_id: session.user.id,
        category_id: formData.category_id,
        tags: formData.tags,
        image_url: formData.image_url || null,
        is_active: true
      };

      const newService = await createService(serviceData);
      
      alert(lang === 'ru' ? 'Услуга успешно создана!' : 'Xizmat muvaffaqiyatli yaratildi!');
      router.push(`/${lang}/dashboard`);
    } catch (error) {
      console.error('Error creating service:', error);
      alert(lang === 'ru' ? 'Ошибка при создании услуги' : 'Xizmatni yaratishda xatolik');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-dark-700 rounded w-1/4 mb-8"></div>
          <div className="h-96 bg-dark-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/${lang}/dashboard`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {lang === 'ru' ? 'Назад' : 'Orqaga'}
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white">
          {lang === 'ru' ? 'Новая услуга' : 'Yangi xizmat'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="bg-dark-800 border-dark-700">
          <CardHeader>
            <CardTitle className="text-white">
              {lang === 'ru' ? 'Основная информация' : 'Asosiy ma\'lumotlar'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">
                  {lang === 'ru' ? 'Название (RU)' : 'Nomi (RU)'} *
                </label>
                <input
                  type="text"
                  value={formData.title_ru}
                  onChange={(e) => handleInputChange('title_ru', e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-primary"
                  placeholder={lang === 'ru' ? 'Название услуги' : 'Xizmat nomi'}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">
                  {lang === 'ru' ? 'Название (UZ)' : 'Nomi (UZ)'} *
                </label>
                <input
                  type="text"
                  value={formData.title_uz}
                  onChange={(e) => handleInputChange('title_uz', e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-primary"
                  placeholder={lang === 'ru' ? 'Название услуги' : 'Xizmat nomi'}
                  required
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">
                  {lang === 'ru' ? 'Описание (RU)' : 'Tavsifi (RU)'} *
                </label>
                <textarea
                  value={formData.description_ru}
                  onChange={(e) => handleInputChange('description_ru', e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-primary resize-none"
                  placeholder={lang === 'ru' ? 'Подробное описание услуги' : 'Xizmatning batafsil tavsifi'}
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">
                  {lang === 'ru' ? 'Описание (UZ)' : 'Tavsifi (UZ)'} *
                </label>
                <textarea
                  value={formData.description_uz}
                  onChange={(e) => handleInputChange('description_uz', e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-primary resize-none"
                  placeholder={lang === 'ru' ? 'Подробное описание услуги' : 'Xizmatning batafsil tavsifi'}
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Price and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">
                  {lang === 'ru' ? 'Цена (UZS)' : 'Narxi (UZS)'} *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-primary"
                  placeholder="100000"
                  min="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">
                  {lang === 'ru' ? 'Категория' : 'Kategoriya'} *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                  required
                >
                  <option value="">
                    {lang === 'ru' ? 'Выберите категорию' : 'Kategoriyani tanlang'}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {lang === 'ru' ? category.name_ru : category.name_uz}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">
                {lang === 'ru' ? 'URL изображения' : 'Rasm URL'}
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-primary"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">
                {lang === 'ru' ? 'Теги (навыки)' : 'Teglar (mahoratlar)'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-grow bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-primary"
                  placeholder={lang === 'ru' ? 'React, Node.js...' : 'React, Node.js...'}
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  {lang === 'ru' ? 'Добавить' : 'Qo\'shish'}
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-primary hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Link href={`/${lang}/dashboard`}>
            <Button variant="outline" className="flex-grow">
              {lang === 'ru' ? 'Отмена' : 'Bekor qilish'}
            </Button>
          </Link>
          <Button 
            type="submit" 
            className="flex-grow"
            disabled={submitting}
          >
            <Save className="w-4 h-4 mr-2" />
            {submitting 
              ? (lang === 'ru' ? 'Создание...' : 'Yaratilmoqda...')
              : (lang === 'ru' ? 'Создать услугу' : 'Xizmat yaratish')
            }
          </Button>
        </div>
      </form>
    </div>
  );
}
