FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY . .
RUN node generate_access_log.js
EXPOSE 3005
CMD ["node", "server.js"]
