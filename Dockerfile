FROM node:16-alpine
RUN npm install -g npm@8
WORKDIR /app
COPY package*.json./
RUN npm install
COPY ..
RUN npm build
RUN npm install -g serve
EXPOSE 5000
CMD ["serve", "-s", "build", "-l", "5000"]
