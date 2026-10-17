import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const candidate = path.resolve('inttest/candidate/EBVA_R34_INT_V134_INTEGRATED_TEST.html');
const oracle = JSON.parse(fs.readFileSync('inttest/auto-ett/hr-confirmed-cases.json','utf8'));
if (!fs.existsSync(candidate)) throw new Error('Integrated candidate HTML missing: '+candidate);
const browser = await chromium.launch({headless:true});
const page = await browser.newPage();
const results=[];
try {
  await page.goto(pathToFileURL(candidate).href, {waitUntil:'load', timeout:30000});
  const ready = await page.evaluate(() => !!window.__EBVA_INTEGRATION_AUDIT__ && typeof window.__EBVA_INTEGRATION_AUDIT__.getResult === 'function');
  if (!ready) throw new Error('Integrated candidate audit surface missing');
  for (const test of oracle) {
    try {
      const out = await page.evaluate(q => {
        const r = window.__EBVA_INTEGRATION_AUDIT__.getResult(q);
        const holder = document.createElement('div');
        holder.innerHTML = renderResult(q,r);
        const visibleAnswer = holder.querySelector('.answer')?.textContent || '';
        const d = window.__EBVA_INTEGRATION_AUDIT__.decide(q);
        const type = d?.type === 'CLEAR' ? 'DIRECT' : d?.type === 'AMB' ? 'CLARIFY' : d?.type === 'MULTI' ? 'MULTI' : d?.type === 'NO' ? 'FALLBACK' : 'ERROR';
        const source = d?.best?.id ?? d?.best?.sourceId ?? d?.best?.source_id ?? null;
        return {visibleAnswer,integratedSource:r?.source||null,actualType:type,actualSource:source};
      }, test.question);
      const norm = value => String(value ?? '').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim().replace(/\s+/g,' ');
      const typePass = out.actualType === test.expectedType;
      const sourcePass = test.expectedType !== 'DIRECT' || out.actualSource === test.expectedSource;
      const answerPass = !test.expectedAnswer || norm(out.visibleAnswer) === norm(test.expectedAnswer);
      const pass = typePass && sourcePass && answerPass;
      results.push({id:test.id,expectedType:test.expectedType,expectedSource:test.expectedSource||'',expectedAnswer:test.expectedAnswer||'',actualType:out.actualType,actualSource:out.actualSource||'',integratedSource:out.integratedSource||'',actualAnswer:out.visibleAnswer,verdict:pass?'PASS':'FAIL',note:test.note,actual:JSON.stringify(out)});
    } catch (e) {
      results.push({id:test.id,expectedType:test.expectedType,expectedSource:test.expectedSource||'',expectedAnswer:test.expectedAnswer||'',actualType:'ERROR',actualSource:'',integratedSource:'',actualAnswer:'',verdict:'FAIL',note:test.note,actual:String(e)});
    }
  }
} finally { await browser.close(); }
fs.mkdirSync('artifacts',{recursive:true});
const header=['id','expectedType','expectedSource','expectedAnswer','actualType','actualSource','integratedSource','actualAnswer','verdict','note','actual'];
const esc=v=>'"'+String(v??'').replaceAll('"','""')+'"';
fs.writeFileSync('artifacts/auto-ett-results.csv',[header.join(','),...results.map(r=>header.map(k=>esc(r[k])).join(','))].join('\n')+'\n');
const pass=results.filter(r=>r.verdict==='PASS').length, fail=results.length-pass;
console.log(JSON.stringify({candidate,tests:results.length,pass,fail,results:results.map(({id,expectedType,expectedSource,actualType,actualSource,verdict})=>({id,expectedType,expectedSource,actualType,actualSource,verdict}))},null,2));
if (fail) process.exitCode=1;
