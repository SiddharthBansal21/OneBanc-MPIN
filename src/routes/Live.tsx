// src/routes/Live.tsx
import { useState } from 'react';
import DemographicsForm, { Demographics } from '../components/DemographicsForm';
import MPINSelector from '../components/MPINSelector';
import MPINInput from '../components/MPINInput';
import evaluateMPIN, { EvalResult } from '../utils/mpinEvaluator';

import '../components/DemographicsForm.css';
import '../components/MPINSelector.css';
import '../components/MPINInput.css';
import './Live.css';

export default function Live() {
  const [userInfo, setUserInfo] = useState<Demographics>({
    dob: '',
    anniversary: '',
    spouseDob: ''
  });
  const [length, setLength] = useState(4);
  const [pin, setPin]       = useState('');
  const [result, setResult] = useState<EvalResult | null>(null);

  const onSubmit = () => {
    const r = evaluateMPIN(pin, userInfo, length);
    setResult(r);
  };

  return (
    <div className="live-container">
      <div className="panel">
        <DemographicsForm onChange={setUserInfo} />
        <MPINSelector length={length} onChange={setLength} />
        <MPINInput
          length={length}
          value={pin}
          onChange={setPin}
          onSubmit={onSubmit}
        />
      </div>

      <div className="panel">
        {result ? (
          <>
            <h2 className={`strength strength-${result.strength}`}>
              Strength: {result.strength.toUpperCase()}
            </h2>
            {result.strength === 'weak' && (
              <ul>
                {result.reasons.map((r, i) => (
                  <li key={i}>{r.replace(/_/g, ' ')}</li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p>Enter MPIN of length {length} and click “Check”</p>
        )}
      </div>
    </div>
  );
}
