import React from 'react';

import styles from './ValidationFieldError.module.scss';

type PropsTypes = {
  errors: ReadonlyArray<string> | string | undefined;
  children?: React.ReactNode | React.ReactNode[] | null;
};

export default function ValidationFieldError({ errors }: PropsTypes) {
  return errors?.length ? (
    <div className={styles.validationErrorField}>
      {typeof errors === 'string' && errors}
      {Array.isArray(errors) && errors.map((error, i) => <p key={i}>{error}</p>)}
    </div>
  ) : null;
}
