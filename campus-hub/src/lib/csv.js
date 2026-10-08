export function parseCSV(text) {
  text = text.replace(/^\uFEFF/, "");
  const rows = [];
  let row = [],
    field = "",
    quoted = false;
  for (let i = 0; i < text.length; i++) {
    const s = text,
      c = s[i];
    if (c === '"') {
      if (quoted && s[i + 1] === '"') {
        field += '"';
        i++;
      } else quoted = !quoted;
    } else if (c === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && s[i + 1] === "\n") i++;
      row.push(field);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  row.push(field);
  if (row.some(Boolean)) rows.push(row);
  if (quoted) throw Error("CSVの引用符が閉じられていません");
  return rows;
}
export const csvCell = (v) => '"' + String(v ?? "").replaceAll('"', '""') + '"';
