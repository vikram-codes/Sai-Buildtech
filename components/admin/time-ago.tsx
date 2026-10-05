"use client";

const rtf = new Intl.RelativeTimeFormat("en-IN", { numeric: "auto" });
const exact = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

const STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

function relative(date: Date) {
  const seconds = (date.getTime() - Date.now()) / 1000;
  for (const [unit, size] of STEPS) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return "just now";
}

/** "2 hours ago", with the exact date and time (India time) on hover. */
export function TimeAgo({ iso }: { iso: string }) {
  const date = new Date(iso);
  return (
    // Server and browser may disagree by a minute; the browser's version wins without a warning
    <time dateTime={iso} title={exact.format(date)} suppressHydrationWarning>
      {relative(date)}
    </time>
  );
}
