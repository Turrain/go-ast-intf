################################
## BUILD ENVIRONMENT ###########
################################

FROM node:20-alpine3.20 As build

WORKDIR /app

COPY package.json ./

RUN npm install

COPY ./ ./

RUN npx vite build

################################
#### PRODUCTION ENVIRONMENT ####
################################

FROM nginx:stable-alpine as production

COPY --from=build /app/nginx /etc/nginx/conf.d

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]