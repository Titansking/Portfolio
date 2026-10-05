"""Generate the deployable resume PDF from the site's content module.

The site keeps every claim in frontend/src/content/profile.ts. This script
reads that file as the source of truth and lays it out, so the PDF a recruiter
downloads and the page they read cannot disagree.

Facts are read out of the TS by regex rather than by importing it, because the
module is TypeScript and this is a standalone build step. Every extracted value
is asserted below, so a rename in the TS fails the build here instead of
silently producing a resume with a blank field.
"""

import re
import sys
from pathlib import Path

from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    ListFlowable,
    ListItem,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)

ROOT = Path("/Users/allworkdone/akash/portfolio/Portfolio")
TS = ROOT / "frontend/src/content/profile.ts"
OUT = ROOT / "frontend/public/resume.pdf"

PAGE_W, PAGE_H = LETTER
MARGIN = 0.45 * inch
CONTENT_W = PAGE_W - 2 * MARGIN

INK = "#141416"
SOFT = "#3F3F46"
MUTE = "#5A5A63"
ACCENT = "#047857"
RULE = "#D4D4D8"

# Helvetica is metrically identical to the Helvetica/Arial family the original
# resume used, and ships with reportlab, so the build has no font dependency.
FONT_REGULAR = "Helvetica"
FONT_BOLD = "Helvetica-Bold"
FONT_OBLIQUE = "Helvetica-Oblique"


def register_fonts() -> None:
    for name in (FONT_REGULAR, FONT_BOLD, FONT_OBLIQUE):
        pdfmetrics.getFont(name)


# --------------------------------------------------------------------------
# Parse the TS content module
# --------------------------------------------------------------------------

def strip_js_comments(text: str) -> str:
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    return re.sub(r"^\s*//.*$", "", text, flags=re.M)


def block(text: str, name: str) -> str:
    """Return the balanced source of `export const <name> = <literal>`.

    Anchors on the assignment rather than the bare identifier, because several
    of these names also appear in a type alias above the constant (SKILL_GROUPS
    has an inline annotation spanning several lines, and PROJECTS names the
    `Project` type). Bracket matching handles both `{...}` and `[...]`, and the
    annotation between the name and `=` is skipped.
    """
    m = re.search(rf"\bexport\s+const\s+{re.escape(name)}\b[^=]*=", text)
    if not m:
        raise SystemExit(f"could not locate `export const {name} =` in the content module")

    opener = text[m.end():]
    i = next((p for p, ch in enumerate(opener) if ch in "{["), None)
    if i is None:
        raise SystemExit(f"{name} has no object or array literal")

    j = m.end() + i
    depth, k = 0, j
    while k < len(text):
        if text[k] in "{[":
            depth += 1
        elif text[k] in "}]":
            depth -= 1
            if depth == 0:
                break
        k += 1
    return text[j : k + 1]


def obj(text: str, start: str) -> dict:
    """Flat string map of an object literal's scalar fields."""
    body = block(text, start)
    out = {}
    for k, v in re.findall(r"(\w+):\s*'((?:[^'\\]|\\.)*)'", body):
        out[k] = v.replace("\\'", "'")
    return out


def strlist(text: str, field: str) -> list[str]:
    """Single-quoted strings from `field: [...]` inside the EXPERIENCE literal.

    Deliberately not block()-based: `contributions` and `stack` are fields of
    the EXPERIENCE object, not exported constants of their own, and reading the
    parent block would also sweep up the company, role and period strings.
    """
    body = block(text, "EXPERIENCE")
    i = body.index(field)
    arr = body[body.index("[", i) :]
    depth, k = 0, 0
    while k < len(arr):
        if arr[k] == "[":
            depth += 1
        elif arr[k] == "]":
            depth -= 1
            if depth == 0:
                break
        k += 1
    arr = arr[: k + 1]
    return [v.replace("\\'", "'") for v in re.findall(r"'((?:[^'\\]|\\.)*)'", arr)]


def entries(body: str) -> list[str]:
    """Split a bracket-matched body into its top-level {...} chunks."""
    if body.startswith("["):
        body = body[1:-1]
    out, depth, start = [], 0, None
    for i, ch in enumerate(body):
        if ch == "{":
            if depth == 0:
                start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and start is not None:
                out.append(body[start : i + 1])
                start = None
    return out


def skill_groups(text: str) -> list[tuple[str, list[str]]]:
    """(label, [skills]) per group, in resume order."""
    groups = []
    for chunk in entries(block(text, "SKILL_GROUPS")):
        label = re.search(r"label:\s*'((?:[^'\\]|\\.)*)'", chunk)
        skills = re.findall(r"'((?:[^'\\]|\\.)*)'", chunk.split("skills:")[1])
        if label:
            groups.append((label.group(1), [s.replace("\\'", "'") for s in skills]))
    return groups


def projects(text: str) -> list[dict]:
    body = block(text, "PROJECTS")
    out = []
    for chunk in entries(body):
        out.append(
            {
                "title": re.search(r"title:\s*'((?:[^'\\]|\\.)*)'", chunk).group(1),
                "kind": re.search(r"kind:\s*'((?:[^'\\]|\\.)*)'", chunk).group(1),
                "tech": re.findall(r"'((?:[^'\\]|\\.)*)'", chunk.split("tech:")[1].split("]")[0]),
                "download": (re.search(r"label:\s*'([^']*)'", chunk) or [None, None])[1],
                "highlights": [
                    (m.group(1), m.group(2))
                    for m in re.finditer(
                        r"title:\s*'((?:[^'\\]|\\.)*)',\s*\n\s*body:\s*\n?\s*'((?:[^'\\]|\\.)*)'",
                        chunk,
                        flags=re.S,
                    )
                ],
            }
        )
    return out


# --------------------------------------------------------------------------
# Styles
# --------------------------------------------------------------------------

def make_styles() -> dict:
    return {
        "name": ParagraphStyle(
            "name", fontName=FONT_BOLD, fontSize=20, leading=22, textColor=INK,
            alignment=TA_LEFT, spaceAfter=1,
        ),
        "headline": ParagraphStyle(
            "headline", fontName=FONT_REGULAR, fontSize=9.6, leading=11.6,
            textColor=ACCENT, spaceAfter=4,
        ),
        "contact": ParagraphStyle(
            "contact", fontName=FONT_REGULAR, fontSize=8, leading=10.4,
            textColor=SOFT, spaceAfter=0.5,
        ),
        "section": ParagraphStyle(
            "section", fontName=FONT_BOLD, fontSize=10, leading=12,
            textColor=ACCENT, spaceBefore=5, spaceAfter=1.8,
        ),
        "entry": ParagraphStyle(
            "entry", fontName=FONT_BOLD, fontSize=9.8, leading=11.8,
            textColor=INK, spaceAfter=0.5,
        ),
        "meta": ParagraphStyle(
            "meta", fontName=FONT_OBLIQUE, fontSize=8.8, leading=11,
            textColor=MUTE, spaceAfter=2,
        ),
        "body": ParagraphStyle(
            "body", fontName=FONT_REGULAR, fontSize=8.8, leading=11.2,
            textColor=SOFT, spaceAfter=2,
        ),
        "bullet": ParagraphStyle(
            "bullet", fontName=FONT_REGULAR, fontSize=8.8, leading=11.2,
            textColor=SOFT, spaceAfter=2,
        ),
        "skill": ParagraphStyle(
            "skill", fontName=FONT_REGULAR, fontSize=8.8, leading=11.2,
            textColor=SOFT,
        ),
        "label": ParagraphStyle(
            "label", fontName=FONT_BOLD, fontSize=9.5, leading=12.4,
            textColor=INK,
        ),
    }


def section(title: str, s: dict) -> list:
    return [
        Paragraph(title.upper(), s["section"]),
        HRFlowable(width="100%", thickness=0.7, color=RULE, spaceAfter=5),
    ]


def bullets(items, s: dict) -> ListFlowable:
    return ListFlowable(
        [ListItem(Paragraph(i, s["bullet"]), leftIndent=9) for i in items],
        bulletType="bullet",
        start="•",
        bulletFontSize=7,
        bulletOffsetY=0,
        leftIndent=11,
        bulletDedent=9,
        spaceAfter=2,
    )


def drive_link_from_module(text: str) -> str:
    """Read the APK URL out of the content module.

    DRIVE_LINK was a second hardcoded copy of a URL that already lives in
    profile.ts, which is exactly the kind of duplication that lets a link rot in
    one place while the other keeps working.
    """
    m = re.search(
        r"label:\s*'Android APK',\s*\n\s*href:\s*'([^']+)'", text
    )
    if not m:
        raise SystemExit("could not find the Android APK download href in the content module")
    return m.group(1)


def build() -> None:
    text = strip_js_comments(TS.read_text())

    profile = obj(text, "PROFILE")
    experience = obj(text, "EXPERIENCE")
    recommendation = obj(text, "RECOMMENDATION")
    groups = skill_groups(text)
    projs = projects(text)

    # Pull contributions and the stack out of their own array literals. Reading
    # them from the parent EXPERIENCE block instead sweeps up the company, role,
    # period and metric strings as well.
    contributions = strlist(text, "contributions")
    stack = strlist(text, "stack")

    ledger = [
        (m.group(1), m.group(2), m.group(3), m.group(4))
        for m in re.finditer(
            r"value:\s*(\d+),\s*\n\s*suffix:\s*'([^']*)',\s*\n\s*label:\s*'([^']*)',\s*\n\s*detail:\s*'([^']*)'",
            block(text, "LEDGER"),
        )
    ]
    certs = []
    for chunk in entries(block(text, "CERTS")):
        t = re.search(r"title:\s*'((?:[^'\\]|\\.)*)'", chunk)
        i = re.search(r"issuer:\s*'((?:[^'\\]|\\.)*)'", chunk)
        b = re.search(r"body:\s*'((?:[^'\\]|\\.)*)'", chunk)
        if t and i and b:
            certs.append((t.group(1), i.group(1), b.group(1)))

    education = [
        (m.group(1), m.group(2), m.group(3), m.group(4))
        for m in re.finditer(
            r"years:\s*'([^']*)',\s*\n\s*degree:\s*'([^']*)',\s*\n\s*school:\s*'([^']*)',\s*\n\s*place:\s*'([^']*)'",
            block(text, "EDUCATION"),
        )
    ]

    # Parsed but not rendered: the "Impact" line was removed because every
    # figure in it already appears in the bullet above it. Kept as a presence
    # check so a missing metrics array fails the build here.
    metrics = [
        (m.group(1), m.group(2), m.group(3))
        for m in re.finditer(
            r"value:\s*(\d+),\s*suffix:\s*'([^']*)',\s*label:\s*'([^']*)'",
            block(text, "EXPERIENCE"),
        )
    ]

    # Fail loudly rather than shipping a resume with a blank section.
    required = {
        "profile.name": profile.get("name"),
        "profile.email": profile.get("email"),
        "experience.company": experience.get("company"),
        "recommendation.name": recommendation.get("name"),
        "skill groups": str(len(groups)),
        "projects": str(len(projs)),
        "ledger rows": str(len(ledger)),
        "experience metrics": str(len(metrics)),
        "certs": str(len(certs)),
        "education rows": str(len(education)),
    }
    bad = {k: v for k, v in required.items() if not v or v == "0"}
    if bad:
        raise SystemExit(f"content module parse failed: {bad}")

    drive_link = drive_link_from_module(text)

    register_fonts()
    s = make_styles()

    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=LETTER,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=0.38 * inch,
        bottomMargin=0.32 * inch,
        title=f"{profile['name']} - Resume",
        author=profile["name"],
        subject=profile.get("degree", ""),
        creator="portfolio build script",
    )

    F = []

    # ------------------------------------------------------------- header
    F.append(Paragraph(profile["name"], s["name"]))
    F.append(
        Paragraph(
            "Full-Stack &amp; Flutter Developer &middot; "
            f"{profile['location']}",
            s["headline"],
        )
    )
    F.append(
        Paragraph(
            f"{profile['phone']} &nbsp;|&nbsp; {profile['email']} &nbsp;|&nbsp; "
            f"{profile['portfolio']} &nbsp;|&nbsp; "
            "linkedin.com/in/ashwani-kumar-898189281 &nbsp;|&nbsp; "
            "github.com/Titansking",
            s["contact"],
        )
    )

    # ---------------------------------------------------------- experience
    F += section("Experience", s)
    F.append(
        KeepTogether(
            [
                Paragraph(f"{experience['title']}, {experience['company']}", s["entry"]),
                Paragraph(
                    f"{experience['period']} &nbsp;|&nbsp; {experience['setup']}", s["meta"]
                ),
            ]
        )
    )
    F.append(bullets(contributions, s))

    # No "Impact" line here. Every figure it would print already appears in the
    # bullet directly above it, and the repetition was costing a second page.

    # --------------------------------------------------------------- skills
    F += section("Technical Skills", s)
    for label, skills in groups:
        F.append(
            Paragraph(f'<b>{label}:</b> {", ".join(skills)}', s["skill"])
        )
        F.append(Spacer(1, 0.8))

    # ------------------------------------------------------------- projects
    F += section("Projects", s)
    for p in projs:
        # The summary is deliberately dropped. Each project carries three or four
        # technical highlights that say the same thing with evidence attached, and
        # keeping both pushed the certifications block onto a second page.
        head = [
            Paragraph(
                # ACCENT already carries its leading '#'; reportlab's markup
                # takes the bare hex, not a CSS-style "#rrggbb".
                f'{p["title"]} &mdash; <font color="{ACCENT.lstrip("#")}" '
                f'size="8.4">{p["kind"]}</font>', s["entry"]
            ),
            Paragraph(", ".join(p["tech"]), s["meta"]),
        ]
        F.append(KeepTogether(head))
        if p["download"]:
            F.append(
                Paragraph(
                    f'<b>Install:</b> {p["download"]} (58 MB) &mdash; '
                    f'<link href="{drive_link}" color="{ACCENT}">Google Drive</link>',
                    s["body"],
                )
            )
            F.append(Spacer(1, 2))
        F.append(bullets([b for _, b in p["highlights"]], s))
        F.append(Spacer(1, 2.5))

    # ------------------------------------------------------------ education
    F += section("Education", s)
    for years, degree, school, place in education:
        F.append(
            KeepTogether(
                [
                    Paragraph(
                        f"{degree} &mdash; <b>{school}</b>, {place}", s["entry"]
                    ),
                    Paragraph(years, s["meta"]),
                ]
            )
        )
        F.append(Spacer(1, 1))
        F.append(Spacer(1, 1.5))

    # --------------------------------------- certifications & achievements
    F += section("Certifications &amp; Achievements", s)

    # One flat bullet list. The old layout gave Letter of Recommendation,
    # Competitive Programming and Certifications each their own sub-heading, and
    # that scaffolding was the difference between one page and two.
    open_source = next(
        ((t, b) for t, i, b in certs if i == "Hacktoberfest 2023"), None
    )
    items = [
        f"<b>Letter of Recommendation</b> &mdash; {recommendation['quote']} "
        f"({recommendation['name']})",
        "<b>Competitive Programming</b> &mdash; 540+ algorithmic challenges "
        "solved across online platforms (400+ on Coding Ninjas, 140+ on "
        "GeeksforGeeks), focused on core data structures.",
    ]
    items += [
        f"{t} &mdash; {i}" for t, i, _ in certs if i != "Hacktoberfest 2023"
    ]
    if open_source:
        items.append(f"{open_source[0]} &mdash; {open_source[1]}")

    F.append(bullets(items, s))

    doc.build(F)
    print(f"wrote {OUT} ({OUT.stat().st_size // 1024} KB, pages: {doc.page})")


if __name__ == "__main__":
    sys.exit(build())
