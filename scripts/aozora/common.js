function percent(value, total) {
  return ((100 * value) / total).toFixed(2);
}

module.exports = {
  BASE_URL: 'https://www.aozora.gr.jp/',
  // paths are relative
  PAGES_URLS_FILE: 'pages.csv',
  PAGES_FILES_DIR: 'pages',
  GAIJI_LIST_FILE: 'gaiji.csv',
  percent,
};
