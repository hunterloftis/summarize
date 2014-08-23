var assert = require('chai').assert;
var fs = require('fs');
var path = require('path');

var summarize = require('..');

var EMPTY = {
  ok: false,
  sentiment: 0,
  title: null,
  topics: [],
  words: 0,
  difficulty: 0,
  minutes: 0,
  image: null
};

describe('summarize()', function() {

  describe('with an empty body', function() {
    var summary = summarize('');

    it('returns ok=false', function() {
      assert.ok(!summary.ok);
    });

    it('returns empty-state data', function() {
      assert.deepEqual(summary, EMPTY);
    })
  });

  describe('with non-html', function() {
    var summary = summarize('>never<>have&I<<ever >>>>>&&? test');

    it('returns ok=false', function() {
      assert.ok(!summary.ok);
    });

    it('returns empty-state data', function() {
      assert.deepEqual(summary, EMPTY);
    })
  });

  describe('with the kotaku article webpage', function() {
    var page = fs.readFileSync(path.join(__dirname, 'kotaku.fixture.html'), 'utf-8');
    var summary = summarize(page);

    it('returns ok=true', function() {
      assert.ok(summary.ok);
    });

    it('returns sentiment near 0.06', function() {
      assert.closeTo(summary.sentiment, 0.06, 0.01);
    });

    it('extracts the title', function() {
      assert.equal(summary.title, 'An Album? A Minecraft-Style Game? Both!');
    });

    it('extracts 6 topics', function() {
      assert.sameMembers(summary.topics, ['video game', 'album', 'Rustie', 'I', 'song', 'musicians']);
    });

    it('counts 270 words', function() {
      assert.equal(summary.words, 270);
    });

    it('calculates a difficulty near 0.5', function() {
      assert.closeTo(summary.difficulty, 0.5, 0.1);
    });

    it('extracts the main image', function() {
      assert.equal(summary.image, 'http://i.kinja-img.com/gawker-media/image/upload/s--GCXC4g_z--/cfbmjh85chn4kityfn9y.jpg');
    });

    it('predicts 2 minutes to read', function() {
      assert.equal(summary.minutes, 2);
    });
  });

  describe('with the wikipedia raytracing page', function() {
    var page = fs.readFileSync(path.join(__dirname, 'wikipedia.fixture.html'), 'utf-8');
    var summary = summarize(page);

    it('returns ok=true', function() {
      assert.ok(summary.ok);
    });

    it('returns sentiment near 0.02', function() {
      assert.closeTo(summary.sentiment, 0.02, 0.01);
    });

    it('extracts the title', function() {
      assert.equal(summary.title, 'Wikipedia, the free encyclopedia');
    });

    it('extracts reasonable topics', function() {
      assert.includeMembers(summary.topics, ['computer', 'graphics', 'technique', 'image', 'pixels']);
    });

    it('counts 3209 words', function() {
      assert.equal(summary.words, 3209);
    });

    it('calculates a difficulty near 0.9', function() {
      assert.closeTo(summary.difficulty, 0.9, 0.1);
    });

    it('includes no image', function() {
      assert.isNull(summary.image);
    });

    it('predicts 30 minutes to read', function() {
      assert.equal(summary.minutes, 30);
    });
  });
});
