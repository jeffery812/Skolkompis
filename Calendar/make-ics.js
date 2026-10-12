#!/usr/bin/env node
// Builds Vasa-2026-27.ics from calendar-data.js, so the phone calendar always matches index.html.
// Every filled cell on the page becomes an event; identical cells on consecutive weekdays become one event.
// Usage: node make-ics.js
'use strict';
const fs = require('fs');
const path = require('path');
const CAL = require('./calendar-data.js');

const OUT = path.join(__dirname, 'Vasa-2026-27.ics');
const NAME = 'Vasa 2026-27';
const STAMP = '20261013T000000Z';
const LABEL = Object.fromEntries(CAL.legend);

const parse = iso => { const [y, m, d] = iso.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)); };
const addDays = (d, n) => new Date(d.getTime() + n * 86400000);
const ymd = d => d.toISOString().slice(0, 10).replace(/-/g, '');
const cat = c => Array.isArray(c) ? c[0] : '';
const plain = c => (c == null ? '' : Array.isArray(c) ? c[1] : c).replace(/<[^>]+>/g, '');
const lines = t => t.split('\n').map(s => s.trim().replace(/,$/, '')).filter(Boolean);

// A short, readable title. The colour of a cell is part of its meaning, so closures say so in words:
// a pink "ASC" cell becomes "School closed – ASC open", a yellow "Långfredagen" becomes "School & ASC closed – Långfredagen".
function title(category, text){
  const ls = lines(text);
  const join = a => a.join(' – ');
  if (category === 'asc'){
    const first = ls[0];
    if (/^ASC\b/.test(first)){
      let rest = first.replace(/^ASC\s*/, '').replace(/^\/\s*/, '').replace(/^Open\b\s*/, '');
      if (/^(clos)/i.test(rest)) return join(['School closed – ASC ' + rest].concat(ls.slice(1)));
      rest = rest.replace(/^\((.*)\)$/, '$1');
      return join(['School closed – ASC open'].concat(rest ? [rest] : [], ls.slice(1)));
    }
    return join(['School closed – ASC open'].concat(ls.filter(l => !/^ASC Open$/i.test(l))));
  }
  if (category === 'closed'){
    const all = join(ls);
    if (/^(ASC|School) Closed\b/i.test(all)){
      const rest = all.replace(/^(ASC|School) Closed\s*(\||–)?\s*/i, '');
      return 'School & ASC closed' + (rest ? ' – ' + rest : '');
    }
    if (/ASC Closed/i.test(all)) return all;
    return 'School & ASC closed – ' + all;
  }
  return join(ls);
}

// ---- collect events ----
const events = [];
CAL.weeks.forEach(w => {
  const [week, , monday, cells, allWeek, spanWeeks = 1] = w;
  const mon = parse(monday);
  if (spanWeeks > 1){
    // one row standing for several weeks (e.g. weeks 27-30): a single event over the whole range
    events.push({ start: mon, end: addDays(mon, 7 * (spanWeeks - 1) + 4), c: cells[0], week });
  } else {
    for (let d = 0; d < 5; d++){
      const c = cells[d];
      if (c == null) continue;
      let e = d;
      while (e + 1 < 5 && cells[e + 1] != null && cat(cells[e + 1]) === cat(c) && plain(cells[e + 1]) === plain(c)) e++;
      events.push({ start: addDays(mon, d), end: addDays(mon, e), c, week });
      d = e;
    }
  }
  if (allWeek){
    const span = Array.isArray(allWeek) && allWeek[2];
    events.push({
      start: span ? parse(span.from) : mon,
      end: span ? parse(span.to) : addDays(mon, 4),
      c: allWeek, week, allWeek: true
    });
  }
});

// ---- write the .ics ----
const esc = s => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
function fold(line){
  const out = [];
  let b = Buffer.from(line);
  while (b.length > 75){
    let cut = out.length ? 74 : 75;
    while ((b[cut] & 0xC0) === 0x80) cut--;          // never split a UTF-8 character
    out.push(b.subarray(0, cut).toString());
    b = b.subarray(cut);
  }
  out.push(b.toString());
  return out.join('\r\n ');
}

const L = [
  'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Skolkompis//Vasa 2026-27//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  'NAME:' + NAME, 'X-WR-CALNAME:' + NAME,
  fold('X-WR-CALDESC:' + esc('VASA International School of Stockholm – academic calendar 2026-27')),
  'X-WR-TIMEZONE:Europe/Stockholm',
  'REFRESH-INTERVAL;VALUE=DURATION:PT12H', 'X-PUBLISHED-TTL:PT12H', 'X-APPLE-CALENDAR-COLOR:#1F8A70'
];
const uids = new Set();
events.forEach(ev => {
  const category = cat(ev.c), text = plain(ev.c);
  const summary = 'Vasa: ' + title(category, text);
  const desc = [];
  if (category) desc.push(LABEL[category] + '.');
  if (lines(text).length > 1 || title(category, text) !== lines(text).join(' – ')) desc.push(text);
  desc.push(ev.allWeek ? 'Week ' + ev.week + ' (all week).' : 'Week ' + ev.week + '.');

  const slug = text.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '').slice(0, 24);
  let uid = 'vasa-2026-27-' + ymd(ev.start) + '-' + (ev.allWeek ? 'week-' : '') + slug;
  for (let n = 2; uids.has(uid); n++) uid = uid.replace(/-\d+$/, '') + '-' + n;
  uids.add(uid);

  L.push('BEGIN:VEVENT', 'UID:' + uid + '@skolkompis', 'DTSTAMP:' + STAMP,
    'DTSTART;VALUE=DATE:' + ymd(ev.start), 'DTEND;VALUE=DATE:' + ymd(addDays(ev.end, 1)),
    'TRANSP:TRANSPARENT', fold('SUMMARY:' + esc(summary)), fold('DESCRIPTION:' + esc(desc.join('\n'))));
  if (category) L.push(fold('CATEGORIES:' + esc(LABEL[category])));
  if (category === 'packed'){
    // packed-lunch days: a reminder at 19:00 the evening before
    L.push('BEGIN:VALARM', 'ACTION:DISPLAY', fold('DESCRIPTION:' + esc('Packed lunch tomorrow – ' + title(category, text))),
      'TRIGGER:-PT5H', 'END:VALARM');
  }
  L.push('END:VEVENT');
});
L.push('END:VCALENDAR');

fs.writeFileSync(OUT, L.join('\r\n') + '\r\n');
console.log('Wrote ' + events.length + ' events to ' + path.basename(OUT));
