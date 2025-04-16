const getMainSentiment = (sentimentArray) => {
    if (!Array.isArray(sentimentArray) || sentimentArray.length === 0) {
      return null;
    }
    return sentimentArray.sort((a, b) => b.score - a.score)[0];
  };
  
  module.exports = { getMainSentiment };
  