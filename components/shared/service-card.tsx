'use client';

import { Service, Locale } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Star, ShieldCheck, Circle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ServiceCardProps {
  service: Service & {
    profiles?: {
      full_name: string;
      avatar_url: string;
      rating: number;
      telegram_username: string;
      is_online: boolean;
    };
    categories?: {
      name_ru: string;
      name_uz: string;
      slug: string;
    };
  };
  lang: Locale;
}

export function ServiceCard({ service, lang }: ServiceCardProps) {
  const router = useRouter();
  const title = lang === 'ru' ? service.title_ru : service.title_uz;
  const description = lang === 'ru' ? service.description_ru : service.description_uz;
  const freelancerName = service.profiles?.full_name || service.freelancer_name || 'Freelancer';
  const telegram = service.profiles?.telegram_username || service.telegram;
  const isOnline = service.profiles?.is_online || false;
  const rating = service.profiles?.rating || 0;
  const categoryName = lang === 'ru' 
    ? service.categories?.name_ru || service.category_id?.replace('_', ' ')
    : service.categories?.name_uz || service.category_id?.replace('_', ' ');

  return (
    <Card 
      className="h-full flex flex-col group cursor-pointer hover:border-primary/50 transition-all duration-300"
      onClick={() => router.push(`/${lang}/services/${service.id}`)}
    >
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-dark-700 overflow-hidden">
          {service.image ? (
            <img src={service.image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
          )}
          <div className="absolute top-4 right-4 z-10">
             <Badge className="bg-primary text-white border-none shadow-lg">
               {categoryName}
             </Badge>
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold relative group/avatar">
              {freelancerName.charAt(0).toUpperCase()}
              <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                <ShieldCheck className="w-3 h-3 text-primary" />
              </div>
              {isOnline && (
                <div className="absolute -bottom-0 -right-0">
                  <Circle className="w-3 h-3 fill-green-500 text-green-500" />
                </div>
              )}
            </div>
            <div className="text-xs text-white font-medium flex items-center gap-1 drop-shadow-md">
              {freelancerName}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </CardTitle>
          <div className="flex items-center gap-1 text-yellow-500 shrink-0">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-bold">{rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-slate-400 text-sm line-clamp-3 mb-4 h-[4.5rem]">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {service.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex items-center justify-between border-t border-dark-700 mt-auto">
        <div className="text-lg font-bold text-white">
          {service.price.toLocaleString()} <span className="text-xs text-slate-500 font-normal">UZS</span>
        </div>
        <Button 
          size="sm" 
          className="gap-2"
          onClick={(e) => {
            e.stopPropagation();
            if (telegram) {
              window.open(`https://t.me/${telegram.replace('@', '')}`, '_blank');
            } else {
              alert(lang === 'ru' ? 'Контакт не указан' : 'Kontakt ko\'rsatilmagan');
            }
          }}
        >
          <MessageCircle className="w-4 h-4" />
          {lang === 'ru' ? 'ТГ' : 'TG'}
        </Button>
      </CardFooter>
    </Card>
  );
}
