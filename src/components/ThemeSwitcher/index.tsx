import { ChangeEvent, useLayoutEffect, useState } from 'react';

import styles from './ThemeSwitcher.module.scss';

const THEME_MODE_KEY = 'theme-mode';

const THEME_MODE = {
  light: 'light',
  auto: 'auto',
  dark: 'dark'
};

export default function ThemeSwitcher() {
  const [currentThemeMode, setCurrentThemeMode] = useState(THEME_MODE.auto);

  useLayoutEffect(() => {
    const activeThemeMode = localStorage.getItem(THEME_MODE_KEY);
    if (activeThemeMode && currentThemeMode !== activeThemeMode) {
      setCurrentThemeMode(activeThemeMode);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeThemeMode = (event: ChangeEvent<HTMLInputElement>) => {
    const mode = event.target.value;
    setCurrentThemeMode(mode);
    onChangeThemeMode(mode as keyof typeof THEME_MODE);
  };

  return (
    <fieldset className={styles.switcher}>
      <legend className={`switcher__legend switcher__legend--${currentThemeMode}`}>
        Theme schema
      </legend>
      <input
        className="switcher__radio switcher__radio--light"
        type="radio"
        name="color-scheme"
        value={THEME_MODE.light}
        aria-label="Light"
        checked={currentThemeMode === THEME_MODE.light}
        onChange={handleChangeThemeMode}
      />
      <input
        className="switcher__radio switcher__radio--auto"
        type="radio"
        name="color-scheme"
        value={THEME_MODE.auto}
        aria-label="System"
        checked={currentThemeMode === THEME_MODE.auto}
        onChange={handleChangeThemeMode}
      />
      <input
        className="switcher__radio switcher__radio--dark"
        type="radio"
        name="color-scheme"
        value={THEME_MODE.dark}
        aria-label="Dark"
        checked={currentThemeMode === THEME_MODE.dark}
        onChange={handleChangeThemeMode}
      />
    </fieldset>
  );
}

function onChangeThemeMode(mode: keyof typeof THEME_MODE) {
  const darkThemeStyles = document.head.querySelector<HTMLLinkElement>(
    'link[rel=stylesheet][href*=dark-theme]'
  );
  const lightThemeStyles = document.head.querySelector<HTMLLinkElement>(
    'link[rel=stylesheet][href*=light-theme]'
  );

  if (lightThemeStyles && darkThemeStyles) {
    if (mode === THEME_MODE.auto) {
      localStorage.removeItem(THEME_MODE_KEY);
      lightThemeStyles.media = '(prefers-color-scheme: light)';
      darkThemeStyles.media = '(prefers-color-scheme: dark)';
    } else {
      localStorage.setItem(THEME_MODE_KEY, mode);
      lightThemeStyles.media = mode === THEME_MODE.light ? 'all' : 'not all';
      darkThemeStyles.media = mode === THEME_MODE.dark ? 'all' : 'not all';
    }
  }
}
