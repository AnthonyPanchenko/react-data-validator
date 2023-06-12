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

export default function GroupValidator() {
  const renderCounter = useRef(0);

  renderCounter.current += 1;
  console.log('GroupValidator renderer counter', renderCounter.current);

  return (
    <GroupDataValidator.FormValidatorProvider
      initialData={INITIAL_STATE_GROUP_DATA}
      onSubmit={d => {
        console.log(d);
      }}
    >
      <GroupValidatorFields />
    </GroupDataValidator.FormValidatorProvider>
  );
}
