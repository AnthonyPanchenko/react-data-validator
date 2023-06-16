import './group-validator-fields.scss';

import CustomButton from '@/components/CustomButton';
import RenderChecker from '@/components/RenderChecker';
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

const DELAY = 0;

export default function GroupValidatorFields() {
  return (
    <RenderChecker label="GroupValidatorFields">
      <GroupDataValidator.FormFieldValidator<string | undefined, ReadonlyArray<string> | string>
        fieldPath={['companyName']}
        validator={validateUserName}
      >
        {(val, setValue) => (
          <RenderChecker label="companyName" className="validator-text-field">
            <TextInput<string | undefined>
              type="text"
              value={val}
              delay={DELAY}
              name="companyName"
              label="Company Name"
              placeholder="Company Name"
              onChange={value => {
                console.log('companyName: ', value, val);
                setValue(value);
              }}
            />
            <span>{val}</span>
          </RenderChecker>
        )}
      </GroupDataValidator.FormFieldValidator>

      <GroupDataValidator.FormFieldValidator<string | undefined, ReadonlyArray<string> | string>
        fieldPath={['ownersData', 'securityNumber']}
        validator={validateUserName}
      >
        {(val, setValue) => (
          <RenderChecker className="validator-text-field">
            <TextInput<string | undefined>
              type="text"
              value={val}
              delay={DELAY}
              name="securityNumber"
              label="Security Number"
              placeholder="Security Number"
              onChange={value => {
                console.log('securityNumber: ', value, val);
                setValue(value);
              }}
            />
            <span>{val}</span>
          </RenderChecker>
        )}
      </GroupDataValidator.FormFieldValidator>

      <GroupDataValidator.FormFieldArray<Owner> fieldPath={['ownersData', 'owners']}>
        {(entries, addField, deleteField) => (
          <RenderChecker label="Array fields">
            {entries.map((item, i) => (
              <GroupDataValidator.FormFieldValidator<
                string | undefined,
                ReadonlyArray<string> | string
              >
                key={'owner' + i}
                fieldPath={['ownersData', 'owners', i, 'name']}
                validator={validateUserName}
              >
                {(val, setValue) => (
                  <RenderChecker className="validator-array-field">
                    <TextInput<string | undefined>
                      type="text"
                      value={val}
                      delay={DELAY}
                      name="owner"
                      label={`Owner (${i + 1})`}
                      placeholder="Owner"
                      onChange={value => {
                        console.log('owner: ', i, value, val);
                        setValue(value);
                      }}
                    />
                    <CustomButton
                      type="button"
                      className="ripple"
                      fontSize="11px"
                      onClick={() => {
                        deleteField(i);
                      }}
                    >
                      {`Delete "${item.name}"`}
                    </CustomButton>
                  </RenderChecker>
                )}
              </GroupDataValidator.FormFieldValidator>
            ))}
            <div>
              <CustomButton
                type="button"
                className="ripple"
                onClick={() => {
                  addField({
                    name: `John ${entries.length + 1}`,
                    documents: [
                      { id: '1212', file: 'qwerty-1' },
                      { id: '24234', file: 'qwerty-2' }
                    ]
                  });
                }}
              >
                Add field
              </CustomButton>
            </div>
          </RenderChecker>
        )}
      </GroupDataValidator.FormFieldArray>
    </RenderChecker>
  );
}
