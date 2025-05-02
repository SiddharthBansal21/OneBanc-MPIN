// src/components/TestCaseList.tsx

import evaluateMPIN from '../utils/mpinEvaluator';
import testCases, { TestCase } from '../utils/testCases';
import './TestCaseList.css';

export default function TestCaseList() {
  const compare = (actual: TestCase['expected'], expected: TestCase['expected']) =>
    actual.strength === expected.strength &&
    actual.reasons.length === expected.reasons.length &&
    actual.reasons.every((r) => expected.reasons.includes(r));

  return (
    <table className="test-table">
      <thead>
        <tr>
          <th>Scenario</th>
          <th>PIN</th>
          <th>Len</th>
          <th>User Info</th>
          <th>Expected</th>
          <th>Actual</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        {testCases.map((tc, i) => {
          const actual = evaluateMPIN(tc.pin, tc.userInfo, tc.length);
          const pass = compare(actual, tc.expected);
          return (
            <tr key={i} className={pass ? 'pass' : 'fail'}>
              <td>{tc.desc}</td>
              <td>{tc.pin}</td>
              <td>{tc.length}</td>
              <td>
                {Object.entries(tc.userInfo)
                  .map(([k, v]) => `${k}: ${v || '-'}`)
                  .join(', ')}
              </td>
              <td>
                <strong>{tc.expected.strength}</strong>
                {tc.expected.reasons.length > 0 && (
                  <ul>
                    {tc.expected.reasons.map((r) => (
                      <li key={r}>{r.replace(/_/g, ' ')}</li>
                    ))}
                  </ul>
                )}
              </td>
              <td>
                <strong>{actual.strength}</strong>
                {actual.reasons.length > 0 && (
                  <ul>
                    {actual.reasons.map((r) => (
                      <li key={r}>{r.replace(/_/g, ' ')}</li>
                    ))}
                  </ul>
                )}
              </td>
              <td>{pass ? 'PASS' : 'FAIL'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
