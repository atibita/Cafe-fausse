/**
 * pages/Home.jsx — Café Fausse Landing Page
 *
 * Sections (FR-1 through FR-4):
 *  1. Hero  — name, tagline, CTA buttons
 *  2. Info  — address, phone, hours
 *  3. Story — brief brand story
 *  4. Menu Preview — 3 signature dishes
 *  5. Awards
 *  6. Testimonials
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

/* ── Static data ─────────────────────────────────────────────── */
const MENU_HIGHLIGHTS = [
  {
    id: 1,
    category: 'Starter',
    name: 'Caesar Salad',
    desc: 'Crisp romaine with homemade Caesar dressing and house-baked croutons.',
    price: '$9.00',
    emoji: '../images/home-caesar-salad.png',
  },
  {
    id: 2,
    category: 'Main Course',
    name: 'Ribeye Steak',
    desc: '12 oz prime cut with roasted garlic mashed potatoes and seasonal vegetables.',
    price: '$28.00',
    emoji: '../images/gallery-ribeye-steak.webp',
  },
  {
    id: 3,
    category: 'Dessert',
    name: 'Tiramisu',
    desc: 'Classic Italian dessert crafted with premium mascarpone and espresso.',
    price: '$7.50',
    emoji: '../images/home-tiramisu.png',
  },
];

const AWARDS = [
  { year: '2022', title: 'Culinary Excellence Award' },
  { year: '2023', title: 'Restaurant of the Year' },
  { year: '2023', title: 'Best Fine Dining — Foodie Magazine' },
];

const TESTIMONIALS = [
  {
    id: 1,
    quote: 'Exceptional ambiance and unforgettable flavors. Every dish told a story.',
    source: 'Gourmet Review',
  },
  {
    id: 2,
    quote: 'A must-visit restaurant for food enthusiasts. The Ribeye Steak is extraordinary.',
    source: 'The Daily Bite',
  },
  {
    id: 3,
    quote: 'An evening at Café Fausse is an experience for all the senses.',
    source: 'DC Dining Weekly',
  },
];

export default function Home() {
  return (
    <div className="home fade-in">

      {/* ── 1. Hero ────────────────────────────────────────────── */}
      <section className="hero" aria-labelledby="hero-heading">
        {/* Decorative background texture */}
        <div className="hero__bg" aria-hidden="true" />
        <div className="hero__overlay" aria-hidden="true" />
        <img className="hero__bg hero__slide--visible" aria-hidden="true" src="../images/gallery-cafe-interior.webp" alt="Cafe Fausse Interior"/>
        <img className="hero__bg hero__slide" aria-hidden="true" src="../images/gallery-private-room.png" alt="Private room"/>

        <div className="hero__content container">
          <p className="hero__eyebrow">Washington, D.C. · Est. 2010</p>

          <h1 className="hero__heading" id="hero-heading">
            <em className="hero__heading-italic">Café</em>
            <span className="hero__heading-main">Fausse</span>
          </h1>

          <p className="hero__tagline">
            Where traditional Italian artistry meets<br className="hero__tagline-br" />
            modern culinary vision.
          </p>

          <div className="hero__actions">
            <Link to="/reservations" className="btn btn-primary hero__btn">
              Reserve a Table
            </Link>
            <Link to="/menu" className="btn btn-secondary hero__btn">
              Explore Our Menu
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero__scroll-hint" aria-hidden="true">
          <span className="hero__scroll-line" />
          <span className="hero__scroll-label">
            
          </span>
          
        </div>
      </section>

      {/* ── 2. Info bar (FR-2) ─────────────────────────────────── */}
      <section className="info-bar" aria-label="Restaurant information">
        <div className="container info-bar__grid">
          <div className="info-bar__item">
            <span className="info-bar__icon" aria-hidden="true">📍</span>
            <div>
              <p className="info-bar__label">Address</p>
              <address className="info-bar__value">
                1234 Culinary Ave, Suite 100<br />Washington, DC 20002
              </address>
            </div>
          </div>
          <div className="info-bar__divider" aria-hidden="true" />
          <div className="info-bar__item">
            <span className="info-bar__icon" aria-hidden="true">📞</span>
            <div>
              <p className="info-bar__label">Phone</p>
              <a href="tel:+12025554567" className="info-bar__value info-bar__link">
                (202) 555-4567
              </a>
            </div>
          </div>
          <div className="info-bar__divider" aria-hidden="true" />
          <div className="info-bar__item">
            <span className="info-bar__icon" aria-hidden="true">🕐</span>
            <div>
              <p className="info-bar__label">Hours</p>
              <p className="info-bar__value">
                Mon – Sat: 5:00 PM – 11:00 PM<br />
                Sunday: 5:00 PM – 9:00 PM
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Brand Story ─────────────────────────────────────── */}
      <section className="story section" aria-labelledby="story-heading">
        <div className="container story__inner">
          <div className="story__text">
            <p className="section-subtitle">Our Philosophy</p>
            <h2 className="section-title" id="story-heading">
              A Table Like No Other
            </h2>
            <div className="ornament"><div className="ornament-diamond" /></div>
            <p className="story__copy">
              Founded in 2010 by Chef Antonio Rossi and restaurateur Maria Lopez,
              Café Fausse has become Washington D.C.'s premier destination for
              refined Italian cuisine. Our kitchen bridges the time-honoured
              traditions of Italy with the creative energy of the modern culinary
              world — drawing on locally sourced ingredients to craft dishes that
              honour both heritage and innovation.
            </p>
            <Link to="/about" className="btn btn-ghost story__cta">
              Our Story
            </Link>
          </div>
          <div className="story__visual" aria-hidden="true">
            <div className="story__frame">
              <div className="story__frame-inner">
                <span className="story__frame-text">
                  "Culinary art is the only art<br />that nourishes both body<br />and soul."
                </span>
                <span className="story__frame-attr">— Chef Antonio Rossi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Menu Highlights ─────────────────────────────────── */}
      <section className="highlights section" aria-labelledby="highlights-heading">
        <div className="container">
          <p className="section-subtitle">Signature Dishes</p>
          <h2 className="section-title" id="highlights-heading">
            Crafted with Passion
          </h2>
          <div className="ornament"><div className="ornament-diamond" /></div>

          <div className="highlights__grid">
            {MENU_HIGHLIGHTS.map(({ id, category, name, desc, price, emoji }, i) => (
              <article
                key={id}
                className="highlight-card fade-in-up"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <div className="highlight-card__emoji" aria-hidden="true">
                  <img src={emoji} alt={desc}/>
                </div>
                <p className="highlight-card__category">{category}</p>
                <h3 className="highlight-card__name">{name}</h3>
                <p className="highlight-card__desc">{desc}</p>
                <p className="highlight-card__price">{price}</p>
              </article>
            ))}
          </div>

          <div className="highlights__cta">
            <Link to="/menu" className="btn btn-ghost">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Awards ──────────────────────────────────────────── */}
      <section className="awards-strip" aria-labelledby="awards-heading">
        <div className="container">
          <h2 className="sr-only" id="awards-heading">Awards &amp; Recognition</h2>
          <ul className="awards-strip__list">
            {AWARDS.map(({ year, title }) => (
              <li key={title} className="awards-strip__item">
                <span className="awards-strip__year">{year}</span>
                <span className="awards-strip__title">{title}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 6. Testimonials ────────────────────────────────────── */}
      <section className="testimonials section" aria-labelledby="testimonials-heading">
        <div className="container">
          <p className="section-subtitle">What Our Guests Say</p>
          <h2 className="section-title" id="testimonials-heading">
            Unforgettable Evenings
          </h2>
          <div className="ornament"><div className="ornament-diamond" /></div>

          <div className="testimonials__grid">
            {TESTIMONIALS.map(({ id, quote, source }) => (
              <blockquote key={id} className="testimonial-card">
                <span className="testimonial-card__mark" aria-hidden="true">"</span>
                <p className="testimonial-card__quote">{quote}</p>
                <footer className="testimonial-card__source">— {source}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Final CTA ───────────────────────────────────────── */}
      <section className="home-cta" aria-labelledby="home-cta-heading">
        <div className="container home-cta__inner">
          <p className="section-subtitle">Join Us</p>
          <h2 className="home-cta__heading" id="home-cta-heading">
            Reserve Your Table Tonight
          </h2>
          <p className="home-cta__sub">
            An evening at Café Fausse begins with a simple reservation.
          </p>
          <Link to="/reservations" className="btn btn-primary home-cta__btn">
            Make a Reservation
          </Link>
        </div>
      </section>
    </div>
  );
}
