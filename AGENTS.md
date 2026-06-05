# Drum Machine — Step Sequencer

## Overview
A browser-based drum machine step sequencer built with **Backbone.js**, **jQuery**, **Lodash**, **Tailwind CSS** (CDN), and the **Web Audio API**. All state is shareable via URL query parameter and persists mixer/EQ/FX settings to `localStorage`.

## Stack
- **Frontend**: Vanilla JS + Backbone.js views, jQuery, Lodash, Tailwind CSS
- **Audio**: Web Audio API (`AudioContext`, `GainNode`, `BiquadFilterNode`, `ConvolverNode`, `DelayNode`, `OscillatorNode`)
- **Storage**: `localStorage` for mixer volumes, EQ/FX settings, and user-saved presets; URL `?data=` parameter for full state sharing

## Architecture

### Core Modules (in `js/app.js`)

| Module | Purpose |
|---|---|
| **App** | Bootstraps all modules, wires dispatcher events, initializes default/persisted state |
| **Dispatcher** | Event bus via `Backbone.Events` |
| **SampleBank** | Loads & plays audio samples using `AudioContext`; manages per-channel `GainNode`s + master gain |
| **AudioFX** | Master FX chain: 3-band EQ (lowshelf/peaking/highshelf) + HPF + LPF + parallel reverb/chorus/delay |
| **Sequencer** | Core step sequencer loop; manages pattern playback, playhead, BPM timing, swing |
| **Transport** | Play/pause, tempo slider, steps control, clear, save/load presets, keyboard shortcuts (Space, arrow keys) |
| **Mixer** | Volume faders per channel + master, 3-band EQ, reverb/chorus/delay FX controls |
| **Modal** | Settings modal (sound pack, time signature, swing toggle) |
| **SoundTypes** | 6 sound packs: standard, powerful, monumental, smooth, minimalistic, energetic |
| **TimeSignature** | 4/4, 3/4, 5/4, 6/8 |
| **SwingRhythm** | Swing toggle |
| **PresetList** | 20 built-in presets (pop/rock, jazz, funk, disco, hip hop, heavy metal) |
| **Modal** | Settings modal open/close + dropdown behavior |

### Channels (8 instruments)
| ID | Display Name |
|---|---|
| `hihatfod` | Hi-hat (foot) |
| `sidetamlys` | Tom-tom |
| `gulvtam` | Floor tom |
| `ride` | Ride cymbal |
| `crash` | Crash cymbal |
| `hihat` | Hi-hat |
| `lilletromme` | Snare drum |
| `stortromme` | Bass drum |

### Note Values
- `0` = off, `1` = normal hit, `2` = accent/alternate (hi-hat open, tom deep, snare rimshot)

### Audio Routing Chain
```
Sample Sources → Per-Channel Gains → Master Gain → EQ Chain (Bass → Mid → Treble → HPF → LPF)
                                                    ├──→ Main Output (dry)
                                                    ├──→ Reverb (convolver, parallel send)
                                                    ├──→ Chorus (delay + LFO, parallel send)
                                                    └──→ Delay (feedback delay, parallel send)
```

### URL State Encoding
Full sequencer state is encoded in `?data=` param: `tempo-steps-swing-rhythm-sound-muted-sequence`
- Uses custom base-N encoding for steps (16 chars of a-p for normal hits, q-z extended for accents)
- `swing`: `y`/`n`
- `rhythm`: e.g. `44`, `34`, `54`, `68`
- `sound`: single letter (a=standard, b=powerful, etc.)
- `muted`: concatenated channel keys
- `sequence`: encoded pattern per channel

### localStorage Keys
- `drum_master_gain`, `drum_gain_{channel}` — mixer volumes
- `drum_eq_bass`, `drum_eq_mid`, `drum_eq_treble`, `drum_eq_hpf`, `drum_eq_lpf` — EQ settings
- `drum_fx_reverbMix`, `drum_fx_chorusRate`, `drum_fx_chorusDepth`, `drum_fx_chorusMix`, `drum_fx_delayTime`, `drum_fx_delayFeedback`, `drum_fx_delayMix` — FX settings
- `drum_saved_presets` — user-saved presets (JSON object)

### File Structure
```
├── index.html          # Entry point
├── js/app.js           # All application logic (~1958 lines)
├── css/style.css       # All styles (~764 lines)
├── audio/
│   ├── standard/       # Default sound pack
│   ├── powerful/
│   ├── monumental/
│   ├── smooth/
│   ├── minimalistic/
│   └── energetic/
└── AGENTS.md
```

### Keyboard Shortcuts
- **Space**: Play/pause toggle
- **Left/Right arrow**: Decrease/increase tempo by 1 BPM
