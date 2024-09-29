FROM node:22.9.0-slim
#RUN addgroup localizer && adduser -S -G localizer localizer
RUN addgroup localizer && useradd -g localizer localizer
USER localizer
WORKDIR /home/localizer
COPY --chown=localizer package*.json ./
RUN npm install
COPY --chown=localizer . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
