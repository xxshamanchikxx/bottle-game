# 🍾 ДЕПЛОЙ БЕЗ SSH (Только FileManager)

## ⚠️ Проблема
На FastPanel нет доступа к терминалу/SSH. Решение - загружаем уже собранные файлы!

---

## 📦 ШАГ 1: Собери проект локально (на твоём ПК)

### 1.1 Собери клиент Next.js
```bash
cd C:\Users\x-ray\Desktop\game\bottle-game-v2\client
npm run build
```

Это создаст папку `client/.next/` с собранным проектом.

---

## 📤 ШАГ 2: Загрузи файлы на сервер

### 2.1 Что загружать через FileManager FastPanel:

Загрузи в `/var/www/svsmoliar/data/www/forum.x-rayrp.com/`:

```
📁 bottle-game/
├── 📁 server/
│   ├── index.js
│   ├── questions.js
│   ├── package.json
│   └── .env (СОЗДАЙ ВРУЧНУЮ!)
│
├── 📁 client/
│   ├── 📁 .next/        ← Собранный билд (ВАЖНО!)
│   ├── 📁 public/
│   ├── 📁 src/
│   ├── package.json
│   ├── next.config.ts
│   └── остальные файлы...
│
└── 📁 node_modules/     ← (Загрузи или установи через встроенный npm)
```

### 2.2 Создай файлы конфигурации вручную

**Файл: `/var/www/svsmoliar/data/www/forum.x-rayrp.com/server/.env`**
```env
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://forum.x-rayrp.com
```

**Файл: `/var/www/svsmoliar/data/www/forum.x-rayrp.com/.env.production`**
```env
NEXT_PUBLIC_SOCKET_URL=https://forum.x-rayrp.com
```

---

## 🔧 ШАГ 3: Настрой FastPanel

### 3.1 Тип сайта
Выбери **"Реверсивный прокси"** или **"Node.js"**

### 3.2 Команда запуска (если FastPanel поддерживает)
Если в FastPanel есть поле "Команда запуска":
```bash
node server/index.js & cd client && npx next start
```

Или через PM2 (если установлен):
```bash
pm2 start server/index.js --name bottle-server
pm2 start "cd client && npx next start" --name bottle-client
```

### 3.3 Настрой Nginx
FastPanel → Настройки домена `forum.x-rayrp.com` → Nginx Config:

```nginx
# Next.js клиент (порт 3000)
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

# Socket.io сервер (порт 4000)
location /socket.io/ {
    proxy_pass http://localhost:4000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

# API routes
location /api/ {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
}
```

---

## 🚀 ШАГ 4: Запуск (альтернативные способы)

### Вариант A: Через встроенный Terminal FastPanel (если есть)
Некоторые версии FastPanel имеют Terminal в веб-интерфейсе.

```bash
cd /var/www/svsmoliar/data/www/forum.x-rayrp.com
node server/index.js &
cd client && npx next start &
```

### Вариант B: Через Cron (автозапуск)
FastPanel → Cron → Добавить задачу:
```
@reboot cd /var/www/svsmoliar/data/www/forum.x-rayrp.com && node server/index.js &
@reboot cd /var/www/svsmoliar/data/www/forum.x-rayrp.com/client && npx next start &
```

### Вариант C: Через PHP exec (если только PHP доступен)
Создай файл `start.php`:
```php
<?php
exec('cd /var/www/svsmoliar/data/www/forum.x-rayrp.com && node server/index.js > /dev/null 2>&1 &');
exec('cd /var/www/svsmoliar/data/www/forum.x-rayrp.com/client && npx next start > /dev/null 2>&1 &');
echo "Servers started!";
?>
```

Открой в браузере: `https://forum.x-rayrp.com/start.php`

---

## 🎯 ПРОСТОЕ РЕШЕНИЕ: Только статика

Если Node.js вообще недоступен:

### 1. Экспортируй статичный сайт
На локальном ПК:
```bash
cd C:\Users\x-ray\Desktop\game\bottle-game-v2\client
npm run build
npx next export
```

### 2. Загрузи папку `out/` на сервер
Загрузи содержимое папки `client/out/` в корень сайта FastPanel.

**НО:** Socket.io не будет работать без Node.js! Нужен хотя бы хостинг с Node.js.

---

## ✅ Проверка

После запуска открой:
- https://forum.x-rayrp.com - главная страница
- https://forum.x-rayrp.com/x-ray - админка

---

## 🆘 Если ничего не работает

### Решение 1: Используй альтернативный хостинг
Если FastPanel не поддерживает Node.js - переезжай на:
- **Vercel** (бесплатно, автодеплой из GitHub)
- **Heroku** (есть бесплатный план)
- **Railway.app** (простой деплой)
- **VPS с SSH** (любой за 200-300 руб/мес)

### Решение 2: Деплой на Vercel (РЕКОМЕНДУЮ!)

#### Для клиента (Next.js):
1. Залей код на GitHub
2. Зайди на https://vercel.com
3. Импортируй репозиторий
4. Vercel автоматически развернёт клиент

#### Для сервера (Socket.io):
Используй бесплатный Railway.app или Render.com:
1. Зайди на https://railway.app
2. New Project → Deploy from GitHub
3. Выбери папку `server/`
4. Добавь переменные окружения:
   - `PORT=4000`
   - `CORS_ORIGIN=https://твой-домен.vercel.app`

---

## 📞 Нужна помощь?

Если FastPanel не поддерживает Node.js - скажи, и я помогу настроить на другом хостинге!
