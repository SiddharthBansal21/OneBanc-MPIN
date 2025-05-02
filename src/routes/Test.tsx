// src/routes/Test.tsx

import TestCaseList from '../components/TestCaseList';
import './Test.css';

export default function Test() {
  return (
    <div className="test-page">
      <h1>Automated Test Scenarios</h1>
      <p>
        Below are 20+ scenarios covering all 4- and 6-digit MPIN rules. Green rows
        passed, red rows failed.
      </p>
      <TestCaseList />
    </div>
  );
}
