function percent(value, total) {
  return ((100 * value) / total).toFixed(2);
}

/**
 * @typedef {Function} MessageGenerator
 * @returns {string}
 */

class ConsoleReporter {
  /**
   * @param {string} message These will be replaced by values: "{COUNT}", "{TOTAL}", "{PERCENT}"
   * @param {number} totalItems
   * @param {number} reportEveryNItems
   */
  constructor(message, totalItems, reportEveryNItems) {
    this.message = message;
    this.totalItems = totalItems;
    this.reportEveryNItems = reportEveryNItems;
  }

  _needToReport(itemCount) {
    if (itemCount % this.reportEveryNItems === 0) return true;
    return itemCount === this.totalItems;
  }

  /**
   * @param {number} itemCount
   * @param {MessageGenerator} [additionalMessage]
   */
  report(itemCount, additionalMessage) {
    if (!this._needToReport(itemCount)) return;

    const pct = this.message.includes('{PERCENT}')
      ? percent(itemCount, this.totalItems)
      : '';
    console.log(
      this.message
        .replaceAll('{COUNT}', itemCount.toString())
        .replaceAll('{TOTAL}', this.totalItems.toString())
        .replaceAll('{PERCENT}', pct),
    );
    if (additionalMessage) {
      console.log(additionalMessage());
    }
  }
}

module.exports = {
  percent,
  ConsoleReporter,
};
