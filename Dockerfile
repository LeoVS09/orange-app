FROM node:11.14-stretch as base

# Need for developming for developming
RUN apt update && apt upgrade -y && \
   apt install -y bash bash-completion make curl

# install yarn
RUN npm install -g yarn

# install vue
RUN yarn global add @vue/cli

WORKDIR /ws

COPY package*.json /ws/

RUN yarn

FROM base

COPY . /ws

# RUN yarn build

EXPOSE 8080

CMD ["node",  "server/index.js"]
