// src/components/DemographicsForm.tsx
import { useState, useEffect } from 'react';

export interface Demographics {
  dob: string;
  anniversary: string;
  spouseDob: string;
}

type Props = {
  onChange: (info: Demographics) => void;
};

export default function DemographicsForm({ onChange }: Props) {
  const [dob, setDob] = useState('');
  const [anniversary, setAnniversary] = useState('');
  const [spouseDob, setSpouseDob] = useState('');

  // Notify parent whenever any field updates
  useEffect(() => {
    onChange({ dob, anniversary, spouseDob });
  }, [dob, anniversary, spouseDob, onChange]);

  return (
    <div className="demo-form">
      <label>
        Date of Birth:
        <input
          type="date"
          value={dob}
          onChange={e => setDob(e.target.value)}
        />
      </label>

      <label>
        Anniversary:
        <input
          type="date"
          value={anniversary}
          onChange={e => setAnniversary(e.target.value)}
        />
      </label>

      <label>
        Spouse DOB:
        <input
          type="date"
          value={spouseDob}
          onChange={e => setSpouseDob(e.target.value)}
        />
      </label>
    </div>
  );
}
