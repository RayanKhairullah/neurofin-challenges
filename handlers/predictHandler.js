const Boom = require('@hapi/boom');
const client = require('../services/inferenceClient');
const { getMainSentiment } = require('../utils');

// Simulasi database in-memory untuk artikel
const articlesDb = [];

const predict = async (request, h) => {
  try {
    const { title, content, timestamp } = request.payload;
    if (!title || !content) {
      throw Boom.badRequest("Title and content are required.");
    }
    const articleTimestamp = timestamp ? new Date(timestamp) : new Date();

    // Lakukan inferensi menggunakan @huggingface/inference
    const sentiment = await client.textClassification({
      model: 'ahmedrachid/FinancialBERT-Sentiment-Analysis',
      inputs: content,
    });

    const articleId = articlesDb.length + 1;
    const articleRecord = {
      id: articleId,
      title,
      content,
      timestamp: articleTimestamp,
      sentiment, // Output berupa array of objects [{ label, score }, ...]
    };

    articlesDb.push(articleRecord);
    return h.response(articleRecord).code(200);
  } catch (err) {
    console.error('Error in predict handler:', err);
    throw Boom.badImplementation(err.message);
  }
};

module.exports = { predict };
