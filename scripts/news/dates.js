const { readdirSync, writeFileSync } = require('fs');
const { join } = require('path');

const { DATA_CLEAN_DIR } = require('./config');
const { toCsv } = require('../csv');

function groupBy(data, columnField, ...groupByFields) {
  const columnValues = new Set();
  const groupByValues = new Set();

  const dataMap = new Map();
  for (const item of data) {
    const columnValue = item[columnField];
    columnValues.add(columnValue);

    const groupByValue = groupByFields.map((f) => item[f]).join('-');
    groupByValues.add(groupByValue);

    if (dataMap.has(groupByValue)) {
      const counts = dataMap.get(groupByValue);
      counts.set(columnValue, (counts.get(columnValue) ?? 0) + 1);
    } else {
      const counts = new Map();
      counts.set(columnValue, 1);
      dataMap.set(groupByValue, counts);
    }
  }

  const columnValuesOrdered = Array.from(columnValues);
  columnValuesOrdered.sort();

  const groupByValuesOrdered = Array.from(groupByValues);
  groupByValuesOrdered.sort();

  const firstRow = [...groupByFields, ...columnValuesOrdered];
  const csv = [firstRow];

  for (const groupByValue of groupByValuesOrdered) {
    const counts = dataMap.get(groupByValue);
    const countValues = columnValuesOrdered.map((countKey) => {
      if (counts.has(countKey)) return counts.get(countKey);
      return 0;
    });
    csv.push([...groupByValue.split('-'), ...countValues]);
  }

  return csv;
}

function run() {
  const dirPath = join(__dirname, DATA_CLEAN_DIR);
  const files = readdirSync(dirPath).filter((f) => f.endsWith('.txt'));

  const data = files.map((fileName) => {
    const [source, _id, year, month, _day] = fileName
      .replace(/\.txt$/, '')
      .split('-');
    return { source, year, month };
  });

  const result = groupBy(data, 'source', 'year', 'month');

  const reportsDir = join(__dirname, '..', '..', 'data');
  const reportFile = join(reportsDir, 'news_dates.csv');
  writeFileSync(reportFile, toCsv(result), { encoding: 'utf-8' });
}

run();
