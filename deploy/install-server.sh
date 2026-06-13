#!/usr/bin/env bash
# Запуск на Ubuntu-сервере: bash install-server.sh
set -euo pipefail

APP_DIR="/var/www/stroybrain"
REPO="https://github.com/odnpsk-rgb/stroybrain.git"

echo "=== StroyBrain: установка на сервер ==="

export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y curl git nginx certbot python3-certbot-nginx

if ! command -v node >/dev/null 2>&1 || [[ "$(node -p "process.versions.node.split('.')[0]")" -lt 22 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

echo "Node: $(node -v)"

if [ ! -d "$APP_DIR/.git" ]; then
  mkdir -p "$APP_DIR"
  git clone "$REPO" "$APP_DIR"
else
  cd "$APP_DIR"
  git pull origin main
fi

cd "$APP_DIR"

if [ ! -f .env ]; then
  cp .env.example .env
  echo ""
  echo ">>> Создан .env — ОБЯЗАТЕЛЬНО отредактируйте пароль админа:"
  echo "    nano $APP_DIR/.env"
  echo ""
fi

npm ci
npm run build

cat > /etc/systemd/system/stroybrain.service << 'EOF'
[Unit]
Description=StroyBrain website
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/stroybrain
Environment=NODE_ENV=production
Environment=PORT=3000
EnvironmentFile=/var/www/stroybrain/.env
ExecStart=/usr/bin/node .output/server/index.mjs
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable stroybrain
systemctl restart stroybrain

cat > /etc/nginx/sites-available/stroybrain.ru << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name stroybrain.ru www.stroybrain.ru;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

ln -sf /etc/nginx/sites-available/stroybrain.ru /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo ""
echo "=== Готово ==="
systemctl status stroybrain --no-pager || true
curl -s -o /dev/null -w "HTTP localhost:3000 => %{http_code}\n" http://127.0.0.1:3000/ || true
echo ""
echo "Сайт: http://186.246.47.189"
echo "SSL:  certbot --nginx -d stroybrain.ru -d www.stroybrain.ru"
echo "Не забудьте: nano $APP_DIR/.env"
