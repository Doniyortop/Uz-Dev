'use client';

import { useState, useEffect, use, useMemo } from 'react';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Locale, Service, Dictionary } from '@/types';
import { ServiceCard } from '@/components/shared/service-card';
import { ServiceCardSkeleton } from '@/components/shared/service-card-skeleton';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, Filter } from 'lucide-react';
import { getServices } from '@/lib/supabase/services';

export default function ServicesPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = use(params);
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [filteredServices, setFilteredServices] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getDictionary(lang).then(setDictionary);

    const loadServices = async () => {
      setIsLoading(true);
      try {
        const services = await getServices();
        setAllServices(services);
        setFilteredServices(services);
      } catch (err) {
        console.error('Error loading services:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, [lang]);

  // Handle Filtering and Searching
  const filteredAndSearchedServices = useMemo(() => {
    let result = allServices;

    // Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.title_ru?.toLowerCase().includes(query) || 
        s.title_uz?.toLowerCase().includes(query) ||
        s.description_ru?.toLowerCase().includes(query) ||
        s.description_uz?.toLowerCase().includes(query) ||
        s.tags?.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    // Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter(s => s.categories?.slug === selectedCategory);
    }

    // Price Filter
    result = result.filter(s => s.price >= priceRange.min && s.price <= priceRange.max);

    return result;
  }, [searchQuery, selectedCategory, priceRange, allServices]);

  useEffect(() => {
    setFilteredServices(filteredAndSearchedServices);
  }, [filteredAndSearchedServices]);

  if (!dictionary) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col gap-8 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {lang === 'ru' ? 'Каталог услуг' : 'Xizmatlar katalogi'}
            </h1>
            <p className="text-slate-400">
              {lang === 'ru' ? 'Найдите подходящего исполнителя для вашего проекта' : 'Loyihangiz uchun mos ijrochini toping'}
            </p>
          </div>
          
          <div className="flex w-full md:w-auto gap-4">
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={dictionary.common.search}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-all shadow-lg shadow-black/20"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-dark-700 hover:bg-dark-800"
            >
              <Filter className="w-4 h-4 mr-2" />
              {lang === 'ru' ? 'Фильтры' : 'Filtrlar'}
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {lang === 'ru' ? 'Цена от' : 'Narxdan'}
                </label>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {lang === 'ru' ? 'Цена до' : 'Narxgacha'}
                </label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                  placeholder="1000000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {lang === 'ru' ? 'Категория' : 'Kategoriya'}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="all">{lang === 'ru' ? 'Все категории' : 'Barcha kategoriyalar'}</option>
                  {Object.entries(dictionary.categories).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Quick Category Filters */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === 'all' 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-dark-800 text-slate-400 hover:text-white border border-dark-700'
            }`}
          >
            {lang === 'ru' ? 'Все' : 'Hammasi'}
          </button>
          {Object.entries(dictionary.categories).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === key 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-dark-800 text-slate-400 hover:text-white border border-dark-700'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <ServiceCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in duration-500">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} lang={lang} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {lang === 'ru' ? 'Ничего не найдено' : 'Hech narsa topilmadi'}
          </h3>
          <p className="text-slate-400 max-w-xs mx-auto">
            {lang === 'ru' 
              ? 'Попробуйте изменить параметры поиска или фильтры' 
              : 'Qidiruv parametrlari yoki filtrlarni o\'zgartirib ko\'ring'}
          </p>
          <Button 
            variant="ghost" 
            className="mt-6"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setPriceRange({ min: 0, max: 1000000 });
            }}
          >
            {lang === 'ru' ? 'Сбросить все' : 'Hammasini tozalash'}
          </Button>
        </div>
      )}
    </div>
  );
}
