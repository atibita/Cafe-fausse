/**
 * components/Navbar.jsx — Site-wide navigation bar.
 *
 * Features:
 *  - Sticky positioning with scroll-triggered shadow (NFR-3)
 *  - Active link highlighting via React Router's NavLink
 *  - Responsive hamburger menu for mobile (NFR-8)
 *  - Keyboard-accessible (FR-4)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/',             label: 'Home' },
  { to: '/menu',         label: 'Menu' },
  { to: '/reservations', label: 'Reservations' },
  { to: '/about',        label: 'About Us' },
  { to: '/gallery',      label: 'Gallery' },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  /* Shadow the navbar once the user scrolls past 40px */
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /* Close mobile menu on resize to desktop */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* Prevent body scroll while mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="banner">
      <div className="navbar__inner container">

        {/* Logo / Brand */}
        <Link to="/" className="navbar__brand" aria-label="Café Fausse — home">
          <span className="navbar__brand-accent">Café</span>
          <span className="navbar__brand-name">Fausse</span>
        </Link>

        {/* Desktop navigation links */}
        <nav className="navbar__nav" aria-label="Primary navigation">
          <ul className="navbar__links">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Reservation CTA (desktop) */}
        <Link
          to="/reservations"
          className="btn btn-primary navbar__cta"
          aria-label="Make a reservation"
        >
          Reserve a Table
        </Link>

        {/* Hamburger toggle (mobile) */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation">
          <ul className="navbar__mobile-links">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link
                to="/reservations"
                className="btn btn-primary navbar__mobile-cta"
                onClick={() => setMenuOpen(false)}
              >
                Reserve a Table
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay behind mobile menu */}
      {menuOpen && (
        <div
          className="navbar__overlay"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
