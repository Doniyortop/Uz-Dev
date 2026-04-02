# 🚀 Развертывание UzDev Hub на Render

## 📋 Что такое Render?
Render - это облачная платформа для развертывания веб-приложений с автоматической CI/CD интеграцией.

## 🛠️ Подготовка к развертыванию

### 1. Требования
- Аккаунт на [Render](https://render.com)
- GitHub репозиторий с проектом
- Настроенный Supabase проект

### 2. Настройка переменных окружения
Перед развертыванием убедитесь, что у вас есть:
- `NEXT_PUBLIC_SUPABASE_URL` - URL вашего Supabase проекта
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Публичный ключ Supabase

## 🚀 Развертывание на Render

### Вариант 1: Через Web Interface (Рекомендуется)

#### 1. Подключите GitHub
1. Войдите в [Render Dashboard](https://dashboard.render.com)
2. Нажмите "New +" → "Web Service"
3. Подключите ваш GitHub аккаунт
4. Выберите репозиторий `Doniyortop/Uz-Dev`

#### 2. Настройте сборку
```
Build Command: npm install && npm run build
Start Command: npm start
Runtime: Node 20.10.0
Build Context: Root
```

#### 3. Переменные окружения
Добавьте в Environment Variables:
```
NODE_VERSION=20.10.0
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 4. Настройте развертывание
- Plan: Free (или Starter)
- Region: Ближайший к вашим пользователям
- Auto-Deploy: Yes (для автоматического обновления)

### Вариант 2: Через render.yaml

Файл `render.yaml` уже настроен в проекте:

```yaml
services:
  - type: web
    name: uzdev-hub
    runtime: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    plan: free
    envVars:
      - key: NODE_VERSION
        value: 20.10.0
      - key: NEXT_TELEMETRY_DISABLED
        value: 1
      - key: NEXT_PUBLIC_SUPABASE_URL
        sync: false
      - key: NEXT_PUBLIC_SUPABASE_ANON_KEY
        sync: false
    healthCheckPath: /
    autoDeploy: true
```

## 🔧 Конфигурация проекта

### 1. Health Check
Render автоматически проверяет здоровье приложения по пути `/`

### 2. Автоматическое развертывание
Каждый push в ветку `main` автоматически триггерит новое развертывание

### 3. Логи и мониторинг
- Доступ к логам сборки и приложения
- Метрики производительности
- Алерты при ошибках

## 🌐 Настройка домена

### 1. Бесплатный домен Render
После развертывания вы получите:
```
https://uzdev-hub.onrender.com
```

### 2. Пользовательский домен
1. В настройках сервиса → "Custom Domains"
2. Добавьте ваш домен (например: `uzdev.uz`)
3. Настройте DNS записи:
   ```
   A: your-domain.com → 216.24.57.251
   CNAME: www → your-domain.com.onrender.com
   ```

## 🔒 Безопасность

### 1. HTTPS
Render автоматически предоставляет SSL сертификаты

### 2. Environment Variables
Все чувствительные данные хранятся в переменных окружения

### 3. CORS
Убедитесь, что ваш домен добавлен в Supabase CORS settings

## 📊 Мониторинг

### 1. Render Dashboard
- Статус приложения
- Логи сборки и выполнения
- Метрики использования

### 2. Supabase Dashboard
- Статистика базы данных
- Аналитика аутентификации
- Использование хранилища

## 🚀 Post-deployment проверки

### 1. Функциональность
- [ ] Главная страница загружается
- [ ] Регистрация работает
- [ ] Вход через OAuth работает
- [ ] Создание услуг работает
- [ ] Поиск работает

### 2. Производительность
- [ ] Время загрузки < 5 секунд
- [ ] Mobile версия работает
- [ ] Нет ошибок в консоли

### 3. SEO
- [ ] Meta-теги генерируются
- [ ] OpenGraph работает
- [ ] Sitemap доступен

## 🔄 CI/CD

### Автоматическое развертывание
```bash
# Любой push в main триггерит развертывание
git push origin main
```

### Ветви разработки
```bash
# Для тестирования новых функций
git checkout -b feature/new-feature
git push origin feature/new-feature
```

## 🐛 Устранение неполадок

### 1. Логи сборки
```bash
# В Render Dashboard → Logs → Build Logs
```

### 2. Логи приложения
```bash
# В Render Dashboard → Logs → Service Logs
```

### 3. Переменные окружения
```bash
# Проверьте все переменные в Environment Variables
```

### 4. Общие проблемы
- **Ошибка сборки**: Проверьте `package.json` и зависимости
- **Ошибка запуска**: Проверьте `startCommand` и порты
- **OAuth не работает**: Проверьте redirect URLs в Supabase

## 📞 Поддержка

### Render Documentation
- [Render Docs](https://render.com/docs)
- [Render Status](https://status.render.com)

### Сообщество
- [Render Community](https://community.render.com)
- GitHub Issues для проекта

---

**Готов к продакшену на Render! 🎉**

## 🚀 Быстрый старт

1. **Перейдите на Render**: https://render.com
2. **Подключите GitHub**: Выберите репозиторий `Doniyortop/Uz-Dev`
3. **Добавьте переменные**: Supabase URL и ключ
4. **Разверните**: Нажмите "Create Web Service"

Через 5-10 минут ваш IT-маркетплейс будет доступен онлайн!
