FROM node:20.17-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm ci
COPY src ./src
COPY .env ./ 
RUN npm run build
RUN npm prune --production

FROM node:20.17-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/.env ./ 
EXPOSE 3000
CMD ["node", "dist/main.js"]