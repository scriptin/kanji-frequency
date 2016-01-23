var kanjiData = {
  aozora:    { fileName: 'aozora.json',    description: 'Books from Aozora Bunko' },
  news:      { fileName: 'news.json',      description: 'Online news articles' },
  twitter:   { fileName: 'twitter.json',   description: 'Twitter messages' },
  wikipedia: { fileName: 'wikipedia.json', description: 'Wikipedia articles and pages' }
};

var getJson = Promise.promisify(d3.json);

// Add loading indicators
$('.templates').html('<div class="col-xs-12 loading"><em>Loading...</em></div>');

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
  // Remove loading indicators
  $('.templates .loading').remove();

  // General info
  _.forEach(kanjiData, function (data, key) {
    var infoBlock = $('<div/>', {'class': 'col-md-6 col-lg-3'}).html(generalInfo(data));
    $('#general-info .templates').append(infoBlock);
  });

  // Frequency and coverage
  _.forEach(kanjiData, function (data, key) {
    var cw = chartWrapper(data.name, 'col-xs-12');
    $('#zipf-law .templates').append(cw);
    freqCoverChart(cw.find('.chart'), key, data);
  });
});

function chartWrapper(title, classes) {
  var chartCell = $('<div/>', {'class': classes});
  var chartWrapper = $('<div/>', {'class': 'chart-wrapper'});
  chartCell.append(chartWrapper);
  chartWrapper.append($('<div/>', {'class': 'chart-title'}).text(title));
  var chart =  $('<div/>', {'class': 'chart'});
  chartWrapper.append(chart);
  return chartCell;
}

function freqCoverChart(el, key, data) {
  var margin = { top: 20, right: 40, bottom: 30, left: 40 };

  var width = el.innerWidth() - margin.left - margin.right;
  var height = 300 - margin.top - margin.bottom;

  var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
  var y0 = d3.scale.linear().range([height, 0]);
  var y1 = d3.scale.linear().range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');
  var yAxisLeft = d3.svg.axis()
    .scale(y0)
    .orient('left')
    .ticks(10, '%');
  var yAxisRight = d3.svg.axis()
    .scale(y1)
    .orient('right')
    .ticks(10, '%');

  var coverageLine = d3.svg.line()
    .x(function(row) { return x.rangeBand()/2 + x(row[0]); })
    .y(function(row) { return y1(row[3]); });

  var svg = d3.select(el.get()[0])
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var table = _(data.table).tail().take(100);
  var sum = 0;
  table.forEach(function (row) {
    row.push(sum + row[2]);
    sum += row[2];
  });

  x.domain(table.map(function (row) { return row[0]; }).value());
  y0.domain([0, table.map(function (row) { return row[2]; }).max()]);
  y1.domain([0, table.map(function (row) { return row[3]; }).max()]);

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  svg.append('g')
    .attr('class', 'y axis left')
    .call(yAxisLeft)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.7em')
    .style('text-anchor', 'end')
    .text('Frequency');

  svg.append('g')
    .attr('class', 'y axis right')
    .attr("transform", "translate(" + width + " ,0)")
    .call(yAxisRight)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '-1.2em')
    .style('text-anchor', 'end')
    .text('Coverage');

  svg.selectAll('.bar')
    .data(table.value())
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', function(row) { return x(row[0]); })
    .attr('width', x.rangeBand())
    .attr('y', function(row) { return y0(row[2]); })
    .attr('height', function(row) { return height - y0(row[2]); });

  svg.append('path')
    .attr('class', 'secondary')
    .attr('d', coverageLine(table.value()));
}
