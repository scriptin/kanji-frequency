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
    this._count = 0;
  }

  _needToReport() {
    if (this._count % this.reportEveryNItems === 0) return true;
    return this._count === this.totalItems;
  }

  /**
   * @param {MessageGenerator} [additionalMessage]
   */
  update(additionalMessage) {
    this._count += 1;
    if (!this._needToReport()) return;

    const pct = this.message.includes('{PERCENT}')
      ? percent(this._count, this.totalItems)
      : '';
    console.log(
      this.message
        .replaceAll('{COUNT}', this._count.toString())
        .replaceAll('{TOTAL}', this.totalItems.toString())
        .replaceAll('{PERCENT}', pct),
    );
    if (additionalMessage) {
      console.log(additionalMessage());
    }
  }
}

module.exports = {
  ConsoleReporter,
};
