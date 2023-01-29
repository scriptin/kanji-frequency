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
   * @param {number} reportEveryNItems
   * @param {number | null | undefined} [totalItems] Set to `null` when total count cannot be determined
   */
  constructor(message, reportEveryNItems, totalItems) {
    this.message = message;
    this.reportEveryNItems = reportEveryNItems;
    this.totalItems = totalItems;
    this._count = 0;
  }

  _needToReport() {
    if (this._count % this.reportEveryNItems === 0) return true;
    return this.totalItems ? this._count === this.totalItems : false;
  }

  /**
   * @param {MessageGenerator} [additionalMessage]
   */
  update(additionalMessage) {
    this._count += 1;
    if (!this._needToReport()) return;

    const needPercents =
      this.message.includes('{PERCENT}') && !!this.totalItems;
    const pct = needPercents ? percent(this._count, this.totalItems) : '?';
    console.log(
      this.message
        .replaceAll('{COUNT}', this._count.toString())
        .replaceAll(
          '{TOTAL}',
          this.totalItems ? this.totalItems.toString() : 'unknown',
        )
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
