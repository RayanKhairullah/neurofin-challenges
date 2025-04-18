const Boom = require('@hapi/boom');
const { articlesDb } = require('../services/data');
const { getMainSentiment } = require('../utils');

module.exports = {
  search: (request, h) => {
    try {
      const { sentiment } = request.query;

      // (Joi di routes sudah required, tapi guard tambahan aman)
      if (!sentiment) {
        throw Boom.badRequest("Parameter 'sentiment' diperlukan.");
      }

      const filtered = articlesDb.filter(article => {
        const main = getMainSentiment(article.sentiment);
        return main && main.label.toLowerCase() === sentiment.toLowerCase();
      });

      return h.response(filtered).code(200);

    } catch (err) {
      console.error('Error in search handler:', err);
      throw Boom.isBoom(err)
        ? err
        : Boom.badImplementation('Terjadi kesalahan saat memproses permintaan.');
    }
  }
};