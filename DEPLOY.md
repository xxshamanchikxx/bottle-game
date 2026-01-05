# 🍾 ДЕПЛОЙ НА FASTPANEL

## 📋 Подготовка

### 1. На FastPanel выбери:
- **"Реверсивный прокси"** или **"Пустой (статичный)"** с Node.js

### 2. Установи Node.js и PM2 на сервере:
```bash
# Установка Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка PM2 глобально
npm install -g pm2
```

---

## 🚀 Процесс деплоя

### Шаг 1: Загрузи проект на сервер
```bash
# Перейди в директорию
cd /var/www/svsmoliar/data/www/forum.x-rayrp.com

# Загрузи файлы через FileManager FastPanel
# Или через Git (если настроен)
```

### Шаг 2: Настрой переменные окружения
```bash
# В корне проекта создай .env
nano server/.env
```

**Файл server/.env:**
```env
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://forum.x-rayrp.com
```

**Файл .env.production (в корне):**
```env
NEXT_PUBLIC_SOCKET_URL=https://forum.x-rayrp.com
```

### Шаг 3: Установи зависимости
```bash
# Корневые зависимости (сервер)
npm install

# Клиентские зависимости
cd client
npm install
cd ..
```

### Шаг 4: Собери клиент (Next.js)
```bash
cd client
npm run build
cd ..
```

### Шаг 5: Запусти через PM2
```bash
# Запуск обоих приложений
pm2 start ecosystem.config.js

# Сохрани конфигурацию для автозапуска
pm2 save
pm2 startup
```

---

## 🌐 Настройка Nginx (Реверсивный прокси)

В FastPanel → Настройки домена → Nginx Config:

```nginx
# Проксирование Next.js клиента (порт 3000)
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
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
```

---

## 🔧 Полезные команды PM2

```bash
# Посмотреть статус
pm2 status

# Посмотреть логи
pm2 logs

# Перезапустить
pm2 restart all

# Остановить
pm2 stop all

# Удалить из PM2
pm2 delete all

# Мониторинг
pm2 monit
```

---

## ✅ Проверка работы

1. **Сервер Socket.io:** `https://forum.x-rayrp.com:4000`
2. **Клиент Next.js:** `https://forum.x-rayrp.com`
3. **Регистрация:** `https://forum.x-rayrp.com`
4. **Админка:** `https://forum.x-rayrp.com/x-ray`

---

## 🔒 SSL сертификат

FastPanel обычно автоматически устанавливает Let's Encrypt:
- Панель → SSL → Let's Encrypt → Активировать

Или вручную:
```bash
sudo certbot --nginx -d forum.x-rayrp.com
```

---

## 📁 Структура на сервере

```
/var/www/svsmoliar/data/www/forum.x-rayrp.com/
├── server/
│   ├── index.js
│   ├── questions.js
│   └── .env
├── client/
│   ├── .next/          # Собранный билд
│   ├── public/
│   ├── src/
│   └── package.json
├── ecosystem.config.js  # PM2 конфиг
├── package.json
└── .env.production
```

---

## 🐛 Если что-то не работает

```bash
# Проверь логи PM2
pm2 logs

# Проверь порты
netstat -tulpn | grep node

# Перезапусти Nginx
sudo systemctl restart nginx

# Проверь права доступа
chmod -R 755 /var/www/svsmoliar/data/www/forum.x-rayrp.com
```

---

## 🔄 Обновление проекта

```bash
cd /var/www/svsmoliar/data/www/forum.x-rayrp.com
git pull origin main
npm install
cd client
npm install
npm run build
cd ..
pm2 restart all
```

---

## 📊 Альтернатива: Docker (если FastPanel поддерживает)

Создай `docker-compose.yml`:
```yaml
version: '3.8'
services:
  server:
    build: ./server
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
  
  client:
    build: ./client
    ports:
      - "3000:3000"
    depends_on:
      - server
```

Запуск:
```bash
docker-compose up -d
```
