const dataToValidate = {
  companyData: {
    id: 2,
    license: {
      issuingAuthority: 'gravida. Praesent eu',
      validityDate: '2019-08-18T16:35:00.1478815Z',
      holderName: 'Astra Dudley',
      validityName: '2020-03-07 01:55:23',
      isSubjectOfRegulation: true,
      files: []
    },
    industry: {
      id: 6,
      value: 'Gastronomy, touristic & leisure industry'
    },
    homepage: 'http://www.myTestHomepage.com',
    isRegulatedBusinessPurpose: true,
    regulationType: {
      id: 9,
      value: 'Trading / Brokerage'
    },
    documents: [],
    companyName: 'Orci Luctus Et Ltd',
    country: {
      id: 1,
      value: 'DE'
    },
    entityType: {
      id: 145,
      value: 'Andere europ?ische Rechtsform'
    },
    street1: 'P.O. Box 140, 8692 Magna Road',
    street2: null,
    postCode: '3363',
    city: 'Notre-Dame-de-la-Salette',
    number: '73900753799',
    issuingAuthority: 'Quisque libero lacus,',
    status: 'Pending'
  },
  ownersData: {
    isStockMarketCompany: true,
    market: {
      id: 12,
      value: 'Osaka Securities Exchange'
    },
    internationalSecurityNumber: '73900753799',
    owners: {
      ids: [60],
      entities: {
        60: {
          ultimateBeneficialOwner: 'Mira X. Schneider',
          street1: '9732 Nunc, Avenue',
          street2: null,
          postCode: '32786',
          city: 'Scarborough',
          country: {
            id: 63,
            value: 'EE'
          },
          birthDate: '1973-02-18T00:00:00',
          structure: [],
          id: 60,
          type: 'Beneficial',
          firstName: 'Brandon',
          lastName: 'Castaneda',
          pep: {
            isExposed: false,
            position: null,
            relationship: null
          }
        }
      }
    }
  },
  representatives: {
    ids: [90],
    entities: {
      90: {
        id: 90,
        salutation: {
          id: 'Company',
          value: 'Company'
        },
        legalFunction: null,
        representationType: null,
        email: null,
        countryPhoneCode: null,
        phoneNumber: null,
        firstName: null,
        lastName: null,
        proofOfAuthorizationDocument: null,
        companyName: 'Elit Aliquam Institute',
        country: {
          id: 179,
          value: 'PT'
        },
        entityType: {
          id: 306,
          value: 'sociedade em commandita'
        },
        street1: '3140 Non Road',
        street2: '3377 Volutpat Road',
        postCode: '4622',
        city: 'Glastonbury',
        number: '19759384399',
        issuingAuthority: 'vel pede blandit',
        status: null
      }
    }
  }
};

function getValidationRules(currentData, initialData, fieldName, data) {
  return {
    data: {
      dd: 3,
      ...data
    },
    validate: value => Boolean(value && value !== ''),
    message: 'This field is required!'
  };
}

function validatePhoneNumber(currentData, initialData, fieldName) {
  return {
    data: 'werwer',
    validate: value => Boolean(value && value !== ''),
    message: 'This field is required!'
  };
}

function getRepresentativesEntytiesFunc(currentData, initialData, fieldName) {
  return {
    data: currentData.ids.map(id => currentData.entities[id]),
    schema: {
      legalFunction: getValidationRules,
      email: getValidationRules,
      countryPhoneCode: getValidationRules,
      phoneNumber: validatePhoneNumber,
      firstName: getValidationRules,
      lastName: getValidationRules,
      companyName: getValidationRules,
      country: getValidationRules,
      entityType: getValidationRules,
      street1: getValidationRules,
      postCode: getValidationRules,
      city: getValidationRules,
      number: getValidationRules,
      representationType: getValidationRules,
      proofOfAuthorizationDocument: getValidationRules,
      issuingAuthority: getValidationRules
    }
  };
}

function getOwnersEntytiesFunc(currentData, initialData, fieldName) {
  return {
    data: currentData.ids.map(id => currentData.entities[id]),
    schema: {
      ultimateBeneficialOwner: getValidationRules,
      street1: getValidationRules,
      postCode: getValidationRules,
      city: getValidationRules,
      country: getValidationRules,
      birthDate: getValidationRules,
      firstName: getValidationRules,
      lastName: getValidationRules,
      pep: {
        position: getValidationRules,
        relationship: getValidationRules
      }
    }
  };
}

const schemaToValidate = {
  companyData: {
    license: {
      issuingAuthority: getValidationRules,
      validityDate: getValidationRules,
      holderName: getValidationRules,
      validityName: getValidationRules,
      files: getValidationRules
    },
    industry: getValidationRules,
    homepage: getValidationRules,
    regulationType: getValidationRules,
    documents: getValidationRules,
    companyName: getValidationRules,
    country: getValidationRules,
    entityType: getValidationRules,
    street1: getValidationRules,
    postCode: getValidationRules,
    city: getValidationRules,
    number: getValidationRules,
    issuingAuthority: getValidationRules,
    status: getValidationRules
  },
  ownersData: {
    market: getValidationRules,
    internationalSecurityNumber: getValidationRules,
    owners: getOwnersEntytiesFunc
  },
  representatives: getRepresentativesEntytiesFunc
};

class DataModelValidator {
  constructor(initialData, initialSchema, additionalData) {
    this.initialData = initialData;
    this.initialSchema = initialSchema;
    this.additionalData = additionalData || {};
    this.result = [];
  }

  validateSingle(singleRule, currentData, fieldName) {
    const isValidCurrent = singleRule.validate(
      currentData,
      this.initialData,
      fieldName,
      this.additionalData
    );

    if (!isValidCurrent) {
      return {
        fieldName,
        data: this.additionalData,
        message: singleRule.message
      };
    }

    return null;
  }

  validateArray(arrayRules, currentData, fieldName) {
    let j = 0;
    let currentValidatedObj = null;

    for (; j < arrayRules.length; j++) {
      const rule = arrayRules[j];
      const validationResult = this.validateSingle(arrayRules[j], currentData, fieldName);

      if (validationResult) {
        currentValidatedObj = validationResult;

        break;
      }
    }

    return currentValidatedObj;
  }

  validateArrayEntities(dataArray, singleItemSchema, fieldName) {
    for (let i = 0; i < dataArray.length; i++) {
      this.validateObjectEntities(dataArray[i], singleItemSchema, fieldName);
    }
  }

  validateObjectEntities(dataObj, schemaObj, fieldName, resultCallback) {
    if (!!dataObj && !!schemaObj && typeof dataObj === 'object' && typeof schemaObj === 'object') {
      for (let field in dataObj) {
        if (!!schemaObj[field] && typeof schemaObj[field] === 'function') {
          const nextObj = schemaObj[field](dataObj[field], this.initialData, field);

          if (!!nextObj && typeof nextObj === 'object') {
            if (
              nextObj.hasOwnProperty('data') &&
              nextObj.hasOwnProperty('schema') &&
              !!nextObj.data &&
              !!nextObj.schema
            ) {
              if (Array.isArray(nextObj.data)) {
                this.validateArrayEntities(nextObj.data, nextObj.schema, fieldName);
              } else {
                this.validateObjectEntities(nextObj.data, nextObj.schema, fieldName);
              }
            } else {
              const resultObj = Array.isArray(nextObj)
                ? this.validateArray(nextObj, dataObj[field], field)
                : this.validateSingle(nextObj, dataObj[field], field);
              if (resultObj) {
                this.result.push(resultObj);
              }
            }
          }
        } else if (!!schemaObj[field] && typeof schemaObj[field] === 'object') {
          this.validateObjectEntities(dataObj[field], schemaObj[field], field);
        }
      } // END for
    }

    if (typeof resultCallback === 'function' && !fieldName) {
      resultCallback(this.result);
    }
  }

  validate(resultCallback) {
    this.result = [];
    this.validateObjectEntities(this.initialData, this.initialSchema, null, resultCallback);
  }
}

const dataModelValidator = new DataModelValidator(dataToValidate, schemaToValidate, 'sdgsdgdfgfg');

dataModelValidator.validate(res => {
  console.log(res);
});
