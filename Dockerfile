# ── Etapa de desarrollo ──────────────────────────────────────────
FROM node:20-alpine

WORKDIR /usr/src/app

# Instalar dependencias primero (cache de Docker)
COPY app/package*.json ./
RUN npm install

# Copiar el resto del código
COPY app/ .

# Exponer el puerto de Next.js dev server
EXPOSE 3000

# Arrancar en modo desarrollo con hot-reload
CMD ["npm", "run", "dev"]
