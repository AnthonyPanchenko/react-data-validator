import React from 'react';

import { SelectOption } from '@/typings';

type PropsTypes<TValue = string> = {
  value: TValue | undefined;
  isMultiple?: boolean;
  label: string;
  name?: string;
  type?: 'text' | 'number';
  options: ReadonlyArray<SelectOption<TValue>>;
  onChange: (v: TValue, name?: string) => void;
};

export default function SelectInput<TValue = string>({
  options,
  label,
  isMultiple,
  name,
  type = 'text',
  value,
  onChange
}: PropsTypes<TValue>): JSX.Element {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (type === 'number') {
      const n = Number(event.target.value);
      onChange((!isNaN(n) ? n : 0) as unknown as TValue, name);
    } else {
      onChange(event.target.value as TValue, name);
    }
  };

  return (
    <div>
      <label>
        {label}
        <select
          multiple={isMultiple}
          name={name}
          value={value as string | number}
          onChange={handleChange}
        >
          {options.map(option => (
            <option key={option.value as string | number} value={option.value as string | number}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
