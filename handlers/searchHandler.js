const Boom = require('@hapi/boom');
const { articlesDb } = require('../services/inferenceClient');
const { getMainSentiment } = require('../utils');

module.exports = {
  search: (request, h) => {
    try {
      const sentimentFilter = request.query.sentiment;
      if (!sentimentFilter) {
        throw Boom.badRequest("Parameter 'sentiment' diperlukan.");
      }
      const filteredArticles = articlesDb.filter(article => {
        const mainSentiment = getMainSentiment(article.sentiment);
        return mainSentiment && mainSentiment.label.toLowerCase() === sentimentFilter.toLowerCase();
      });
      return h.response(filteredArticles).code(200);
    } catch (err) {
      throw Boom.badImplementation(err);
    }
  }
};
