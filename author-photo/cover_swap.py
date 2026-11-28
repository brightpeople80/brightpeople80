"""Fit the real front cover onto the AI-generated book (perspective warp), keep the fingers on top."""
import numpy as np
from PIL import Image, ImageFilter
import sys
src = Image.open(sys.argv[1]).convert('RGB')
cover = Image.open(sys.argv[2]).convert('RGB')
quad = [tuple(map(float, p.split(','))) for p in sys.argv[3:7]]  # TL TR BR BL in photo pixels
out_path = sys.argv[7]
W, H = cover.size
def coeffs(dst, srcpts):
    A = []; B = []
    for (x, y), (u, v) in zip(dst, srcpts):
        A.append([x, y, 1, 0, 0, 0, -u*x, -u*y]); B.append(u)
        A.append([0, 0, 0, x, y, 1, -v*x, -v*y]); B.append(v)
    return np.linalg.solve(np.array(A), np.array(B)).tolist()
c = coeffs(quad, [(0, 0), (W, 0), (W, H), (0, H)])
warped = cover.transform(src.size, Image.PERSPECTIVE, c, Image.BICUBIC)
mask = Image.new('L', (W, H), 255).transform(src.size, Image.PERSPECTIVE, c, Image.BICUBIC)
mask = mask.filter(ImageFilter.GaussianBlur(0.8))
# match the photo's softness and tone
warped = warped.filter(ImageFilter.GaussianBlur(0.5))
a = np.asarray(src).astype(np.float32); w = np.asarray(warped).astype(np.float32)
m = np.asarray(mask).astype(np.float32) / 255.0
# keep skin (fingers) from the original photo where it overlaps the cover
R, G, B = a[..., 0], a[..., 1], a[..., 2]
yy = np.arange(a.shape[0])[:, None] * np.ones((1, a.shape[1]))
xx = np.ones((a.shape[0], 1)) * np.arange(a.shape[1])[None, :]
hand_zone = (yy > float(sys.argv[8])) if len(sys.argv) > 8 else np.ones(R.shape, bool)
if len(sys.argv) > 9:
    hand_zone &= xx < float(sys.argv[9])   # fingers only sit at the left of the cover
skin = (R > 70) & (R - G > 25) & (G - B > 5) & (G - B < 60) & hand_zone   # brown skin; excludes yellow/gold print
skin_m = Image.fromarray((skin * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
s = np.asarray(skin_m).astype(np.float32) / 255.0
m = m * (1 - s)
# light falloff from the original cover area so the new cover sits in the same light
lum = (0.299 * R + 0.587 * G + 0.114 * B)
blend = w * 0.96 + 4
res = a * (1 - m[..., None]) + blend * m[..., None]
Image.fromarray(np.clip(res, 0, 255).astype(np.uint8)).save(out_path)
print('saved', out_path)
