// Cookie-based cooldown so the same browser can't start a new
// playthrough again right away. Only active in production —
// `npm run dev` never sets or checks this, so it never gets in the
// way while building/testing.

const COOKIE_NAME = 'helfi_last_played';
export const COOLDOWN_SECONDS = 2 * 24 * 60 * 60; // 2 days per Helfi, for now
export const COOLDOWN_ENABLED = process.env.NODE_ENV === 'production';

function readCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// Milliseconds left before a new playthrough is allowed again, or 0
// if there's no active cooldown (including when disabled in dev).
// Only player2 ever sets the cookie (see markPlayedNow), so the
// check is skipped for any other role.
export function getCooldownRemainingMs(role) {
  if (!COOLDOWN_ENABLED) return 0;
  if (role !== 'player2') return 0;
  const raw = readCookie(COOKIE_NAME);
  const playedAt = raw ? Number(raw) : NaN;
  if (!Number.isFinite(playedAt)) return 0;
  return Math.max(0, playedAt + COOLDOWN_SECONDS * 1000 - Date.now());
}

export function markPlayedNow() {
  if (!COOLDOWN_ENABLED) return;
  document.cookie = `${COOKIE_NAME}=${Date.now()}; max-age=${COOLDOWN_SECONDS}; path=/; SameSite=Lax`;
}
