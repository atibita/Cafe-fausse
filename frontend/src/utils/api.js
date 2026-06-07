/**
 * utils/api.js — Axios instance pre-configured for the Café Fausse API.
 *
 * All components import from this module so the base URL is defined once.
 * In development the proxy field in package.json forwards /api/* to Flask.
 */

import axios from 'axios';

const api = axios.create({
  // In production set REACT_APP_API_URL to your backend's public URL
  baseURL: process.env.REACT_APP_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,  // 10 seconds — satisfies NFR-2
});

/**
 * Normalise errors from the Flask API into a plain string.
 * @param {unknown} err - Axios or network error
 * @returns {string}
 */
export function getErrorMessage(err) {
  if (err?.response?.data?.errors?.length) {
    return err.response.data.errors.join(' ');
  }
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }
  if (err?.message) {
    return err.message;
  }
  return 'An unexpected error occurred. Please try again.';
}

export default api;
