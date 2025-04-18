const Boom = require('@hapi/boom');
const { articlesDb } = require('../services/data');
const { getMainSentiment } = require('../utils');

module.exports = {
  recommend: (request, h) => {
    try {
      let positiveCount = 0;
      let negativeCount = 0;
      articlesDb.forEach(article => {
        const mainSentiment = getMainSentiment(article.sentiment);
        if (mainSentiment) {
          if (mainSentiment.label === 'positive') {
            positiveCount++;
          } else if (mainSentiment.label === 'negative') {
            negativeCount++;
          }
        }
      });
      let recommendation;
      if (positiveCount > negativeCount) {
        recommendation = "Buy - Rekomendasi untuk membeli aset karena sentimen pasar cenderung positif.";
      } else if (negativeCount > positiveCount) {
        recommendation = "Sell - Rekomendasi untuk menjual aset karena sentimen pasar cenderung negatif.";
      } else {
        recommendation = "Hold - Rekomendasi untuk mempertahankan aset karena sentimen pasar netral.";
      }
      return h.response({
        recommendation,
        positive_count: positiveCount,
        negative_count: negativeCount
      }).code(200);
    } catch (err) {
      throw Boom.badImplementation(err);
    }
  }
};
