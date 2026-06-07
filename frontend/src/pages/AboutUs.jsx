/**
 * pages/AboutUs.jsx — Café Fausse About Us Page
 *
 * Implements FR-10 and FR-11:
 *  - Restaurant history and founding story
 *  - Founder biographies (Chef Antonio Rossi & Maria Lopez)
 *  - Mission statement and values
 *  - Commitment to locally sourced ingredients
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

/* ── Static content (FR-10, FR-11) ──────────────────────────── */
const FOUNDERS = [
  {
    id: 1,
    name: 'Chef Antonio Rossi',
    role: 'Co-Founder & Executive Chef',
    initials: 'AR',
    bio: `Born in Naples to a family of restaurateurs, Antonio Rossi trained
          under Michelin-starred chefs across Rome, Florence, and Paris before
          bringing his craft to Washington, D.C. His philosophy is simple: every
          plate should tell a story rooted in tradition, elevated by curiosity.
          At Café Fausse, he curates seasonal menus that honour Italy's culinary
          canon while embracing the finest local produce the Mid-Atlantic has to
          offer.`,
    quote: 'Great cooking is an act of love — for the ingredients, the guest, and the craft.',
  },
  {
    id: 2,
    name: 'Maria Lopez',
    role: 'Co-Founder & Managing Director',
    initials: 'ML',
    bio: `Maria Lopez brings over two decades of hospitality leadership to Café
          Fausse. After managing celebrated dining rooms in New York and London,
          she returned to Washington with a vision: a space where impeccable
          service feels genuinely warm rather than formal. Maria oversees every
          aspect of the guest experience, from the curated wine programme to the
          handpicked team of sommeliers and servers who make each visit feel
          personal.`,
    quote: 'Hospitality is the art of making every guest feel like the only guest.',
  },
];

const VALUES = [
  {
    icon: '🌿',
    title: 'Locally Sourced',
    desc: 'We partner with family farms and regional purveyors within 150 miles of Washington to ensure peak freshness on every plate.',
  },
  {
    icon: '🍋',
    title: 'Seasonal Menus',
    desc: 'Our menu evolves with the seasons. What grows together, goes together — and tastes better for it.',
  },
  {
    icon: '🤝',
    title: 'Community First',
    desc: 'We believe restaurants are the beating heart of neighbourhoods. We source locally, hire locally, and give back locally.',
  },
  {
    icon: '✨',
    title: 'Uncompromising Quality',
    desc: 'From the olive oil we import from Puglia to the espresso beans roasted two blocks away, every detail is deliberate.',
  },
];

const MILESTONES = [
  { year: '2010', event: 'Café Fausse opens its doors on Culinary Ave, Washington, D.C.' },
  { year: '2013', event: 'Awarded Best New Restaurant by the Washington Dining Guide.' },
  { year: '2016', event: 'Chef Antonio introduces the first fully seasonal tasting menu.' },
  { year: '2019', event: 'Expansion to a second dining room, doubling capacity to 60 covers.' },
  { year: '2022', event: 'Culinary Excellence Award — recognising sustained creative leadership.' },
  { year: '2023', event: 'Named Restaurant of the Year and Best Fine Dining by Foodie Magazine.' },
];

/* ── Component ────────────────────────────────────────────────── */
export default function AboutUs() {
  return (
    <div className="about-page fade-in">

      {/* Page header */}
      <header className="page-hero page-hero--about">
        <div className="page-hero__overlay" aria-hidden="true" />
        <div className="container page-hero__content">
          <p className="section-subtitle">Est. 2010 · Washington, D.C.</p>
          <h1 className="page-hero__title">About Us</h1>
          <div className="ornament"><div className="ornament-diamond" /></div>
          <p className="page-hero__desc">
            The story of a kitchen, a vision, and a table worth gathering around.
          </p>
        </div>
      </header>

      {/* ── Our Story (FR-10) ────────────────────────────────── */}
      <section className="about-story section" aria-labelledby="about-story-heading">
        <div className="container about-story__inner">
          <div className="about-story__text">
            <p className="section-subtitle">Our Story</p>
            <h2 className="section-title" id="about-story-heading">
              About Café Fausse
            </h2>
            <div className="ornament"><div className="ornament-diamond" /></div>
            <p>
              Founded in 2010 by Chef Antonio Rossi and restaurateur Maria Lopez,
              Café Fausse blends traditional Italian flavors with modern culinary
              innovation. Our mission is to provide an unforgettable dining experience
              that reflects both quality and creativity.
            </p>
            <p>
              What began as a modest 30-seat dining room on Culinary Avenue has grown
              into one of Washington D.C.'s most celebrated fine-dining destinations —
              without ever losing the intimate, personal spirit that defined opening
              night. We remain a family-run establishment in every sense: our team,
              many of whom have been with us since the beginning, treat every guest
              like a welcomed friend.
            </p>
            <p>
              Our commitment to locally sourced, seasonal ingredients is not a
              marketing promise — it is the foundation of everything we cook. Each
              morning, Chef Rossi reviews what has arrived from our network of
              regional farms and producers before a single menu is printed for the
              evening. The result is food that is alive, honest, and deeply connected
              to this place and this moment in time.
            </p>
          </div>
          <div className="about-story__timeline" aria-label="Restaurant milestones">
            <h3 className="about-story__timeline-title">Our Journey</h3>
            <ol className="timeline">
              {MILESTONES.map(({ year, event }) => (
                <li key={year} className="timeline__item">
                  <span className="timeline__year">{year}</span>
                  <div className="timeline__dot" aria-hidden="true" />
                  <p className="timeline__event">{event}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Founders (FR-11) ─────────────────────────────────── */}
      <section className="founders section" aria-labelledby="founders-heading">
        <div className="container">
          <p className="section-subtitle">The People Behind the Table</p>
          <h2 className="section-title" id="founders-heading">Meet the Founders</h2>
          <div className="ornament"><div className="ornament-diamond" /></div>

          <div className="founders__grid">
            {FOUNDERS.map(({ id, name, role, initials, bio, quote }) => (
              <article key={id} className="founder-card">
                {/* Avatar placeholder — elegant monogram */}
                <div className="founder-card__avatar" aria-hidden="true">
                  <span className="founder-card__initials">{initials}</span>
                </div>
                <div className="founder-card__body">
                  <h3 className="founder-card__name">{name}</h3>
                  <p className="founder-card__role">{role}</p>
                  <hr className="gold-rule" style={{ margin: '1rem 0' }} />
                  <p className="founder-card__bio">{bio}</p>
                  <blockquote className="founder-card__quote">
                    <span aria-hidden="true">"</span>{quote}<span aria-hidden="true">"</span>
                  </blockquote>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────── */}
      <section className="values section" aria-labelledby="values-heading">
        <div className="container">
          <p className="section-subtitle">What We Stand For</p>
          <h2 className="section-title" id="values-heading">Our Commitments</h2>
          <div className="ornament"><div className="ornament-diamond" /></div>

          <div className="values__grid">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="value-card">
                <span className="value-card__icon" aria-hidden="true">{icon}</span>
                <h3 className="value-card__title">{title}</h3>
                <p className="value-card__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="about-cta">
        <div className="container about-cta__inner">
          <p className="section-subtitle">Come and See Us</p>
          <h2 className="about-cta__heading">Experience It for Yourself</h2>
          <p className="about-cta__sub">
            The best way to understand Café Fausse is to sit down at one of our tables.
          </p>
          <div className="about-cta__actions">
            <Link to="/reservations" className="btn btn-primary">Reserve a Table</Link>
            <Link to="/menu" className="btn btn-secondary">View Our Menu</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
