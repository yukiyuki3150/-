import { periods } from "../data/mock";
export function createTimetableICS(reg) {
  const escape = (s) =>
    s
      .replaceAll("\\", "\\\\")
      .replaceAll("\n", "\\n")
      .replaceAll(",", "\\,")
      .replaceAll(";", "\\;");
  const events = reg.map((c) => {
    const date = `202610${String(5 + c.day).padStart(2, "0")}`,
      times = periods[c.period - 1]
        .split("–")
        .map((t) => t.replace(":", "").padStart(4, "0") + "00");
    return [
      "BEGIN:VEVENT",
      `UID:${c.id}@campus-hub.local`,
      "DTSTAMP:20261008T000000Z",
      `DTSTART;TZID=Asia/Tokyo:${date}T${times[0]}`,
      `DTEND;TZID=Asia/Tokyo:${date}T${times[1]}`,
      "RRULE:FREQ=WEEKLY;UNTIL=20270201T145959Z",
      `SUMMARY:${escape(c.name)}`,
      `LOCATION:教室 ${escape(c.room)}`,
      `DESCRIPTION:${escape(c.teacher + " 先生")}`,
      "END:VEVENT",
    ].join("\r\n");
  });
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Campus Hub//JP",
    "CALSCALE:GREGORIAN",
    "X-WR-TIMEZONE:Asia/Tokyo",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}
