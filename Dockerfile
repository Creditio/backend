FROM node:18

RUN mkdir /app

ADD . /app
WORKDIR /app
RUN npm install && npm run build

ENV PORT 80
ENV PORTS 443

EXPOSE 1337

CMD [ "npm", "run", "start" ]