var summarize = require('./index');
var superagent = require('superagent');

superagent
  .get('http://kotaku.com/an-album-a-minecraft-style-game-both-1625202335')
  .end(function(res) {
    console.log(summarize(res.text));
  });
