#!/usr/bin/env bash
# Однократная настройка сервера для варианта B (запуск без node_modules)
set -euo pipefail

APP_DIR="/var/www/stroybrain"
mkdir -p "$APP_DIR/data"

if [ ! -f "$APP_DIR/.env" ]; then
  echo "Создайте $APP_DIR/.env (скопируйте с ПК или из .env.example)"
fi

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

if [ ! -f /etc/nginx/sites-enabled/stroybrain.ru ]; then
  cat > /etc/nginx/sites-available/stroybrain.ru << 'NGINX'
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
NGINX
  ln -sf /etc/nginx/sites-available/stroybrain.ru /etc/nginx/sites-enabled/
  nginx -t && systemctl reload nginx
fi

echo "Сервис:"
systemctl status stroybrain --no-pager || true
curl -s -o /dev/null -w "localhost:3000 => HTTP %{http_code}\n" http://127.0.0.1:3000/ || true
