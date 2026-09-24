const KEY = "cookie-consent";
const EVENT = "cookie-consent-change";
export const OPEN_SETTINGS_EVENT = "cookie-settings-open";

export function getConsent() {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setConsent(value) {
  try {
    window.localStorage.setItem(KEY, value);
  } catch {}
  window.dispatchEvent(new CustomEvent(EVENT, { detail: value }));
}

export function subscribeConsent(cb) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

// Server render has no storage; "pending" keeps the banner and map closed until hydration.
export const serverConsent = () => "pending";

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}
