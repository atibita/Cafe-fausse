/**
 * pages/Menu.jsx — Café Fausse Menu Page
 *
 * Displays the full menu segmented by category (FR-5):
 *  - Starters
 *  - Main Courses
 *  - Desserts
 *  - Beverages
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';

/* ── Menu data (FR-5) ─────────────────────────────────────────── */
const MENU_DATA = [
  {
    id: 'starters',
    category: 'Starters',
    icon: '🫒',
    items: [
      {
        name: 'Bruschetta',
        desc: 'Fresh tomatoes, basil, olive oil, and toasted baguette slices.',
        price: 8.50,
        dietary: ['V'],
      },
      {
        name: 'Caesar Salad',
        desc: 'Crisp romaine with homemade Caesar dressing and house-baked croutons.',
        price: 9.00,
        dietary: [],
      },
    ],
  },
  {
    id: 'mains',
    category: 'Main Courses',
    icon: '🍽️',
    items: [
      {
        name: 'Grilled Salmon',
        desc: 'Served with lemon butter sauce and seasonal vegetables.',
        price: 22.00,
        dietary: ['GF'],
      },
      {
        name: 'Ribeye Steak',
        desc: '12 oz prime cut with roasted garlic mashed potatoes.',
        price: 28.00,
        dietary: ['GF'],
      },
      {
        name: 'Vegetable Risotto',
        desc: 'Creamy Arborio rice with wild mushrooms and fresh herbs.',
        price: 18.00,
        dietary: ['V', 'GF'],
      },
    ],
  },
  {
    id: 'desserts',
    category: 'Desserts',
    icon: '🍮',
    items: [
      {
        name: 'Tiramisu',
        desc: 'Classic Italian dessert with premium mascarpone and espresso.',
        price: 7.50,
        dietary: ['V'],
      },
      {
        name: 'Cheesecake',
        desc: 'Creamy cheesecake with a fresh berry compote.',
        price: 7.00,
        dietary: ['V'],
      },
    ],
  },
  {
    id: 'beverages',
    category: 'Beverages',
    icon: '🍷',
    items: [
      {
        name: 'Red Wine (Glass)',
        desc: 'A curated selection of Italian reds.',
        price: 10.00,
        dietary: ['V', 'GF'],
      },
      {
        name: 'White Wine (Glass)',
        desc: 'Crisp, refreshing, and elegantly paired with any dish.',
        price: 9.00,
        dietary: ['V', 'GF'],
      },
      {
        name: 'Craft Beer',
        desc: 'Local artisan brews, rotated seasonally.',
        price: 6.00,
        dietary: [],
      },
      {
        name: 'Espresso',
        desc: 'Strong, aromatic, and prepared with imported Italian beans.',
        price: 3.00,
        dietary: ['V', 'GF'],
      },
    ],
  },
];

const DIETARY_LABELS = { V: 'Vegetarian', GF: 'Gluten Friendly' };

/* ── Component ────────────────────────────────────────────────── */
export default function Menu() {
  const [activeSection, setActiveSection] = useState('starters');

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(`menu-${id}`);
    if (el) {
      const offset = 120;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="menu-page fade-in">

      {/* Page header */}
      <header className="page-hero page-hero--menu">
        <div className="page-hero__overlay" aria-hidden="true" />
        <div className="container page-hero__content">
          <p className="section-subtitle">Crafted Daily</p>
          <h1 className="page-hero__title">Our Menu</h1>
          <div className="ornament"><div className="ornament-diamond" /></div>
          <p className="page-hero__desc">
            Seasonal ingredients. Timeless technique. Unforgettable results.
          </p>
        </div>
      </header>

      {/* Sticky category nav */}
      <nav className="menu-nav" aria-label="Menu categories">
        <div className="container menu-nav__inner">
          {MENU_DATA.map(({ id, category, icon }) => (
            <button
              key={id}
              className={`menu-nav__btn ${activeSection === id ? 'menu-nav__btn--active' : ''}`}
              onClick={() => scrollToSection(id)}
              aria-current={activeSection === id ? 'true' : undefined}
            >
              <span aria-hidden="true">{icon}</span>
              {category}
            </button>
          ))}
        </div>
      </nav>

      {/* Dietary legend */}
      <div className="menu-legend container">
        {Object.entries(DIETARY_LABELS).map(([code, label]) => (
          <span key={code} className="menu-legend__item">
            <span className="menu-legend__badge">{code}</span>
            {label}
          </span>
        ))}
      </div>

      {/* Menu sections */}
      <div className="menu-body container">
        {MENU_DATA.map(({ id, category, icon, items }) => (
          <section
            key={id}
            id={`menu-${id}`}
            className="menu-section"
            aria-labelledby={`menu-${id}-heading`}
          >
            <div className="menu-section__header">
              <span className="menu-section__icon" aria-hidden="true">{icon}</span>
              <h2 className="menu-section__title" id={`menu-${id}-heading`}>
                {category}
              </h2>
            </div>
            <hr className="gold-rule" />

            <div className="menu-items">
              {items.map((item) => (
                <div key={item.name} className="menu-item">
                  <div className="menu-item__info">
                    <div className="menu-item__name-row">
                      <h3 className="menu-item__name">{item.name}</h3>
                      {item.dietary.map((code) => (
                        <span
                          key={code}
                          className="menu-item__badge"
                          title={DIETARY_LABELS[code]}
                          aria-label={DIETARY_LABELS[code]}
                        >
                          {code}
                        </span>
                      ))}
                    </div>
                    <p className="menu-item__desc">{item.desc}</p>
                  </div>
                  <div className="menu-item__price" aria-label={`Price: $${item.price.toFixed(2)}`}>
                    ${item.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Reservation CTA */}
      <section className="menu-cta">
        <div className="container menu-cta__inner">
          <p className="section-subtitle">Ready to Dine?</p>
          <h2 className="menu-cta__heading">Reserve Your Table</h2>
          <p className="menu-cta__sub">
            Secure your spot and let us take care of the rest.
          </p>
          <Link to="/reservations" className="btn btn-primary">
            Make a Reservation
          </Link>
        </div>
      </section>
    </div>
  );
}
