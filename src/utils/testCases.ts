
import { UserInfo, EvalResult } from './mpinEvaluator';

export interface TestCase {
  desc: string;
  pin: string;
  length: number;
  userInfo: UserInfo;
  expected: EvalResult;
}

const baseUser: UserInfo = {
  dob: '1985-04-12',
  anniversary: '2010-06-20',
  spouseDob: '1986-11-05'
};

const emptyAll: UserInfo = { dob: '', anniversary: '', spouseDob: '' };

const newTestCases: TestCase[] = [
  // 1–5: Common 4-digit patterns
  {
    desc: 'Common 4-digit: Sequential',
    pin: '1234',
    length: 4,
    userInfo: baseUser,
    expected: { strength: 'weak', reasons: ['COMMONLY_USED'] }
  },
  {
    desc: 'Common 4-digit: Repeated digits',
    pin: '0000',
    length: 4,
    userInfo: baseUser,
    expected: { strength: 'weak', reasons: ['COMMONLY_USED'] }
  },
  {
    desc: 'Common 4-digit: Keypad pattern',
    pin: '2580',
    length: 4,
    userInfo: baseUser,
    expected: { strength: 'weak', reasons: ['COMMONLY_USED'] }
  },
  {
    desc: 'Common 4-digit: Alternating',
    pin: '1212',
    length: 4,
    userInfo: baseUser,
    expected: { strength: 'weak', reasons: ['COMMONLY_USED'] }
  },
  {
    desc: 'Common 4-digit: Special date',
    pin: '2020',
    length: 4,
    userInfo: baseUser,
    expected: { strength: 'weak', reasons: ['COMMONLY_USED'] }
  },

  // 6: Strong 4-digit with no demographics
  {
    desc: 'Strong 4-digit, no demographics',
    pin: '3459',
    length: 4,
    userInfo: emptyAll,
    expected: { strength: 'strong', reasons: [] }
  },

  // 7–9: Single-date matches (4-digit)
  {
    desc: 'Match self DOB (4-digit → 1204)',
    pin: '1204',
    length: 4,
    userInfo: baseUser,
    expected: { strength: 'weak', reasons: ['DEMOGRAPHIC_DOB_SELF'] }
  },
  {
    desc: 'Match spouse DOB (4-digit → 0511)',
    pin: '0511',
    length: 4,
    userInfo: baseUser,
    expected: { strength: 'weak', reasons: ['DEMOGRAPHIC_DOB_SPOUSE'] }
  },
  {
    desc: 'Match anniversary (4-digit → 2006)',
    pin: '2006',
    length: 4,
    userInfo: baseUser,
    expected: { strength: 'weak', reasons: ['DEMOGRAPHIC_ANNIVERSARY'] }
  },

  // 10–12: Cross-date matches (4-digit)
  {
    desc: 'Cross-date: DOB & Spouse → 1205',
    pin: '1205',
    length: 4,
    userInfo: baseUser,
    expected: {
      strength: 'weak',
      reasons: [
        'DEMOGRAPHIC_CROSS_DATES_DOB_SELF_AND_DOB_SPOUSE',
        'DEMOGRAPHIC_DOB_SELF',
        'DEMOGRAPHIC_DOB_SPOUSE'
      ]
    }
  },
  {
    desc: 'Cross-date: DOB & Anniversary → 1220',
    pin: '1220',
    length: 4,
    userInfo: baseUser,
    expected: {
      strength: 'weak',
      reasons: [
        'DEMOGRAPHIC_CROSS_DATES_DOB_SELF_AND_DOB_ANNIVERSARY',
        'DEMOGRAPHIC_DOB_SELF',
        'DEMOGRAPHIC_ANNIVERSARY'
      ]
    }
  },
  {
    desc: 'Cross-date: Anniversary & Spouse → 2005',
    pin: '2005',
    length: 4,
    userInfo: baseUser,
    expected: {
      strength: 'weak',
      reasons: [
        'DEMOGRAPHIC_CROSS_DATES_ANNIVERSARY_SPOUSE',
        'DEMOGRAPHIC_ANNIVERSARY',
        'DEMOGRAPHIC_DOB_SPOUSE'
      ]
    }
  },

  // 13–15: Common 6-digit patterns
  {
    desc: 'Common 6-digit: Sequential',
    pin: '123456',
    length: 6,
    userInfo: baseUser,
    expected: { strength: 'weak', reasons: ['COMMONLY_USED'] }
  },
  {
    desc: 'Common 6-digit: Repeated digits',
    pin: '111111',
    length: 6,
    userInfo: baseUser,
    expected: { strength: 'weak', reasons: ['COMMONLY_USED'] }
  },
  {
    desc: 'Common 6-digit: Keypad pattern',
    pin: '258025',
    length: 6,
    userInfo: baseUser,
    expected: { strength: 'weak', reasons: ['COMMONLY_USED'] }
  },

  // 16: Strong 6-digit, no demographics
  {
    desc: 'Strong 6-digit, no demographics',
    pin: '789012',
    length: 6,
    userInfo: emptyAll,
    expected: { strength: 'strong', reasons: [] }
  },

  // 17–19: Single-date matches (6-digit)
  {
    desc: 'Match self DOB (6-digit → 120485)',
    pin: '120485',
    length: 6,
    userInfo: baseUser,
    expected: { strength: 'weak', reasons: ['DEMOGRAPHIC_DOB_SELF'] }
  },
  {
    desc: 'Match spouse DOB (6-digit → 051186)',
    pin: '051186',
    length: 6,
    userInfo: baseUser,
    expected: { strength: 'weak', reasons: ['DEMOGRAPHIC_DOB_SPOUSE'] }
  },
  {
    desc: 'Match anniversary (6-digit → 200610)',
    pin: '200610',
    length: 6,
    userInfo: baseUser,
    expected: { strength: 'weak', reasons: ['DEMOGRAPHIC_ANNIVERSARY'] }
  },

  // 20: Invalid length special case
  {
    desc: 'Invalid length (5-digit MPIN)',
    pin: '12345',
    length: 5,
    userInfo: baseUser,
    expected: { strength: 'strong', reasons: [] }
  },

  // 21–22: Fully correct strong with all demographics provided
  {
    desc: 'Fully correct: Strong 4-digit with all demographics',
    pin: '8374',
    length: 4,
    userInfo: baseUser,
    expected: { strength: 'strong', reasons: [] }
  },
  {
    desc: 'Fully correct: Strong 6-digit with all demographics',
    pin: '837465',
    length: 6,
    userInfo: baseUser,
    expected: { strength: 'strong', reasons: [] }
  }
];

export default newTestCases;
