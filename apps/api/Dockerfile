FROM node:20-slim

RUN npm install -g prisma

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY apps/api/prisma ./apps/api/prisma
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma

COPY apps/api/ ./apps/api/
WORKDIR /app/apps/api
RUN npm run build

EXPOSE 5000
CMD ["node", "dist/main"]
