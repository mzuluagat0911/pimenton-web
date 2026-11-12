"""Extrae el contenido ES de los posts publicados sin versión italiana a
motor/data/i18n/es/<slug>.json (fuente para traducir con publish-italian)."""
import html
import json
import re
from pathlib import Path

MOTOR = Path(__file__).resolve().parent.parent
PUBLIC = MOTOR.parent / "public"
OUT = MOTOR / "data" / "i18n" / "es"

LEAD_RE = re.compile(r'<div class="blog-visuals-lead" data-blog-visuals="lead">[\s\S]*?</div><!-- /blog-visuals-lead -->\n?')
MID_RE = re.compile(r'<figure class="blog-figure" data-blog-visuals="mid">[\s\S]*?</figure>\n?')


def one(pattern: str, text: str) -> str:
    m = re.search(pattern, text, re.S)
    return m.group(1) if m else ""


def extract(post: dict) -> dict:
    raw = (PUBLIC / f"{post['path'].lstrip('/')}.html").read_text("utf8")
    raw = MID_RE.sub("", LEAD_RE.sub("", raw))
    body = one(r'<p class="byline">.*?</p>\n(.*?)\s*<h2 id="faq">', raw)
    faq_html = one(r'<div class="faq">(.*?)</div>', raw)
    faq = [
        {"q": html.unescape(q), "a": html.unescape(a)}
        for q, a in re.findall(r"<summary>(.*?)</summary>\s*<p>(.*?)</p>", faq_html, re.S)
    ]
    keywords = html.unescape(one(r'<meta name="keywords" content="([^"]*)"', raw))
    return {
        "slug": post["slug"],
        "destino": post["destino"],
        "date": post["date"],
        "title": html.unescape(one(r"<title>(.*?)</title>", raw)),
        "headline": html.unescape(one(r"<h1>(.*?)</h1>", raw)),
        "meta_description": html.unescape(one(r'<meta name="description" content="([^"]*)"', raw)),
        "keywords": [k.strip() for k in keywords.split(",") if k.strip()],
        "eyebrow": html.unescape(one(r'<p class="eyebrow">(.*?)</p>', raw)),
        "byline": html.unescape(one(r'<p class="byline">(.*?)</p>', raw)),
        "answer_html": one(r'<p class="lead-answer">(.*?)</p>\n', raw),
        "body_html": body.strip("\n"),
        "faq": faq,
    }


state = json.loads((MOTOR / "data" / "state.json").read_text("utf8"))
for post in state["published"]:
    if post.get("pathIt"):
        continue
    data = extract(post)
    (OUT / f"{post['slug']}.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", "utf8")
    print(post["slug"], len(data["body_html"]), len(data["faq"]))
