# Start the server by default, this can be overwritten at runtime
FROM node:18-bullseye-slim

WORKDIR /index

ENV DATABASE_URL="mysql://admin:-=,inP<Sh2T1QT4T@34.101.161.224:3306/simpeg_pdm_sleman"

ENV ACCESS_TOKEN="sefkdgwFSDH35449UFSEDRT97FDgjd"

ENV API_KEY="AIzaSyBuAgmNF6vHe35BTpz4y6UUArfZYAbaLOM"
ENV AUTH_DOMAIN="simpeg-pdm-sleman.firebaseapp.com"
ENV PROJECT_ID="simpeg-pdm-sleman"
ENV STORAGE_BUCKET="gs://simpeg-pdm-sleman.appspot.com"
ENV APP_ID="1:244128348729:web:f3f8be8e48b1ac764eebe8"
ENV MEASUREMENT_ID="244128348729"

ENV PORT 8080
COPY . .
RUN npm install
EXPOSE 8080
CMD [ "npm", "run", "start"]