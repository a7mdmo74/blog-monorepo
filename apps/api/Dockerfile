FROM node:20-slim

RUN npm install -g prisma

WORKDIR /app

COPY apps/api/package.json apps/api/package-lock.json ./
RUN npm ci

COPY apps/api/prisma ./prisma
RUN npx prisma generate

COPY apps/api/ ./
RUN npm run build

EXPOSE 5000
CMD ["node", "dist/main"]
