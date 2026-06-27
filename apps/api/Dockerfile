FROM node:20-slim

RUN npm install -g prisma @nestjs/cli

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/ui/package.json ./packages/ui/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/
RUN npm ci

COPY apps/api/ ./apps/api/
WORKDIR /app/apps/api
RUN npx prisma generate && nest build && echo "BUILD OK" && find dist -type f 2>/dev/null || echo "NO DIST FOUND"

EXPOSE 5000
CMD ["node", "dist/main.js"]
