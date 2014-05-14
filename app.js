var options = require('./options.js');

var FeedParser = require('feedparser');
var request = require('request');
var fs = require('fs');
var nunjucks = require('nunjucks');

var req = request(options.feed);
var feedparser = new FeedParser([options]);

var down = [];
var up = [];

req.on('error', function (error) {
  // handle any request errors
});
req.on('response', function (res) {
  var stream = this;

  if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

  stream.pipe(feedparser);
});

feedparser.on('error', function(error) {
  // always handle errors
});

feedparser.on('readable', function() {
  // This is where the action is!
  var stream = this;
  var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
  var item;

  while ((item = stream.read())) {
    if (item.summary === 'up') {
      up.push(item);
    } else {
      down.push(item);
    }
  }
});

nunjucks.configure('views', { autoescape: true });
nunjucks.render('index.html', { foo: 'bar' });

feedparser.on('end', function() {
  up.sort(comparator);
  down.sort(comparator);
  fs.writeFileSync('sitesup.html', nunjucks.render('index.html', { up: up, down: down }));
});

function comparator(a, b) {
  var aTitle = a.title.toLowerCase();
  var bTitle = b.title.toLowerCase();
  if (aTitle < bTitle) {
    return -1;
  } else if (aTitle > bTitle) {
    return 1;
  } else {
    return 0;
  }
}
