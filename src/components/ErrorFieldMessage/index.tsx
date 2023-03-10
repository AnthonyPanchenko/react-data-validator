import React from 'react';

type PropsTypes = {
  value: number | undefined;
  label: string;
  name?: string;
  min: number;
  max: number;
  onChange: (v: number) => void;
};

export default function ErrorFieldMessage({
  label,
  name,
  value,
  min,
  max,
  onChange
}: PropsTypes): JSX.Element {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const n = Number(event.target.value);
    onChange(!isNaN(n) ? n : 0);
  };

  return (
    <div>
      <label>
        <input type="range" value={value} name={name} min={min} max={max} onChange={handleChange} />
        {label}
      </label>
    </div>
  );
}
