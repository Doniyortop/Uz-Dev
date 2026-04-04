'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Locale } from '@/types';

interface ReviewFormProps {
  serviceId: string;
  onSubmit: (review: { service_id: string; rating: number; comment: string }) => void;
  onCancel: () => void;
  lang: Locale;
}

export default function ReviewForm({ serviceId, onSubmit, onCancel, lang }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      alert(lang === 'ru' ? 'Пожалуйста, напишите отзыв' : 'Iltimos, sharx yozing');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        service_id: serviceId,
        rating,
        comment: comment.trim()
      });
      
      // Reset form
      setRating(5);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-dark-800 border-dark-700">
      <CardHeader>
        <CardTitle className="text-white">
          {lang === 'ru' ? 'Оставить отзыв' : 'Sharx qoldirish'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">
              {lang === 'ru' ? 'Оценка' : 'Baho'}
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star 
                    className={`w-6 h-6 transition-colors ${
                      star <= rating 
                        ? 'text-yellow-500 fill-current' 
                        : 'text-slate-600 hover:text-yellow-500'
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">
              {lang === 'ru' ? 'Комментарий' : 'Izoh'}
            </label>
            <textarea
              placeholder={lang === 'ru' 
                ? 'Расскажите о вашем опыте...' 
                : 'Tajribangiz haqida gapiring...'}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-primary resize-none"
              rows={4}
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-grow"
            >
              {isSubmitting 
                ? (lang === 'ru' ? 'Отправка...' : 'Yuborilmoqda...')
                : (lang === 'ru' ? 'Отправить' : 'Yuborish')
              }
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {lang === 'ru' ? 'Отмена' : 'Bekor qilish'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
