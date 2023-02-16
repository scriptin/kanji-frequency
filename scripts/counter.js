const { readdirSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const {
  isHan,
  isHanExt,
  IDEOGRAPHIC_ITERATION_MARK_CODE_POINT,
  isIterationMark,
} = require('./han');
const { toCsv } = require('./csv');
const { ConsoleReporter } = require('./reporter');

const ITERATION_MARK_SEQUENCE_REGEX = new RegExp(
  `^\\(.\\)\\u{${IDEOGRAPHIC_ITERATION_MARK_CODE_POINT.toString(16)}}$`,
  'u',
);

/**
 * @param {string} char Character, or 'all', or iteration mark sequence
 * @return {number} Code point value, for iteration mark sequence
 *                  it will return {@link IDEOGRAPHIC_ITERATION_MARK_CODE_POINT}
 */
function getCodePoint(char) {
  if (ITERATION_MARK_SEQUENCE_REGEX.test(char)) {
    return IDEOGRAPHIC_ITERATION_MARK_CODE_POINT;
  }
  return char.codePointAt(0);
}

class CharCounter {
  constructor() {
    /** @type {Map<string, number>} */
    this.charactersCount = new Map();

    /** @type {Map<string, Set<string>>} */
    this.documentsCount = new Map();
  }

  /**
   * Increment count for a given character and add a new file name to count unique files later.
   * File names are stored in a set, so you can (and should) give the same name multiple times
   * @param {string} char Unicode character, may have length > 1 if the character is outside
   *                      Base Multilingual Plane, i.e. has code point > 0xFFFF
   * @param {string} documentId Any unique ID (e.g. a file name) of a document/file
   *                            where this character was encountered.
   */
  incrementChar(char, documentId) {
    this.charactersCount.set(char, (this.charactersCount.get(char) ?? 0) + 1);
    if (this.documentsCount.has(char)) {
      this.documentsCount.get(char).add(documentId);
    } else {
      this.documentsCount.set(char, new Set([documentId]));
    }
  }

  /**
   * @param {[string, number]} a
   * @param {[string, number]}b
   * @return {number}
   * @private
   */
  _sort(a, b) {
    if (a[1] !== b[1]) return b[1] - a[1]; // by frequency, descending
    return a[0] - b[0]; // by code point, ascending
  }

  /**
   * List of characters with number of times each of them were encountered
   * @returns {[string, number][]} Sorted in descending order
   */
  getSortedCharactersCount() {
    return Array.from(this.charactersCount.entries()).sort((a, b) =>
      this._sort(a, b),
    );
  }

  /**
   * List of characters with number of documents in which each of these chars were encountered
   * @returns {[string, number][]} Sorted in descending order
   */
  getSortedDocumentsCount() {
    return Array.from(this.documentsCount.entries())
      .map(([char, files]) => [char, files.size])
      .sort((a, b) => this._sort(a, b));
  }
}

/**
 * @param {[string, number][]} countData
 * @return {number}
 */
function total(countData) {
  return countData.reduce((sum, [_, next]) => sum + next, 0);
}

function addRankAndCodePointColumns(countData) {
  const result = [];

  let rank = 0;
  let prevCount = Infinity;
  countData.forEach(([char, count]) => {
    if (count < prevCount) {
      rank += 1;
    }
    prevCount = count;
    result.push([rank, getCodePoint(char).toString(16), char, count]);
  });

  return result;
}

function writeCharactersCountReport(reportFilePath, countData) {
  const header = ['rank', 'code_point_hex', 'char', 'char_count'];
  const totalRow = [0, '0', 'all', total(countData)];
  const data = [header, totalRow].concat(addRankAndCodePointColumns(countData));
  writeFileSync(reportFilePath, toCsv(data), { encoding: 'utf-8' });
}

function writeDocumentsCountReport(reportFilePath, filesCount, nFiles) {
  const header = ['rank', 'code_point_hex', 'char', 'doc_count'];
  const totalRow = [0, '0', 'all', nFiles];
  const data = [header, totalRow].concat(
    addRankAndCodePointColumns(filesCount),
  );
  writeFileSync(reportFilePath, toCsv(data), { encoding: 'utf-8' });
}

/**
 * @param {CharCounter} counter
 * @param {string} charactersCountReportFilePath
 * @param {string} documentsCountReportFilePath
 * @param {number} nDocuments
 */
function writeReports(
  counter,
  charactersCountReportFilePath,
  documentsCountReportFilePath,
  nDocuments,
) {
  writeCharactersCountReport(
    charactersCountReportFilePath,
    counter.getSortedCharactersCount(),
  );
  writeDocumentsCountReport(
    documentsCountReportFilePath,
    counter.getSortedDocumentsCount(),
    nDocuments,
  );
}

/**
 * Counter for dataset
 */
class DatasetHanCounter {
  /**
   * @param {string} directoryPath Path to a directory containing dataset files
   * @param {string[]} fileNames List of file names (not paths!) within the directory (directoryPath).
   *                             Gives you an opportunity to include/exclude certain files.
   */
  constructor(directoryPath, fileNames) {
    this.directoryPath = directoryPath;
    this.nDcouments = fileNames.length;

    // e.g. 100 => 2, 1,000 => 3, 10,000 => 4, etc.
    const datasetSizeOrder = Math.floor(Math.log10(fileNames.length));
    const reportEvery = 10 ** (datasetSizeOrder < 2 ? 1 : datasetSizeOrder - 1);
    this.reporter = new ConsoleReporter(
      'Processed {COUNT}/{TOTAL} files, {PERCENT}%...',
      reportEvery,
      fileNames.length,
    );

    // Counter for "normal" Han characters
    this.counter = new CharCounter();
    // Counter for BOTH "normal" AND "extended" Han characters
    this.counterExt = new CharCounter();
  }

  run() {
    const files = readdirSync(this.directoryPath);
    for (let fileName of files) {
      const filePath = join(this.directoryPath, fileName);
      const contents = readFileSync(filePath, { encoding: 'utf-8' });

      let previousChar = ''; // for iteration mark
      for (let char of contents) {
        const _isHan = isHan(char);
        if (_isHan) {
          this.counter.incrementChar(char, fileName);
          this.counterExt.incrementChar(char, fileName);
        } else if (isHanExt(char)) {
          if (isIterationMark(char)) {
            // For any iteration mark encountered, include the previous character,
            // as iteration marks serve as a placeholders for previous characters.
            // This allows to group iteration marks by the chars they replace,
            // and count these groups separately
            this.counterExt.incrementChar(`(${previousChar})${char}`, fileName);
          } else {
            this.counterExt.incrementChar(char, fileName);
          }
        }
        // Iteration mark repeats the last kanji before it,
        // but ruby annotations and whitespace can get in between,
        // so we only reassign han characters as previous character
        if (_isHan) {
          previousChar = char;
        }
      }

      this.reporter.update();
    }
  }

  /**
   * @param {string} countReportFilePath
   * @param {string} documentsCountReportFilePath
   */
  writeReportsTo(countReportFilePath, documentsCountReportFilePath) {
    writeReports(
      this.counter,
      countReportFilePath,
      documentsCountReportFilePath,
      this.nDcouments,
    );
  }

  /**
   * @param {string} countReportFilePath
   * @param {string} documentsCountReportFilePath
   */
  writeExtendedReportsTo(countReportFilePath, documentsCountReportFilePath) {
    writeReports(
      this.counterExt,
      countReportFilePath,
      documentsCountReportFilePath,
      this.nDcouments,
    );
  }
}

module.exports = {
  DatasetHanCounter,
};
