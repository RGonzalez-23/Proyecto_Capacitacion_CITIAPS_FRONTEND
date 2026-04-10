# Etapa 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm i

# Copiar codigo fuente
COPY . .

# Compilar la aplicacion
RUN npm run build

# Etapa 2: Runtime
FROM node:22-alpine

WORKDIR /app

# Copiar package.json para instalar dependencias de produccion
COPY package*.json ./

# Instalar solo dependencias de produccion
RUN npm i --production

# Copiar archivos compilados desde la etapa anterior
COPY --from=builder /app/.output /app/.output

# Exponer el puerto
EXPOSE 3000

# Variables de entorno
ENV PORT=3000 HOST=0.0.0.0

# Ejecutar la aplicacion
CMD ["node", ".output/server/index.mjs"]
