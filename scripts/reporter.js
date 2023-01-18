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

  /**
   * @param {number} itemCount
   * @param {MessageGenerator} [additionalMessage]
   */
  report(itemCount, additionalMessage) {
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
