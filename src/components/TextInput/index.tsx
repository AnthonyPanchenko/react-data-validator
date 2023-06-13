import React, { useCallback, useEffect, useState } from 'react';

import { debounce } from '@/components/utils';

type PropsTypes<TValue = string> = {
  value: TValue | undefined;
  delay?: number;
  placeholder: string;
  isDebounced?: boolean;
  label: string;
  name?: string;
  type?: 'text' | 'number';
  onChange: (v: TValue, name?: string) => void;
};

export default function TextInput<TValue = string>({
  type = 'text',
  delay = 500,
  label,
  name,
  isDebounced = false,
  placeholder,
  value,
  onChange
}: PropsTypes<TValue>): JSX.Element {
  const [localValue, setLocalValue] = useState<TValue | undefined>();

  useEffect(() => {
    if (value !== localValue) {
      if (type === 'number') {
        const incomingValue = Number(value);
        const currentValue = Number(localValue);
        if (!isNaN(currentValue) && !isNaN(incomingValue) && incomingValue !== currentValue) {
          setLocalValue(incomingValue as unknown as TValue);
        }
      } else {
        setLocalValue(value);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedChangeHandler = useCallback(
    debounce(val => {
      onChange(val, name);
    }, delay),
    [onChange]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    if (type === 'number') {
      const n = Number(val);
      const parsedNumber = !isNaN(n) ? n : 0;
      if (isDebounced) {
        debouncedChangeHandler(parsedNumber);
        setLocalValue(parsedNumber as unknown as TValue);
      } else {
        onChange(parsedNumber as TValue, name);
      }
    } else {
      if (isDebounced) {
        debouncedChangeHandler(val);
        setLocalValue(val as unknown as TValue);
      } else {
        onChange(val as TValue, name);
      }
    }
  };

  return (
    <div>
      <label>
        {label}
        <input
          type={type}
          name={name}
          value={isDebounced ? (localValue as string | number) || '' : (value as string | number)}
          placeholder={placeholder}
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
