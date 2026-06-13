#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/stroybrain"
REPO="https://github.com/odnpsk-rgb/stroybrain.git"

echo "==> Обновление кода..."
if [ ! -d "$APP_DIR/.git" ]; then
  sudo git clone "$REPO" "$APP_DIR"
  sudo chown -R "$USER:$USER" "$APP_DIR"
fi

cd "$APP_DIR"
git pull origin main

echo "==> Зависимости и сборка..."
npm install
npm run build

echo "==> Перезапуск сервиса..."
sudo systemctl restart stroybrain

echo "Готово. Проверка: curl -I http://127.0.0.1:3000/"
