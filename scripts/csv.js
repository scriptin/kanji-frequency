/**
 * @param {*[][]} data
 * @return {string}
 */
function toCsv(data) {
  return data.map((row) => row.join(',')).join('\n');
}

module.exports = {
  toCsv,
};
