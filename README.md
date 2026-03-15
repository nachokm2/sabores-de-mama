<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Sabores de Mamá — Reserva y pago

Aplicación React + Vite con servidor Express (`server.ts`) para servir frontend y endpoint de pago.

## Requisitos

- Node.js 20+

## Variables de entorno

Crear un archivo `.env.local` (o variables del sistema) con:

- `STRIPE_SECRET_KEY` (requerida para `/api/create-payment-intent`)
- `GEMINI_API_KEY` (si se usa funcionalidad de Gemini)

## Desarrollo

1. Instalar dependencias:
   `npm install`
2. Iniciar entorno de desarrollo:
   `npm run dev`
3. Abrir:
   `http://localhost:3000`

## Lanzamiento (producción)

1. Construir frontend:
   `npm run build`
2. Iniciar servidor:
   `npm start`

El servidor usa `PORT` si está definida; por defecto `3000`.
