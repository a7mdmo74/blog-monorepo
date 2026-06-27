FROM node:20-slim

RUN npm install -g prisma

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 5000
CMD ["node", "dist/main"]
