import createFormValidator from '@/validator/hooks/createFormValidator';

type OwnersType = {
  id: number;
  firstName: string;
  lastName: string;
  pep: {
    isExposed: boolean;
  };
};

type CompanyDataType = {
  id: number;
  companyName: string;
  postCode: string;
  city: string;
  license: {
    number: number;
    isRegulation: boolean;
  };
  documents: Array<{ id: string; file: string }>;
};

export type GroupDataToValidate = {
  companyData: CompanyDataType;
  ownersData: {
    securityNumber: string;
    owners: Array<OwnersType>;
  };
};

export const INITIAL_STATE_GROUP_DATA: GroupDataToValidate = {
  companyData: {
    id: 45,
    companyName: 'Cyberpunk Ltd',
    postCode: '23-234',
    city: 'New york',
    license: {
      number: 739,
      isRegulation: true
    },
    documents: [{ id: '1212', file: 'ewer' }]
  },
  ownersData: {
    securityNumber: 'ML73900753799',
    owners: [
      {
        id: 23,
        firstName: 'John',
        lastName: 'Connors',
        pep: {
          isExposed: false
        }
      }
    ]
  }
};

const GroupDataValidator = createFormValidator<GroupDataToValidate>();

export default GroupDataValidator;
