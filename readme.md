# Summarize

Easily summarize webpage content

```js
var summarize = require('summarize');
var superagent = require('superagent');

superagent
  .get('http://kotaku.com/an-album-a-minecraft-style-game-both-1625202335')
  .end(function(res) {
    console.log(summarize(res.text));
  });
```

```
{ ok: true,
  sentiment: 0.05976095617529881,
  title: 'An Album? A Minecraft-Style Game? Both!',
  topics: [ 'video game', 'album', 'Rustie', 'I', 'song', 'musicians' ],
  words: 270,
  difficulty: 0.5166666666666667,
  minutes: 2,
  image: 'http://i.kinja-img.com/gawker-media/image/upload/s--GCXC4g_z--/cfbmjh85chn4kityfn9y.jpg' }
```

## Installation

```
npm install --save summarize
```

## Summary information

### ok

`true` if content was parseable, `false` if not.

### sentiment

A comparative sentiment value where lower = negative and
higher = positive. 0.06 is pretty positive while 0.01 is fairly neutral.

### title

Title, taken from the `<title>` tag.

### topics

Extracted topic keywords in order of importance.

### words

Word count.

### difficulty

A normalized (0-1) rating of reading comprehension difficulty.
Scholarly articles will tend towards one while Justin Beiber's
twitter will tend towards zero.

(uses the [Smog Index](http://en.wikipedia.org/wiki/SMOG))

### minutes

Estimated minutes required to read and comprehend.

### image

Primary image from the page (or `null` if none found).
