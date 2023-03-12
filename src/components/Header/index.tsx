import { NavLink } from 'react-router-dom';

import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.navigation}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/wizard">Wizard</NavLink>
        <NavLink to="/context">Fast context</NavLink>
      </nav>
    </header>
  );
}
