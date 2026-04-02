# 🔧 Настройка переменных окружения

## ❗ **ВАЖНО: Ошибка сборки**

Ваша сборка не удалась из-за отсутствия переменных окружения:
```
Error: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.
```

## 🚀 **Быстрое исправление (2 минуты)**

### Шаг 1: Создайте Supabase проект
1. Перейдите на [supabase.com](https://supabase.com)
2. Войдите через GitHub
3. "New Project" → введите название "uzdev-hub"
4. Выберите регион "Singapore" (ближе к Узбекистану)
5. Создайте проект

### Шаг 2: Настройте базу данных
1. В панели Supabase откройте "SQL Editor"
2. Скопируйте весь код из файла: `lib/supabase/database.sql`
3. Вставьте и нажмите "Run"
4. Убедитесь, что все таблицы созданы

### Шаг 3: Получите ключи доступа
1. В Supabase: Project Settings → API
2. Скопируйте два значения:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon (public) Key**: `eyJhbGciOiJIU...`

### Шаг 4: Создайте .env.local файл
В корне проекта создайте файл `.env.local`:

```env
# Замените на ваши реальные данные
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_real_anon_key_here
```

### Шаг 5: Проверьте сборку
```bash
npm run build
```

Должно быть:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (0/5)
✓ Finalizing page optimization
```

## 🔒 **Настройка OAuth (опционально)**

### Google OAuth:
1. [Google Cloud Console](https://console.cloud.google.com)
2. Создайте OAuth 2.0 Client ID
3. Redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. В Supabase: Authentication → Providers → Google
5. Добавьте Client ID и Secret

### GitHub OAuth:
1. [GitHub Developer Settings](https://github.com/settings/developers)
2. New OAuth App
3. Authorization callback: `https://your-project.supabase.co/auth/v1/callback`
4. В Supabase: Authentication → Providers → GitHub
5. Добавьте Client ID и Secret

## 🚀 **Запуск проекта**

После настройки переменных:
```bash
npm run dev
```

Откройте: http://localhost:3000

## 🌐 **Для развертывания на Render**

При развертывании на Render добавьте те же переменные:
1. Render Dashboard → Service → Environment
2. Добавьте:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🐛 **Если ошибка осталась**

### Проверьте:
1. ✅ Файл `.env.local` существует в корне проекта
2. ✅ Переменные названы правильно (без опечаток)
3. ✅ URL начинается с `https://`
4. ✅ Anon key начинается с `eyJhbGciOiJIU`

### Тестирование:
```bash
# Проверьте, что переменные доступны
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 📞 **Поддержка**

Если остались проблемы:
1. Проверьте [Supabase Status](https://status.supabase.com)
2. Создайте issue на GitHub
3. Смотрите логи в консоли браузера

---

**После этих шагов сборка пройдет успешно! 🎉**
