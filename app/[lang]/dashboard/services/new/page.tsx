'use client';

import { use } from 'react';
import { Locale } from '@/types';
import { getCategories } from '@/lib/mock-services';
import { createService } from '@/lib/mock-services';
import { simpleAuth } from '@/lib/auth-simple';
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
    title: '',
    description: '',
    price: '',
    category_id: '',
    tags: [] as string[],
    images: [] as File[]
  });
  const [tagInput, setTagInput] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const session = simpleAuth.getCurrentUser();
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (formData.images.length + files.length > 8) {
      alert(lang === 'ru' ? 'Можно добавить не более 8 изображений' : '8 tasdan ortiq rasm qo\'shib bo\'lmaydi');
      return;
    }
    
    const newImages = [...formData.images, ...files].slice(0, 8);
    setFormData(prev => ({ ...prev, images: newImages }));
    
    // Create previews
    const newPreviews = newImages.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setFormData(prev => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
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
    
    if (!formData.title || !formData.description || 
        !formData.price || !formData.category_id) {
      alert(lang === 'ru' ? 'Заполните все обязательные поля' : 'Barcha majburiy maydonlarni to\'ldiring');
      return;
    }

    setSubmitting(true);
    
    try {
      const session = simpleAuth.getCurrentUser();
      if (!session) {
        router.push(`/${lang}/login`);
        return;
      }

      const serviceData = {
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price),
        freelancer_id: session.id,
        category_id: formData.category_id,
        tags: formData.tags,
        images: formData.images.map(file => file.name),
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
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">
                {lang === 'ru' ? 'Название услуги' : 'Xizmat nomi'} *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-primary"
                placeholder={lang === 'ru' ? 'Введите название услуги' : 'Xizmat nomini kiriting'}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">
                {lang === 'ru' ? 'Описание услуги' : 'Xizmat tavsifi'} *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-primary min-h-[120px]"
                placeholder={lang === 'ru' ? 'Подробное описание услуги' : 'Xizmatning batafsil tavsifi'}
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">
                {lang === 'ru' ? 'Цена ($)' : 'Narxi ($)'} *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-primary"
                placeholder={lang === 'ru' ? 'Цена в долларах' : 'Narx dollarda'}
                min="1"
                required
              />
            </div>

            {/* Category */}
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

            {/* Images */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-400">
                {lang === 'ru' ? 'Изображения (до 8 шт)' : 'Rasmlar (8 tagacha)'}
              </label>
              
              {/* Upload Button */}
              <div className="border-2 border-dashed border-dark-600 rounded-lg p-6">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-slate-400">
                    {lang === 'ru' 
                      ? 'Нажмите для загрузки изображений' 
                      : 'Rasmlarni yuklash uchun bosing'}
                  </span>
                  <span className="text-xs text-slate-500 mt-1">
                    {lang === 'ru' 
                      ? `Загружено: ${formData.images.length}/8` 
                      : `Yuklandi: ${formData.images.length}/8`}
                  </span>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-400">
                {lang === 'ru' ? 'Теги' : 'Teglar'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-primary"
                  placeholder={lang === 'ru' ? 'Добавить тег' : 'Teg qo\'shish'}
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  variant="outline"
                  size="sm"
                >
                  {lang === 'ru' ? 'Добавить' : 'Qo\'shish'}
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-primary hover:text-primary/80"
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

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Link href={`/${lang}/dashboard`}>
            <Button variant="outline" type="button">
              {lang === 'ru' ? 'Отмена' : 'Bekor qilish'}
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={submitting}
            className="min-w-[120px]"
          >
            {submitting ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {lang === 'ru' ? 'Сохранить' : 'Saqlash'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
