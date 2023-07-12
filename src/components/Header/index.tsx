import { NavLink } from 'react-router-dom';

import ThemeSwitcher from '@/components/ThemeSwitcher';

import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.navigation}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/wizard">Wizard</NavLink>
        <NavLink to="/context">Fast context</NavLink>
        <NavLink to="/form-validator">Form Validator</NavLink>
        <NavLink to="/media-query">Media query</NavLink>
        <NavLink to="/sortable-hoc">DnD Sortable HOC</NavLink>
      </nav>
      <ThemeSwitcher />
    </header>
  );
}
