const Boom = require('@hapi/boom');
const { articlesDb } = require('../services/inferenceClient');
const { getMainSentiment } = require('../utils');

module.exports = {
  notify: (request, h) => {
    try {
      const threshold = request.query.threshold ? parseFloat(request.query.threshold) : 0.8;
      let negativeCount = 0;
      articlesDb.forEach(article => {
        const mainSentiment = getMainSentiment(article.sentiment);
        if (mainSentiment && mainSentiment.label === 'negative' && mainSentiment.score >= threshold) {
          negativeCount++;
        }
      });
      let notifications = [];
      if (negativeCount > 0) {
        notifications.push({ message: `Terdeteksi ${negativeCount} artikel dengan sentimen negatif tinggi.`, level: "danger" });
      } else {
        notifications.push({ message: "Tidak ada artikel dengan sentimen negatif tinggi.", level: "info" });
      }
      return h.response(notifications).code(200);
    } catch (err) {
      throw Boom.badImplementation(err);
    }
  }
};
