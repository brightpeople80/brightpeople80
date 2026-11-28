"""Copy the corrected face from a generated image into the original photo.
Usage: python3 face_transplant.py BASE DONOR OUT MODEL"""
import sys, numpy as np, cv2, mediapipe as mp
from mediapipe.tasks.python import vision, BaseOptions
base_p, donor_p, out_p, model = sys.argv[1:5]
det = vision.FaceLandmarker.create_from_options(vision.FaceLandmarkerOptions(base_options=BaseOptions(model_asset_path=model), num_faces=1))
def lm(img):
    r = det.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(img, cv2.COLOR_BGR2RGB)))
    h, w = img.shape[:2]
    return np.array([[p.x*w, p.y*h] for p in r.face_landmarks[0]], np.float32)
B = cv2.imread(base_p); D = cv2.imread(donor_p)
lb, ld = lm(B), lm(D)
# similarity transform on stable points: eye corners, nose bridge, forehead (not the jaw, which we want to change)
idx = [33,133,362,263,168,6,10,151,9,8]
M,_ = cv2.estimateAffinePartial2D(ld[idx], lb[idx])
W = cv2.warpAffine(D, M, (B.shape[1], B.shape[0]), flags=cv2.INTER_LANCZOS4)
ldw = (np.c_[ld, np.ones(len(ld))] @ M.T).astype(np.float32)
# mask: union of donor face oval (warped) and base face oval, plus neck area under the chin
oval = [10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109]
mask = np.zeros(B.shape[:2], np.uint8)
cv2.fillPoly(mask, [ldw[oval].astype(np.int32)], 255)
cv2.fillPoly(mask, [lb[oval].astype(np.int32)], 255)
# neck: from jaw down, between jaw corners, to 0.45 face height below chin
fh = np.linalg.norm(lb[10]-lb[152]); chin = ldw[152]
l, r = ldw[172], ldw[397]
neck = np.array([l, r, [r[0]-0.05*fh, chin[1]+0.20*fh], [l[0]+0.05*fh, chin[1]+0.20*fh]], np.int32)
cv2.fillPoly(mask, [neck], 255)
k = int(fh*0.08)|1
mask = cv2.GaussianBlur(cv2.erode(mask, np.ones((5,5),np.uint8)), (k*2+1,k*2+1), 0)
# match colour of donor (which has the corrected warmer tone) is kept; light match of overall brightness only
a = mask[...,None]/255.0
out = (W*a + B*(1-a)).astype(np.uint8)
cv2.imwrite(out_p, out, [cv2.IMWRITE_JPEG_QUALITY, 95])
cv2.imwrite(out_p.replace('.jpg','-mask.png'), mask)
print('fh', fh, 'scale', np.sqrt(abs(np.linalg.det(M[:, :2]))))
