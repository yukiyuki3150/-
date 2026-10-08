import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
const source = `
import React from 'react';
import {App} from './App';
import {menus} from './lib/navigation';
import {parseCSV} from './lib/csv';
import {createTimetableICS} from './lib/ics';
import {courses as seed} from './data/mock';
`;
const checks = `
import {renderToString} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';
import assert from 'node:assert/strict';
let storage={};
globalThis.localStorage={getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=v};
assert.deepEqual(parseCSV('\\uFEFFid,name\\r\\nC1,"科目,名称"\\r\\nC2,"行1\\n行2"'),[['id','name'],['C1','科目,名称'],['C2','行1\\n行2']]);
assert.deepEqual(parseCSV('id,name\\nC1,"a""b"'),[['id','name'],['C1','a"b']]);
assert.throws(()=>parseCSV('id,"bad'));
let count=0;
for(const r of Object.keys(menus)){
 for(const [page] of menus[r]){
  storage={'ch-role':JSON.stringify(r)};
  const html=renderToString(<MemoryRouter initialEntries={['/'+r+'/'+page]}><App/></MemoryRouter>);
  assert.ok(html.includes('Campus Hub'),r+'/'+page);
  assert.ok(html.includes('<main>'),r+'/'+page);
  assert.ok(!html.includes('NaN'),r+'/'+page);
  if(r==='student'&&page==='grades')assert.ok(!html.includes('GPA 3.4'));
  count++;
 }
}
storage={};assert.ok(renderToString(<MemoryRouter><App/></MemoryRouter>).replaceAll('<!-- -->','').includes('学生としてログイン'));
storage={'ch-role':'"student"','ch-draft':JSON.stringify(seed.map(c=>c.id))};
const registration=renderToString(<MemoryRouter initialEntries={['/student/registration']}><App/></MemoryRouter>);
assert.ok(registration.includes('同一時限の重複'));
assert.ok(registration.includes('オーバーします'));
assert.ok(registration.includes('100'));
storage={'ch-role':'"student"','ch-notices':JSON.stringify([{id:'test',title:'教員からの連絡',body:'配信テスト',target:'ミクロ経済学A',read:false},{id:'other',title:'対象外の学年',body:'test',target:'4年',read:false}]),'ch-applications':JSON.stringify([{id:'a',student:'小宮路 健心',studentId:'26E001',type:'証明書発行',body:'1枚',status:'完了',date:'2026-10-08'}])};
const noticesHtml=renderToString(<MemoryRouter initialEntries={['/student/notices']}><App/></MemoryRouter>);
assert.ok(noticesHtml.includes('教員からの連絡'));assert.ok(!noticesHtml.includes('対象外の学年'));
const applicationHtml=renderToString(<MemoryRouter initialEntries={['/student/applications']}><App/></MemoryRouter>);
assert.ok(applicationHtml.includes('完了'));

const initialIDs=seed.slice(0,6).map(c=>c.id);
const renderRegistration=()=>renderToString(<MemoryRouter initialEntries={['/student/registration']}><App/></MemoryRouter>).replaceAll('<!-- -->','');
// Fresh and legacy empty drafts retain the existing timetable.
for (const legacy of [undefined, []]) {
 storage={'ch-role':'"student"'};
 if(legacy) storage['ch-draft']=JSON.stringify(legacy);
 const html=renderRegistration();
 for(const id of initialIDs) assert.ok(html.includes('aria-label="'+seed.find(c=>c.id===id).name+'を外す"'));
 const total=seed.slice(0,6).reduce((sum,c)=>sum+c.credits,0);
 assert.ok(html.includes('<strong>'+(64+total)+'</strong>'), 'count registered credits once');
 assert.ok(html.includes('registration-help-mobile'));
}
// Legacy additions are merged without duplicating a registered course.
storage={'ch-role':'"student"','ch-draft':JSON.stringify([initialIDs[0],seed[6].id])};
let draftHtml=renderRegistration();
assert.ok(draftHtml.includes('aria-label="'+seed[6].name+'を外す"'));
assert.ok(draftHtml.includes('<strong>'+(64+seed.slice(0,7).reduce((sum,c)=>sum+c.credits,0))+'</strong>'));
// A migrated draft preserves removals, including deliberately removing everything.
for(const ids of [initialIDs.slice(1), []]) {
 storage={'ch-role':'"student"','ch-draft-version':'2','ch-draft':JSON.stringify(ids)};
 draftHtml=renderRegistration();
 assert.ok(!draftHtml.includes('aria-label="'+seed[0].name+'を外す"'));
 const total=seed.filter(c=>ids.includes(c.id)).reduce((sum,c)=>sum+c.credits,0);
 assert.ok(draftHtml.includes('<strong>'+(64+total)+'</strong>'));
}
const ics=createTimetableICS(seed.slice(0,6));
assert.equal((ics.match(/BEGIN:VEVENT/g)||[]).length,6);
assert.ok(ics.startsWith('BEGIN:VCALENDAR'));
assert.ok(ics.includes('DTSTART;TZID=Asia/Tokyo:20261005T103000'));
assert.ok(createTimetableICS([{...seed[0],name:'a,b;c'}]).includes('SUMMARY:a\\\\,b\\\\;c'));
storage={'ch-role':'"admin"'};
const adminHtml=renderToString(<MemoryRouter initialEntries={['/admin/home']}><App/></MemoryRouter>);
assert.equal((adminHtml.match(/important-notice-row/g)||[]).length,3);
console.log('PASS: '+count+' role screens + login, CSV quoting/newlines/validation, GPA privacy, registration warnings, shared announcements/application status rendering, draft migration/removals/credit totals, ICS exports, admin notice rows.');
`;
const output = join(tmpdir(), "campus-hub-check.cjs");
await build({
  stdin: {
    contents: source + checks,
    resolveDir: join(process.cwd(), "src"),
    loader: "jsx",
  },
  bundle: true,
  platform: "node",
  format: "cjs",
  outfile: output,
  logLevel: "silent",
});
try {
  console.log(
    execFileSync(process.execPath, [output], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }),
  );
} catch (e) {
  console.error(e.stdout?.toString());
  console.error(e.stderr?.toString() || e.message);
  process.exit(1);
}
