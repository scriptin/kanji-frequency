function percent(value, total) {
  return ((100 * value) / total).toFixed(2);
}

module.exports = {
  percent,
};
