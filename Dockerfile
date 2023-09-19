FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run prisma:generate

RUN npm run build

EXPOSE 50001

CMD [ "npm", "run", "start:prod" ]