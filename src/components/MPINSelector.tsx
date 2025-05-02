// src/components/MPINSelector.tsx
type Props = {
    length: number;
    onChange: (len: number) => void;
  };
  
  export default function MPINSelector({ length, onChange }: Props) {
    return (
      <div className="mpin-selector">
        <label className="mpin-selector__label">MPIN length:</label>
        <div className="mpin-selector__options">
          <label>
            <input
              type="radio"
              name="mpin-length"
              value="4"
              checked={length === 4}
              onChange={() => onChange(4)}
            />{' '}
            4 digits
          </label>
          <label style={{ marginLeft: '1rem' }}>
            <input
              type="radio"
              name="mpin-length"
              value="6"
              checked={length === 6}
              onChange={() => onChange(6)}
            />{' '}
            6 digits
          </label>
        </div>
      </div>
    );
  }
  