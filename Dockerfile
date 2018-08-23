FROM node:8.11.4-jessie

WORKDIR /orange-app

RUN npm i npm@latest -g

COPY package*.json ./
RUN npm install --verbose

ADD . .

RUN npm run build

EXPOSE 80

CMD ["node",  "server/index.js"]
