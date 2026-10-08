export function weekDate(offset, day = 0) {
  const date = new Date(Date.UTC(2026, 9, 5 + offset * 7 + day));
  return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
}
