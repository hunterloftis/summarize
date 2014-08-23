var _ = require('lodash');
var unfluff = require('unfluff');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var sentiment = require('sentiment');
var Stats = require('text-statistics');
var glossary = require('glossary')({
  minFreq: 2,
  collapse: true
});

var DEFAULTS = {
  ok: false,
  sentiment: 0,
  title: null,
  topics: [],
  words: 0,
  difficulty: 0,
  minutes: 0,
  image: null
};

module.exports = function summarize(html) {
  var data = unfluff(html);
  var tokens = tokenizer.tokenize(data.text).length;
  var keywords = glossary.extract(data.title + '. ' + data.text);

  if (tokens > 5 && keywords.length > 2) {
    var sent = sentiment(data.text);
    var stats = new Stats(data.text);
    var difficulty = stats.smogIndex() / 12;
    var wpm = 100 + 100 * difficulty;
    var minutes = Math.ceil(tokens / wpm);

    return _.extend({}, DEFAULTS, {
      ok: true,
      sentiment: sent.comparative,
      title: data.title,
      topics: keywords,
      words: tokens,
      difficulty: difficulty,
      minutes: minutes,
      image: data.image
    });
  }

  return _.extend({}, DEFAULTS);
};
