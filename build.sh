#!/bin/bash

# Установка зависимостей
npm install

# Сборка проекта
npm run build

# Копирование собранных файлов в директорию для деплоя
cp -r docs/* /var/www/html/

echo "Проект успешно собран и развернут!" 