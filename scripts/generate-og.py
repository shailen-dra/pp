"""Generate public/og.png (1200x630) in the site's style. Re-run after changing the name or headline:

    python3 scripts/generate-og.py "Full Name" "Headline text"

Requires Pillow (with FreeType/WOFF2 support) and `npm install` for the font.
"""
import sys
import textwrap

from PIL import Image, ImageDraw, ImageFont

name = sys.argv[1] if len(sys.argv) > 1 else "Shailendra"
headline = (
    sys.argv[2]
    if len(sys.argv) > 2
    else "Front-end developer with 10+ years of experience, now shipping full-stack apps faster with AI-assisted development."
)

W, H, PAD = 1200, 630, 72
INK, FG, MUTED, ACCENT = (7, 11, 20), (238, 241, 246), (163, 175, 194), (96, 165, 250)
FONT = "node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wdth-normal.woff2"


def font(size, weight, width):
    f = ImageFont.truetype(FONT, size)
    f.set_variation_by_axes([weight, width])
    return f


img = Image.new("RGB", (W, H), INK)
draw = ImageDraw.Draw(img)

first, _, rest = name.upper().partition(" ")
display = font(150, 800, 75)
y = 70 if rest else 140
draw.text((PAD, y), first, font=display, fill=FG)
if rest:
    y += 132
    draw.text((PAD + 120, y), rest, font=display, fill=INK, stroke_width=3, stroke_fill=ACCENT)

body = font(34, 400, 100)
y = 400 if rest else 370
for line in textwrap.wrap(headline, width=58, break_on_hyphens=False):
    draw.text((PAD, y), line, font=body, fill=MUTED)
    y += 48

draw.rounded_rectangle((W - PAD - 64, PAD - 10, W - PAD, PAD + 54), radius=10, outline=ACCENT, width=3)
draw.text((W - PAD - 32, PAD + 22), name[:1].upper(), font=font(40, 800, 75), fill=ACCENT, anchor="mm")

img.save("public/og.png", optimize=True)
