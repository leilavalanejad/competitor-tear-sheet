# Competitor Tear Sheet

A skill that turns a competitor's name into an eight to twelve page document a
product team can argue with: the category's vocabulary, how their money moves, a
pricing teardown, what they've quietly stopped claiming, where they're genuinely
strong, where they're structurally exposed, and what to watch.

It's a set of instructions for Claude rather than a program. `SKILL.md` is the
whole thing.

**It's half of a pair.** This is the outside view, built from public sources.
[Review Signal](https://github.com/leilavalanejad/review-signal) is the inside
view, built from what that company's customers actually say. Run both on the
same competitor and read them together.

---

## Why the pair matters

Most competitive analysis is one of two failure modes.

The first is a feature grid. Rows of checkmarks that tell you what exists and
nothing about whether it works, what it costs, or why anyone chose it. It ages
in weeks and nobody reopens it.

The second is vibes from the sales team. Real signal, badly sampled. Whoever
lost the most recent deal sets the narrative for a quarter.

The fix isn't a better grid. It's two documents that answer different questions:

**How does this company work?** Where the money comes from, what they charge,
what they're building, what they've stopped saying. Public, structural, slow to
change. That's this skill.

**What do their customers actually experience?** Themes, trends, verbatims, and
what's changed in the last six weeks. That's Review Signal.

A pricing teardown tells you their strategy. Their reviews tell you whether it's
working. Either one alone gets you a confident wrong answer.

## The decisions in here, and why

**Pricing and packaging is its own section, not a line item.** Most competitive
docs record what a company charges. Almost none read *what's gated at each
tier*, which is the actual strategy document. Where the upgrade pressure sits
tells you who they think their customer is and what they're willing to lose.

**"What they've stopped saying" is a real section.** Compare today's homepage to
an archive snapshot from eighteen months ago. A dropped claim is a decision
someone made in a room, and it's usually more informative than anything they
currently say. Almost nobody does this and it takes ten minutes.

**Job listings are a named research source.** What a company is hiring for tells
you where it's investing months before any announcement. It's public, it's
specific, and it's routinely ignored.

**The changelog counts more than the roadmap.** What a company ships is what it
believes, stated more honestly than any positioning page.

**"Where they're strong" comes before "where they're exposed."** A competitive
document that only finds weaknesses is a morale exercise and everyone reading it
knows. Naming a rival's real advantages is what buys you credibility on the rest.

**"Exposed" means structural, not wishful.** Pricing that punishes their own
best users. A segment their model can't serve. A dependency they don't control.
"Their UI is dated" is not an exposure, it's a preference.

**It ends with "what to watch."** Three to five things that would change the
picture, and what each would mean. That's the difference between a document you
reread and a snapshot you replace.

**Eight to twelve pages, and "cut rather than justify."** Without a hard ceiling
these grow a category explainer nobody asked for.

**Help centre and support docs are named as a primary source.** Limits, quotas,
fee mechanics and workflow constraints appear there in plain language while
marketing pages stay vague. It's the most underrated source in competitive work.

## The honesty section

The part I'd defend hardest:

- Name their real strengths.
- Flag facts that cut against your own product. If they've solved something you
  haven't, say so plainly.
- Mark what you couldn't verify. A short open-questions list beats confident
  guessing.
- Attribute vendor-commissioned research as such, including their own case
  studies and ROI claims. A customer logo is not evidence of anything.
- Keep published pricing separate from estimated pricing. Those get confused
  constantly and the second is not a fact.
- Date everything. Competitive documents rot faster than any other kind.

A competitive document that only tells the team what it wants to hear is worse
than no document, because it gets cited in a planning meeting six months later
by someone who wasn't there when it was written.

## The build notes

Section 4 is a list of things that will bite you, and each is there because it
bit me:

- Table column widths have to be absolute `DXA` with `FIXED` layout. Percentage
  widths are valid docx and Google Docs imports them badly.
- `tableHeader: true` on header rows or they don't repeat across pages.
- Compress diagram PNGs to about 1150px and 128 colours. Over roughly a
  megabyte, delivery times out.
- `matplotlib.rcParams["text.parse_math"] = False` or dollar signs render as
  LaTeX.
- `letterspacing` is not a valid matplotlib Text kwarg. It raises
  AttributeError.
- Render the diagram and look at it before embedding. Overflow and clipping are
  invisible until you do.

A skill that doesn't carry its own debugging history makes the next person
rediscover it.

## Using it

Drop `SKILL.md` into your skills directory and it triggers when you ask about a
competitor. Or read it as a research checklist and do the work yourself. The
structure is the useful part and it doesn't need a model to be worth following.

Then run the same company's reviews through Review Signal and read the two side
by side. The interesting moments are where they disagree: a pricing page that
promises simplicity next to forty reviews about surprise charges is a finding.

## What I'd change

- **The page ceiling is a proxy.** What I want is a limit on how long it takes
  to reread. Pages are a rough stand-in.
- **No staleness handling.** The document knows its retrieval dates and does
  nothing with them. It should open with what's most likely already wrong.
- **No diffing.** Refreshing one today means rereading it to find what changed.
  It should tell you.
- **One competitor at a time.** Comparing three of them is a different document
  and probably a different skill.

---

Written by [Leila Valanejad](https://github.com/leilavalanejad).
