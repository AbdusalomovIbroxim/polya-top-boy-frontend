#!/bin/bash

# Проверка наличия PM2
if ! command -v pm2 &> /dev/null; then
    echo "Установка PM2..."
    npm install -g pm2
fi

# Запуск проекта через PM2
pm2 start ecosystem.config.js

echo "Проект запущен! Доступен по адресу: http://localhost:8080" 