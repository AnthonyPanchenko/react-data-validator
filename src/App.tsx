import './reset.scss';

import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// import logoSrc from '@/assets/logo.png';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
// import Logo from '@/components/Logo';
import FastContext from '@/pages/FastContext';
import GroupValidator from '@/pages/GroupValidator';
import IndependentValidator from '@/pages/IndependentValidator';
import MainPage from '@/pages/MainPage';
import MediaQuery from '@/pages/MediaQuery';
import WizardPage from '@/pages/WizardPage';

import styles from './App.module.css';

export default function App() {
  return (
    <BrowserRouter>
      {/* <img alt="React logo" width="400px" src={logoSrc} /> */}
      {/* <Logo /> */}
      <main className={styles.main}>
        <Header />
        <section className={styles.section}>
          <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
            <Routes>
              <Route element={<MainPage />} path="/" />
              <Route element={<WizardPage />} path="/wizard" />
              <Route element={<FastContext />} path="/context" />
              <Route element={<IndependentValidator />} path="/independent-validator" />
              <Route element={<GroupValidator />} path="/group-validator" />
              <Route element={<MediaQuery />} path="/media-query" />
            </Routes>
          </Suspense>
        </section>
        <Footer />
      </main>
    </BrowserRouter>
  );
}
