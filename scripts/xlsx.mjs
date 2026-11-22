// Minimal .xlsx reader: plain Node, no dependencies.
// readSheet(path, sheetName) -> array of rows, each an array of cell values
// (strings or numbers as written in the file; empty cells are '').
import { readFileSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';

function unzip(buf) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('Not a zip file');
  const n = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const files = new Map();
  for (let k = 0; k < n; k++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('Bad central directory');
    const method = buf.readUInt16LE(p + 10);
    const csize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nameLen);
    files.set(name, { method, csize, local });
    p += 46 + nameLen + extraLen + commentLen;
  }
  return name => {
    const f = files.get(name);
    if (!f) return null;
    const start = f.local + 30 + buf.readUInt16LE(f.local + 26) + buf.readUInt16LE(f.local + 28);
    const data = buf.subarray(start, start + f.csize);
    if (f.method === 0) return data.toString('utf8');
    if (f.method === 8) return inflateRawSync(data).toString('utf8');
    throw new Error(`Unsupported zip method ${f.method}`);
  };
}

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
function decode(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) =>
    e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : +e.slice(1)) : (ENT[e] ?? m));
}
function texts(xml) {
  let out = '';
  for (const m of xml.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)) out += m[1];
  return decode(out);
}
function colIndex(ref) {
  let n = 0;
  for (const ch of ref.match(/^[A-Z]+/)[0]) n = n * 26 + ch.charCodeAt(0) - 64;
  return n - 1;
}

export function readSheet(path, sheetName) {
  const get = unzip(readFileSync(path));
  const wb = get('xl/workbook.xml');
  const sheet = [...wb.matchAll(/<sheet\s[^>]*>/g)].map(m => m[0]).find(s => decode(s.match(/name="([^"]*)"/)[1]) === sheetName);
  if (!sheet) throw new Error(`No sheet ${sheetName}`);
  const rid = sheet.match(/r:id="([^"]*)"/)[1];
  const rels = get('xl/_rels/workbook.xml.rels');
  const rel = [...rels.matchAll(/<Relationship\s[^>]*>/g)].map(m => m[0]).find(r => r.includes(`Id="${rid}"`));
  let target = rel.match(/Target="([^"]*)"/)[1];
  target = target.startsWith('/') ? target.slice(1) : 'xl/' + target;
  const sst = get('xl/sharedStrings.xml');
  const strings = sst ? [...sst.matchAll(/<si>([\s\S]*?)<\/si>/g)].map(m => texts(m[1])) : [];
  const xml = get(target);
  const rows = [];
  for (const rm of xml.matchAll(/<row\s([^>]*?)(?:\/>|>([\s\S]*?)<\/row>)/g)) {
    const r = +rm[1].match(/\br="(\d+)"/)[1] - 1;
    const row = [];
    for (const cm of (rm[2] ?? '').matchAll(/<c\s([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const attrs = cm[1];
      const ci = colIndex(attrs.match(/\br="([A-Z]+\d+)"/)[1]);
      const t = (attrs.match(/\bt="([^"]*)"/) || [])[1];
      const body = cm[2] ?? '';
      const v = (body.match(/<v>([\s\S]*?)<\/v>/) || [])[1];
      let val = '';
      if (t === 's') val = strings[+v];
      else if (t === 'inlineStr') val = texts(body);
      else if (t === 'str' || t === 'e') val = v === undefined ? '' : decode(v);
      else if (t === 'b') val = v === '1';
      else if (v !== undefined) val = Number(v);
      row[ci] = val;
    }
    for (let i = 0; i < row.length; i++) if (row[i] === undefined) row[i] = '';
    rows[r] = row;
  }
  for (let i = 0; i < rows.length; i++) if (rows[i] === undefined) rows[i] = [];
  return rows;
}
