/**
 * components/Footer.jsx — Site-wide footer.
 *
 * Contains:
 *  - Restaurant info (address, phone, hours)
 *  - Navigation links
 *  - Newsletter signup form (FR-15, FR-16)
 *  - Awards list
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../utils/api';
import './Footer.css';

const NAV_LINKS = [
  { to: '/',             label: 'Home' },
  { to: '/menu',         label: 'Menu' },
  { to: '/reservations', label: 'Reservations' },
  { to: '/about',        label: 'About Us' },
  { to: '/gallery',      label: 'Gallery' },
];

export default function Footer() {
  /* ── Newsletter form state ─────────────────────────────────── */
  const [email,   setEmail]   = useState('');
  const [status,  setStatus]  = useState(null); // null | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation (FR-15)
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const { data } = await api.post('/api/newsletter', { email: email.trim() });
      setStatus('success');
      setMessage(data.message);
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(getErrorMessage(err));
    }
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__top container">

        {/* Brand column */}
        <div className="footer__col footer__col--brand">
          <Link to="/" className="footer__brand" aria-label="Café Fausse home">
            <span className="footer__brand-italic">Café</span>
            <span className="footer__brand-name">Fausse</span>
          </Link>
          <p className="footer__tagline">
            Traditional Italian flavors meet<br />
            modern culinary innovation.
          </p>
          <div className="footer__awards">
            <span className="footer__award-item">✦ Culinary Excellence Award 2022</span>
            <span className="footer__award-item">✦ Restaurant of the Year 2023</span>
            <span className="footer__award-item">✦ Best Fine Dining — Foodie Magazine 2023</span>
          </div>
        </div>

        {/* Info column */}
        <div className="footer__col">
          <h3 className="footer__col-title">Visit Us</h3>
          <address className="footer__address">
            <p>1234 Culinary Ave, Suite 100</p>
            <p>Washington, DC 20002</p>
            <a href="tel:+12025554567" className="footer__phone">(202) 555-4567</a>
          </address>
          <div className="footer__hours">
            <p><strong>Mon – Sat:</strong> 5:00 PM – 11:00 PM</p>
            <p><strong>Sunday:</strong> 5:00 PM – 9:00 PM</p>
          </div>
        </div>

        {/* Navigation column */}
        <div className="footer__col">
          <h3 className="footer__col-title">Explore</h3>
          <ul className="footer__nav-links">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="footer__nav-link">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter column */}
        <div className="footer__col footer__col--newsletter">
          <h3 className="footer__col-title">Stay in Touch</h3>
          <p className="footer__newsletter-desc">
            Subscribe for seasonal menus, exclusive events, and offers.
          </p>

          <form
            className="footer__newsletter-form"
            onSubmit={handleNewsletterSubmit}
            noValidate
            aria-label="Newsletter signup"
          >
            <div className="footer__newsletter-input-row">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus(null);
                }}
                placeholder="Your email address"
                className={`footer__newsletter-input ${status === 'error' ? 'error' : ''}`}
                aria-label="Email address for newsletter"
                disabled={status === 'loading' || status === 'success'}
                autoComplete="email"
              />
              <button
                type="submit"
                className="btn btn-primary footer__newsletter-btn"
                disabled={status === 'loading' || status === 'success'}
                aria-label="Subscribe to newsletter"
              >
                {status === 'loading' ? <span className="spinner" /> : 'Subscribe'}
              </button>
            </div>

            {/* Feedback */}
            {status === 'success' && (
              <p className="footer__newsletter-msg footer__newsletter-msg--success" role="status">
                {message}
              </p>
            )}
            {status === 'error' && (
              <p className="footer__newsletter-msg footer__newsletter-msg--error" role="alert">
                {message}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>
            © {new Date().getFullYear()} Café Fausse. All rights reserved.
          </p>
          <p className="footer__bottom-credits">
            Founded by Chef Antonio Rossi &amp; Maria Lopez · Washington, DC
          </p>
        </div>
      </div>
    </footer>
  );
}
