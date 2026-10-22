import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { sample,reportSchema,validateEvidence,markdown } from './report.ts';
test('example evidence resolves and exports all source URLs',()=>{validateEvidence(reportSchema.parse(sample));for(const s of sample.sources)assert.ok(markdown(sample).includes(s.url));});
test('unresolved citations and duplicated evidence are rejected',()=>{const r=structuredClone(sample);r.sections[0].points[0].sources=[99];assert.throws(()=>validateEvidence(r));const d=structuredClone(sample);d.sources.push(d.sources[0]);assert.throws(()=>validateEvidence(d));});
test('sources must have been retrieved by the research call',()=>{assert.throws(()=>validateEvidence(sample,new Set(['https://example.org'])));assert.equal(validateEvidence(sample,new Set(sample.sources.map(s=>s.url))).company,'Stripe');});
