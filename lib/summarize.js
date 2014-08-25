var _ = require('lodash');
var unfluff = require('unfluff');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var sentiment = require('sentiment');
var Stats = require('text-statistics');
var glossary = require('glossary')({
  minFreq: 2,
  collapse: true,
  verbose: true
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

module.exports = function summarize(html, limit) {
  limit = limit || Infinity;

  var data = unfluff(html);
  var tokens = tokenizer.tokenize(data.text).length;
  var wordcounts = glossary.extract(data.title + '. ' + data.text);
  var keywords = _.chain(wordcounts)
    .filter(function(wc) { return wc.norm.length > 2 })
    .sortBy('count')
    .reverse()
    .pluck('norm')
    .value();

  if (tokens > 5 && keywords.length > 2) {
    var sent = sentiment(data.text);
    var stats = new Stats(data.text);
    var difficulty = stats.smogIndex() / 12;
    var wpm = (200 - 100 * difficulty) || 1;
    var minutes = Math.ceil(tokens / wpm);

    return _.extend({}, DEFAULTS, {
      ok: true,
      sentiment: sent.comparative,
      title: data.title,
      topics: keywords.slice(0, limit),
      words: tokens,
      difficulty: difficulty,
      minutes: minutes,
      image: data.image
    });
  }

  return _.extend({}, DEFAULTS);
};
