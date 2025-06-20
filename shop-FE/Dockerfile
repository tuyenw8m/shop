# Giai đoạn build dùng Node.js 21
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build  # <-- Lệnh build đúng (cho React, Vite, Vue...)

# Giai đoạn serve với Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]