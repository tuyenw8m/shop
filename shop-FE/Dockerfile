# Giai đoạn build dùng Node.js 21
FROM node:21-alpine AS build
WORKDIR /app
COPY . .
RUN yarn install && yarn build

# Giai đoạn serve với Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 3000
