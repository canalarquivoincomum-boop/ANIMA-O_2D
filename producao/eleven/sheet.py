"""sheet.py DIR OUT.jpg t0 t1 step [cols] — folha de contato a partir de PNGs t*.png renderizados por render.js --times"""
import sys, glob, os
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]
fs = sorted(glob.glob(os.path.join(d, "t*.png")))
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 6
W = 288; H = 512
rows = (len(fs) + cols - 1) // cols
im = Image.new("RGB", (cols * W, rows * H), (20, 20, 20))
for i, f in enumerate(fs):
    a = Image.open(f).convert("RGB").resize((W, H))
    ImageDraw.Draw(a).text((6, 6), os.path.basename(f)[1:-4], fill=(255, 255, 0))
    im.paste(a, ((i % cols) * W, (i // cols) * H))
im.save(out, quality=82)
print(out, im.size)
