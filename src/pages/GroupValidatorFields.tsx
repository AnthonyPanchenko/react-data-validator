import { Fragment, useRef } from 'react';

import TextInput from '@/components/TextInput';
import GroupDataValidator, { Owner } from '@/pages/group-data-validator-context';

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

export default function GroupValidatorFields() {
  const renderCounter = useRef(0);

  renderCounter.current += 1;
  console.log('GroupValidatorFields renderer counter', renderCounter.current);

  return (
    <Fragment>
      <GroupDataValidator.FormFieldValidator<string | undefined, ReadonlyArray<string> | string>
        fieldPath={['companyName']}
        validator={validateUserName}
      >
        {(val, setValue) => (
          <Fragment>
            <TextInput<string | undefined>
              type="text"
              value={val}
              name="companyName"
              label="Company Name"
              placeholder="Company Name"
              onChange={value => {
                console.log('companyName: ', value, val);
                setValue(value);
              }}
            />
            <p>{val}</p>
          </Fragment>
        )}
      </GroupDataValidator.FormFieldValidator>

      <br />

      <GroupDataValidator.FormFieldValidator<string | undefined, ReadonlyArray<string> | string>
        fieldPath={['ownersData', 'securityNumber']}
        validator={validateUserName}
      >
        {(val, setValue) => (
          <Fragment>
            <TextInput<string | undefined>
              type="text"
              value={val}
              name="securityNumber"
              label="Security Number"
              placeholder="Security Number"
              onChange={value => {
                console.log('securityNumber: ', value, val);
                setValue(value);
              }}
            />
            <p>{val}</p>
          </Fragment>
        )}
      </GroupDataValidator.FormFieldValidator>

      <br />

      <GroupDataValidator.FormFieldArray<Owner> fieldPath={['ownersData', 'owners']}>
        {entries => (
          <Fragment>
            {entries.map((item, i) => (
              <GroupDataValidator.FormFieldValidator<
                string | undefined,
                ReadonlyArray<string> | string
              >
                key={'owner' + i}
                fieldPath={['ownersData', 'owners', i.toString(), 'name']}
                validator={validateUserName}
              >
                {(val, setValue) => (
                  <Fragment>
                    <TextInput<string | undefined>
                      type="text"
                      value={val}
                      name="owner"
                      label="Owner"
                      placeholder="Owner"
                      onChange={value => {
                        console.log('owner: ', i, value, val);
                        setValue(value);
                      }}
                    />
                    <p>{item.name}</p>
                  </Fragment>
                )}
              </GroupDataValidator.FormFieldValidator>
            ))}
          </Fragment>
        )}
      </GroupDataValidator.FormFieldArray>
    </Fragment>
  );
}