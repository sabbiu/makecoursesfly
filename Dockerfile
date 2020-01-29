FROM node:12-alpine

WORKDIR /app

COPY ./package.json ./
RUN npm install
COPY ./client/package.json ./client/package.json
RUN npm install --prefix client
COPY . .
RUN npm run build --prefix client
RUN npm run build

CMD npm run start:prod --bind 0.0.0.0:$PORT
