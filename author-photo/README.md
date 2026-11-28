# Author photo: reading the book (AI-edited)

`out-author-reading-4x5.jpg` (1080×1350, Instagram 4:5).

- **Identity:** `refs/author-identity.png` (the author). **Pose/outfit/setting only:** `refs/pose-reference.jpg` (another person; no facial or body features taken).
- **Made with:** HeyGen GPT Image 2.6 (two references) → correction edit to match the author's real proportions → BytePlus 2× upscale (professional, non-generative) → real front cover fitted with `cover_swap.py` (perspective warp, fingers kept on top).
- Rejected: Nano Banana 2.1 version (face did not match).
- **Label:** this is an AI-edited photo of the author. Use Instagram's "AI info" label when posting.
- Known limit: the book's spine text is still AI-drawn and slightly garbled (thin, hard to read at normal size).

## v2 face correction (28 Nov)
Requested: chin did not match. Fix: gpt-image-2.6 edit of the final photo with both real photos as identity references and written corrections (short, soft, rounded chin; full soft jaw; warmer skin; softer hooded eyes; thinner higher brows; rounder nose tip; thinner upper / fuller lower lip; no contouring). Only the face and upper neck were transplanted back into the original photo (`face_transplant.py`, MediaPipe landmarks aligned on eyes/forehead), so pose, body, outfit, room and the real cover are unchanged.
- Output: `out-author-reading-4x5-v2.jpg` (1080×1350). Comparison: `compare-before-after.jpg`.
- Cost: 4 credits (one run wasted on a wrong landscape setting).
