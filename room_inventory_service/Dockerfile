FROM node:20-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

# RUN npm install --production
RUN npm ci --omit=dev

COPY . .

EXPOSE 8090

CMD ["node", "server.js"]