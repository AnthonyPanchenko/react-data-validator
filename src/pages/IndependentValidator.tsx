import { Fragment } from 'react';

import SelectInput from '@/components/SelectInput';
import TextInput from '@/components/TextInput';
import ValidationFieldError from '@/validator/components/ValidationFieldError';
import useStatelessValidationField from '@/validator/hooks/useStatelessValidationField';
import useValidationFieldState from '@/validator/hooks/useValidationFieldState';
// import useDataValidator from '@/validator/hooks/useDataValidator';

const SELECT_OPTIONS = [
  { label: 'Monday', value: 'mon' },
  { label: 'Tuesday', value: 'tue' },
  { label: 'Wednesday', value: 'wen' },
  { label: 'Thursday', value: 'thu' },
  { label: 'Friday', value: 'fri' },
  { label: 'Saturday', value: 'sat' },
  { label: 'Sunday', value: 'sun' }
];

const resultPromise = (day: string | undefined) =>
  new Promise<string>((result, reject) => {
    setTimeout(() => {
      console.log(day);
      if (day !== 'wen') {
        reject('The Day is not a "Wednesday"!');
      } else {
        result('');
      }
    }, 3000);
  });

async function asyncValidateDay(day: string | undefined) {
  return await resultPromise(day);
}

// function validateDay(day: string | undefined) {
//   if (day !== 'wen') {
//     return 'The Day is not a "Wednesday"!';
//   }

//   return '';
// }

// function validateUserName(name: string | undefined) {
//   if (!name) {
//     return 'Name is required!';
//   }

//   if (name !== name.trim() && name.length > 10) {
//     return ['Name cannot include leading and trailing spaces!', 'Name cannot be longer than 10!'];
//   }

//   if (name !== name.trim()) {
//     return 'Name cannot include leading and trailing spaces!';
//   }

//   if (name.length > 10) {
//     return 'Name cannot be longer than 10!';
//   }

//   return '';
// }

export default function IndependentValidator() {
  const userNameField = useStatelessValidationField<string | undefined, string>(
    useValidationFieldState,
    {
      fieldPath: 'userName',
      isValid: true,
      isDirty: false,
      isValidating: false,
      isTouched: false,
      initialValue: 'initial text',
      errors: ['Error initial first', 'Error second'],
      validator: asyncValidateDay
    }
  );

  const dayField = useStatelessValidationField<string | undefined, string>(
    useValidationFieldState,
    {
      fieldPath: 'day',
      isValid: true,
      isDirty: false,
      isValidating: false,
      isTouched: false,
      initialValue: SELECT_OPTIONS[1].value,
      errors: 'Wrong day initial',
      validator: asyncValidateDay
    }
  );

  const onChangeText = (value: string | undefined, name?: string) => {
    console.log(value, name);
    // setSingle('textValue', value);

    const d = userNameField.setFieldValue(value);

    if (value?.includes('q')) {
      d.validate<string>('bla');
    }
  };

  const onChangeSelect = (value: string, name?: string) => {
    console.log(value, name);
    // setSingle('selectValue', value);
    const d = dayField.setFieldValue(value);
    d.validate();
  };

  return (
    <Fragment>
      <TextInput<string | undefined>
        type="text"
        value={userNameField.value}
        name="userName"
        label="Name"
        placeholder="Name"
        onChange={onChangeText}
      />
      <ValidationFieldError errors={userNameField.fieldState.errors} />
      <br />
      <SelectInput<string>
        type="text"
        name="day"
        value={dayField.value}
        label="Day of week"
        options={SELECT_OPTIONS}
        onChange={onChangeSelect}
      />
      <ValidationFieldError errors={dayField.fieldState.errors} />
    </Fragment>
  );
}
