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
const norm = value => String(value ?? '').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim().replace(/\s+/g,' ');
const normExact = value => String(value ?? '').replace(/\s+/g,' ').trim();
try {
  await page.goto(pathToFileURL(candidate).href, {waitUntil:'load', timeout:30000});
  const ready = await page.evaluate(() => !!window.__EBVA_INTEGRATION_AUDIT__ && typeof window.__EBVA_INTEGRATION_AUDIT__.getResult === 'function' && typeof window.__EBVA_INTEGRATION_AUDIT__.getApprovedQA === 'function');
  if (!ready) throw new Error('Integrated candidate audit surface missing');
  const baseline = await page.evaluate(() => window.__EBVA_INTEGRATION_AUDIT__.getApprovedQA());
  const approved = [
    ...(baseline.controlled || []).map(x=>({q:x.q,a:x.a,source:'CONTROLLED_QA'})),
    ...(baseline.r330 || []).map(x=>({q:x.q,a:x.a,source:'R330_QA'}))
  ];
  if (approved.length !== 412) {
    results.push({suite:'BASELINE_412',id:'BASELINE-COUNT',question:'Count approved baseline records',expectedType:'COUNT=412',expectedSource:'',expectedAnswer:'412',actualType:'COUNT='+approved.length,actualSource:'',actualAnswer:String(approved.length),verdict:'FAIL',note:'Expected exact 412 approved records from the protected R3.4 copy',actual:JSON.stringify({controlled:baseline.controlled?.length,r330:baseline.r330?.length})});
  }
  for (let i=0;i<approved.length;i++) {
    const item=approved[i];
    try {
      const out=await page.evaluate(q=>{
        const r=window.__EBVA_INTEGRATION_AUDIT__.getResult(q);
        const holder=document.createElement('div');
        holder.innerHTML=renderResult(q,r);
        return {answer:holder.querySelector('.answer')?.textContent||'',source:r?.source||''};
      },item.q);
      const pass=normExact(out.answer)===normExact(item.a);
      results.push({suite:'BASELINE_412',id:'KB-'+String(i+1).padStart(3,'0'),question:item.q,expectedType:'BASELINE_EXACT',expectedSource:item.source,expectedAnswer:item.a,actualType:'BASELINE',actualSource:out.source,actualAnswer:out.answer,verdict:pass?'PASS':'FAIL',note:'Exact approved-answer preservation',actual:JSON.stringify(out)});
    } catch(e) {
      results.push({suite:'BASELINE_412',id:'KB-'+String(i+1).padStart(3,'0'),question:item.q,expectedType:'BASELINE_EXACT',expectedSource:item.source,expectedAnswer:item.a,actualType:'ERROR',actualSource:'',actualAnswer:'',verdict:'FAIL',note:'Baseline comparison exception',actual:String(e)});
    }
  }
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
      const typePass = out.actualType === test.expectedType;
      const sourcePass = test.expectedType !== 'DIRECT' || out.actualSource === test.expectedSource;
      const answerPass = !test.expectedAnswer || norm(out.visibleAnswer) === norm(test.expectedAnswer);
      const pass = typePass && sourcePass && answerPass;
      results.push({suite:'HR_CONFIRMED',id:test.id,question:test.question,expectedType:test.expectedType,expectedSource:test.expectedSource||'',expectedAnswer:test.expectedAnswer||'',actualType:out.actualType,actualSource:out.actualSource||'',integratedSource:out.integratedSource||'',actualAnswer:out.visibleAnswer,verdict:pass?'PASS':'FAIL',note:test.note,actual:JSON.stringify(out)});
    } catch (e) {
      results.push({suite:'HR_CONFIRMED',id:test.id,question:test.question,expectedType:test.expectedType,expectedSource:test.expectedSource||'',expectedAnswer:test.expectedAnswer||'',actualType:'ERROR',actualSource:'',integratedSource:'',actualAnswer:'',verdict:'FAIL',note:test.note,actual:String(e)});
    }
  }
} finally { await browser.close(); }
fs.mkdirSync('artifacts',{recursive:true});
const header=['suite','id','question','expectedType','expectedSource','expectedAnswer','actualType','actualSource','integratedSource','actualAnswer','verdict','note','actual'];
const esc=v=>'"'+String(v??'').replaceAll('"','""')+'"';
fs.writeFileSync('artifacts/auto-ett-results.csv',[header.join(','),...results.map(r=>header.map(k=>esc(r[k])).join(','))].join('\n')+'\n');
const pass=results.filter(r=>r.verdict==='PASS').length, fail=results.length-pass;
const baselineRows=results.filter(r=>r.suite==='BASELINE_412'), hrRows=results.filter(r=>r.suite==='HR_CONFIRMED');
console.log(JSON.stringify({candidate,baselineExpected:412,baselineExecuted:approvedCount(results),baselinePass:baselineRows.filter(r=>r.verdict==='PASS').length,baselineFail:baselineRows.filter(r=>r.verdict==='FAIL').length,hrTests:hrRows.length,hrPass:hrRows.filter(r=>r.verdict==='PASS').length,hrFail:hrRows.filter(r=>r.verdict==='FAIL').length,total:results.length,pass,fail,hrResults:hrRows.map(({id,expectedType,expectedSource,actualType,actualSource,verdict})=>({id,expectedType,expectedSource,actualType,actualSource,verdict}))},null,2));
if (fail) process.exitCode=1;
function approvedCount(rows){return rows.filter(r=>r.suite==='BASELINE_412'&&r.id!=='BASELINE-COUNT').length;}
