FROM node:18-alpine

WORKDIR /usr/src/next

COPY *.* /usr/src/next

RUN npm install

COPY . /usr/src/next

RUN npm run build --no-warnings || true

EXPOSE 3000

CMD ["npm", "run", "dev"]