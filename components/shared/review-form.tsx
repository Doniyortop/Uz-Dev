'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { Locale } from '@/types';
import { createReview } from '@/lib/supabase/reviews';

interface ReviewFormProps {
  serviceId: string;
  freelancerId: string;
  clientId: string;
  clientName: string;
  lang: Locale;
  onSubmit?: () => void;
}

export function ReviewForm({ 
  serviceId, 
  freelancerId, 
  clientId, 
  clientName, 
  lang,
  onSubmit 
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (rating === 0 || !comment.trim()) {
      alert(lang === 'ru' ? 'Пожалуйста, оцените и оставьте комментарий' : 'Iltimos, baho bering va izoh qoldiring');
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview({
        service_id: serviceId,
        freelancer_id: freelancerId,
        client_id: clientId,
        client_name: clientName,
        rating,
        comment: comment.trim()
      });
      
      setRating(0);
      setComment('');
      onSubmit?.();
    } catch (error) {
      console.error('Error creating review:', error);
      alert(lang === 'ru' ? 'Ошибка при отправке отзыва' : 'Fikrni yuborishda xatolik');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          {lang === 'ru' ? 'Ваша оценка' : 'Bahoingiz'}
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1 transition-colors"
            >
              <Star 
                className={`w-6 h-6 ${
                  star <= rating 
                    ? 'fill-yellow-500 text-yellow-500' 
                    : 'text-slate-600 hover:text-yellow-400'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          {lang === 'ru' ? 'Ваш отзыв' : 'Fikringiz'}
        </label>
        <Textarea
          value={comment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
          placeholder={lang === 'ru' 
            ? 'Расскажите о вашем опыте работы с этим исполнителем...' 
            : 'Bu ijrochi bilan ishlash tajribangiz haqida gapiring...'
          }
          className="bg-dark-800 border-dark-700 text-white placeholder:text-slate-500"
          rows={4}
        />
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting || rating === 0 || !comment.trim()}
        className="w-full"
      >
        {isSubmitting 
          ? (lang === 'ru' ? 'Отправка...' : 'Yuborilmoqda...') 
          : (lang === 'ru' ? 'Отправить отзыв' : 'Fikr yuborish')
        }
      </Button>
    </form>
  );
}
