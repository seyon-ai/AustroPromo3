"""Trim leading/trailing silence from each VO clip, then loudness-normalise.

Input : public/vo/raw/NN.mp3   (original TTS output, kept for reference)
Output: public/vo/NN.mp3       (trimmed, EBU R128 loudnorm I=-16 TP=-1.5 LRA=11)
Decoding/trimming uses numpy; loudnorm + MP3 encode use the bundled ffmpeg.
"""
import glob, os, subprocess, shutil
import numpy as np
from scipy.io import wavfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FFMPEG = os.environ.get("FFMPEG", "ffmpeg")
SR = 48000
THRESH = 10 ** (-45 / 20)  # -45 dBFS gate
PAD = 0.03                 # keep 30 ms of breath at each end


def decode(path):
    tmp = path.replace(".mp3", ".decode.wav")
    subprocess.run([FFMPEG, "-y", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), tmp], check=True)
    sr, data = wavfile.read(tmp)
    os.remove(tmp)
    if data.dtype == np.int16:
        return data.astype(np.float64) / 32768.0
    return data.astype(np.float64)


def trim(x):
    env = np.abs(x)
    # 10 ms moving max to be robust to zero crossings
    win = int(0.01 * SR)
    env = np.convolve(env, np.ones(win) / win, mode="same")
    idx = np.where(env > THRESH)[0]
    if len(idx) == 0:
        return x
    a = max(0, idx[0] - int(PAD * SR))
    b = min(len(x), idx[-1] + int(PAD * SR))
    return x[a:b]


os.makedirs(os.path.join(ROOT, "public", "vo", "raw"), exist_ok=True)
for src in sorted(glob.glob(os.path.join(ROOT, "public", "vo", "*.mp3"))):
    name = os.path.basename(src)
    raw = os.path.join(ROOT, "public", "vo", "raw", name)
    if not os.path.exists(raw):
        shutil.copy(src, raw)
    x = decode(raw)
    before = len(x) / SR
    y = trim(x)
    after = len(y) / SR
    tmp_wav = os.path.join(ROOT, "public", "vo", "raw", name.replace(".mp3", ".trim.wav"))
    wavfile.write(tmp_wav, SR, (y * 32767).astype(np.int16))
    dst = os.path.join(ROOT, "public", "vo", name)
    subprocess.run([FFMPEG, "-y", "-v", "error", "-i", tmp_wav,
                    "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
                    "-ar", "48000", "-ac", "1", "-b:a", "192k", dst], check=True)
    print(f"{name}: {before:.2f}s -> {after:.2f}s (trimmed {before-after:.2f}s)")
