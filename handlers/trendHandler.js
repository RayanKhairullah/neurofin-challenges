const Boom = require('@hapi/boom');
const { articlesDb } = require('../services/inferenceClient');
const { getMainSentiment } = require('../utils');

const getTrend = async (request, h) => {
    try {
      const { start_date, end_date } = request.query;
  
      // Asumsikan articlesDb adalah array artikel yang tersedia
      const filteredArticles = articlesDb.filter(article => {
        const articleDate = new Date(article.timestamp);
        return articleDate >= new Date(start_date) && articleDate <= new Date(end_date);
      });
  
      if (!filteredArticles.length) {
        return h.response({ message: 'Tidak ada artikel dalam rentang tanggal yang diberikan.' }).code(200);
      }
  
      // Lanjutkan dengan pemrosesan data
      const trendData = processTrendData(filteredArticles);
      return h.response(trendData).code(200);
    } catch (err) {
      console.error('Error in getTrend handler:', err);
      throw Boom.internal('Terjadi kesalahan saat memproses permintaan.');
    }
  };
  
  module.exports = { getTrend };
