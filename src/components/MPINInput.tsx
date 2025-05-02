import { ChangeEvent } from 'react';

type Props = {
  length: number;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
};

export default function MPINInput({ length, value, onChange, onSubmit }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, length);
    onChange(digits);
  };

  return (
    <div className="mpin-input">
      <label>
        Enter MPIN:
        <input
          type="text"
          value={value}
          onChange={handleChange}
        />
      </label>
      <button onClick={onSubmit} disabled={value.length !== length}>
        Check
      </button>
    </div>
  );
}
