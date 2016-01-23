var kanjiData = {
  aozora:    { fileName: 'aozora.json',    description: 'Books from Aozora Bunko' },
  news:      { fileName: 'news.json',      description: 'Online news articles' },
  twitter:   { fileName: 'twitter.json',   description: 'Twitter messages' },
  wikipedia: { fileName: 'wikipedia.json', description: 'Wikipedia articles and pages' }
};

var getJson = Promise.promisify(d3.json);

Promise.all(_.map(_.toPairs(kanjiData), function (data) {
  var key = data[0], record = kanjiData[key];
  return getJson(data[1].fileName).then(function (json) {
    record = _.merge(record, {
      name: _.upperFirst(key),
      table: json,
      kanjiTotalCount: json[0][1],
      kanjiDistinctCount: json.length - 1
    });
  })
})).then(function () {
  // todo: rendering
  _.forEach(kanjiData, function (data, key) {
    d3.select('#general-info .row')
      .append('div')
      .classed('col-md-6 col-lg-3', true)
      .html(generalInfo(data))
  });
});
