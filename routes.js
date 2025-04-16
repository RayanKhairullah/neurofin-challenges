const Joi = require('joi');

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
    method: 'GET',
    path: '/trend',
    handler: trendHandler.getTrend,
    options: {
      validate: {
        query: Joi.object({
          start_date: Joi.date().iso().required(),
          end_date: Joi.date().iso().required()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/notify',
    handler: notifyHandler.notify,
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
  },
];

module.exports = routes;
