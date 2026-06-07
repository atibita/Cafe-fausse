/**
 * pages/Reservations.jsx — Café Fausse Reservation Page
 *
 * Implements FR-6 through FR-9:
 *  - Form with Time Slot, Guests, Name, Email, Phone (optional)
 *  - Client-side validation before submission
 *  - POST to /api/reservations
 *  - Success / error feedback to the user
 */
import React, { useState, useMemo } from 'react';
import api, { getErrorMessage } from '../utils/api';
import './Reservations.css';

/* ── Time slot generator ──────────────────────────────────────── */
/**
 * Generates available time slots for the next 30 days.
 * Slots are on the hour from opening to last seating.
 */
function generateTimeSlots() {
  const slots = [];
  const now = new Date();

  for (let day = 0; day < 30; day++) {
    const date = new Date(now);
    date.setDate(now.getDate() + day);
    const dayOfWeek = date.getDay(); // 0 = Sunday

    // Opening hours per SRS FR-2:
    //   Mon–Sat (1–6): 17:00–23:00  → last seating 22:00
    //   Sunday  (0):   17:00–21:00  → last seating 20:00
    const lastHour = dayOfWeek === 0 ? 20 : 22;

    for (let hour = 17; hour <= lastHour; hour++) {
      const slot = new Date(date);
      slot.setHours(hour, 0, 0, 0);
      if (slot > new Date()) {
        slots.push(slot);
      }
    }
  }
  return slots;
}

/* Format a Date as "Tuesday, June 10, 2025 at 7:00 PM" */
function formatSlot(date) {
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/* ── Validation helpers ───────────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s()\-+.]{7,20}$/;

function validateForm(fields) {
  const errors = {};

  if (!fields.name.trim())
    errors.name = 'Please enter your name.';

  if (!fields.email.trim())
    errors.email = 'Please enter your email address.';
  else if (!EMAIL_RE.test(fields.email.trim()))
    errors.email = 'Please enter a valid email address.';

  if (!fields.timeSlot)
    errors.timeSlot = 'Please select a time slot.';

  if (!fields.numGuests)
    errors.numGuests = 'Please select the number of guests.';
  else if (Number(fields.numGuests) < 1 || Number(fields.numGuests) > 20)
    errors.numGuests = 'Guests must be between 1 and 20.';

  if (fields.phone && !PHONE_RE.test(fields.phone.trim()))
    errors.phone = 'Please enter a valid phone number.';

  return errors;
}

/* ── Component ────────────────────────────────────────────────── */
const INITIAL_FORM = {
  name:      '',
  email:     '',
  phone:     '',
  timeSlot:  '',
  numGuests: '',
  newsletter: false,
};

export default function Reservations() {
  const timeSlots = useMemo(generateTimeSlots, []);

  const [form,       setForm]       = useState(INITIAL_FORM);
  const [errors,     setErrors]     = useState({});
  const [touched,    setTouched]    = useState({});
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [submitMsg,  setSubmitMsg]  = useState('');
  const [confirmed,  setConfirmed]  = useState(null); // reservation details on success

  /* ── Field handlers ───────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setForm(prev => ({ ...prev, [name]: newValue }));
    // Clear error on change if field was touched
    if (touched[name]) {
      const newErrors = validateForm({ ...form, [name]: newValue });
      setErrors(prev => ({ ...prev, [name]: newErrors[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldErrors = validateForm(form);
    setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
  };

  /* ── Submit ───────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched so all errors display
    const allTouched = Object.keys(INITIAL_FORM).reduce(
      (acc, k) => ({ ...acc, [k]: true }), {}
    );
    setTouched(allTouched);

    const formErrors = validateForm(form);
    setErrors(formErrors);

    if (Object.keys(formErrors).filter(k => formErrors[k]).length > 0) {
      // Scroll to first error
      const firstErrorField = document.querySelector('.form-input.error, .form-select.error');
      if (firstErrorField) firstErrorField.focus();
      return;
    }

    setSubmitStatus('loading');
    setSubmitMsg('');

    try {
      const { data } = await api.post('/api/reservations', {
        name:       form.name.trim(),
        email:      form.email.trim(),
        phone:      form.phone.trim() || undefined,
        time_slot:  new Date(form.timeSlot).toISOString(),
        num_guests: Number(form.numGuests),
        newsletter: form.newsletter,
      });

      setSubmitStatus('success');
      setSubmitMsg(data.message);
      setConfirmed(data.reservation);
      setForm(INITIAL_FORM);
      setTouched({});
      // Scroll to confirmation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitStatus('error');
      setSubmitMsg(getErrorMessage(err));
    }
  };

  const handleReset = () => {
    setSubmitStatus(null);
    setSubmitMsg('');
    setConfirmed(null);
    setForm(INITIAL_FORM);
    setErrors({});
    setTouched({});
  };

  /* ── Render ───────────────────────────────────────────────────── */
  return (
    <div className="reservations-page fade-in">

      {/* Page header */}
      <header className="page-hero page-hero--reservations">
        <div className="page-hero__overlay" aria-hidden="true" />
        <div className="container page-hero__content">
          <p className="section-subtitle">Dine With Us</p>
          <h1 className="page-hero__title">Reservations</h1>
          <div className="ornament"><div className="ornament-diamond" /></div>
          <p className="page-hero__desc">
            Secure your table for an unforgettable evening.
          </p>
        </div>
      </header>

      <div className="reservations-body container">

        {/* ── Success confirmation ───────────────────────────── */}
        {submitStatus === 'success' && confirmed && (
          <div className="confirmation fade-in-up" role="status" aria-live="polite">
            <div className="confirmation__icon" aria-hidden="true">✓</div>
            <h2 className="confirmation__title">Reservation Confirmed!</h2>
            <p className="confirmation__msg">{submitMsg}</p>
            <div className="confirmation__details">
              <div className="confirmation__detail">
                <span className="confirmation__detail-label">Reservation ID</span>
                <span className="confirmation__detail-value">
                  #{String(confirmed.reservation_id).padStart(4, '0')}
                </span>
              </div>
              <div className="confirmation__detail">
                <span className="confirmation__detail-label">Table</span>
                <span className="confirmation__detail-value">{confirmed.table_number}</span>
              </div>
              <div className="confirmation__detail">
                <span className="confirmation__detail-label">Guests</span>
                <span className="confirmation__detail-value">{confirmed.num_guests}</span>
              </div>
            </div>
            <button className="btn btn-ghost" onClick={handleReset}>
              Make Another Reservation
            </button>
          </div>
        )}

        {/* ── Reservation form ──────────────────────────────── */}
        {submitStatus !== 'success' && (
          <div className="res-layout">

            {/* Info sidebar */}
            <aside className="res-info">
              <h2 className="res-info__title">Before You Book</h2>
              <ul className="res-info__list">
                <li>
                  <strong>Hours</strong><br />
                  Mon–Sat: 5:00 PM – 11:00 PM<br />
                  Sunday: 5:00 PM – 9:00 PM
                </li>
                <li>
                  <strong>Address</strong><br />
                  1234 Culinary Ave, Suite 100<br />
                  Washington, DC 20002
                </li>
                <li>
                  <strong>Phone</strong><br />
                  <a href="tel:+12025554567">(202) 555-4567</a>
                </li>
                <li>
                  <strong>Party Size</strong><br />
                  We accommodate groups of 1–20.
                  For larger events, please call us directly.
                </li>
                <li>
                  <strong>Cancellations</strong><br />
                  We kindly ask for 24 hours' notice for cancellations.
                </li>
              </ul>
            </aside>

            {/* Form */}
            <form
              className="res-form"
              onSubmit={handleSubmit}
              noValidate
              aria-label="Table reservation form"
            >
              <h2 className="res-form__title">Reserve Your Table</h2>

              {/* Error banner */}
              {submitStatus === 'error' && (
                <div className="alert alert-error" role="alert" aria-live="assertive">
                  {submitMsg}
                </div>
              )}

              {/* Grid of form fields */}
              <div className="res-form__grid">

                {/* Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="res-name">
                    Full Name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="res-name"
                    name="name"
                    type="text"
                    className={`form-input ${touched.name && errors.name ? 'error' : ''}`}
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Jane Smith"
                    autoComplete="name"
                    required
                    aria-required="true"
                    aria-describedby={errors.name ? 'res-name-error' : undefined}
                  />
                  {touched.name && errors.name && (
                    <span id="res-name-error" className="form-error" role="alert">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label" htmlFor="res-email">
                    Email Address <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="res-email"
                    name="email"
                    type="email"
                    className={`form-input ${touched.email && errors.email ? 'error' : ''}`}
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="jane@example.com"
                    autoComplete="email"
                    required
                    aria-required="true"
                    aria-describedby={errors.email ? 'res-email-error' : undefined}
                  />
                  {touched.email && errors.email && (
                    <span id="res-email-error" className="form-error" role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Phone (optional) */}
                <div className="form-group">
                  <label className="form-label" htmlFor="res-phone">
                    Phone Number <span className="form-label--optional">(optional)</span>
                  </label>
                  <input
                    id="res-phone"
                    name="phone"
                    type="tel"
                    className={`form-input ${touched.phone && errors.phone ? 'error' : ''}`}
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="(202) 555-0000"
                    autoComplete="tel"
                    aria-describedby={errors.phone ? 'res-phone-error' : undefined}
                  />
                  {touched.phone && errors.phone && (
                    <span id="res-phone-error" className="form-error" role="alert">
                      {errors.phone}
                    </span>
                  )}
                </div>

                {/* Guests */}
                <div className="form-group">
                  <label className="form-label" htmlFor="res-guests">
                    Number of Guests <span aria-hidden="true">*</span>
                  </label>
                  <div className="form-select-wrapper">
                    <select
                      id="res-guests"
                      name="numGuests"
                      className={`form-select ${touched.numGuests && errors.numGuests ? 'error' : ''}`}
                      value={form.numGuests}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      aria-required="true"
                      aria-describedby={errors.numGuests ? 'res-guests-error' : undefined}
                    >
                      <option value="">Select guests…</option>
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'guest' : 'guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                  {touched.numGuests && errors.numGuests && (
                    <span id="res-guests-error" className="form-error" role="alert">
                      {errors.numGuests}
                    </span>
                  )}
                </div>

                {/* Time Slot — spans full width */}
                <div className="form-group form-group--full">
                  <label className="form-label" htmlFor="res-timeslot">
                    Select a Time Slot <span aria-hidden="true">*</span>
                  </label>
                  <div className="form-select-wrapper">
                    <select
                      id="res-timeslot"
                      name="timeSlot"
                      className={`form-select ${touched.timeSlot && errors.timeSlot ? 'error' : ''}`}
                      value={form.timeSlot}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      aria-required="true"
                      aria-describedby={errors.timeSlot ? 'res-timeslot-error' : undefined}
                    >
                      <option value="">Choose a date and time…</option>
                      {timeSlots.map(slot => (
                        <option key={slot.toISOString()} value={slot.toISOString()}>
                          {formatSlot(slot)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {touched.timeSlot && errors.timeSlot && (
                    <span id="res-timeslot-error" className="form-error" role="alert">
                      {errors.timeSlot}
                    </span>
                  )}
                </div>

                {/* Newsletter opt-in */}
                <div className="form-group form-group--full res-form__checkbox">
                  <label className="res-form__checkbox-label">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={form.newsletter}
                      onChange={handleChange}
                      className="res-form__checkbox-input"
                    />
                    <span className="res-form__checkbox-custom" aria-hidden="true" />
                    Subscribe to our newsletter for exclusive offers and seasonal menus.
                  </label>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary res-form__submit"
                disabled={submitStatus === 'loading'}
                aria-busy={submitStatus === 'loading'}
              >
                {submitStatus === 'loading' ? (
                  <><span className="spinner" /> Reserving…</>
                ) : (
                  'Confirm Reservation'
                )}
              </button>

              <p className="res-form__required-note">
                <span aria-hidden="true">*</span> Required fields
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
