#!/usr/bin/env node

var superagent = require('superagent');
var summarize = require('./summarize');
var url = process.argv[2];

superagent
  .get(url)
  .end(function(res) {
    writeSummary(summarize(res.text, 8));
  });

function writeSummary(summary) {
  if (!summary.ok) {
    return console.error("Unable to summarize");
  }

  console.log('\nTitle:', summary.title);
  console.log('Topics:', summary.topics.join(', '));
  console.log('Image:', summary.image);
  console.log('Sentiment:', summary.sentiment);
  console.log('Word count:', summary.words);
  console.log('Difficulty:', summary.difficulty);
  console.log('Minutes to read:', summary.minutes);
  console.log('');
}
