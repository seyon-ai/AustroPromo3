# AustroClash — Launch Film (Remotion)

A 67.8 s cinematic launch film for AustroClash, built with Remotion 4. Dark arena look, real-UI code replicas, a cloned voiceover, synthesized SFX, and a music bed.

- `AustroClashFilm` — 1920×1080, 30 fps, 2034 frames (67.8 s)
- `AustroClashFilmVertical` — 1080×1920 (see Director's notes: currently a fit-to-width letterbox, not yet a dedicated vertical layout)

## What's in here
- `src/Film.tsx` — sequencing, voiceover, music bed with ducking and final swell, global SFX cues
- `src/scenes/Scene01..10.tsx` — the ten scenes
- `src/components/` — logo, stage/camera/grain, effects, type reveals, particles, device frames, real-UI mockups (`UI.tsx`)
- `src/theme.ts` — palette, UI colours sampled from the product screenshot, `SITE_URL`
- `src/timing.ts` — generated scene timing and hero-word frames (`npm run build:timing`)
- `src/logoPaths.ts` — generated from `public/logo.png` by `scripts/make_logo.py`
- `scripts/` — `make_logo.py`, `make_sfx_music.py`, `process_vo.py`, `build-timing.mjs`
- `public/` — `logo.png`, `logo-white.png`, `vo/01..10.mp3`, `sfx/*.wav`, `music.wav`
- `previews/` — proof render and key stills (not used by the build)

## How I push it (GitHub Desktop)
1. Clone the repo in GitHub Desktop.
2. Copy the contents of this folder into the clone (overwrite).
3. Commit ("Add AustroClash launch film") and push to `main`.

## How renders trigger
- Push to `main` runs `.github/workflows/render.yml`, which renders both compositions.
- Manual: Actions → Render Film → Run workflow.

## Where the MP4 lands
GitHub → Actions → the run → **Artifacts** → `austroclash-film` (contains `AustroClashFilm.mp4` and `AustroClashFilmVertical.mp4`, kept 14 days).

## Changing VO lines and regenerating
1. Edit the line in `scripts/build-timing.mjs` (`SCENES`) and in the matching voiceover.
2. Replace `public/vo/NN.mp3` (or drop the new raw clip in `public/vo/raw/` and run `python3 scripts/process_vo.py` with `FFMPEG` pointing at a working ffmpeg).
3. Run `npm run build:timing` to regenerate `src/timing.ts`.
4. Hero-word frames are estimated proportionally from character position. Verify them against the render and nudge the hero words if they land early or late.

## Music
The current `public/music.wav` is a synthesized 71 s bed (100 BPM, A minor, Am–F–C–G, sub kick, detuned-saw pad with sidechain, off-beat hats, risers into scenes 2 and 10, a hit and swell at the lockup).

To use a custom track instead:
1. Export it as `public/music.mp3` (≥ 70 s).
2. In `src/Film.tsx`, change `staticFile("music.wav")` to `staticFile("music.mp3")`.
3. Set `MUSIC_GAIN = 0.14` in `src/Film.tsx`.

Suno prompt to generate a matching bed:

> Cinematic dark electronic trailer bed, 100 BPM, A minor, instrumental, no vocals. Deep sub bass pulse on every beat, sidechained analog pad, sparse glitchy hi-hats, slow filter sweep opening over the first 8 seconds, tension risers at 0:04 and 0:56, big clean hit and swell at 0:58, resolve and tail out by 1:08. Premium tech product launch — Apple keynote meets esports arena. Clean wide mix, no melodic hook that fights a voiceover, leave space in the 1–4 kHz range. 70 seconds.

## Changing SITE_URL
Edit `SITE_URL` in `src/theme.ts` (default `austroclash.com`).

## Local commands
- `npm ci`
- `npm run build:assets` (logo trace, SFX, music) — requires Python with numpy, scipy, scikit-image, Pillow
- `npm run build:timing`
- `npm run preview`
- `npm run render` / `npm run render:vertical`

## Director's notes (round 2)
1. **Vertical layouts.** 03, 04, 05 and 08 need dedicated stacked layouts. Right now the vertical composition is a fit-to-width letterbox of the landscape film, which is not acceptable as a final deliverable.
2. **Frame-accurate hero sync.** Derive word timestamps from the audio (forced alignment) instead of character-proportional estimates, then verify the visual leads by ~6 frames on every hero.
3. **Image plates.** Add up to two generated arena haze plates behind scenes 1 and 10 for more depth.
4. **Scene 06 cluster.** Add an orbit to the magnetic Squads cluster and clean up the centre "SQ" mark.
5. **Light-leak and shape-wipe transitions.** Add the chevron shape-wipe between scenes 3→4 and 7→8 and a light leak into scene 10; both are described in the brief but not yet built.
6. **Mix.** Tune SFX relative to the VO (currently the impact is at −10 dBFS, not −3, to stay under the VO), and re-check the final swell.
