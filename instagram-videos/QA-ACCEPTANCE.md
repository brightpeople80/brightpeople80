# Quality assurance and acceptance

**Role (from 28 November 2026):** no new concepts and no new scripts. The job is to take the existing videos (E01–E15) and raise each one to the gold standard (`GOLD-STANDARD.md`, benchmark video **01 · Museum of Unfinished Dreams**). An improved video keeps its own story, script and scenes; it gains what the gold standard has and it lacks.

## 1. Gates (automatic fail, whatever the score)
| Gate | Rule |
|---|---|
| **G1 Facts** | Title, author, Kindle £3.99 pre-order, paperback £9.99 **coming soon**, out 23 January 2027, website address. No hardcover. No paperback release date. |
| **G2 Honesty** | No invented reviews, results, sales, awards or quotes; the quiz is "self-reflection", not a test. |
| **G3 Format** | Instagram videos are 1080×1920 (9:16), H.264 + AAC, captions inside the safe zone. |

## 2. Scorecard (14 criteria, 0–2 each, maximum 28)
**0** = missing · **1** = partly there · **2** = meets the gold standard

| # | Criterion | 2 points means |
|---|---|---|
| F1 | Hook and audience recognition | First 3 s names a feeling or moment the target reader owns; the hook is not on the retired list |
| F2 | AIDA | Attention, Interest, Desire and Action all present, in order |
| F3 | Purchase motivation | Self-recognition **and** relief **and** a reason to act now (price or date) |
| F4 | Competitive differentiation | Shows what the book *does* (SELECT, 30-day programme, tools), not just names it |
| F5 | One clear CTA | A single action ("tap the link in my bio") leading to one place |
| F6 | Brand facts | All facts present and correct (see G1) |
| F7 | Measurable objective | A brief with numeric targets, a time window and where it is measured |
| P1 | Author's voice | Narrated in the "Belinda" voice clone |
| P2 | Clean audio and captions | Voice only (no music under speech), captions for every line |
| P3 | Book presence | Book on screen throughout **and** a special-effect entrance |
| P4 | Offer | Kindle £3.99, paperback £9.99 coming soon and 23 January 2027, spoken and on screen |
| P5 | Website | A specific free reason to visit, with the address on screen |
| P6 | Length and format | 45–65 s, 9:16 |
| P7 | Visual production quality | Cinematic, consistent 3D animation at the level of 01 (added 28 Nov after review of E14) |

## 3. Acceptance categories
| Category | Rule | What happens |
|---|---|---|
| **A · Accept** | ≥ 85% (24+ of 28) and all gates passed, **and the automated QA (`tools/qa_check.py`) passes** | Ready to post |
| **B · Improve** | 65–84% (19–23) | Keep script and visuals; add the missing gold-standard elements |
| **C · Rework** | 45–64% (13–18), or any gate failed | Keep the story and best lines and scenes; rebuild the delivery (voice, facts, offer, website) |
| **D · Retire** | < 45%, or a duplicate of a better video | Do not post; reuse its best parts inside other videos |

## 4. Results (28 November 2026)
Scored from each video's script, build files and six sampled frames.

| Video | F1 | F2 | F3 | F4 | F5 | F6 | F7 | P1 | P2 | P3 | P4 | P5 | P6 | Score | Gates | Category |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **01 Museum** | 2 | 2 | 2 | 1 | 1 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | **24 (92%)** | ✅ | **A · Accept** (bio link must open the website) |
| E14 Author promo | 2 | 2 | 1 | 2 | 1 | 2 | 0 | 2 | 1 | 2 | 1 | 1 | 2 | **19 (73%)** | ✅ | **B · Improve** |
| ~~E14 Author promo (upgraded), first build~~ | | | | | | | | | | | | | | ~~25 (96%)~~ | ❌ G3 | **Withdrawn:** scored without a documented check; captions failed the safe zone |
| E15 Announcement | 2 | 2 | 1 | 1 | 2 | 2 | 0 | 2 | 2 | 2 | 1 | 1 | 1 | **19 (73%)** | ✅ | **B · Improve** |
| E03 30-second ad | 1 | 2 | 2 | 2 | 1 | 0 | 0 | 0 | 1 | 2 | 2 | 0 | 1 | 14 (54%) | ❌ G1 | **C · Rework** |
| E04 Maya | 2 | 1 | 1 | 2 | 2 | 1 | 0 | 0 | 1 | 1 | 0 | 2 | 1 | 14 (54%) | ✅ | **C · Rework** |
| E05 Chapter 3 | 2 | 2 | 1 | 2 | 1 | 0 | 0 | 0 | 1 | 1 | 1 | 1 | 1 | 13 (50%) | ❌ G1 | **C · Rework** |
| E02 Trailer v2 | 2 | 2 | 1 | 1 | 1 | 1 | 0 | 0 | 1 | 2 | 1 | 0 | 1 | 13 (50%) | ✅ | **C · Rework** |
| E06 Meet the author | 1 | 2 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 2 | 1 | 1 | 2 | 13 (50%) | ❌ G1 | **C · Rework** |
| E10 Chapter 6 | 2 | 2 | 1 | 2 | 1 | 0 | 0 | 0 | 1 | 1 | 0 | 1 | 1 | 12 (46%) | ❌ G1 | **C · Rework** |
| E11 Chapter 1 | 2 | 2 | 1 | 2 | 1 | 0 | 0 | 0 | 1 | 1 | 0 | 1 | 1 | 12 (46%) | ❌ G1 | **C · Rework** |
| E12 Chapter 5 | 2 | 2 | 1 | 2 | 1 | 0 | 0 | 0 | 1 | 1 | 0 | 1 | 1 | 12 (46%) | ❌ G1 | **C · Rework** (male voice) |
| E07 Meet the author 3D | — | | | | | | | | | | | | | duplicate of E06 | ❌ G1 | **D · Retire** (merge best scenes into E06) |
| E01 Trailer v1 | — | | | | | | | | | | | | | superseded by E02 | ✅ | **D · Retire** (merge into E02) |
| E09 Notes ad | 1 | 1 | 0 | 1 | 1 | 0 | 0 | 0 | 1 | 1 | 0 | 1 | 0 | 7 (27%) | ❌ G1 | **D · Retire** (reuse the sticky-note tower) |
| E08 3D tangle ad | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 2 | 0 | 0 | 0 | 4 (15%) | ✅ | **D · Retire** as a post; **reuse as an alternative book-entrance effect** |
| E13 16:9 Amazon ad | n/a | | | | | | | | | | | | | not an Instagram format | ❌ G1, G3 | Out of scope: fix the facts for its Amazon use |

## 5. Fact errors to fix first (G1)
| Video | Error |
|---|---|
| E05, E06, E07, E09, E10, E11, E12, E13 | End card says "Paperback £9.99 · Out 23 January 2027" and "Hardcover · Coming soon". Should be: Paperback £9.99 · Coming soon; no hardcover. |
| E03 | Spoken: "Paperback, nine ninety-nine. Out January the twenty-third." Paperback is coming soon. |

## 6. Improvement plan (existing material only)
The same upgrade kit applies to each video. It reuses the gold standard's structure, not its words.
1. **Re-voice the existing script** in the "Belinda" clone (same words, except fact corrections).
2. **Remove music** under speech; captions for every line.
3. **Correct the end card** (G1).
4. **Add the book badge** during the story and a **book entrance** (E08's tangle-to-arrow can serve as a second entrance style, so 01's gold flash is not repeated).
5. **Speak the offer**: Kindle £3.99 pre-order, paperback £9.99 coming soon, 23 January 2027.
6. **Website close** with the address on screen, using website content the video does not already cover.
7. **Attach a brief** with measurable targets (F7) and pass the eight-point test.

| Order | Video | Main upgrades |
|---|---|---|
| 1 | E14 Author promo | Remove music; speak the price; add the website close and a link-in-bio CTA |
| 2 | E15 Announcement | Speak the prices and paperback status; add the website close; extend to 45 s+ |
| 3 | E10, E11, E05, E12 (chapter series) | Re-voice in Belinda's voice (E12 is currently male); fix the end cards; add badge, entrance, offer and website |
| 4 | E04 Maya | Re-voice; add the offer and the book entrance |
| 5 | E02 Trailer (+ best of E01) | Re-voice; retire the "You're not lazy" line as the hook by opening on its second line; add the offer and website |
| 6 | E03 30-second ad | Correct the spoken paperback line; re-voice; replace the retired hook the same way |
| 7 | E06 Meet the author (+ best of E07) | Re-voice; fix the end card; single CTA |

## 7. QA log

### 28 Nov 2026 · E14 Author promo (upgraded)
**Method:** `tools/qa_check.py` + frame review every 2.5 s + caption-zone overlay.
| Finding | Evidence | Fix | Status |
|---|---|---|---|
| G3: original captions at 1,488–1,580 px (below 1,440) | caption scan | Original 0–57 s scaled to 82%, lifted, blurred fill | ✅ lowest text now 1,404 px |
| G3: new ending captions/address down to 1,516 px | caption scan | Ending captions raised to 1,232 px, phone and cards made smaller | ✅ |
| P3: no book on screen 2.5–39 s | frame review | Book badge 4.3–39.8 s | ✅ |
| Caption style changes at 57 s (small → large gold) | frame review | None yet | ⚠️ minor |
| 1.2 s silence at 45.3 s (in original) | silencedetect | None | ⚠️ minor |
| P6 length 72 s | duration | None (would cut original lines) | ⚠️ |
| **P7: 3D animation weak compared with 01** (sticky notes, white tangle, text on a plain floor) | author review | Rebuild the middle scenes (4.9–45 s) as cinematic 3D, keeping script, voice and intro | ⏸ **On hold until HeyGen credits reset on 26 Dec 2026** (32 credits left) |

**Score (safe-zone build):** F1 2 · F2 2 · F3 2 · F4 2 · F5 2 · F6 2 · F7 2 · P1 2 · P2 2 · P3 2 · P4 2 · P5 2 · P6 1 · P7 0 = **25/28 (89%)**, but **P7 = 0 blocks acceptance** → **B · Improve, on hold**. File: `heygen-promo/upgrade/out/e14-author-promo-qa-9x16.mp4`.

### 28 Nov 2026 · 01 Museum of Unfinished Dreams (gold standard)
| Finding | Evidence | Fix | Status |
|---|---|---|---|
| G3: end card button and "Amazon UK · link in bio" below 1,440 px (35–41 s) | frame review | Cover smaller and higher, text block moved to 960 px | ✅ fixed 28 Nov |
| G3: finale "Pre-order your copy today" and "link in bio" below 1,440 px (55–56 s) | frame review | Cards, button and line raised 60–70 px | ✅ fixed 28 Nov |
| G3: website captions and address below 1,440 px (58–64 s) | caption scan | Phone shortened, captions at 1,248 px, address at 1,390 px | ✅ fixed 28 Nov (scan 31 s–end: lowest text 1,428 px) |
| 2.5 s dead air at 40.8–43.3 s | silencedetect | End-card hold 12 s → 10.3 s, then 0.5 s crossfade | ✅ fixed (no silence > 1.5 s) |
| Dip to dark at 43.0 s (fade-in from black) | brightness per frame | 0.5 s crossfade into the finale | ✅ fixed (darkest frame 43.6, was 16) |
| Bright scenery flagged at 9.0 s | frame review | None (false alarm) | ✅ |

**Fixed 28 Nov (scheduled task, 14:00):** `museum-reel/v2/compose-v4.sh` → `instagram-videos/01-museum-of-unfinished-dreams/museum-of-unfinished-dreams-final-9x16.mp4` (61.9 s). Story, scenes, voice and wording unchanged. qa_check: format ✅ loudness ✅ length ✅ black ✅ silence ✅; safe zone ✅ for all text (its only flag, 1,792 px at 9.0 s, is the candle and cushions in the scenery, a known false alarm of the white-pixel scan).
**Score:** F1 2 · F2 2 · F3 2 · F4 1 · F5 1 · F6 2 · F7 2 · P1 2 · P2 2 · P3 2 · P4 2 · P5 2 · P6 2 · P7 2 = **26/28 (93%) → A · Accept** (F5 depends on the bio link opening the website, which it now does).
