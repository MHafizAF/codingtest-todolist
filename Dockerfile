FROM node:lts-slim

WORKDIR /todolist

COPY package.json ./

RUN npm install

COPY . ./

CMD ["npm", "start"]