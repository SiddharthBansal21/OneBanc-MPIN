// src/utils/mpinEvaluator.ts

export type Strength = 'weak' | 'strong';
export type Reason =
  | 'COMMONLY_USED'
  | 'DEMOGRAPHIC_DOB_SELF'
  | 'DEMOGRAPHIC_DOB_SPOUSE'
  | 'DEMOGRAPHIC_ANNIVERSARY'
  | 'DEMOGRAPHIC_CROSS_DATES_DOB_SELF_AND_DOB_ANNIVERSARY'
  | 'DEMOGRAPHIC_CROSS_DATES_DOB_SELF_AND_DOB_SPOUSE'
  | 'DEMOGRAPHIC_CROSS_DATES_ANNIVERSARY_SPOUSE';

export interface UserInfo {
  dob?: string;
  anniversary?: string;
  spouseDob?: string;
}

export interface EvalResult {
  strength: Strength;
  reasons: Reason[];
}

// Commonly-used 4-digit PIN patterns
const pinCategories4: Array<[string, string[]]> = [
  ['Sequential',     ['9012','0123','1234','2345','3456','4321','8765','7890']],
  ['RepeatedDigits', ['0000','1111','2222','3333','4444','5555','6666','7777','8888','9999']],
  ['KeypadPatterns', ['2580','1478','1593','7531','0852']],
  ['MirrorSymmetry', ['1221','2112','3443']],
  ['Alternating',    ['1212','1313','2323','3434','4545']],
  ['DoublePairs',    ['1122','3344','5566','7788']],
  ['SpecialDates',   ['2020','1004','1515','1984','1990','2000']]
];

// Commonly-used 6-digit PIN patterns
const pinCategories6: Array<[string, string[]]> = [
  ['Sequential',     ['012345','123456','234567','345678','456789','654321','765432','876543','987654','789012','890123']],
  ['RepeatedDigits', ['000000','111111','222222','333333','444444','555555','666666','777777','888888','999999']],
  ['KeypadPatterns', ['258025','147852','159357','753159','085208']],
  ['MirrorSymmetry', ['123321','211112','456654','344443']],
  ['Alternating',    ['121212','131313','232323','343434','454545']],
  ['DoublePairs',    ['112233','334455','445566','778899']],
  ['SpecialDates',   ['202020','131313','151515','198419','199019','200020']]
];

// Additional common PIN examples
const extraPins4 = [
  '4321','8765','2109','3210','6789','7890','1357','2468',
  '1995','2005','2010','2020'
];
const extraPins6 = [
  '101112','121314','131415','141516','151617'
];

const COMMON_PINS_4 = new Set(pinCategories4.flatMap(([, p]) => p).concat(extraPins4));
const COMMON_PINS_6 = new Set(pinCategories6.flatMap(([, p]) => p).concat(extraPins6));

// Extracts day, month, year segments from an ISO date
function extractSegments(iso: string): [string, string, string] {
  const [YYYY, MM, DD] = iso.split('-');
  return [DD, MM, YYYY.slice(-2)];
}

// Generates all 4-digit patterns from a single date
function patternsFromDate4(iso: string): Set<string> {
  const [DD, MM, YY] = extractSegments(iso);
  return new Set([
    DD + MM,
    MM + DD,
    YY + MM,
    MM + YY,
    YY + DD,
    DD + YY
  ]);
}

// Generates all 6-digit permutations from a single date
function patternsFromDate6(iso: string): Set<string> {
  const [DD, MM, YY] = extractSegments(iso);
  const parts = [DD, MM, YY];
  const out = new Set<string>();
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (j === i) continue;
      for (let k = 0; k < 3; k++) {
        if (k === i || k === j) continue;
        out.add(parts[i] + parts[j] + parts[k]);
      }
    }
  }
  return out;
}

// Generates cross-date 4-digit patterns between two dates
function crossPatterns4(a: string, b: string): Set<string> {
  const segA = extractSegments(a);
  const segB = extractSegments(b);
  const out = new Set<string>();
  for (const x of segA) {
    for (const y of segB) {
      out.add(x + y);
      out.add(y + x);
    }
  }
  return out;
}

// Main MPIN strength evaluator
export default function evaluateMPIN(
  pin: string,
  info: UserInfo,
  length: number
): EvalResult {
  const reasons: Reason[] = [];

  // Check against common PIN lists
  if (
    (length === 4 && COMMON_PINS_4.has(pin)) ||
    (length === 6 && COMMON_PINS_6.has(pin))
  ) {
    reasons.push('COMMONLY_USED');
  }

  // Single-date demographic checks
  if (info.dob) {
    const set = length === 4
      ? patternsFromDate4(info.dob)
      : patternsFromDate6(info.dob);
    if (set.has(pin)) reasons.push('DEMOGRAPHIC_DOB_SELF');
  }
  if (info.spouseDob) {
    const set = length === 4
      ? patternsFromDate4(info.spouseDob)
      : patternsFromDate6(info.spouseDob);
    if (set.has(pin)) reasons.push('DEMOGRAPHIC_DOB_SPOUSE');
  }
  if (info.anniversary) {
    const set = length === 4
      ? patternsFromDate4(info.anniversary)
      : patternsFromDate6(info.anniversary);
    if (set.has(pin)) reasons.push('DEMOGRAPHIC_ANNIVERSARY');
  }

  // Cross-date checks (4-digit only)
  if (length === 4) {
    const pairs: Array<{
      a?: string;
      b?: string;
      cross: Reason;
      ra: Reason;
      rb: Reason;
    }> = [
      {
        a: info.dob,
        b: info.anniversary,
        cross: 'DEMOGRAPHIC_CROSS_DATES_DOB_SELF_AND_DOB_ANNIVERSARY',
        ra: 'DEMOGRAPHIC_DOB_SELF',
        rb: 'DEMOGRAPHIC_ANNIVERSARY'
      },
      {
        a: info.dob,
        b: info.spouseDob,
        cross: 'DEMOGRAPHIC_CROSS_DATES_DOB_SELF_AND_DOB_SPOUSE',
        ra: 'DEMOGRAPHIC_DOB_SELF',
        rb: 'DEMOGRAPHIC_DOB_SPOUSE'
      },
      {
        a: info.anniversary,
        b: info.spouseDob,
        cross: 'DEMOGRAPHIC_CROSS_DATES_ANNIVERSARY_SPOUSE',
        ra: 'DEMOGRAPHIC_ANNIVERSARY',
        rb: 'DEMOGRAPHIC_DOB_SPOUSE'
      }
    ];

    for (const { a, b, cross, ra, rb } of pairs) {
      if (a && b) {
        const crossSet = crossPatterns4(a, b);
        if (crossSet.has(pin)) {
          if (!reasons.includes(cross)) reasons.push(cross);
          if (!reasons.includes(ra)) reasons.push(ra);
          if (!reasons.includes(rb)) reasons.push(rb);
        }
      }
    }
  }

  const strength: Strength = reasons.length > 0 ? 'weak' : 'strong';
  return { strength, reasons };
}
