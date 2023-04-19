import { useState } from 'react';

import CustomButton from '@/components/CustomButton';

import styles from './Footer.module.css';

type PropsTypes = {
  msg?: string;
};

export default function Footer({ msg }: PropsTypes) {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prevCount => prevCount + 1);

  return (
    <footer className={styles.footer}>
      <CustomButton type="button" className="ripple" onClick={increment}>
        count is: {count}
      </CustomButton>
    </footer>
  );
}
