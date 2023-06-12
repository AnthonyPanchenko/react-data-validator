import createFormValidator from '@/validator/hooks/createFormValidator';

export type Owner = {
  name: string;
  documents: Array<{ id: string; file: string }>;
};

export type GroupDataToValidate = {
  companyName: string;
  postCode: string;
  city: string;
  license: {
    number: number;
    isRegulation: boolean;
  };
  ownersData: {
    securityNumber: string;
    owners: Array<Owner>;
  };
};

export const INITIAL_STATE_GROUP_DATA: GroupDataToValidate = {
  companyName: 'Cyberpunk Ltd',
  postCode: '23-234',
  city: 'New york',
  license: {
    number: 73998876,
    isRegulation: true
  },
  ownersData: {
    securityNumber: 'ML73900753799',
    owners: [
      {
        name: 'John',
        documents: [
          { id: '1212', file: 'qwerty-1' },
          { id: '24234', file: 'qwerty-2' }
        ]
      }
    ]
  }
};

const GroupDataValidator = createFormValidator<GroupDataToValidate>();

export default GroupDataValidator;
