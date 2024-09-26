FROM node:20.17.0-alpine3.20
RUN addgroup localizer && adduser -S -G localizer localizer
USER localizer
WORKDIR /home/localizer
COPY --chown=localizer package*.json ./
RUN npm install
COPY --chown=localizer . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
