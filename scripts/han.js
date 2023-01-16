const HAN_RANGES = [
  ['4E00', '9FFF'], // CJK Unified Ideographs
  ['3400', '4DBF'], // CJK Unified Ideographs Extension A
  ['20000', '2A6DF'], // CJK Unified Ideographs Extension B
  ['2A700', '2B739'], // CJK Unified Ideographs Extension C
  ['2B740', '2B81D'], // CJK Unified Ideographs Extension D
  ['2B820', '2CEA1'], // CJK Unified Ideographs Extension E
  ['2CEB0', '2EBE0'], // CJK Unified Ideographs Extension F
  ['30000', '3134A'], // CJK Unified Ideographs Extension G
  ['31350', '323AF'], // CJK Unified Ideographs Extension H
  ['2E80', '2EFF'], // CJK Radicals Supplement
  ['2F00', '2FDF'], // Kangxi Radicals
  ['F900', 'FAFF'], // CJK Compatibility Ideographs
  ['2F800', '2FA1F'], // CJK Compatibility Ideographs Supplement
];

const HAN_EXT_RANGES = [
  // CJK Symbols and Punctuation:
  ['3005'], // 々 IDEOGRAPHIC ITERATION MARK
  ['3006'], // 〆 IDEOGRAPHIC CLOSING MARK

  // CJK Strokes:
  ['31C0', '31EF'],

  // Enclosed CJK Letters and Months:
  ['3220', '3243'], // parenthesized
  ['3244', '3247'], // circled
  ['3280', '32B0'], // circled
  ['32C0', '32CB'], // telegraph symbols for months
  ['32FF'], // square era name: REIWA

  // CJK Compatibility:
  ['3358', '3370'], // telegraph symbols for hours
  ['337B', '337E'], // square era names: HEISEI, SYOUWA, TAISYOU, MEIZI
  ['337F'], // square: CORPORATION
  ['33E0', '33FE'], // telegraph symbols for days (1st-31st)

  // Enclosed Ideographic Supplement:
  ['1F210', '1F23B'], // enclosed in squares
  ['1F240', '1F248'], // tortoise shell bracketed
  ['1F250', '1F251'], // circled
];

module.exports = {
  HAN_RANGES,
  HAN_EXT_RANGES,
};
