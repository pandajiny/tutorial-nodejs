FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY .env ./
COPY dist/ ./

EXPOSE 443
EXPOSE 80

ENTRYPOINT ["node", "index.js"]