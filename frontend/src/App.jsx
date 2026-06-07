/**
 * App.jsx — Root component.
 * Defines client-side routing and wraps all pages with the shared
 * Navbar and Footer layout shell.
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home         from './pages/Home';
import Menu         from './pages/Menu';
import Reservations from './pages/Reservations';
import AboutUs      from './pages/AboutUs';
import Gallery      from './pages/Gallery';

/* Scroll to top on route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="page-wrapper">
        <Navbar />
        <main>
          <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="/menu"         element={<Menu />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/about"        element={<AboutUs />} />
            <Route path="/gallery"      element={<Gallery />} />
            {/* Catch-all: redirect to home */}
            <Route path="*"             element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
