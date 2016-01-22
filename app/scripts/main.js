var fileNames = [
  'aozora.json',
  'news.json',
  'twitter.json',
  'wikipedia.json'
];

var getJson = Promise.promisify(d3.json);
