# 🚀 Развертывание UzDev Hub

## 🌐 Production развертывание

### Vercel (Рекомендуется)

#### 1. Подготовка
```bash
# Убедитесь, что все изменения сохранены
git status
git add .
git commit -m "Ready for deployment - full IT marketplace with Supabase"
```

#### 2. Настройка Vercel
1. Перейдите на [vercel.com](https://vercel.com)
2. Войдите через GitHub
3. Импортируйте репозиторий `Doniyortop/Uz-Dev`
4. Настройте переменные окружения:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### 3. Развертывание
```bash
# Локальная проверка сборки
npm run build

# Если все в порядке, развертывание через Vercel
vercel --prod
```

### Netlify

#### 1. Подготовка
```bash
npm run build
```

#### 2. Настройка Netlify
1. Перейдите на [netlify.com](https://netlify.com)
2. Подключите GitHub репозиторий
3. Настройте:
   - Build command: `npm run build`
   - Publish directory: `out`
   - Environment variables

### Docker

#### 1. Создание Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### 2. Сборка и запуск
```bash
docker build -t uzdev-hub .
docker run -p 3000:3000 uzdev-hub
```

## 🔧 Настройка Supabase для Production

### 1. Безопасность
```sql
-- Включите RLS для всех таблиц
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
```

### 2. Индексы для производительности
```sql
-- Индексы для поиска
CREATE INDEX idx_services_search ON services USING gin(to_tsvector('english', title_ru || ' ' || title_uz || ' ' || description_ru || ' ' || description_uz));
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_freelancer ON services(freelancer_id);
CREATE INDEX idx_services_price ON services(price);
CREATE INDEX idx_services_active ON services(is_active);

-- Индексы для профилей
CREATE INDEX idx_profiles_online ON profiles(is_online);
CREATE INDEX idx_profiles_rating ON profiles(rating);
```

### 3. Backup стратегии
```sql
-- Настройте автоматические бэкапы в Supabase Dashboard
-- Settings → Database → Backups
```

## 📊 Мониторинг

### 1. Supabase
- Используйте Supabase Dashboard для мониторинга
- Отслеживайте:
  - Database performance
  - Auth logs
  - Storage usage

### 2. Vercel Analytics
- Включите Vercel Analytics
- Отслеживайте:
  - Page views
  - Core Web Vitals
  - Error rates

## 🔒 Безопасность в Production

### 1. Environment Variables
```bash
# Никогда не храните ключи в коде
# Используйте только переменные окружения
```

### 2. CORS настройки
```javascript
// В Supabase Settings → API → CORS
// Добавьте ваш домен:
// https://yourdomain.com
```

### 3. Rate Limiting
```javascript
// Настройте rate limiting в Supabase
// Settings → API → Rate Limiting
```

## 🚀 Post-deployment проверки

### 1. Функциональность
- [ ] Регистрация работает
- [ ] Вход через OAuth работает
- [ ] Создание услуг работает
- [ ] Поиск работает
- [ ] Отзывы работают

### 2. Производительность
- [ ] Страницы загружаются < 3 сек
- [ ] Mobile score > 90
- [ ] SEO метатеги работают

### 3. Безопасность
- [ ] HTTPS работает
- [ ] Environment variables скрыты
- [ ] RLS политики работают

## 🔄 CI/CD

### GitHub Actions
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📞 Поддержка

### Production проблемы:
1. Проверьте Vercel logs
2. Проверьте Supabase logs
3. Проверьте GitHub Actions logs

### Мониторинг:
- Используйте Uptime monitoring
- Настройте алерты для ошибок
- Регулярные бэкапы

---

**Готов к production! 🎉**
