// Utility to parse Google-style opening_hours weekday text and generate slots
export type TimeRange = { start: string; end: string }; // 'HH:mm'
export type WeekdayRanges = Record<string, TimeRange[]>;

function normalizeText(s: string): string {
  return s
    .replace(/\u202F/g, " ") // narrow no-break space
    .replace(/[\u2013\u2014]/g, "-") // en-dash/em-dash -> hyphen
    .replace(/\s+/g, " ")
    .trim();
}

function to24Hour(time: string, ampm?: string): string | null {
  // time like '10:00' and ampm 'AM'|'PM'
  const m = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  let hh = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  if (ampm) {
    const a = ampm.toUpperCase();
    if (a === "AM") {
      if (hh === 12) hh = 0;
    } else if (a === "PM") {
      if (hh !== 12) hh += 12;
    }
  }
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

// Note: a small helper for token parsing was removed because the main parsing
// pipeline uses direct regex matches for full ranges. Keep file focused.

export function parseOpeningHoursArray(arr: string[] | null): WeekdayRanges {
  const result: WeekdayRanges = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };

  if (!arr) return result;

  arr.forEach((item) => {
    const normalized = normalizeText(item);
    const parts = normalized.split(":");
    if (parts.length < 2) return;
    const day = parts[0].trim();
    const timestr = parts.slice(1).join(":").trim();
    if (/closed/i.test(timestr)) {
      result[day] = [];
      return;
    }

    // Split multiple ranges by comma
    const ranges = timestr.split(",").map((r) => r.trim()).filter(Boolean);
    const parsed: TimeRange[] = [];
    ranges.forEach((r) => {
      // Normalize dash to single '-'
      const seg = r.replace(/\s*-\s*/g, "-");
      const m = seg.match(/(\d{1,2}:\d{2})\s*(AM|PM)?-(\d{1,2}:\d{2})\s*(AM|PM)?/i);
      if (!m) return;
      const start = to24Hour(m[1], m[2]);
      const end = to24Hour(m[3], m[4]);
      if (!start || !end) return;
      parsed.push({ start, end });
    });

    if (parsed.length > 0) result[day] = parsed;
  });

  return result;
}

function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
  return h * 60 + m;
}

function minutesToHHMM(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function generateSlotsForRanges(ranges: TimeRange[], intervalMinutes = 30): string[] {
  const slots: string[] = [];
  ranges.forEach(({ start, end }) => {
    const startMin = hhmmToMinutes(start);
    const endMin = hhmmToMinutes(end);
    if (endMin <= startMin) return; // skip invalid or cross-day ranges for now

    // round start up to nearest interval
    const first = Math.ceil(startMin / intervalMinutes) * intervalMinutes;
    // generate t where t < endMin
    for (let t = first; t < endMin; t += intervalMinutes) {
      slots.push(minutesToHHMM(t));
    }
  });

  // dedupe & sort
  return Array.from(new Set(slots)).sort();
}

const OpeningHours = { parseOpeningHoursArray, generateSlotsForRanges };

export default OpeningHours;
