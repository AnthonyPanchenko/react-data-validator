// import useDataValidator from '@/validator/hooks/useDataValidator';
import '@/validator/utils';

import { Fragment, useRef } from 'react';

import TextInput from '@/components/TextInput';
import ValidationField from '@/validator/components/ValidationField';
import ValidationFieldError from '@/validator/components/ValidationFieldError';
import { useDataValidatorStateManager } from '@/validator/hooks/createDataValidatorContext';

// type OwnersType = {
//   id: number;
//   firstName: string;
//   lastName: string;
//   pep: {
//     isExposed: boolean;
//   };
// };

// type CompanyDataType = {
//   id: number;
//   companyName: string;
//   postCode: string;
//   city: string;
//   license: {
//     number: number;
//     isRegulation: boolean;
//   };
//   documents: Array<{ id: string; file: string }>;
// };

// type GroupDataToValidate = {
//   companyData: CompanyDataType;
//   ownersData: {
//     securityNumber: string;
//     owners: Array<OwnersType>;
//   };
// };
type GroupDataToValidate = {
  firstName: string;
  lastName: string;
};

// const dataToValidate: GroupDataToValidate = {
//   companyData: {
//     id: 45,
//     companyName: 'Cyberpunk Ltd',
//     postCode: '23-234',
//     city: 'New york',
//     license: {
//       number: 739,
//       isRegulation: true
//     },
//     documents: [{ id: '1212', file: 'ewer' }]
//   },
//   ownersData: {
//     securityNumber: 'ML73900753799',
//     owners: [
//       {
//         id: 23,
//         firstName: 'John',
//         lastName: 'Connors',
//         pep: {
//           isExposed: false
//         }
//       }
//     ]
//   }
// };
// const dataToValidate: GroupDataToValidate = {
//   firstName: 'John',
//   lastName: 'Connors'
// };

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
  const dataValidatorStore = useDataValidatorStateManager<GroupDataToValidate>();

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
  renderCounter.current += 1;
  console.log('renderer counter', renderCounter.current);

  return (
    <Fragment>
      <ValidationField<string | undefined, GroupDataToValidate>
        validatorStore={dataValidatorStore}
        fieldPath="firstName"
        validator={validateUserName}
      >
        {(val, setValue) => (
          <Fragment>
            <TextInput<string | undefined>
              type="text"
              value={val}
              name="firstName"
              label="Name"
              placeholder="Name"
              onChange={value => {
                console.log(value, val);
                setValue({ firstName: value });
              }}
            />
            <ValidationFieldError errors={undefined} />
          </Fragment>
        )}
      </ValidationField>

      <br />

      <ValidationField<string | undefined, GroupDataToValidate>
        validatorStore={dataValidatorStore}
        fieldPath="lastName"
        validator={validateUserName}
      >
        {(val, setValue) => (
          <Fragment>
            <TextInput<string | undefined>
              type="text"
              value={val}
              name="lastName"
              label="Name"
              placeholder="Name"
              onChange={value => {
                console.log(value, val);
                setValue({ lastName: value });
              }}
            />
            <ValidationFieldError errors={undefined} />
          </Fragment>
        )}
      </ValidationField>
    </Fragment>
  );
}
