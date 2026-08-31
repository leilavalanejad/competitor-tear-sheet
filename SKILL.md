---
name: "competitor-tear-sheet"
description: "Research a competitor and produce a tear sheet a product team can act on: the category's vocabulary, how their money moves, a pricing and packaging teardown, positioning claims and what they've quietly stopped saying, where they're strong, where they're exposed, and what to watch. Use when starting competitive analysis on a company, before a positioning debate, or when someone asks why a rival is winning. Pair it with review-signal, which covers what that company's customers actually say."
---

# Competitor Tear Sheet

Produces a document that lets a product team argue about a competitor with facts
instead of impressions.

**This is the outside view.** Public sources: how they make money, what they
charge, what they claim, where they're exposed. The inside view, what their
customers actually experience, comes from their reviews. Run those through
[review-signal](https://github.com/leilavalanejad/review-signal) and read the
two together. Neither one alone is competitive analysis.

## Length discipline

**Eight to twelve pages. Hard ceiling.** If it runs long, cut rather than
justify. The most common failure is a category explainer nobody asked for.

**When a section has thin research behind it, drop the section.** A short honest
document beats a long padded one. Say what you could not find.

## Voice

- **No em dashes.** Commas, semicolons, parentheses.
- **No arrow notation.** "grew from 500K to 2M+," never "500K → 2M+."
- **No rhetorical triads.** Three items only when there are three things.
- **No antithesis constructions.** Not "it isn't X, it's Y."
- **Vary sentence rhythm.**
- **Never invent a number.** If it is not in a source it does not appear. Mark
  derived figures as derived.

## Step 1. Research before writing a word

Never write from priors. Prefer primary sources: earnings releases, pricing
pages, help centres, changelogs, SEC filings, engineering blogs. Treat
vendor-commissioned market research as directional and attribute it.

1. **Pricing and packaging pages**, every tier, including the enterprise page
   that hides the number.
2. **Help centre and support documentation.** The most underused source in
   competitive work. Limits, quotas, fee mechanics and workflow constraints show
   up there in plain language while marketing pages stay vague.
3. **The changelog or release notes**, last twelve months. What a company ships
   is what it believes, stated more honestly than any positioning page.
4. **Financial performance.** Public companies: latest results with the reporting
   date. Private: funding rounds with dates, amounts, leads, disclosed ARR,
   headcount, customer counts.
5. **Positioning as it stands now**, homepage and category pages.
6. **Positioning as it stood twelve to twenty-four months ago**, via archive
   snapshots. What they stopped saying is often more informative than what they
   say.
7. **Job listings.** What they're hiring for tells you where they're investing
   before any announcement does.
8. **Their competitive set**, including who they name and who they pointedly
   don't.

## Step 2. Structure

Nine parts. Drop what the research does not support.

1. **The vocabulary.** Every term in the rest of the document, in plain
   language, with the real figure alongside where one exists. The category's
   words, their product names, the business-model terms. Least glamorous section
   and the one people reread.
2. **How the money moves.** Trace one customer end to end, with a process-flow
   diagram. Who pays, for what, how often, what it costs them to serve.
   This is the analytical centre.
3. **Pricing and packaging teardown.** Every tier, what's gated at each, what's
   free, what's usage-based, and where the upgrade pressure sits. Most
   competitive analysis skips this and it's where the strategy actually lives.
4. **Product surface.** What they ship, module by module, and what they've
   shipped in the last year.
5. **Positioning.** What they claim, who they say it's for, and what they have
   quietly stopped saying. Show the before and after when the archive supports
   it.
6. **Performance.** Public numbers with reporting dates, and a note on what goes
   stale first.
7. **Where they're strong.** Be honest here. A document that can't name a
   rival's genuine strengths will not be believed on their weaknesses.
8. **Where they're exposed.** Structural, not wishful: pricing that punishes
   their own best users, a segment their model can't serve, a dependency they
   don't control, a promise the changelog shows they can't keep.
9. **What to watch.** Three to five specific things that would change this
   picture, and what each one would mean. This is what makes the document
   reusable rather than a snapshot.

## Step 3. Diagrams

At least one process-flow diagram for how the money moves. A second when there
is a genuine multi-party tension worth drawing.

Generate with matplotlib and embed as PNG. Two traps:

- **Set `matplotlib.rcParams["text.parse_math"] = False`** or dollar signs
  render as LaTeX.
- **`letterspacing` is not a valid Text kwarg.** It raises AttributeError.

Lay out in explicit pixel-style coordinates rather than 0-to-1 fractions.
**Always render the PNG and look at it before embedding**; overflow and clipping
are invisible until you do. Budget roughly 6.7 units of width per character at
fontsize 7.5 in an 800-unit-wide figure, and add generous box padding.

## Step 4. Build notes that will bite you otherwise

- **Table column widths must be absolute.** `WidthType.DXA` with
  `TableLayoutType.FIXED` and an explicit `columnWidths` array summing to page
  width minus both margins. Percentage widths are valid docx and Google Docs
  imports them badly.
- **Set `tableHeader: true`** on header rows so they repeat across pages.
- **Compress diagram PNGs.** Downscale to about 1150px wide and quantize to 128
  colours. A document over roughly a megabyte times out on delivery.
- **If delivery times out, retry once** before changing anything.

## Step 5. Verify

- Render to PDF and **look at the pages.** Check diagram placement and table
  overflow.
- Page count is within ceiling.
- Grep for em dashes and arrows.
- Every number traces to a source; derived figures labelled as derived.
- Every figure carries its retrieval date.
- Sources section flags what is most likely to be stale first.

## Honesty obligations

This is the section that decides whether the document is worth anything.

- **Name their real strengths.** A competitive document that only finds
  weaknesses is a morale exercise, and everyone reading it knows.
- **Flag facts that cut against your own product.** If they've solved something
  you haven't, that belongs in the document in plain language.
- **Mark what you could not verify.** A short open-questions list beats
  confident guessing.
- **Attribute vendor-commissioned research as such**, including their own case
  studies and ROI claims. A customer logo is not evidence of anything.
- **Separate published pricing from estimated pricing.** These get confused
  constantly and the second is not a fact.
- **Date everything.** Competitive documents rot faster than any other kind.

## Working defaults

- File naming: `<Company>_Tear_Sheet.docx`
- **Deliver .docx.** Rendering a PDF for your own verification is fine.
- Save a markdown version alongside it under `<company-slug>/tear-sheet.md` so a
  later session can refresh rather than rebuild.
- **Document generation:** Node with the `docx` library.
- Before building a new one, **check whether one already exists** for this
  company. If it does and it is not badly stale, refresh it and say plainly what
  changed.

## Tone

Be an analyst, not a cheerleader and not a hit piece. When the research
contradicts what the team believes about a competitor, say so directly. Being
corrected by a document is cheaper than being corrected by the market.
