# ── Stage 1: build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Instalamos dependencias primero (capa de caché separada del código fuente)
COPY package*.json ./
RUN npm ci

# El build arg permite sobreescribir la URL del backend al ejecutar docker-compose.
# Vite lo embebe en el bundle en tiempo de compilación (no en tiempo de ejecución).
ARG VITE_API_BACK_SBM_BASE_URL=http://localhost:8080
ENV VITE_API_BACK_SBM_BASE_URL=$VITE_API_BACK_SBM_BASE_URL

COPY . .
RUN npm run build

# ── Stage 2: servir con nginx ─────────────────────────────────────────────────
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración de nginx para React Router (SPA: todas las rutas → index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
