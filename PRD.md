# Sanek Synth — Product Requirements Document (PRD)

## 1. Vision & Mission

**Sanek Synth** is a next-generation hybrid synthesizer that unifies subtractive, wavetable, FM, and modular synthesis in a single matrix-patched environment. It targets sound designers, electronic music producers, and experimental musicians who want both the immediacy of preset-driven workflows and the depth of modular patching.

**Mission:** Make advanced synthesis accessible, visually intuitive, and playful — without sacrificing pro-level sound design capabilities.

## 2. Target Audience

| Segment | Description |
|---------|-------------|
| **Electronic Producers** | House, techno, D&B producers who need fast sound design. |
| **Sound Designers** | Film, game, and media composers creating custom textures. |
| **Modular Enthusiasts** | Eurorack users who want a portable, affordable matrix. |
| **Mobile Creators** | Musicians who start ideas on phone and finish on desktop. |
| **Experimental Artists** | Glitch, ambient, and noise artists exploring random/ generative patches. |

## 3. Market Analysis

| Competitor | Strengths | Weaknesses | Gap Sanek Synth Fills |
|------------|-----------|------------|------------------------|
| Bitwig Grid | Modular grid, polyphony | Steep learning curve, desktop-only | Mobile-first, gamified onboarding |
| Arturia Pigments | Beautiful UI, hybrid synthesis | Preset-centric, limited patching | Deep matrix + random generation |
| Native Instruments FM8 | Legendary FM synthesis | Aging UI, no wavetable/modular | Modern FM + wavetable + matrix |
| Moog Model D | Classic analog modeling | Monophonic, limited modules | Polyphonic, unlimited modules |
| Audiotool | Browser-based, collaborative | Cloud-only, latency | Local-first, offline-capable |

## 4. Core Value Propositions

1. **Unified Module Ecosystem** — OSC, LFO, Filter, Wavetable, FM, Effects in one matrix.
2. **Dual Workflow** — Quick preset/random patch for speed; deep manual patching for control.
3. **Cross-Device Continuity** — Start on phone, finish on desktop (single project file).
4. **Generative Design Tools** — Categorized random patches (Neuro, Ambient, Drums, etc.).
5. **Sample-to-Synth** — Convert any audio sample into wavetable, FM carrier, or modulator.
6. **Studio-Grade Effects Rack** — Reverb, delay, chorus, distortion, dynamics inside the synth.

## 5. Product Pillars

### 5.1 Sound Engine
- Multi-engine: Analog-modeled OSC, Wavetable, FM (DX-style & custom), Sample-based.
- Unified modulation matrix with virtual cables.
- Polyphonic & paraphonic modes.
- Low-latency audio path (< 10ms on desktop, < 20ms on mobile).

### 5.2 Patching & Modulation
- Visual matrix grid (à la Bitwig) for signal routing.
- Automatic intelligent patching (suggested connections based on selected modules).
- Per-module random + global random for selected modules.
- Atone button: quick detune/dissonance for experimental sounds.

### 5.3 Random & Generative
- Categorized random engines:
  - **Neuro Bass** — distorted, mid-heavy, rhythmic.
  - **Ambient** — slow-evolution, reverb-heavy, pad-like.
  - **Drums** — transient-focused, pitchy, short-decay.
  - **Experimental** — atonal, glitchy, extreme modulation.
- Sketch mode: iterate on random patches before committing.

### 5.4 Sequencing & Performance
- Built-in tone scale editor (tonal & atonal modes).
- Step sequencer + arpeggiator.
- Keyboard (onscreen) with glide, aftertouch (velocity/ pressure simulation).

### 5.5 Effects & Processing
- Internal effects rack: Reverb, Delay, Chorus, Flanger, Phaser, Distortion, Compressor, EQ.
- Send/return or insert modes.
- Wet/Dry mix per effect.

### 5.6 Workflow & UX
- ADSR-first workflow: shape envelope, then choose source.
- Grouping system: combine multiple modules/operators into a single macro control.
- Preset browser with tags (Bass, Lead, Pad, FX, etc.).
- Undo/redo stack for all parameter changes and patching actions.

### 5.7 Cross-Platform
- **Desktop:** macOS, Windows, Linux (Tauri).
- **Mobile:** iOS, Android (Tauri mobile).
- **File format:** `.sanek` (JSON-based, versioned).
- Cloud sync optional (future phase).

## 6. Roadmap

### Phase 1 — Foundation (Months 1–3)
- Core audio engine (OSC, Filter, Amp, ADSR).
- Basic matrix patching UI.
- Preset save/load.
- Desktop build (Tauri).

### Phase 2 — Modulation & Random (Months 4–6)
- LFO, Envelope Follower, Random generators.
- Matrix cabling with virtual wires.
- Random patch engine (basic categories).
- Wavetable engine + sample import.

### Phase 3 — Advanced Synthesis (Months 7–9)
- FM synthesis (2–4 operators, grouping).
- Effects rack (reverb, delay, distortion).
- Mobile UI adaptation.
- Project file sync (local network / cloud).

### Phase 4 — Polish & Launch (Months 10–12)
- Performance optimization.
- Preset library & community sharing.
- In-app tutorials / gamified onboarding.
- Marketing site & launch.

## 7. Technical Constraints & Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Latency (desktop) | < 10ms round-trip |
| Latency (mobile) | < 20ms round-trip |
| Polyphony | Up to 32 voices |
| Project file size | < 5 MB per patch |
| Offline capability | 100% offline audio engine |
| Build size | < 50 MB desktop, < 80 MB mobile |

## 8. Success Metrics

- **Engagement:** > 60% of users create > 5 patches in first session.
- **Retention:** > 40% weekly active users at 30 days.
- **Performance:** 60 FPS UI, no audio dropouts during patching.
- **Community:** > 1,000 presets shared within 3 months of launch.
