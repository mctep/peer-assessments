FROM node:7

RUN curl https://install.meteor.com/ | sh

RUN npm i typings --global

ADD .meteor /project
ADD package.json /project
ADD typings.json /project

WORKDIR /project

RUN meteor npm i

ADD . .

RUN typings install

CMD LC_ALL=C.UTF-8 npm start -- --allow-superuser
