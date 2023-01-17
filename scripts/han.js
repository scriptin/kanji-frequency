const HAN_RANGES = [
  [0x4e00, 0x9fff], // CJK Unified Ideographs
  [0x3400, 0x4dbf], // CJK Unified Ideographs Extension A
  [0x20000, 0x2a6df], // CJK Unified Ideographs Extension B
  [0x2a700, 0x2b739], // CJK Unified Ideographs Extension C
  [0x2b740, 0x2b81d], // CJK Unified Ideographs Extension D
  [0x2b820, 0x2cea1], // CJK Unified Ideographs Extension E
  [0x2ceb0, 0x2ebe0], // CJK Unified Ideographs Extension F
  [0x30000, 0x3134a], // CJK Unified Ideographs Extension G
  [0x31350, 0x323af], // CJK Unified Ideographs Extension H
  [0x2e80, 0x2eff], // CJK Radicals Supplement
  [0x2f00, 0x2fdf], // Kangxi Radicals
  [0xf900, 0xfaff], // CJK Compatibility Ideographs
  [0x2f800, 0x2fa1f], // CJK Compatibility Ideographs Supplement
];

const HAN_EXT_RANGES = [
  // CJK Symbols and Punctuation:
  [0x3005], // 々 IDEOGRAPHIC ITERATION MARK
  [0x3006], // 〆 IDEOGRAPHIC CLOSING MARK

  // CJK Strokes:
  [0x31c0, 0x31ef],

  // Enclosed CJK Letters and Months:
  [0x3220, 0x3243], // parenthesized
  [0x3244, 0x3247], // circled
  [0x3280, 0x32b0], // circled
  [0x32c0, 0x32cb], // telegraph symbols for months
  [0x32ff], // square era name: REIWA

  // CJK Compatibility:
  [0x3358, 0x3370], // telegraph symbols for hours
  [0x337b, 0x337e], // square era names: HEISEI, SYOUWA, TAISYOU, MEIZI
  [0x337f], // square: CORPORATION
  [0x33e0, 0x33fe], // telegraph symbols for days (1st-31st)

  // Enclosed Ideographic Supplement:
  [0x1f210, 0x1f23b], // enclosed in squares
  [0x1f240, 0x1f248], // tortoise shell bracketed
  [0x1f250, 0x1f251], // circled
];

module.exports = {
  HAN_RANGES,
  HAN_EXT_RANGES,
};
