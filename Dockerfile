FROM node:18

RUN mkdir /app

ADD . /app
WORKDIR /app
RUN npm install && npm run build

ENV PORT 80
ENV PORTS 443
ENV NODE_ENV production

EXPOSE 1337

CMD [ "npm", "run", "pm2-start" ]