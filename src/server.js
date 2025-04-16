require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');

const HF_API_KEY = process.env.HF_API_KEY;
if (!HF_API_KEY) {
  console.error("Error: HF_API_KEY is not set in environment variables.");
  process.exit(1);
}

// Impor semua route dari file routes.js
const routes = require('../routes');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 8000,
    host: 'localhost',
    routes: {
      cors: true,
      security: true
    }
  });

  // Registrasi semua route
  server.route(routes);

  // Jalankan server
  await server.start();
  console.log(`Server berjalan pada: ${server.info.uri}`);
};

// Tangani error yang tidak tertangkap
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

init();
