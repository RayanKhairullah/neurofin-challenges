const Joi = require('joi');
const Boom = require('@hapi/boom');
const predictHandler = require('./handlers/predictHandler');
const trendHandler = require('./handlers/trendHandler');
const notifyHandler = require('./handlers/notifyHandler');
const recommendHandler = require('./handlers/recommendHandler');
const searchHandler = require('./handlers/searchHandler');

const routes = [
  {
    method: 'POST',
    path: '/predict',
    handler: predictHandler.predict,
  },
  {
    method: 'GET',
    path: '/trend',
    handler: trendHandler.getTrend,
    options: {
      validate: {
        query: Joi.object({
          start_date: Joi.date().iso().required()
            .messages({ 'any.required': "'start_date' wajib diisi.", 'date.format': "Format 'start_date' harus YYYY-MM-DD." }),
          end_date:   Joi.date().iso().required()
            .messages({ 'any.required': "'end_date' wajib diisi.",   'date.format': "Format 'end_date' harus YYYY-MM-DD." })
        }),
        failAction: (request, h, err) => {
          throw Boom.badRequest(err.message);
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/notify',
    handler: notifyHandler.notify,
    options: {
      validate: {
        query: Joi.object({
          threshold: Joi.number().min(0).max(1).default(0.8)
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/recommend',
    handler: recommendHandler.recommend,
  },
  {
    method: 'GET',
    path: '/search',
    handler: searchHandler.search,
    options: {
      validate: {
        query: Joi.object({
          sentiment: Joi.string().valid('positive','negative','neutral')
            .insensitive().required()
            .messages({ 'any.required': "'sentiment' wajib diisi.", 'any.only': "Nilai 'sentiment' harus one of [positive, negative, neutral]." })
        }),
        failAction: (request, h, err) => {
          throw Boom.badRequest(err.message);
        }
      }
    }
  },
];

module.exports = routes;
