FROM node:20.18 as builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20.18 

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/tsconfig.json ./ 

EXPOSE $NODE_DOCKER_PORT

CMD [ "npm", "run", "start:migrate:dev" ]
