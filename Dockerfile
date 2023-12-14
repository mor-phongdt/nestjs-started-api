FROM node:18 AS builder

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
# Install app dependencies

RUN npm install


COPY . .
RUN npx prisma generate

RUN npm run build

FROM node:18

COPY --from=builder /node_modules ./node_modules
COPY --from=builder /package*.json ./
COPY --from=builder /dist ./dist
COPY --from=builder /prisma ./prisma

EXPOSE 3000
