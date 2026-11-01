"""Generate public/og.png (1200x630). Re-run after changing the name or headline:

    python3 scripts/generate-og.py "Full Name" "Headline text"
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

W, H, PAD = 1200, 630, 80
BG, FG, MUTED, ACCENT = (12, 10, 9), (245, 245, 244), (168, 162, 158), (45, 212, 191)
FONT = "/System/Library/Fonts/HelveticaNeue.ttc"

img = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)
draw.rectangle((0, 0, 16, H), fill=ACCENT)

name_font = ImageFont.truetype(FONT, 84, index=1)  # bold
body_font = ImageFont.truetype(FONT, 38)
label_font = ImageFont.truetype(FONT, 28, index=1)

draw.text((PAD, 150), "PORTFOLIO", font=label_font, fill=ACCENT)
draw.text((PAD, 200), name, font=name_font, fill=FG)
y = 330
for line in textwrap.wrap(headline, width=50, break_on_hyphens=False):
    draw.text((PAD, y), line, font=body_font, fill=MUTED)
    y += 54

img.save("public/og.png", optimize=True)
