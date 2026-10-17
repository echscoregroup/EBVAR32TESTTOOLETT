import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const candidate = path.resolve('inttest/candidate/EBVAINT016_BUILD169_V134_GENERALIZED_RESOLVER_LOCAL.html');
const oracle = JSON.parse(fs.readFileSync('inttest/auto-ett/hr-confirmed-cases.json','utf8'));
if (!fs.existsSync(candidate)) throw new Error('Candidate HTML missing: '+candidate);
const browser = await chromium.launch({headless:true});
const page = await browser.newPage();
const results=[];
try {
  await page.goto(pathToFileURL(candidate).href, {waitUntil:'load', timeout:30000});
  const hasResolver = await page.evaluate(() => !!window.__EBVA_AUDIT__ && typeof window.__EBVA_AUDIT__.decide === 'function');
  if (!hasResolver) throw new Error('Candidate does not expose __EBVA_AUDIT__.decide');
  for (const test of oracle) {
    try {
      const actual = await page.evaluate(q => window.__EBVA_AUDIT__.decide(q), test.question);
      const actualType = actual?.type === 'CLEAR' ? 'DIRECT' : actual?.type === 'AMB' ? 'CLARIFY' : actual?.type === 'MULTI' ? 'MULTI' : actual?.type === 'NO' ? 'FALLBACK' : 'ERROR';
      const source = actual?.best?.id ?? actual?.best?.sourceId ?? actual?.best?.source_id ?? null;
      const answer = actual?.best?.answer ?? actual?.answer ?? '';
      const norm = value => String(value ?? '').normalize('NFKC').toLowerCase().replace(/[^\\p{L}\\p{N}]+/gu,' ').trim().replace(/\\s+/g,' ');
      const typePass = actualType === test.expectedType;
      const sourcePass = test.expectedType !== 'DIRECT' || source === test.expectedSource;
      const answerPass = !test.expectedAnswer || norm(answer) === norm(test.expectedAnswer);
      const pass = typePass && sourcePass && answerPass;
      results.push({id:test.id,expectedType:test.expectedType,expectedSource:test.expectedSource,actualType,actualSource:source,expectedAnswer:test.expectedAnswer ?? '',actualAnswer:answer,verdict:pass?'PASS':'FAIL',note:test.note,actual:JSON.stringify(actual)});
    } catch (e) {
      results.push({id:test.id,expectedType:test.expectedType,expectedSource:test.expectedSource,actualType:'ERROR',actualSource:null,verdict:'FAIL',note:test.note,actual:String(e)});
    }
  }
} finally { await browser.close(); }
fs.mkdirSync('artifacts',{recursive:true});
const header=['id','expectedType','expectedSource','expectedAnswer','actualType','actualSource','actualAnswer','verdict','note','actual'];
const esc=v=>'"'+String(v??'').replaceAll('"','""')+'"';
fs.writeFileSync('artifacts/auto-ett-results.csv',[header.join(','),...results.map(r=>header.map(k=>esc(r[k])).join(','))].join('\n')+'\n');
const pass=results.filter(r=>r.verdict==='PASS').length, fail=results.length-pass;
console.log(JSON.stringify({candidate,tests:results.length,pass,fail,results:results.map(({id,expectedType,expectedSource,actualType,actualSource,verdict})=>({id,expectedType,expectedSource,actualType,actualSource,verdict}))},null,2));
if (fail) process.exitCode=1;
