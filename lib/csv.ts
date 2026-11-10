/** Minimal RFC 4180 CSV parser (quoted fields, doubled quotes). No embedded newlines. */
export type CsvRow = Record<string, string>;

function parseLine(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      cells.push(cur);
      cur = "";
    } else cur += ch;
  }
  cells.push(cur);
  return cells;
}

export function parseCsv(text: string, source = "csv"): CsvRow[] {
  const lines = text.trimEnd().split(/\r?\n/);
  const [headerLine, ...rest] = lines;
  const header = parseLine(headerLine ?? "");
  return rest.map((line, n) => {
    const cells = parseLine(line);
    if (cells.length !== header.length) {
      throw new Error(`${source}:${n + 2} has ${cells.length} cells, expected ${header.length}`);
    }
    return Object.fromEntries(header.map((h, i) => [h, cells[i] ?? ""]));
  });
}
