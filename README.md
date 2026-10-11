# AustroClash — Launch Film (Remotion)

A ~67 s cinematic launch film for AustroClash, built in Remotion (React), with voiceover, SFX, a music bed, and real-UI mockups.

## What's in here
- `src/Root.tsx` — two compositions:
  - `AustroClashFilm` — 1920×1080 landscape, 30 fps, 1998 frames (66.6 s)
  - `AustroClashFilmVertical` — 1080×1920 vertical (placeholder: fit-to-width of the landscape cut)
- `src/scenes/Scene01–10.tsx` — the ten scenes
- `src/Film.tsx` — sequences, VO clips, music bed with ducking/swell, SFX cues, neutral chevron wipes
- `src/timing.ts` — generated timing (`npm run build:timing`); VO-driven, hero words land 6 frames before the spoken word
- `src/theme.ts` — colours, real-UI tokens, `SITE_URL = "austroclash.in"`
- `src/components/` — Stage (camera push, grain, vignette, light leak), Effects (flare, bloom, flash, chroma, Ghosts), Transitions (chevron wipe), Text (word reveal, wordmark light sweep), UI mockups
- `src/lib/motion.ts` — frame-driven helpers and spring presets (`UI_SPRING`, `HERO_SPRING`)
- `public/vo/01–10.mp3` — processed voiceover (chosen voice, trimmed, loudnorm I=-16 TP=-1.5 LRA=11)
- `public/sfx/*.wav`, `public/music.mp3` — SFX and music bed
- `scripts/` — logo trace, VO processing, timing builder, SFX/music synthesis

## Render settings and triggers
Rendering is done on GitHub Actions (`.github/workflows/render.yml`); the MP4 is uploaded as an artifact.

- **Push to `main`** → 1080p landscape (`--scale=1`, crf 17, yuv420p). Fast preview.
- **Manual run (workflow_dispatch)** with inputs:
  - `scale`: `1` (1080p) or `2` (4K, 3840×2160). 4K is dispatch-only.
  - `vertical`: `true` to also render the 1080×1920 cut at the chosen scale (4K vertical = 2160×3840).
  - `composition`: defaults to `AustroClashFilm`.
- The workflow timeout is 300 minutes. Concurrency is 2.

4K uses Remotion's `--scale=2` on the 1920×1080 composition. The layout is unchanged; only the output is doubled.

Local equivalents:
- `npm run render` — 1080p landscape
- `npm run render:4k` — 4K landscape (`--scale=2`)
- `npm run render:vertical` — vertical 1080×1920
- `npm run render:proof` — quick proof (`--scale=0.5 --crf=28 --concurrency=1`, 960×540)

## Where the MP4 lands
`out/` in the repo locally. In Actions, download the artifact named `austroclash-film-<scale>x` from the run page.

## Changing VO lines and regenerating
1. Edit the line in the scene's VO list and regenerate the raw clip into `public/vo/raw/NN.mp3`.
2. `python3 scripts/process_vo.py` (gate, trim leading and trailing silence, loudnorm I=-16 TP=-1.5 LRA=11). Set `FFMPEG` to the bundled binary if it is not on PATH.
3. `npm run build:timing` — regenerates `src/timing.ts`. Scene lengths and hero frames update automatically.
4. Re-run `python3 scripts/make_sfx_music.py` so the music bed and the lockup hit follow the new timing. Then encode `public/music.mp3` (192 kbps).

## Music
The current `public/music.mp3` is a synthesized 71 s bed (100 BPM, A minor, Am–F–C–G, sub kick, detuned-saw pad with sidechain, off-beat hats, risers into scenes 2 and 10, a hit and swell at the lockup). The music gain in `src/Film.tsx` is `MUSIC_GAIN = 0.16`, ducking to 0.09 under VO, and swelling to 0.32 in the final 3 s.

To use a custom track instead:
1. Export it as `public/music.mp3` (≥ 70 s, 192 kbps recommended).
2. Replace the file (keep the name), or point `staticFile("music.mp3")` in `src/Film.tsx` at your new file.
3. Set `MUSIC_GAIN = 0.14` in `src/Film.tsx` if your track is hotter than the synthesized bed.

Suno prompt to generate a matching bed:

> Cinematic dark electronic trailer bed, 100 BPM, A minor, instrumental, no vocals. Deep sub bass pulse on every beat, sidechained analog pad, sparse glitchy hi-hats, slow filter sweep opening over the first 8 seconds, tension risers at 0:04 and 0:56, big clean hit and swell at 0:58, resolve and tail out by 1:08. Premium tech product launch — Apple keynote meets esports arena. Clean wide mix, no melodic hook that fights a voiceover, leave space in the 1–4 kHz range. 70 seconds.

## Changing SITE_URL
Edit `SITE_URL` in `src/theme.ts` (default `austroclash.in`, displayed without a scheme; the link is https://austroclash.in/).

## Local commands
- `npm ci`
- `npm run build:assets` (logo trace, SFX, music) — requires Python with numpy, scipy, scikit-image, Pillow
- `npm run build:timing`
- `npm run preview`
- `npm run render` / `npm run render:4k` / `npm run render:vertical` / `npm run render:proof`

## Director's notes (round 3)
- **Voice.** Re-auditioned; the chosen voice is a masculine, trailer-style read with fast attack, read as an event opener rather than a narrator. All ten lines were regenerated using periods and em-dashes, no commas, for sharper delivery. Silence trimmed, loudness normalized.
- **Timing.** The film is now 66.6 s, with a 1 s resolved hold after each VO line. Each hero word lands 6 frames before it is spoken.
- **Motion.** UI entrances use an overdamped spring (damping 200). Hero words, the logo slam, the King badge, and the lockup use a bouncier preset (damping 14, stiffness 120, mass 0.8). Every interpolate has an easing curve. Freeze frames (8 f) sit on the logo slam, the crown drop, and the final AustroClash.
- **Ghost frames.** Two trailing copies at −1 f (30%) and −2 f (15%) on the King badge drop and the two slam words in scene 10.
- **Camera and texture.** The camera pushes 1.00 → 1.04 linearly across every scene. Background blur 6 px. Grain 4%. Vignette 40%. Light leak 8%.
- **Transitions.** Neutral chevron wipes into scenes 3, 5, 7, and 9. Gold stays in scenes 4, 5, and 10 only; violet stays in scene 8 only.
- **Cool elements.** Seeded gold particle burst on the crown (72 particles), text-as-mask light sweep on the wordmark, rack focus on the Arena tile, lifted King row, scan-line on AI Referee.
- **Product facts.** Only the listed features appear. Placeholder people only: Arjun K., Mira S., Dev P. Vote numbers in mockups are illustrative.

## Known gaps
- The vertical cut is still a letterboxed fit-to-width placeholder. Scenes 03, 04, 05, and 08 need vertical layouts.
- Scene 09 has a blank frame near 1586.
- Hero-word forced alignment is approximate; hits follow the TTS timing.
- Image plates for scenes 01 and 10 are not in yet.
- Scene 06 orbit cleanup is pending.
