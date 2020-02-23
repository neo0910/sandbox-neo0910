FROM node:13-alpine

WORKDIR /usr/src/app

CMD npm install ; npm run dev

EXPOSE 3000