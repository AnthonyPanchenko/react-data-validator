import { useState } from 'react';

import styles from './Footer.module.css';

type PropsTypes = {
  msg?: string;
};

export default function Footer({ msg }: PropsTypes) {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prevCount => prevCount + 1);

  return (
    <footer className={styles.footer}>
      <button type="button" onClick={increment}>
        count is: {count}
      </button>
    </footer>
  );
}
