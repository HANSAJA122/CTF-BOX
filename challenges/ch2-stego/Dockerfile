FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY . .
RUN node generate_stego.js
EXPOSE 3002
CMD ["node", "server.js"]
