FROM node:alpine
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
# RUN npm install --production
RUN npm ci --omit=dev
COPY . .
EXPOSE 8081
CMD ["npm", "start"]