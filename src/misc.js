/* eslint-disable import/prefer-default-export */
import { number2kanji } from '@geolonia/japanese-numeral';

/**
 * @param {function} callback
 */
export function throttle(callback) {
  let handle = 0;
  return (...args) => {
    cancelAnimationFrame(handle);
    handle = requestAnimationFrame(() => {
      callback(...args);
    });
  };
}

/**
 * @param {number} fps
 * @param {() => void} render
 */
export function animate(fps, render) {
  const interval = 1000 / fps;
  let handle = 0;
  let drawnAt = 0;
  const draw = () => {
    const now = Date.now();
    if (now - drawnAt > interval) {
      render();
      drawnAt = now;
    }
    handle = window.requestAnimationFrame(() => draw());
  };
  draw();
  return () => window.cancelAnimationFrame(handle);
}

export function numberToKanji(number) {
  if (number === 0) return '〇';
  return number2kanji(number);
}
