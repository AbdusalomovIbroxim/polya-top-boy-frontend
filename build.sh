#!/bin/bash

# Установка зависимостей
npm install

# Сборка проекта
npm run build

# Копирование собранных файлов в директорию для деплоя
cp -r dist/* /var/www/html/

echo "Проект успешно собран и развернут!" 