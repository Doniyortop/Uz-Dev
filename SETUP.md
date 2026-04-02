# 🚀 UzDev Hub - Настройка проекта

## 📋 Требования
- Node.js 18+
- npm или yarn
- Учетная запись Supabase

## 🛠️ Настройка Supabase

### 1. Создание проекта
1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Выберите регион (рекомендуется: Singapore или Mumbai)
4. Создайте базу данных

### 2. Выполнение SQL миграций
1. В панели Supabase откройте "SQL Editor"
2. Скопируйте и выполните SQL из файла `lib/supabase/database.sql`
3. Убедитесь, что все таблицы созданы успешно

### 3. Настройка OAuth провайдеров

#### Google OAuth:
1. Перейдите в [Google Cloud Console](https://console.cloud.google.com)
2. Создайте новый проект или выберите существующий
3. Включите "Google+ API" и "Google Identity"
4. Создайте OAuth 2.0 Client ID
5. Добавьте redirect URI: `https://[your-project].supabase.co/auth/v1/callback`
6. В Supabase: Authentication → Providers → Google
7. Включите Google provider и добавьте Client ID и Secret

#### GitHub OAuth:
1. Перейдите в [GitHub Developer Settings](https://github.com/settings/developers)
2. Создайте новое OAuth App
3. Authorization callback URL: `https://[your-project].supabase.co/auth/v1/callback`
4. В Supabase: Authentication → Providers → GitHub
5. Включите GitHub provider и добавьте Client ID и Secret

### 4. Получение ключей доступа
1. В Supabase: Project Settings → API
2. Скопируйте:
   - Project URL
   - Anon (public) Key

## 📦 Установка и запуск

### 1. Клонирование и установка
```bash
git clone https://github.com/Doniyortop/Uz-Dev.git
cd "IT market uzb"
npm install
```

### 2. Настройка переменных окружения
```bash
cp .env.example .env.local
```

Отредактируйте `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Запуск проекта
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## 🔧 Тестирование

### Тестовые аккаунты:
- **Фрилансер**: Создайте через регистрацию
- **Заказчик**: Создайте через регистрацию

### Функции для тестирования:
1. ✅ Регистрация (Email/пароль, Google, GitHub)
2. ✅ Создание услуги
3. ✅ Добавление портфолио
4. ✅ Оставление отзыва
5. ✅ Поиск и фильтрация услуг
6. ✅ Просмотр профилей фрилансеров

## 🚀 Развертывание

### Vercel (Рекомендуется):
1. Подключите репозиторий к Vercel
2. Добавьте переменные окружения
3. Разверните проект

### Другие платформы:
```bash
npm run build
npm start
```

## 🐛 Устранение неполадок

### Проблемы с аутентификацией:
- Проверьте redirect URLs в Supabase
- Убедитесь, что OAuth провайдеры настроены правильно
- Проверьте переменные окружения

### Проблемы с базой данных:
- Убедитесь, что SQL миграции выполнены
- Проверьте RLS политики
- Проверьте права доступа

### Проблемы с поиском:
- Проверьте индексы в базе данных
- Убедитесь, что данные загружаются корректно

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи в консоли браузера
2. Проверьте логи Supabase
3. Создайте issue на GitHub

---

**Готово к использованию! 🎉**
