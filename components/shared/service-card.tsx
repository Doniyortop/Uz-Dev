import { Service, Locale } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Star } from 'lucide-react';
import Image from 'next/image';

interface ServiceCardProps {
  service: Service;
  lang: Locale;
}

export function ServiceCard({ service, lang }: ServiceCardProps) {
  const title = lang === 'ru' ? service.title_ru : service.title_uz;
  const description = lang === 'ru' ? service.description_ru : service.description_uz;

  return (
    <Card className="h-full flex flex-col group">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-dark-700">
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold">
              DEV
            </div>
            <div className="text-xs text-white font-medium">Freelancer Name</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </CardTitle>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-bold">4.9</span>
          </div>
        </div>
        <p className="text-slate-400 text-sm line-clamp-3 mb-4">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {service.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex items-center justify-between border-t border-dark-700 mt-auto">
        <div className="text-lg font-bold text-white">
          {lang === 'ru' ? 'от' : 'dan'} ${service.price}
        </div>
        <Button size="sm" className="gap-2">
          <MessageCircle className="w-4 h-4" />
          {lang === 'ru' ? 'ТГ' : 'TG'}
        </Button>
      </CardFooter>
    </Card>
  );
}
