FROM node:20-slim

RUN npm install -g prisma

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/ui/package.json ./packages/ui/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/
RUN npm ci

COPY apps/api/ ./apps/api/
WORKDIR /app/apps/api
RUN npx prisma generate
RUN npx tsc -p tsconfig.build.json
RUN ls dist/main.js && echo "BUILD SUCCESS"

EXPOSE 5000
CMD ["node", "dist/main.js"]
