"""Synthesize SFX (public/sfx/*.wav) and the music bed (public/music.wav) with numpy.

Rules from the brief: 30 ms fade-in / 60 ms fade-out on every file; SFX peak ~ -14 dBFS
(quiet ticks/pops lower); impact is the only low-frequency hit; nothing louder than VO.
Music bed: 100 BPM, A minor, Am-F-C-G (2 bars each), sub kick, detuned-saw pad with
sidechain ducking, off-beat hats, filter opening over 8 s, risers into scenes 2 and 10,
clean hit + swell at the lockup, 1 s tail.
Timing constants come from src/timing.ts (scene 2 and scene 10 start frames, lockup).
"""
import os, re
import numpy as np
from scipy.io import wavfile
from scipy import signal

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
FPS = 30
rng = np.random.default_rng(7)  # deterministic: same noise every build


def db_to_lin(db):
    return 10 ** (db / 20)


def fades(x, fi=0.030, fo=0.060):
    n = len(x)
    a = min(int(fi * SR), n // 2)
    b = min(int(fo * SR), n // 2)
    env = np.ones(n)
    env[:a] *= np.linspace(0, 1, a)
    env[n - b:] *= np.linspace(1, 0, b)
    return x * env


def normalize_peak(x, dbfs):
    p = np.max(np.abs(x)) + 1e-12
    return x * (db_to_lin(dbfs) / p)


def write(path, x, dbfs=-14):
    x = fades(x)
    x = normalize_peak(x, dbfs)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    wavfile.write(path, SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))
    print(f"{os.path.relpath(path, ROOT)}: {len(x)/SR:.3f}s peak {20*np.log10(np.max(np.abs(x))+1e-12):.1f} dBFS")


def pink(n):
    w = rng.standard_normal(n)
    f = np.fft.rfft(w)
    freqs = np.fft.rfftfreq(n, 1 / SR)
    freqs[0] = freqs[1]
    f = f / np.sqrt(freqs)
    p = np.fft.irfft(f, n)
    return p / np.max(np.abs(p))


def sweep_onepole(x, f_start, f_end):
    """One-pole low-pass whose cutoff glides f_start -> f_end (chunked, smooth, no resonance)."""
    n = len(x)
    out = np.zeros(n)
    chunk = 64
    y = 0.0
    for s in range(0, n, chunk):
        e = min(n, s + chunk)
        t = (s + e) / 2 / n
        fc = f_start * (f_end / f_start) ** t          # log sweep
        a = np.exp(-2 * np.pi * fc / SR)
        seg = x[s:e]
        b_ = np.array([1 - a])
        a_ = np.array([1, -a])
        seg_out, zf = signal.lfilter(b_, a_, seg, zi=[a * y])
        out[s:e] = seg_out
        y = seg_out[-1]
    return out


def hann(n):
    return np.hanning(n)


# ---------- whoosh.wav 0.5 s
n = int(0.5 * SR)
x = pink(n)
x = sweep_onepole(x, 300, 2500)
x = x * hann(n)
x = x + 0.15 * x[::-1]          # reversed breath before the cut (R14)
write(os.path.join(ROOT, "public/sfx/whoosh.wav"), x, -14)

# ---------- impact.wav 0.6 s  (logo slam / crown drop / lockup only)
n = int(0.6 * SR)
t = np.arange(n) / SR
f = 45 + 35 * np.exp(-t / 0.08)                       # 80 -> 45 Hz glide
phase = 2 * np.pi * np.cumsum(f) / SR
body = np.sin(phase) * np.exp(-t / 0.22)
trans_len = int(0.020 * SR)
noise = np.zeros(n)
noise[:trans_len] = rng.standard_normal(trans_len) * np.exp(-np.arange(trans_len) / (0.006 * SR))
noise = signal.lfilter(*signal.butter(2, 1000, "low", fs=SR), noise)
x = body + 0.35 * noise
write(os.path.join(ROOT, "public/sfx/impact.wav"), x, -10)  # brief says -3; -10 keeps SFX under VO (deviation noted in README)

# ---------- tick.wav 15 ms (quiet)
n = int(0.015 * SR)
t = np.arange(n) / SR
x = np.sin(2 * np.pi * 2200 * t) * hann(n)
write(os.path.join(ROOT, "public/sfx/tick.wav"), x, -22)

# ---------- pop.wav 80 ms (quiet)
n = int(0.080 * SR)
t = np.arange(n) / SR
f = 700 * (520 / 700) ** (t / 0.08)
x = np.sin(2 * np.pi * np.cumsum(f) / SR) * hann(n)
write(os.path.join(ROOT, "public/sfx/pop.wav"), x, -18)

# ---------- shimmer.wav 0.8 s (gold/store only): three detuned high sines, slow fade
n = int(0.8 * SR)
t = np.arange(n) / SR
x = sum(np.sin(2 * np.pi * f0 * t) for f0 in (1568.0, 1574.6, 1561.4)) / 3
env = np.sin(np.pi * np.clip(t / 0.8, 0, 1)) ** 2
write(os.path.join(ROOT, "public/sfx/shimmer.wav"), x * env, -14)

# ---------- riser.wav 1.2 s: filtered noise 400 Hz -> 8 kHz (scenes 2 and 10 only)
n = int(1.2 * SR)
t = np.arange(n) / n
x = sweep_onepole(rng.standard_normal(n), 400, 8000)
env = np.clip(t, 0, 1) ** 2.2
write(os.path.join(ROOT, "public/sfx/riser.wav"), x * env, -14)


# ====================== MUSIC BED ======================
BPM = 100
BEAT = 60 / BPM
BAR = 4 * BEAT
DUR = 71.0                      # >= 70 s, includes 1 s tail
N = int(DUR * SR)
T = np.arange(N) / SR

# scene timing (seconds) from src/timing.ts
timing = open(os.path.join(ROOT, "src/timing.ts")).read()
scene_start = {int(a): int(b) for a, b in re.findall(r"\"id\": (\d+),\s*\"start\": (\d+)", timing)}
LOCKUP_FRAME = 1908  # hero "AustroClash" in scene 10 (src/timing.ts)
RISER_TARGETS = [scene_start[2] / FPS, scene_start[10] / FPS]
LOCKUP_T = LOCKUP_FRAME / FPS

music = np.zeros((N, 2))

# --- kick: sine 50 Hz (+ fast pitch drop), 120 ms, every beat
kick = np.zeros(N)
kick_env = np.zeros(N)
k = 0
while k * BEAT < DUR:
    t0 = k * BEAT
    i0 = int(t0 * SR)
    L = int(0.12 * SR)
    tt = np.arange(L) / SR
    fk = 50 + 60 * np.exp(-tt / 0.02)
    body = np.sin(2 * np.pi * np.cumsum(fk) / SR) * np.exp(-tt / 0.045)
    end = min(N, i0 + L)
    kick[i0:end] += body[: end - i0] * 0.9
    ke = np.exp(-np.arange(L) / (0.12 * SR))
    kick_env[i0:end] = np.maximum(kick_env[i0:end], ke[: end - i0])
    k += 1
duck = 1 - 0.55 * kick_env            # sidechain (R-audio: pad ducks per kick)

# --- chords (2 bars each), Am F C G
CHORDS = [
    [220.00, 261.63, 329.63],   # Am  (A3 C4 E4)
    [174.61, 220.00, 261.63],   # F   (F3 A3 C4)
    [130.81, 164.81, 196.00],   # C   (C3 E3 G3)
    [196.00, 246.94, 293.66],   # G   (G3 B3 D4)
]
CHORD_LEN = 2 * BAR

# --- pad: detuned saws, per-chord segments, with short crossfades
pad = np.zeros(N)
for seg in range(int(np.ceil(DUR / CHORD_LEN))):
    s0 = int(seg * CHORD_LEN * SR)
    s1 = min(N, int((seg + 1) * CHORD_LEN * SR))
    tt = np.arange(s1 - s0) / SR
    chord = CHORDS[seg % 4]
    acc = np.zeros(s1 - s0)
    for f0 in chord:
        for det in (-0.004, 0.0, 0.004):
            ph = np.cumsum(np.full(s1 - s0, f0 * (1 + det) / SR))
            acc += 2 * (ph % 1.0) - 1
    acc /= (3 * len(chord))
    fade = np.ones(s1 - s0)
    a = min(int(0.25 * SR), len(fade) // 2)
    fade[:a] = np.linspace(0, 1, a)
    fade[-a:] = np.linspace(1, 0, a)
    pad[s0:s1] = acc * fade

# filter: cutoff opens 300 -> 2200 Hz over the first 8 s, then eases to 1400 Hz (chunked one-pole)
pad_f = np.zeros(N)
chunk = 480
y = 0.0
for s in range(0, N, chunk):
    e = min(N, s + chunk)
    tm = (s / SR)
    if tm < 8:
        fc = 300 * (2200 / 300) ** (tm / 8)
    else:
        fc = 2200 * (1400 / 2200) ** min(1.0, (tm - 8) / 40)
    a = np.exp(-2 * np.pi * fc / SR)
    seg, _ = signal.lfilter([1 - a], [1, -a], pad[s:e], zi=[a * y])
    pad_f[s:e] = seg
    y = seg[-1]
pad_f = pad_f * 0.16 * duck

# --- swell layer at lockup: sustained Am, rising, then tail
swell = np.zeros(N)
sw0 = int(LOCKUP_T * SR)
if sw0 < N:
    tt = np.arange(N - sw0) / SR
    acc = np.zeros(N - sw0)
    for f0 in [220.0, 329.63, 440.0]:
        for det in (-0.003, 0.003):
            ph = np.cumsum(np.full(N - sw0, f0 * (1 + det) / SR))
            acc += 2 * (ph % 1.0) - 1
    acc /= 6
    env = np.clip(tt / 3.0, 0, 1) ** 1.5 * np.exp(-np.maximum(0, tt - 6.0) / 0.8)
    acc = signal.lfilter(*signal.butter(2, 1600, "low", fs=SR), acc)
    swell[sw0:] = acc * env * 0.22

# --- hats: soft noise off-beats, 20 ms, high-passed
hats = np.zeros(N)
hk = 0
while (hk + 0.5) * BEAT < DUR:
    i0 = int((hk + 0.5) * BEAT * SR)
    L = int(0.020 * SR)
    nz = rng.standard_normal(L) * np.exp(-np.arange(L) / (0.006 * SR))
    end = min(N, i0 + L)
    hats[i0:end] += nz[: end - i0] * 0.035
    hk += 1
hats = signal.lfilter(*signal.butter(2, 7000, "high", fs=SR), hats) * duck

# --- risers into scene 2 and scene 10 (riser.wav shape, 1.2 s ending at scene start)
riser = np.zeros(N)
rise_n = int(1.2 * SR)
rise_src = sweep_onepole(rng.standard_normal(rise_n), 400, 8000) * (np.linspace(0, 1, rise_n) ** 2.2)
for tgt in RISER_TARGETS:
    i0 = int((tgt - 1.2) * SR)
    if 0 <= i0 < N - rise_n:
        riser[i0:i0 + rise_n] += rise_src * 0.22

# --- clean hit at lockup: sub boom + short noise crack
hit = np.zeros(N)
hl = int(1.2 * SR)
if sw0 + hl < N:
    tt = np.arange(hl) / SR
    fh = 46 + 40 * np.exp(-tt / 0.05)
    hit[sw0:sw0 + hl] += np.sin(2 * np.pi * np.cumsum(fh) / SR) * np.exp(-tt / 0.35) * 0.9
    hit[sw0:sw0 + int(0.04 * SR)] += rng.standard_normal(int(0.04 * SR)) * 0.05

mix_l = kick + pad_f + swell + hats + riser + hit
# subtle stereo spread on the pad by delaying right channel slightly
mix_r = mix_l + 0.0
mix_r[: int(0.012 * SR)] = mix_r[: int(0.012 * SR)]
music = np.stack([mix_l, np.roll(mix_r, int(0.011 * SR))], axis=1)

# 1 s tail + final fade, peak -3 dBFS
tail = int(1.0 * SR)
music[-tail:] *= np.linspace(1, 0, tail)[:, None] ** 2
music = normalize_peak(music, -3)
wavfile.write(os.path.join(ROOT, "public/music.wav"), SR, (np.clip(music, -1, 1) * 32767).astype(np.int16))
print(f"public/music.wav: {DUR:.1f}s stereo, peak {20*np.log10(np.max(np.abs(music))):.1f} dBFS")
print("risers at", [round(x, 2) for x in RISER_TARGETS], "lockup hit at", round(LOCKUP_T, 2))
