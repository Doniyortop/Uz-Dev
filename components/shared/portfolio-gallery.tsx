'use client';

import { useState } from 'react';
import { PortfolioItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, ZoomIn } from 'lucide-react';
import { Locale } from '@/types';

interface PortfolioGalleryProps {
  items: PortfolioItem[];
  lang: Locale;
  isOwner?: boolean;
  onEdit?: (item: PortfolioItem) => void;
  onDelete?: (itemId: string) => void;
}

export function PortfolioGallery({ 
  items, 
  lang, 
  isOwner = false, 
  onEdit, 
  onDelete 
}: PortfolioGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="group overflow-hidden hover:border-primary/50 transition-all">
            <div className="relative aspect-video overflow-hidden bg-dark-700">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => setSelectedImage(item.image_url)}
                  className="p-2 bg-white/10 backdrop-blur-sm rounded-lg mr-2 hover:bg-white/20 transition-colors"
                >
                  <ZoomIn className="w-4 h-4 text-white" />
                </button>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-white" />
                  </a>
                )}
              </div>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              
              {item.description && (
                <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
              )}
              
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{item.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
              
              {isOwner && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit?.(item)}
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    {lang === 'ru' ? 'Изменить' : 'O\'zgartirish'}
                  </button>
                  <button
                    onClick={() => onDelete?.(item.id)}
                    className="text-xs text-red-500 hover:text-red-400 transition-colors"
                  >
                    {lang === 'ru' ? 'Удалить' : 'O\'chirish'}
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Portfolio item"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
            >
              <ZoomIn className="w-4 h-4 text-white rotate-45" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
