import { Fragment, useState } from 'react';

import ButtonInput from '@/components/ButtonInput';
import RangeInput from '@/components/RangeInput';
import SelectInput from '@/components/SelectInput';
import TextInput from '@/components/TextInput';

const RADIO_OPTIONS = [
  { value: 'US', label: 'USD' },
  { value: 'UZ', label: 'UZS' },
  { value: 'VA', label: 'EUR' }
];
const SELECT_OPTIONS = [
  { label: 'Monday', value: 'mon' },
  { label: 'Tuesday', value: 'tue' },
  { label: 'Wednesday', value: 'wen' },
  { label: 'Thursday', value: 'thu' },
  { label: 'Friday', value: 'fri' },
  { label: 'Saturday', value: 'sat' },
  { label: 'Sunday', value: 'sun' }
];
const CHECKBOX_OPTIONS = [
  { value: 'AW', label: 'Aruba' },
  { value: 'BS', label: 'Bahamas' },
  { value: 'NO', label: 'Norway' },
  { value: 'CA', label: 'Canada' },
  { value: 'UA', label: 'Ukraine' }
];

export default function WizardPage() {
  const [textValue, setTextValue] = useState<string | undefined>();
  const [numberValue, setNumberValue] = useState<number | undefined>();
  const [selectValue, setSelectValue] = useState<string | undefined>();
  const [rangeValue, setRangeValue] = useState<number | undefined>();

  const [radioValue, setRadioValue] = useState<string | undefined>();
  const [checkboxValue, setCheckboxValue] = useState<ReadonlyArray<string>>([]);

  const onChangeText = (value: string, name?: string) => {
    console.log(value, name);
    setTextValue(value);
  };
  const onChangeNumber = (value: number, name?: string) => {
    console.log(value, name);
    setNumberValue(value);
  };
  const onChangeRange = (value: number, name?: string) => {
    console.log(value, name);
    setRangeValue(value);
  };
  const onChangeSelect = (value: string, name?: string) => {
    console.log(value, name);
    setSelectValue(value);
  };
  const onChangeCheckbox = (value: ReadonlyArray<string>, name?: string) => {
    console.log(value, name);
    setCheckboxValue(value);
  };
  const onChangeRadio = (value: string, name?: string) => {
    console.log(value, name);
    setRadioValue(value);
  };

  return (
    <Fragment>
      <TextInput<string>
        type="text"
        value={textValue}
        name="name"
        label="Name"
        placeholder="Name"
        onChange={onChangeText}
      />
      <TextInput<number>
        type="number"
        value={numberValue}
        name="age"
        label="Age"
        placeholder="Age"
        onChange={onChangeNumber}
      />
      <SelectInput<string>
        type="text"
        name="day"
        value={selectValue}
        label="Day of week"
        options={SELECT_OPTIONS}
        onChange={onChangeSelect}
      />
      <RangeInput
        label="Range slider"
        min={0}
        max={100}
        name="distance"
        value={rangeValue}
        onChange={onChangeRange}
      />
      <ButtonInput<string, ReadonlyArray<string>>
        type="checkbox"
        name="country"
        value={checkboxValue}
        options={CHECKBOX_OPTIONS}
        onChange={onChangeCheckbox}
      />
      <ButtonInput<string, string>
        type="radio"
        name="currency"
        value={radioValue}
        options={RADIO_OPTIONS}
        onChange={onChangeRadio}
      />
    </Fragment>
  );
}
