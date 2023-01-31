const { join } = require('path');

const { DATA_CLEAN_DIR } = require('./config');
const { DatasetHanCounter } = require('../counter');
const { readdirSync } = require('fs');

function run() {
  const cleanDirPath = join(__dirname, DATA_CLEAN_DIR);
  const files = readdirSync(cleanDirPath).filter((f) => f.endsWith('.txt'));

  const reportsDir = join(__dirname, '..', '..', 'data');
  const countReportFile = join(reportsDir, 'aozora_characters.csv');
  const filesCountReportFile = join(reportsDir, 'aozora_documents.csv');
  const extCountReportFile = join(reportsDir, 'aozora_characters_ext.csv');
  const extFilesCountReportFile = join(reportsDir, 'aozora_documents_ext.csv');

  const counter = new DatasetHanCounter(cleanDirPath, files);
  counter.run();
  counter.writeReportsTo(countReportFile, filesCountReportFile);
  counter.writeExtendedReportsTo(extCountReportFile, extFilesCountReportFile);
}

run();
