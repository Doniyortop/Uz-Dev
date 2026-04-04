'use client';

import { use } from 'react';
import { Locale } from '@/types';
import { getCategories } from '@/lib/supabase/categories';
import { getServices } from '@/lib/supabase/services';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Star, MapPin, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ServicesPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesData, categoriesData] = await Promise.all([
          getServices(),
          getCategories()
        ]);
        setServices(servicesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredServices = services.filter(service => {
    const matchesSearch = searchTerm === '' || 
      service.title_ru?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.title_uz?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || service.category_id === selectedCategory;
    const matchesPrice = service.price >= priceRange[0] && service.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-dark-700 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="h-96 bg-dark-700 rounded"></div>
            <div className="md:col-span-2 h-96 bg-dark-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder={lang === 'ru' ? 'Поиск услуг...' : 'Xizmatlarni qidirish...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4" />
              {lang === 'ru' ? 'Категории' : 'Kategoriyalar'}
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === '' 
                    ? 'bg-primary text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-dark-800'
                }`}
              >
                {lang === 'ru' ? 'Все категории' : 'Barcha kategoriyalar'}
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === category.id 
                      ? 'bg-primary text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  {lang === 'ru' ? category.name_ru : category.name_uz}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <h3 className="font-bold text-white">
              {lang === 'ru' ? 'Ценовой диапазон' : 'Narx oraligi'}
            </h3>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-slate-400">
                <span>0 UZS</span>
                <span>{priceRange[1].toLocaleString()} UZS</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {lang === 'ru' ? 'Услуги' : 'Xizmatlar'}
            </h1>
            <p className="text-slate-400">
              {lang === 'ru' 
                ? `Найдено ${filteredServices.length} услуг` 
                : `${filteredServices.length} ta xizmat topildi`}
            </p>
          </div>

          {/* Services Grid */}
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Link 
                  key={service.id} 
                  href={`/${lang}/services/${service.id}`}
                  className="block group"
                >
                  <Card className="overflow-hidden border-dark-700 hover:border-primary/50 transition-all h-full">
                    <div className="h-48 bg-dark-800 relative">
                      {service.image ? (
                        <img 
                          src={service.image} 
                          alt={lang === 'ru' ? service.title_ru : service.title_uz}
                          className="w-full h-full object-cover opacity-60"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-2xl">🔧</span>
                            </div>
                            <span className="text-sm">
                              {lang === 'ru' ? 'Нет изображения' : 'Rasm yo\'q'}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-dark-900/80 backdrop-blur-sm text-primary">
                          {service.price.toLocaleString()} UZS
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-white mb-2 line-clamp-2">
                        {lang === 'ru' ? service.title_ru : service.title_uz}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                        {lang === 'ru' ? service.description_ru : service.description_uz}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {service.profiles?.avatar_url ? (
                            <img 
                              src={service.profiles.avatar_url} 
                              alt={service.profiles.full_name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-dark-700 rounded-full flex items-center justify-center">
                              <span className="text-xs">👤</span>
                            </div>
                          )}
                          <span className="text-sm text-slate-400">
                            {service.profiles?.full_name}
                          </span>
                        </div>
                        {service.profiles?.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-white">
                              {service.profiles.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {lang === 'ru' ? 'Услуги не найдены' : 'Xizmatlar topilmadi'}
              </h3>
              <p className="text-slate-400 mb-6">
                {lang === 'ru' 
                  ? 'Попробуйте изменить параметры поиска' 
                  : 'Qidirish parametrlarini o\'zgartirib ko\'ring'}
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setPriceRange([0, 10000]);
                }}
                variant="outline"
              >
                {lang === 'ru' ? 'Сбросить фильтры' : 'Filtrlarni tiklash'}
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
