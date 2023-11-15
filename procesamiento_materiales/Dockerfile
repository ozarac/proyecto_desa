FROM node:16-alpine

# Definir el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Instalar las dependencias del proyecto
COPY package*.json ./
COPY package-lock.json ./

# Instalar dependencias del proyecto
RUN npm install

# Copiar los archivos del proyecto al directorio de trabajo del contenedor
COPY . .

# Exponer el puerto que usa la aplicación (3000 en este caso)
EXPOSE 3000

# Definir el comando para ejecutar la aplicación
CMD [ "npm", "start" ]