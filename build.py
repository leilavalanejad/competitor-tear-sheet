#!/usr/bin/env python3
"""
build.py: turn research you have already gathered into a tear sheet.

    pip install anthropic
    export ANTHROPIC_API_KEY="sk-ant-..."
    python build.py Stripe sources/stripe/

WHAT THIS DOES NOT DO: research the company. It has no web access, and that is
deliberate rather than a limitation I forgot to fix.

SKILL.md opens with "never write from priors." A script that took a company name
and asked a model to describe it would do exactly that, and produce something
confident, well-formatted and unreliable. Pricing changes. Companies get
acquired. A model's recollection of a pricing page is not a pricing page.

So this refuses to run without source files. You gather them, it structures
them. Every claim in the output traces to something you actually put in the
folder.

If you want the research done for you, use SKILL.md in a Claude conversation
with web access instead. That is the better path for the research half, and it
needs no API key at all.

HOW TO GATHER SOURCES
    Make a folder. Save each page as a .txt or .md file. Name them plainly:

        sources/stripe/
            pricing.txt
            changelog.txt
            homepage-today.txt
            homepage-2024-archived.txt
            help-center-limits.txt
            latest-earnings.txt
            job-listings.txt

    Select-all and paste is fine. The filenames become labels in the prompt, so
    name them for what they are.

THE KEY NEVER GOES IN A FILE IN THIS REPO. It is read from the environment.
"""

import argparse
import os
import sys
from datetime import date
from pathlib import Path

HERE = Path(__file__).parent

MODEL = os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-4-5")

READABLE = {".txt", ".md", ".markdown", ".csv", ".json", ".html"}


def die(msg):
    print(f"\n  {msg}\n")
    sys.exit(1)


def load_sources(folder):
    files = sorted(p for p in Path(folder).rglob("*")
                   if p.is_file() and p.suffix.lower() in READABLE)
    if not files:
        die(f"No source files in {folder}.\n\n"
            "  This script will not write a tear sheet from the model's memory.\n"
            "  Save the pricing page, the changelog, the homepage and anything\n"
            "  else you found as .txt files in that folder, then run it again.\n\n"
            "  See the docstring at the top of this file for a suggested layout.")

    chunks, total = [], 0
    for f in files:
        try:
            body = f.read_text(errors="replace").strip()
        except OSError as e:
            print(f"  skipping {f.name}: {e}")
            continue
        if not body:
            continue
        total += len(body)
        chunks.append(f"===== SOURCE: {f.name} =====\n{body}")
    return files, chunks, total


def main():
    p = argparse.ArgumentParser(
        description="Build a tear sheet from research you have gathered.")
    p.add_argument("company", help="Company name, as it should appear")
    p.add_argument("sources", help="Folder of saved source files")
    p.add_argument("-o", "--out", help="Output file (default: <company>-tear-sheet.md)")
    p.add_argument("--yes", action="store_true", help="Skip the confirmation")
    args = p.parse_args()

    # Order matters. The sources check comes first because "I will not write
    # this from memory" is the design, and it should be the first thing you
    # hear whether or not you have a key installed yet.
    if not Path(args.sources).is_dir():
        die(f"{args.sources} isn't a folder. Make one and save your research "
            "into it as .txt files.\n\n"
            "  See the docstring at the top of this file for a suggested layout.")

    skill = (HERE / "SKILL.md").read_text()
    files, chunks, total = load_sources(args.sources)

    if not os.environ.get("ANTHROPIC_API_KEY"):
        die('No ANTHROPIC_API_KEY in your environment.\n\n'
            '    export ANTHROPIC_API_KEY="sk-ant-..."\n\n'
            "  Nothing has been spent.")

    try:
        import anthropic
    except ImportError:
        die("The anthropic package isn't installed.\n\n    pip install anthropic")

    out = Path(args.out or f"{args.company.lower().replace(' ', '-')}-tear-sheet.md")

    print(f"\n  Company:  {args.company}")
    print(f"  Sources:  {len(files)} files, about {total // 1000}k characters")
    for f in files:
        print(f"              {f.name}")
    print(f"  Model:    {MODEL}")
    print(f"  Output:   {out}")
    print("\n  One call. Larger than the review tools, so expect this one to "
          "cost more\n  than pennies. Check your console for real numbers.\n")

    if not args.yes and input("  Go ahead? [y/N] ").strip().lower() != "y":
        print("\n  Stopped. Nothing spent.\n")
        return

    prompt = (
        f"{skill}\n\n"
        "=====================================================\n"
        f"Build a competitor tear sheet for: {args.company}\n"
        f"Today's date: {date.today().isoformat()}\n\n"
        "Follow the instructions above. Two changes for this run:\n\n"
        "1. Output MARKDOWN, not docx. Skip Steps 3 and 4 entirely, and where "
        "a diagram is called for, describe the flow as a numbered list instead.\n"
        "2. The research is already done and appears below. Use ONLY what is "
        "in these sources. Do not add facts from memory. Where a section has no "
        "supporting source, drop the section and say so in a short "
        "'Not covered' list at the end.\n\n"
        "Cite the source filename after any figure, like (pricing.txt).\n\n"
        "=====================================================\n\n"
        + "\n\n".join(chunks)
    )

    client = anthropic.Anthropic()
    print("  Working...", end=" ", flush=True)
    msg = client.messages.create(
        model=MODEL, max_tokens=16000,
        messages=[{"role": "user", "content": prompt}])
    out.write_text(msg.content[0].text)
    print("done")

    print(f"\n  Wrote {out} ({out.stat().st_size // 1000}k)")
    print("\n  Read it before you trust it. Check that every number carries a "
          "source\n  filename, and read the 'Not covered' list at the end.")
    print("\n  Then run the same company's reviews through review-signal and "
          "read the\n  two together. This is the outside view; that one is what "
          "customers say.\n")


if __name__ == "__main__":
    main()
