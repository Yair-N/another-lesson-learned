FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN npm install --only=production

RUN npm run build --prefix client

# less privileged USER. avoiding using root user
USER node

# CMD specifies the instruction that is to be executed when a Docker container starts.
CMD ["npm","start", "--prefix","server"]

EXPOSE 8000