import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { sample,reportSchema,validateEvidence,markdown } from './report.ts';
test('example evidence resolves and exports all source URLs',()=>{validateEvidence(reportSchema.parse(sample));for(const s of sample.sources)assert.ok(markdown(sample).includes(s.url));});
test('unresolved citations and duplicated evidence are rejected',()=>{const r=structuredClone(sample);r.sections[0].points[0].sources=[99];assert.throws(()=>validateEvidence(r));const d=structuredClone(sample);d.sources.push(d.sources[0]);assert.throws(()=>validateEvidence(d));});
test('sources must have been retrieved by the research call',()=>{assert.throws(()=>validateEvidence(sample,new Set(['https://example.org'])));assert.equal(validateEvidence(sample,new Set(sample.sources.map(s=>s.url))).company,'Stripe');});

test('rich blocks retain evidence and shape through validation and export',()=>{const r=reportSchema.parse(sample);assert.ok(r.sections.some(s=>s.blocks?.length));const text=markdown(sample);assert.ok(text.includes('What the public disclosures establish'));assert.ok(text.includes('Processing fee: $3.20'));const bad=structuredClone(sample);bad.sections.find(s=>s.id==='model')!.blocks![0].type==='flow'&&(bad.sections.find(s=>s.id==='model')!.blocks![0] as any).sources.push(999);assert.throws(()=>validateEvidence(bad));const table=structuredClone(sample);const b=table.sections.find(s=>s.id==='financials')!.blocks![0];if(b.type==='table')b.rows[0].cells.pop();assert.throws(()=>validateEvidence(table));});
