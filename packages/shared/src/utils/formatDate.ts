/**
 * Date formatting helpers for ISO 8601 UTC strings from the API.
 * All functions accept the raw string — never a Date object —
 * so the conversion boundary is explicit and testable.
 */

/**
 * Returns a short human label relative to today.
 * formatOrderDate("2026-05-23T03:42:00Z") → "Today" / "Tomorrow" / "3 May"
 */
export function formatOrderDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();

  const dateDay = toLocalDateKey(date);
  const today = toLocalDateKey(now);
  const tomorrow = toLocalDateKey(new Date(now.getTime() + 86_400_000));

  if (dateDay === today) return 'Today';
  if (dateDay === tomorrow) return 'Tomorrow';

  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/**
 * Short time display for ETA badges.
 * formatTime("2026-05-23T11:30:00Z") → "11:30 AM"
 */
export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Age label for pending actions.
 * formatAge(30)  → "30m"
 * formatAge(90)  → "1h 30m"
 * formatAge(180) → "3h"
 */
export function formatAge(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

// ─── Internal ────────────────────────────────────────────────────────────────
function toLocalDateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
