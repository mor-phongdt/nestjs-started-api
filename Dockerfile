FROM node:18 AS builder
RUN apt-get -q update && apt-get -qy install netcat

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
# Install app dependencies

RUN npm install

COPY . .
RUN chmod +x /app/wait-for

RUN npx prisma generate

RUN npm run build

FROM node:18

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/wait-for ./
EXPOSE 3000
# 👇 new migrate and start app script
