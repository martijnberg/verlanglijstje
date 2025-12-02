// backend/config/appConfig.js

export const APP_CONFIG = {
  port: process.env.PORT || 5001,
  // In dev: frontend op Mac
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  // Later voor Hetzner bijvoorbeeld:
  // CORS_ORIGIN=https://berg-verlanglijstjes.nl
};
