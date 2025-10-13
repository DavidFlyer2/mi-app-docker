# Usa una imagen base de Node.js Alpine (ligera)
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package.json yarn.lock .yarnrc.yml ./

# Habilita corepack y prepara Yarn
RUN corepack enable && \
    corepack prepare yarn@stable --activate

# Instala las dependencias
RUN yarn install --immutable

# Copia el resto de los archivos
COPY . .

# Expone el puerto
EXPOSE 3000

# Comando de salud para Docker
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Inicia la aplicación
CMD ["node", "server.js"]