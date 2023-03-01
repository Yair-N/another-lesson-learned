FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./


COPY client/package*.json client/
RUN npm run install-client --omit=dev

COPY server/package*.json server/
RUN npm run install-server --omit=dev

COPY client/ client/
RUN npm run build --prefix client

COPY server/ server/

# less privileged USER. avoiding using root user
USER node

# CMD specifies the instruction that is to be executed when a Docker container starts.
CMD ["npm","start", "--prefix","server"]

EXPOSE 8000