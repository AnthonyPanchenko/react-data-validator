import './button-input.scss';

import React from 'react';

import { SelectOption } from '@/typings';

type PropsTypes<TValue = string, TResult = ReadonlyArray<TValue>> = {
  value: TResult | undefined;
  name?: string;
  type: 'checkbox' | 'radio';
  options: ReadonlyArray<SelectOption<TValue>>;
  onChange: (v: TResult, name?: string) => void;
};

export default function ButtonInput<TValue = string, TResult = ReadonlyArray<TValue>>({
  options,
  name,
  type,
  value,
  onChange
}: PropsTypes<TValue, TResult>): JSX.Element {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    if (type === 'checkbox' && Array.isArray(value)) {
      const isCurrentChecked = value.includes(val);
      if (isCurrentChecked) {
        onChange(value.filter(item => item !== val) as TResult, name);
      } else {
        onChange([...value, val] as TResult, name);
      }
    } else {
      onChange(val as TResult, name);
    }
  };

  return (
    <div className="input-btn-row">
      {options.map(option => (
        <div key={option.value as string | number}>
          <label>
            <input
              name={name}
              value={option.value as string | number}
              type={type}
              checked={
                type === 'checkbox' && Array.isArray(value)
                  ? value.includes(option.value)
                  : value === option.value
              }
              onChange={handleChange}
            />
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
}
