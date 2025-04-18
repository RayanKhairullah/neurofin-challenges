// handlers/trendHandler.js
const Boom = require('@hapi/boom');
const { articlesDb } = require('../services/data');
const { getMainSentiment } = require('../utils');

const getTrend = async (request, h) => {
  try {
    const { start_date, end_date } = request.query;

    // (Joi sudah validasi iso date, tapi double‑check)
    const start = new Date(start_date);
    const end = new Date(end_date);
    if (isNaN(start) || isNaN(end)) {
      throw Boom.badRequest("Format 'start_date' atau 'end_date' tidak valid. Gunakan YYYY-MM-DD.");
    }

    // filter artikel
    const filtered = articlesDb.filter(a => {
      const ts = new Date(a.timestamp);
      return ts >= start && ts <= end;
    });

    if (filtered.length === 0) {
      return h
        .response({ message: 'Tidak ada artikel dalam rentang tanggal yang diberikan.' })
        .code(200);
    }

    // hitung tren per tanggal
    const trendMap = {};
    filtered.forEach(article => {
      const date = new Date(article.timestamp).toISOString().split('T')[0];
      const main = getMainSentiment(article.sentiment);
      if (!trendMap[date]) {
        trendMap[date] = { date, positive: 0, negative: 0, neutral: 0 };
      }
      if (main && main.label) {
        const key = main.label.toLowerCase();
        if (trendMap[date][key] !== undefined) {
          trendMap[date][key]++;
        }
      }
    });
    const trendData = Object.values(trendMap);

    return h.response(trendData).code(200);

  } catch (err) {
    console.error('Error in getTrend handler:', err);
    throw Boom.isBoom(err)
      ? err
      : Boom.internal('Terjadi kesalahan saat memproses permintaan.');
  }
};

module.exports = { getTrend };