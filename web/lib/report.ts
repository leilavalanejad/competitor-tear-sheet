import { z } from 'zod';
export const pointSchema = z.object({ title:z.string(), text:z.string(), kind:z.enum(['fact','analysis']), sources:z.array(z.number().int().positive()).min(1) });
const citations = z.array(z.number().int().positive()).min(1);
export const blockSchema = z.discriminatedUnion('type', [
 z.object({type:z.literal('table'),title:z.string(),columns:z.array(z.string()).min(2),rows:z.array(z.object({cells:z.array(z.string()),kind:z.enum(['fact','analysis','derived','unavailable']),sources:citations})).min(1),note:z.string()}),
 z.object({type:z.literal('flow'),title:z.string(),steps:z.array(z.object({label:z.string(),detail:z.string()})).min(2),kind:z.enum(['fact','analysis','derived']),sources:citations,note:z.string()})
]);
export const reportSchema = z.object({ company:z.string(), domain:z.string(), category:z.string(), summary:z.string(), sections:z.array(z.object({id:z.string(),title:z.string(),points:z.array(pointSchema),blocks:z.array(blockSchema).optional()})), sources:z.array(z.object({id:z.number().int().positive(),title:z.string(),url:z.string().url(),type:z.string(),date:z.string()})), gaps:z.array(z.string()) });
export type Report = z.infer<typeof reportSchema> & { generatedAt:string; sample?:boolean };
export const sample:Report={
 company:'Stripe',domain:'stripe.com',category:'Payments & financial infrastructure',summary:'Stripe brings payments, recurring billing and platform money movement into one product suite. The strategic question is how much of a company’s revenue workflow it can own.',generatedAt:'2026-10-21',sample:true,
 sections:[
 {id:'overview',title:'Company overview',points:[{title:'The business',text:'Stripe offers online payments and a broader financial software suite. Its product catalog spans Billing, Connect, Tax and fraud tools.',kind:'fact',sources:[1]},{title:'The customer',text:'Connect targets platforms and marketplaces that need to accept payments and move money between parties.',kind:'fact',sources:[2]}]},
 {id:'model',title:'How the money moves',points:[{title:'Payments as the entry point',text:'A merchant accepts a customer payment. Stripe charges for processing; additional products have their own fees.',kind:'fact',sources:[1]},{title:'Expansion within the workflow',text:'Analysis: once payment infrastructure is integrated, adjacent billing and platform workflows create opportunities to expand the relationship. Integration alone does not establish switching costs or retention.',kind:'analysis',sources:[1,2,3]}]},
 {id:'pricing',title:'Pricing & packaging',points:[{title:'US standard card processing',text:'2.9% + 30¢ per successful domestic card transaction. Payment method and geography affect pricing; custom pricing is available.',kind:'fact',sources:[1]},{title:'Where to look closely',text:'Analysis: compare the total workflow cost, including selected add-ons and payment mix. A headline processing rate cannot establish which provider is cheaper for a particular business.',kind:'analysis',sources:[1]}]},
 {id:'product',title:'Product surface',points:[{title:'Billing',text:'Stripe Billing supports subscriptions, invoicing and usage-based monetization.',kind:'fact',sources:[3]},{title:'Connect',text:'Connect provides payments infrastructure for platforms and marketplaces.',kind:'fact',sources:[2]}]},
 {id:'landscape',title:'Competitive landscape',points:[{title:'Define the buying decision first',text:'Analysis: separate payment processing, subscription management and marketplace infrastructure before selecting peers. This source set does not support a ranked competitor comparison.',kind:'analysis',sources:[1,2,3]}]},
 {id:'strengths',title:'Strengths & exposure',points:[{title:'Breadth of the product surface',text:'Analysis: the range of adjacent products supports an integrated buying proposition. Product breadth by itself does not prove implementation quality or customer preference.',kind:'analysis',sources:[1,2,3]},{title:'Cost requires a workload',text:'Analysis: transaction and product fees make effective cost sensitive to usage. Validate that cost against an actual customer workload before calling it a structural disadvantage.',kind:'analysis',sources:[1]}]},
 {id:'watch',title:'What to watch',points:[{title:'Packaging and fee changes',text:'Watch for changes to published fees and what is bundled. Recalculate a representative customer’s total bill when either changes.',kind:'analysis',sources:[1]},{title:'Ownership of revenue operations',text:'Watch how the Billing and Connect propositions evolve. Test whether the broader suite wins more of the workflow or increases implementation complexity.',kind:'analysis',sources:[2,3]}]}],
 sources:[{id:1,title:'Stripe pricing',url:'https://stripe.com/pricing',type:'Official pricing',date:'2026-10-21'},{id:2,title:'Stripe Connect',url:'https://stripe.com/connect',type:'Official product page',date:'2026-10-21'},{id:3,title:'Stripe Billing',url:'https://stripe.com/billing',type:'Official product page',date:'2026-10-21'}],
 gaps:['Illustrative brief with three primary sources, not a full diligence report.','Financial performance, hiring signals and historical positioning were not researched for this example.','Competitor pricing and customer experience need independent verification.']};
export function blockMarkdown(b:z.infer<typeof blockSchema>){
 if(b.type==='flow')return `### ${b.title} (${b.kind})\n\n`+b.steps.map((s,i)=>`${i+1}. **${s.label}**: ${s.detail}`).join('\n')+`\n\n${b.note} Sources: ${b.sources.join(', ')}\n`;
 const cell=(v:string)=>v.replace(/\|/g,'\\|').replace(/\n/g,' ');
 return `### ${b.title}\n\n| ${[...b.columns,'Evidence'].map(cell).join(' | ')} |\n| ${[...b.columns,'Evidence'].map(()=> '---').join(' | ')} |\n`+b.rows.map(r=>`| ${[...r.cells,`${r.kind}: ${r.sources.map(n=>'['+n+']').join(' ')}`].map(cell).join(' | ')} |`).join('\n')+`\n\n${b.note}\n`;
}
export function markdown(r:Report){return `# ${r.company}\n\n${r.category}\n\n${r.summary}\n\nResearched: ${r.generatedAt}${r.sample?' (example brief)':''}\n\n`+r.sections.map(s=>`## ${s.title}\n\n`+(s.blocks||[]).map(blockMarkdown).join('\n')+'\n'+s.points.map(p=>`### ${p.title}\n\n${p.kind==='analysis'?'[Analysis] ':''}${p.text}\n\nSources: ${p.sources.map(n=>`[${n}]`).join(' ')}\n`).join('\n')).join('\n')+`\n## Open questions\n\n${r.gaps.map(x=>'- '+x).join('\n')}\n\n## Sources\n\n`+r.sources.map(s=>`[${s.id}] ${s.title}: ${s.url} (retrieved ${s.date})`).join('\n');}

export function validateEvidence(r: z.infer<typeof reportSchema>, retrievedUrls?:Set<string>){
 const ids=new Set(r.sources.map(s=>s.id));
 if(!r.sources.length||!r.sections.length||ids.size!==r.sources.length)throw Error('Missing or duplicated evidence');
 const normalize=(url:string)=>{const u=new URL(url);u.hash='';return u.href.replace(/\/$/,'');};
 const retrieved=retrievedUrls?new Set([...retrievedUrls].map(normalize)):null;
 for(const source of r.sources){if(!/^https?:\/\//.test(source.url)||!/^\d{4}-\d{2}-\d{2}$/.test(source.date))throw Error('Invalid evidence');if(retrieved&&!retrieved.has(normalize(source.url)))throw Error('Source not in retrieved evidence');}
 for(const section of r.sections){if(!section.points.length&&!section.blocks?.length)throw Error('Empty section');for(const b of section.blocks||[]){const refs=b.type==='flow'?b.sources:b.rows.flatMap(row=>row.sources);if(refs.some(id=>!ids.has(id)))throw Error('Unresolved block citation');if(b.type==='table'&&b.rows.some(row=>row.cells.length!==b.columns.length))throw Error('Invalid table width');}for(const point of section.points){if(!point.sources.length||point.sources.some(id=>!ids.has(id)))throw Error('Unresolved citation');}}
 return r;
}

// Manually researched design example. Every added table row carries evidence.
sample.generatedAt='2026-10-22';
sample.sources.push(
 {id:4,title:'Stripe 2025 annual update',url:'https://stripe.com/annual-updates/2025',type:'Company-reported operating scale',date:'2026-10-22'},
 {id:5,title:'Stripe 2024 update',url:'https://stripe.com/newsroom/news/stripe-2024-update',type:'Company-reported operating scale',date:'2026-10-22'},
 {id:6,title:'Adyen pricing',url:'https://www.adyen.com/pricing',type:'Competitor primary source',date:'2026-10-22'}
);
sample.sections.find(s=>s.id==='model')!.blocks=[{
 type:'flow',title:'A $100 domestic card sale: illustrative fee economics',kind:'derived',sources:[1],
 steps:[{label:'Customer pays $100',detail:'Assumed successful US domestic card purchase.'},{label:'Processing fee: $3.20',detail:'$100 × 2.9% + $0.30 at published standard pricing.'},{label:'Merchant remainder: $96.80',detail:'Before other fees, refunds, taxes or adjustments.'}],
 note:'Simplified fee allocation, not a settlement-system diagram. The processing fee is not Stripe net revenue or profit; this illustration does not break out network or bank costs.'
}];
sample.sections.splice(4,0,{id:'financials',title:'Financials & operating scale',blocks:[{
 type:'table',title:'What the public disclosures establish',columns:['Measure','2024','2025','Interpretation'],rows:[
 {cells:['Company-reported volume','$1.4 trillion total payment volume','$1.9 trillion generated by businesses on Stripe','Operating scale; not Stripe revenue. Wording follows each disclosure.'],kind:'fact',sources:[4,5]},
 {cells:['Stripe revenue','Not established in this source set','Not established in this source set','Do not apply the retail card fee to total volume to estimate revenue.'],kind:'unavailable',sources:[4,5]},
 {cells:['Net margin / free cash flow','Not established in this source set','Not established in this source set','No supported valuation or profitability model from these figures alone.'],kind:'unavailable',sources:[4,5]}
 ],note:'USD. Annual periods. These are selected company disclosures, not a full financial statement review. No inferred growth calculation from rounded figures with differently labeled scope.'
}],points:[{title:'Scale is not monetization',text:'The disclosed volume establishes the size of activity on the platform. It does not establish how much Stripe retains. A financial model needs revenue definitions, payment mix, negotiated pricing, product mix and processing costs before it can bridge activity into earnings.',kind:'analysis',sources:[1,4,5]}]});
sample.sections.find(s=>s.id==='landscape')!.blocks=[{
 type:'table',title:'A buying-decision comparison: Stripe and Adyen',columns:['Dimension','Stripe','Adyen','Decision implication'],rows:[
 {cells:['Published pricing architecture','US standard domestic cards: 2.9% + $0.30; custom packages available.','Fixed processing fee plus payment-method fee; Interchange++ passes through variable interchange.','Model the same card mix, geography and ticket size before comparing cost.'],kind:'fact',sources:[1,6]},
 {cells:['Commercial scope','Payments plus separately priced adjacent products.','Other products are priced separately from payment methods.','Compare the complete required workflow and the negotiated quote.'],kind:'fact',sources:[1,6]},
 {cells:['What would change the decision?','Test the value of an integrated Billing / Connect workflow.','Test the effective payment cost for the same transaction population.','Run a matched workload and implementation evaluation; these sources do not establish a winner.'],kind:'analysis',sources:[1,2,3,6]}
 ],note:'A bounded comparison supported by pricing/product sources. It does not rank implementation quality, authorization rates or customer satisfaction.'
}];
sample.sections.find(s=>s.id==='landscape')!.points=[{title:'Where competition actually happens',text:'The comparison should start with the job being bought. A merchant buying payment acceptance is making a different decision from a software platform buying merchant onboarding and money movement, or a finance team buying subscription operations. Compare alternatives within each job before judging the breadth of a suite.',kind:'analysis',sources:[1,2,3,6]}];
sample.gaps=['Design example, not a completed diligence report. Peer coverage currently includes only Adyen.','Financial statement detail, retention, customer concentration and segment economics require additional evidence.','Historical positioning, product changes, implementation experience and switching costs have not been independently evaluated.'];
