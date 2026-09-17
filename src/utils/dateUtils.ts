import { TaskStatus } from '../types';

/**
 * Determines whether a task is "Due Soon" based on its dueDateStr.
 * A task triggers the 'Due Soon' alert badge when its due date
 * is within 48 hours of the current system time.
 * 
 * Handles:
 * - YYYY-MM-DD date-only strings (evaluating through end of the target day)
 * - ISO-8601 timestamps (e.g. 2026-09-18T14:30:00Z)
 * - Null/undefined values
 */
export function isDueSoon(dueDateStr?: string | null, status?: TaskStatus): boolean {
  if (!dueDateStr) return false;

  const now = Date.now();
  let dueTimestamp = new Date(dueDateStr).getTime();

  if (isNaN(dueTimestamp)) return false;

  // For YYYY-MM-DD date-only strings, evaluate with end-of-day in local time
  // to avoid UTC midnight timezone offsets marking today's tasks as expired prematurely.
  if (/^\d{4}-\d{2}-\d{2}$/.test(dueDateStr.trim())) {
    const endOfDay = new Date(`${dueDateStr.trim()}T23:59:59`).getTime();
    if (!isNaN(endOfDay) && endOfDay > dueTimestamp) {
      if (dueTimestamp < now && endOfDay >= now) {
        dueTimestamp = endOfDay;
      }
    }
  }

  const diffMs = dueTimestamp - now;
  const diffHours = diffMs / (1000 * 60 * 60);

  // Within 48 hours of current system time (allowing a 1-hour grace window for clock drift)
  return diffHours >= -1 && diffHours <= 48;
}

/**
 * Returns a human-friendly due date string relative to current time.
 */
export function formatDueText(dueDateStr?: string): string {
  if (!dueDateStr) return 'No date';
  const d = new Date(dueDateStr);
  if (isNaN(d.getTime())) return dueDateStr;

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
