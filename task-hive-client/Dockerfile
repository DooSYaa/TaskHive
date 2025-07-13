# Базовый образ с Node.js
FROM node:18 AS build
WORKDIR /app
# Копируем package.json и устанавливаем зависимости
COPY package.json ./
RUN npm install
# Копируем весь проект и собираем
COPY . .
RUN npm run build
# Финальный образ для запуска
FROM node:18-alpine
WORKDIR /app
# Копируем собранные файлы
COPY --from=build /app/dist ./dist
# Устанавливаем serve для сервировки
RUN npm install -g serve
# Запускаем приложение на порту 4173
CMD ["serve", "-s", "dist", "-l", "4173"]   