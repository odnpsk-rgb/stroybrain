# Загрузка собранного сайта на сервер (вариант B — без сборки на VPS)
# Запуск из корня проекта: .\deploy\upload-output.ps1

$ErrorActionPreference = "Stop"
$Server = "root@186.246.47.189"
$RemoteDir = "/var/www/stroybrain"
$ProjectRoot = (Resolve-Path "$PSScriptRoot\..").Path
Set-Location $ProjectRoot

if (-not (Test-Path ".output\server\index.mjs")) {
    Write-Host "Сначала соберите проект: npm run build" -ForegroundColor Yellow
    exit 1
}

Write-Host "==> Подготовка каталога на сервере..."
ssh $Server "mkdir -p $RemoteDir/data && rm -rf $RemoteDir/.output"

Write-Host "==> Загрузка .output..."
scp -r .output "${Server}:${RemoteDir}/"

Write-Host "==> Загрузка .env..."
if (Test-Path ".env") {
    scp .env "${Server}:${RemoteDir}/"
} else {
    Write-Host "Файл .env не найден — скопируйте вручную или создайте на сервере." -ForegroundColor Yellow
}

Write-Host "==> Перезапуск сервиса..."
ssh $Server @"
systemctl daemon-reload
systemctl enable stroybrain 2>/dev/null || true
systemctl restart stroybrain
curl -s -o /dev/null -w 'HTTP %{http_code}\n' http://127.0.0.1:3000/ || true
"@

Write-Host "Готово. Проверьте: http://stroybrain.ru" -ForegroundColor Green
