const { readdirSync } = require('fs');
const { join } = require('path');

const { DATA_CLEAN_DIR } = require('./constants');
const { DatasetHanCounter } = require('../counter');

function run() {
  const dirPath = join(__dirname, DATA_CLEAN_DIR);
  const files = readdirSync(dirPath).filter((f) => f.endsWith('.txt'));

  const reportsDir = join(__dirname, '..', '..', 'data');
  const countReportFile = join(reportsDir, 'wikinews_characters.csv');
  const filesCountReportFile = join(reportsDir, 'wikinews_documents.csv');
  const extCountReportFile = join(reportsDir, 'wikinews_characters_ext.csv');
  const extFilesCountReportFile = join(
    reportsDir,
    'wikinews_documents_ext.csv',
  );

  const counter = new DatasetHanCounter(dirPath, files);
  counter.run();
  counter.writeReportsTo(countReportFile, filesCountReportFile);
  counter.writeExtendedReportsTo(extCountReportFile, extFilesCountReportFile);
}

run();
