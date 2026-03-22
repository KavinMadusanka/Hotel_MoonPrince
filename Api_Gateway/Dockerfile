FROM node:alpine

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
# RUN npm ci --omit=dev

COPY . .

RUN npm install -g nodemon

EXPOSE 5000

CMD ["npm", "run", "dev"]