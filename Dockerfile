FROM node:20-alpine AS build
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --ignore-scripts

COPY src ./src
COPY tsconfig*.json ./

RUN npm run build

FROM node:20-alpine AS production
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production --ignore-scripts

COPY --from=build /usr/src/app/dist ./dist

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs

EXPOSE 8080
CMD ["npm", "run", "start:prod"]