import '@/validator/utils';

import { useRef } from 'react';

import GroupDataValidator, { INITIAL_STATE_GROUP_DATA } from '@/pages/group-data-validator-context';
import GroupValidatorFields from '@/pages/GroupValidatorFields';

// const SELECT_OPTIONS = [
//   { label: 'Monday', value: 'mon' },
//   { label: 'Tuesday', value: 'tue' },
//   { label: 'Wednesday', value: 'wen' },
//   { label: 'Thursday', value: 'thu' },
//   { label: 'Friday', value: 'fri' },
//   { label: 'Saturday', value: 'sat' },
//   { label: 'Sunday', value: 'sun' }
// ];

// const resultPromise = (day: string | undefined) =>
//   new Promise<string>((result, reject) => {
//     setTimeout(() => {
//       console.log(day);
//       if (day !== 'wen') {
//         reject('The Day is not a "Wednesday"!');
//       } else {
//         result('');
//       }
//     }, 3000);
//   });

// async function asyncValidateDay(day: string | undefined) {
//   return await resultPromise(day);
// }

// function validateDay(day: string | undefined) {
//   if (day !== 'wen') {
//     return 'The Day is not a "Wednesday"!';
//   }

//   return '';
// }

function validateUserName(name: string | undefined) {
  if (!name) {
    return 'Name is required!';
  }

  if (name !== name.trim() && name.length > 10) {
    return ['Name cannot include leading and trailing spaces!', 'Name cannot be longer than 10!'];
  }

  if (name !== name.trim()) {
    return 'Name cannot include leading and trailing spaces!';
  }

  if (name.length > 10) {
    return 'Name cannot be longer than 10!';
  }

  return '';
}

export default function GroupValidator() {
  const renderCounter = useRef(0);
  const dataValidatorStore = GroupDataValidator.useFormValidator(INITIAL_STATE_GROUP_DATA);

  renderCounter.current += 1;
  console.log('GroupValidator renderer counter', renderCounter.current);

  return (
    <GroupDataValidator.ContextProvider value={dataValidatorStore}>
      <GroupValidatorFields />
    </GroupDataValidator.ContextProvider>
  );
}

// const onChangeText = (value: string | undefined, name?: string) => {
//   console.log(value, name);
//   // setSingle('textValue', value);

//   const d = userNameField.setFieldValue(value);

//   if (value?.includes('q')) {
//     console.log(1);
//     d.validate<string>('bla');
//   }
// };

// const onChangeSelect = (value: string, name?: string) => {
//   console.log(value, name);
//   // setSingle('selectValue', value);
//   const d = dayField.setFieldValue(value);
//   d.validate();
// };

/*
  meta: {
      fieldId: prev.fieldId,
      parentId: prev.parentId,
      initialValue: prev.initialValue,
      isValid: s.isValid !== undefined ? s.isValid : prev.isValid,
      isDirty: s.isDirty !== undefined ? s.isDirty : prev.isDirty,
      isValidating: s.isValidating !== undefined ? s.isValidating : prev.isValidating,
      isTouched: s.isTouched !== undefined ? s.isTouched : prev.isTouched,
      errors: 'errors' in s ? s.errors : prev.errors
  },
  actions: {
    setData
    setValue
  }
  */

// fieldPath="companyData.documents[]"

// companyData: {
//   id: 45,
//   companyName: 'Cyberpunk Ltd',
//   postCode: '23-234',
//   city: 'New york',
//   license: {
//     number: 739,
//     isRegulation: true
//   },
//   documents: [{ id: '12212', file: 'ewer' }]
// },
// ownersData: {
//   securityNumber: 'ML73900753799',
//   owners: [
//     {
//       id: 23,
//       firstName: 'John',
//       lastName: 'Connors',
//       pep: {
//         isExposed: false
//       }
//     }
//   ]
// }
