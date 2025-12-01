/**
 * Convert a timestamp (number from Date.now() or a Date object) into a small
 * object with day, month, year and hour as strings.
 *
 * - day: 2-digit day ("01".."31")
 * - month: 2-digit month ("01".."12")
 * - year: 4-digit year ("2025")
 * - hour: 24-hour time with minutes ("HH:mm")
 */
export function formatTimestamp(input: number | Date): {
  day: string;
  month: string;
  year: string;
  hour: string;
} {
  const d = typeof input === "number" ? new Date(input) : input;

  const pad2 = (n: number) => String(n).padStart(2, "0");

  const day = pad2(d.getDate());
  const month = pad2(d.getMonth() + 1); // months are 0-based in JS
  const year = String(d.getFullYear());
  const hour = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

  return { day, month, year, hour };
}

// Small convenience default export
export default formatTimestamp;
