/**
 * pages/Gallery.jsx — Café Fausse Gallery Page
 *
 * Implements FR-12 through FR-14:
 *  - Grid of restaurant images (interior, dishes, events)
 *  - Lightbox for enlarged image viewing (FR-13)
 *  - Awards and customer reviews section (FR-14)
 */

import React, { useState, useEffect, useCallback } from 'react';
import './Gallery.css';

/* ── Gallery items (FR-12) ───────────────────────────────────── */
/* Using rich emoji + colour panels as elegant placeholders.
   In production, replace `bg` and `emoji` with real <img> src paths. */
const GALLERY_ITEMS = [
  {
    id: 1,
    category: 'Interior',
    title: 'The Main Dining Room',
    desc: 'Restaurant with a luxury and classic style',
    bg: '#3D1A2A',
    emoji: '../images/gallery-cafe-interior.webp',
    size: 'medium',
  },
  {
    id: 2,
    category: 'Events',
    title: 'Private Dining',
    desc: 'Our private room accommodates up to 20 guests for bespoke events.',
    bg: '#1A2A3D',
    emoji: '../images/gallery-private-room.png',
    size: 'medium',
  },
  {
    id: 3,
    category: 'Cuisine',
    title: 'Grilled Salmon',
    desc: 'Pan-seared Atlantic salmon with lemon butter and micro herbs.',
    bg: '#2A3D30',
    emoji: '../images/gallery-Pan-seared-atlantic-salmon.png',
    size: 'medium',
  },
  {
    id: 4,
    category: 'Cuisine',
    title: 'Ribeye Steak',
    desc: '12 oz prime cut, rested and carved tableside on request.',
    bg: '#3D1A1A',
    emoji: '../images/gallery-ribeye-steak.webp',
    size: 'small',
  },
  {
    id: 5,
    category: 'Cuisine',
    title: 'Vegetable Risotto',
    desc: 'Creamy Arborio rice with wild mushrooms and truffle oil.',
    bg: '#3D3A1A',
    emoji: '../images/gallery-creamy-arborio-rice.png',
    size: 'small',
  },
  {
    id: 6,
    category: 'Cuisine',
    title: 'Tiramisu',
    desc: 'Our signature Italian dessert, dusted with Valrhona cocoa.',
    bg: '#3D2A1A',
    emoji: '../images/gallery-signature-Italian-dessert.png',
    size: 'medium',
  },
  {
    id: 7,
    category: 'Cuisine',
    title: 'The Bar',
    desc: 'Hand-crafted cocktails and a wine list curated by our sommelier.',
    bg: '#2A1A3D',
    emoji: '../images/gallery-hand-crafted-cocktail.png',
    size: 'medium',
  },
  {
    id: 8,
    category: 'Events',
    title: 'Chef\'s Table',
    desc: 'An intimate counter experience overlooking our open kitchen.',
    bg: '#1A3D2A',
    emoji: '../images/gallery-intimate-counter-experience.png',
    size: 'medium',
  },
  {
    id: 9,
    category: 'Interior',
    title: 'Garden Terrace',
    desc: 'Al fresco dining under string lights on warm Washington evenings.',
    bg: '#2A3D1A',
    emoji: '../images/gallery-alfresco-dining.png',
    size: 'medium',
  },
];

const CATEGORIES = ['All', 'Interior', 'Cuisine', 'Events'];

/* ── Awards & Reviews (FR-14) ────────────────────────────────── */
const AWARDS = [
  {
    id: 1,
    year: '2022',
    title: 'Culinary Excellence Award',
    org: 'Washington Restaurant Association',
    icon: '🏆',
  },
  {
    id: 2,
    year: '2023',
    title: 'Restaurant of the Year',
    org: 'D.C. Dining Authority',
    icon: '⭐',
  },
  {
    id: 3,
    year: '2023',
    title: 'Best Fine Dining Experience',
    org: 'Foodie Magazine',
    icon: '🥇',
  },
];

const REVIEWS = [
  {
    id: 1,
    quote: 'Exceptional ambiance and unforgettable flavors.',
    source: 'Gourmet Review',
    stars: 5,
  },
  {
    id: 2,
    quote: 'A must-visit restaurant for food enthusiasts.',
    source: 'The Daily Bite',
    stars: 5,
  },
  {
    id: 3,
    quote: 'The tasting menu is an extraordinary journey through Italian cuisine.',
    source: 'Capitol Eats',
    stars: 5,
  },
  {
    id: 4,
    quote: 'Service was impeccable from the moment we walked in. We will return.',
    source: 'OpenTable Guest',
    stars: 5,
  },
];

/* ── Star renderer ───────────────────────────────────────────── */
function Stars({ count }) {
  return (
    <span className="review-stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} aria-hidden="true">★</span>
      ))}
    </span>
  );
}

/* ── Lightbox ────────────────────────────────────────────────── */
function Lightbox({ item, onClose, onPrev, onNext }) {
  /* Close on Escape, navigate with arrow keys */
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft')  onPrev();
    if (e.key === 'ArrowRight') onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  if (!item) return null;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Lightbox: ${item.title}`}
      onClick={onClose}
    >
      <button
        className="lightbox__close"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        ✕
      </button>
      <button
        className="lightbox__nav lightbox__nav--prev"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous image"
      >
        ‹
      </button>
      <div
        className="lightbox__card"
        onClick={(e) => e.stopPropagation()}
        style={{ background: item.bg }}
      >
        <div className="lightbox__visual">
          <span className="lightbox__emoji" aria-hidden="true">
            <img src={item.emoji} alt={item.desc}/>
          </span>
        </div>
        <div className="lightbox__info">
          <p className="lightbox__category">{item.category}</p>
          <h2 className="lightbox__title">{item.title}</h2>
          <p className="lightbox__desc">{item.desc}</p>
        </div>
      </div>
      <button
        className="lightbox__nav lightbox__nav--next"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Next image"
      >
        ›
      </button>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────── */
export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex,  setLightboxIndex]  = useState(null);

  const filtered = activeCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(i => i.category === activeCategory);

  const openLightbox  = (idx) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage     = () => setLightboxIndex(i => (i - 1 + filtered.length) % filtered.length);
  const nextImage     = () => setLightboxIndex(i => (i + 1) % filtered.length);

  return (
    <div className="gallery-page fade-in">

      {/* Page header */}
      <header className="page-hero page-hero--gallery">
        <div className="page-hero__overlay" aria-hidden="true" />
        <div className="container page-hero__content">
          <p className="section-subtitle">A Feast for the Eyes</p>
          <h1 className="page-hero__title">Gallery</h1>
          <div className="ornament"><div className="ornament-diamond" /></div>
          <p className="page-hero__desc">
            Step inside Café Fausse — before the first bite.
          </p>
        </div>
      </header>

      {/* ── Category filter ──────────────────────────────────── */}
      <div className="gallery-filter" role="tablist" aria-label="Filter gallery by category">
        <div className="container gallery-filter__inner">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              className={`gallery-filter__btn ${activeCategory === cat ? 'gallery-filter__btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Image grid (FR-12) ───────────────────────────────── */}
      <section className="gallery-grid-section" aria-label="Photo gallery">
        <div className="container">
          <div className="gallery-grid" role="list">
            {filtered.map((item, idx) => (
              <button
                key={item.id}
                className={`gallery-item gallery-item--${item.size}`}
                style={{ background: item.bg }}
                onClick={() => openLightbox(idx)}
                aria-label={`View ${item.title} — ${item.category}`}
                role="listitem"
              >
                <span className="gallery-item__emoji" aria-hidden="true">
                  <img src={item.emoji} alt={item.desc}/>
                </span>
                
                <div className="gallery-item__overlay">
                  <p className="gallery-item__cat">{item.category}</p>
                  <h3 className="gallery-item__title">{item.title}</h3>
                  <span className="gallery-item__cta">View ↗</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Awards (FR-14) ───────────────────────────────────── */}
      <section className="gallery-awards section" aria-labelledby="awards-heading">
        <div className="container">
          <p className="section-subtitle">Recognition</p>
          <h2 className="section-title" id="awards-heading">Awards & Honours</h2>
          <div className="ornament"><div className="ornament-diamond" /></div>

          <div className="awards-grid">
            {AWARDS.map(({ id, year, title, org, icon }) => (
              <div key={id} className="award-card">
                <span className="award-card__icon" aria-hidden="true">{icon}</span>
                <span className="award-card__year">{year}</span>
                <h3 className="award-card__title">{title}</h3>
                <p className="award-card__org">{org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews (FR-14) ──────────────────────────────────── */}
      <section className="gallery-reviews section" aria-labelledby="reviews-heading">
        <div className="container">
          <p className="section-subtitle">Guest Voices</p>
          <h2 className="section-title" id="reviews-heading">What Our Guests Say</h2>
          <div className="ornament"><div className="ornament-diamond" /></div>

          <div className="reviews-grid">
            {REVIEWS.map(({ id, quote, source, stars }) => (
              <blockquote key={id} className="review-card">
                <Stars count={stars} />
                <p className="review-card__quote">"{quote}"</p>
                <footer className="review-card__source">— {source}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lightbox (FR-13) ─────────────────────────────────── */}
      {lightboxIndex !== null && (
        <Lightbox
          item={filtered[lightboxIndex]}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </div>
  );
}
