FROM node:18 AS builder

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
RUN npx prisma generate

FROM node:18
RUN apk update && apk add bash && apk add --no-cache coreutils


COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/wait-for ./prisma
EXPOSE 3000
# 👇 new migrate and start app script
