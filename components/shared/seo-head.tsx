import { Locale } from '@/types';

interface SEOHeadProps {
  title: string;
  description: string;
  lang: Locale;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  keywords?: string[];
}

export function generateSEOHead({
  title,
  description,
  lang,
  image,
  url,
  type = 'website',
  keywords = []
}: SEOHeadProps) {
  const siteName = lang === 'ru' ? 'UzDev Hub - IT Маркетплейс Узбекистана' : 'UzDev Hub - O\'zbekiston IT bozori';
  const fullTitle = `${title} | ${siteName}`;
  
  const defaultKeywords = [
    'IT услуги Узбекистан',
    'фриланс Ташкент',
    'разработка сайтов Узбекистан',
    'программисты Узбекистан',
    'IT специалисты Ташкент',
    'веб разработка Узбекистан',
    'мобильные приложения Узбекистан',
    'IT маркетплейс',
    'Uzbekistan IT services',
    'freelance Uzbekistan',
    'web development Uzbekistan'
  ];

  const allKeywords = [...keywords, ...defaultKeywords];

  return {
    title: fullTitle,
    description,
    keywords: allKeywords.join(', '),
    openGraph: {
      title: fullTitle,
      description,
      type,
      url,
      images: image ? [{ url: image }] : [],
      siteName,
      locale: lang === 'ru' ? 'ru_RU' : 'uz_UZ',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: url,
      languages: {
        'ru': url?.replace('/uz/', '/ru/'),
        'uz': url?.replace('/ru/', '/uz/'),
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateServiceSEO(service: any, lang: Locale) {
  const title = lang === 'ru' ? service.title_ru : service.title_uz;
  const description = lang === 'ru' ? service.description_ru : service.description_uz;
  const freelancerName = service.profiles?.full_name || service.freelancer_name;
  
  const seoTitle = lang === 'ru' 
    ? `${title} от ${freelancerName} - Заказать в Ташкенте`
    : `${title} - ${freelancerName} dan Toshkentda buyurtma qiling`;
    
  const seoDescription = lang === 'ru'
    ? `Закажите "${title}" от профессионального исполнителя ${freelancerName}. ${description.slice(0, 100)}... Быстро и качественно в Ташкенте.`
    : `"${title}" xizmatini professional ${freelancerName} dan buyurtma qiling. ${description.slice(0, 100)}... Tez va sifatli Toshkentda.`;

  return generateSEOHead({
    title: seoTitle,
    description: seoDescription,
    lang,
    image: service.image,
    url: typeof window !== 'undefined' ? window.location.href : '',
    type: 'article',
    keywords: [
      title,
      freelancerName,
      ...(service.tags || []),
      lang === 'ru' ? 'услуга Ташкент' : 'xizmat Toshkent',
      lang === 'ru' ? 'заказать услугу' : 'xizmat buyurtma qilish'
    ]
  });
}
