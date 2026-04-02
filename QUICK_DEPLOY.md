# 🚀 Быстрое развертывание на Render

## 📋 1. Подготовка (2 минуты)

### Шаг 1: Создайте Supabase проект
1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект → выберите регион Singapore
3. В SQL Editor выполните код из `lib/supabase/database.sql`
4. Project Settings → API → скопируйте URL и anon key

### Шаг 2: Настройте OAuth (опционально)
1. Google OAuth: Включите в Authentication → Providers → Google
2. GitHub OAuth: Включите в Authentication → Providers → GitHub
3. Добавьте redirect URL: `https://your-app.onrender.com/auth/callback`

## 🚀 2. Развертывание на Render (3 минуты)

### Шаг 1: Подключите GitHub
1. Перейдите на [render.com](https://render.com)
2. "New Web Service" → "Connect GitHub"
3. Выберите репозиторий `Doniyortop/Uz-Dev`

### Шаг 2: Настройте сборку
```
Build Command: npm install && npm run build
Start Command: npm start
Runtime: Node 20.10.0
```

### Шаг 3: Добавьте переменные окружения
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NODE_VERSION=20.10.0
NEXT_TELEMETRY_DISABLED=1
```

### Шаг 4: Разверните
- Plan: Free
- Region: Oregon (ближайший)
- Auto-Deploy: ✅

## 🎉 3. Готово!

Через 5-10 минут ваш IT-маркетплейс будет доступен по адресу:
**https://uzdev-hub.onrender.com**

## 🧪 Тестирование

### Базовые функции:
- ✅ Регистрация пользователя
- ✅ Вход через Google/GitHub
- ✅ Создание услуги
- ✅ Поиск услуг
- ✅ Просмотр профилей

### Продвинутые функции:
- ✅ Отзывы и рейтинги
- ✅ Портфолио с изображениями
- ✅ Мобильная версия
- ✅ SEO оптимизация

## 🔧 Настройка домена (опционально)

### Бесплатный домен Render:
```
https://uzdev-hub.onrender.com
```

### Пользовательский домен:
1. Render Dashboard → Service → Custom Domains
2. Добавьте ваш домен: `your-domain.com`
3. Настройте DNS:
   ```
   A: your-domain.com → 216.24.57.251
   CNAME: www → your-domain.com.onrender.com
   ```

## 📊 Мониторинг

### Render Dashboard:
- Status: Онлайн/офлайн статус
- Logs: Логи приложения
- Metrics: Производительность

### Supabase Dashboard:
- Database: Статистика БД
- Auth: Аналитика входов
- Storage: Использование файлов

## 🚨 Если что-то не работает

### 1. Проверьте логи:
- Render: Logs → Service Logs
- Supabase: Database → Logs

### 2. Проверьте переменные:
- Убедитесь, что все ключи правильные
- Проверьте опечатки в названиях

### 3. Проверьте Supabase:
- SQL миграции выполнены?
- OAuth провайдеры включены?
- RLS политики работают?

### 4. Проверьте сборку:
- `npm run build` работает локально?
- Нет ошибок TypeScript?
- Все зависимости установлены?

## 📞 Поддержка

### Документация:
- `SETUP.md` - Полная настройка
- `DEPLOYMENT.md` - Детальное развертывание
- `RENDER_DEPLOY.md` - Специфика Render

### GitHub Issues:
Создайте issue: https://github.com/Doniyortop/Uz-Dev/issues

---

**Ваш IT-маркетплейс готов к работе! 🎉**

**Следующие шаги:**
1. Настройте Supabase (5 минут)
2. Разверните на Render (3 минуты)
3. Тестируйте функциональность (5 минут)

**Общее время: ~15 минут** ⚡
