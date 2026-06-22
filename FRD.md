# Sanek Synth — Functional Requirements Document (FRD)

## 1. Audio Engine Requirements

### 1.1 Oscillators
- **FR-OSC-01:** System shall support at least 3 oscillator types:
  - Analog-modeled (saw, square, triangle, sine with shape morphing).
  - Wavetable (importable .wav, .snd, built-in tables).
  - FM carrier (accepts modulator input, supports DX7-style algorithms).
- **FR-OSC-02:** Each oscillator shall expose: Frequency (Hz / Note), Fine Tune (cents), Level (dB), Phase.
- **FR-OSC-03:** Oscillators shall support unison (2–16 voices) with detune and spread controls.
- **FR-OSC-04:** System shall allow sample-to-wavetable conversion (import audio file → extract cycle → wavetable).

### 1.2 Filters
- **FR-FLT-01:** Minimum 4 filter types: Low-pass, High-pass, Band-pass, Notch.
- **FR-FLT-02:** Each filter shall expose: Cutoff, Resonance, Drive, Envelope Amount.
- **FR-FLT-03:** Filter shall support 12/24 dB/oct slopes (where applicable).

### 1.3 Modulation
- **FR-MOD-01:** LFO module with waveforms: sine, triangle, saw, square, random (sample & hold).
- **FR-MOD-02:** LFO shall expose: Rate (Hz / Tempo Sync), Shape, Amount, Delay, Fade In.
- **FR-MOD-03:** ADSR envelope with Delay, Attack, Decay, Sustain, Release.
- **FR-MOD-04:** Random generator with modes: Unipolar, Bipolar, Triggered.
- **FR-MOD-05:** Matrix patching: any modulation source → any modulation destination via virtual cable.

### 1.4 Effects
- **FR-FX-01:** Built-in effects rack with minimum: Reverb, Delay, Chorus, Distortion, Compressor, EQ (3-band).
- **FR-FX-02:** Each effect shall support Insert or Send/Return routing.
- **FR-FX-03:** Dry/Wet mix control per effect.
- **FR-FX-04:** Effect parameters shall be modulatable via matrix.

### 1.5 Performance
- **FR-PERF-01:** Audio engine shall use Web Audio API with `AudioWorklet` for DSP.
- **FR-PERF-02:** Polyphony shall be configurable (1–32 voices).
- **FR-PERF-03:** System shall display CPU load and voice count in debug panel.
- **FR-PERF-04:** Audio shall resume automatically after OS suspension (mobile).

---

## 2. Matrix Patching System

### 2.1 Visual Matrix
- **FR-MAT-01:** Matrix UI shall display modules as nodes and connections as curved Bézier wires.
- **FR-MAT-02:** User shall drag from output jack to input jack to create connection.
- **FR-MAT-03:** Clicking a wire shall highlight it and expose Delete / Disconnect action.
- **FR-MAT-04:** Matrix shall support zoom and pan on desktop; pinch and drag on mobile.
- **FR-MAT-05:** Virtual wires shall animate signal flow (optional visual mode).

### 2.2 Intelligent Patching
- **FR-MAT-06:** Auto-patch mode: when user adds module, system suggests 2–3 logical connections.
- **FR-MAT-07:** One-click "Smart Init" patch: OSC → Filter → Amp with LFO → Filter Cutoff.
- **FR-MAT-08:** Module grouping: user can group 2+ modules into a single macro; group exposes summed/selected outputs.

### 2.3 Randomization
- **FR-RND-01:** Per-module random: when a single module is selected, randomize only its parameters.
- **FR-RND-02:** Global random: when multiple modules are selected, randomize all of them together.
- **FR-RND-03:** Categorized random patches:
  - **Neuro:** high resonance, mid-focused, rhythmic LFO, distortion.
  - **Ambient:** slow attack, long release, reverb send, detune.
  - **Drums:** short decay, pitch envelope, noise source, transient shaping.
  - **Experimental:** atonal scale, extreme modulation, feedback routing.
- **FR-RND-04:** Atone button: one-click detune from harmonic series (microtonal / atonal mode).

---

## 3. Sequencing & Performance

### 3.1 Keyboard
- **FR-KBD-01:** Onscreen piano keyboard (1–4 octaves, configurable).
- **FR-KBD-02:** Glide/Portamento control (time, amount).
- **FR-KBD-03:** Velocity sensitivity (mouse/touch pressure emulation).
- **FR-KBD-04:** Aftertouch simulation via continuous touch pressure (mobile) or mouse Y-axis (desktop).

### 3.2 Sequencer
- **FR-SEQ-01:** 16-step sequencer with per-step: pitch, velocity, gate length.
- **FR-SEQ-02:** Scale editor: user defines scale (tonal: major/minor/custom; atonal: free pitch).
- **FR-SEQ-03:** Arpeggiator with modes: up, down, random, chord memory.
- **FR-SEQ-04:** Tempo sync (internal clock or external MIDI clock input).

---

## 4. Preset & Project Management

### 4.1 Presets
- **FR-PRE-01:** Save patch as `.sanek` file (JSON + embedded samples base64 or external refs).
- **FR-PRE-02:** Preset metadata: Name, Author, Tags (Bass, Lead, Pad, FX, etc.), Description.
- **FR-PRE-03:** Preset browser with list/grid view, search, filter by tag.
- **FR-PRE-04:** Import/export presets via file system or share sheet (mobile).

### 4.2 Project Files
- **FR-PRJ-01:** `.sanek` project file stores: module graph, connections, all parameter values, sample references.
- **FR-PRJ-02:** Auto-save every 30 seconds + explicit save.
- **FR-PRJ-03:** Undo/redo stack (minimum 50 steps) for parameter changes and patching.

---

## 5. User Interface Requirements

### 5.1 Desktop (macOS / Windows / Linux)
- **FR-UI-01:** Native window with title bar, menu bar, keyboard shortcuts.
- **FR-UI-02:** Resizable, fullscreen support.
- **FR-UI-03:** Drag-and-drop audio file import.
- **FR-UI-04:** MIDI learn for external controllers.

### 5.2 Mobile (iOS / Android)
- **FR-UI-05:** Touch-optimized controls (minimum 44×44 px hit targets).
- **FR-UI-06:** Bottom navigation: Modules, Matrix, Presets, Settings.
- **FR-UI-07:** Pinch-to-zoom on matrix; swipe between module pages.
- **FR-UI-08:** Share extension to export `.sanek` files.

### 5.3 Visual Design
- **FR-UI-09:** Dark theme default; light theme optional.
- **FR-UI-10:** Module skins/themes (at least 3: Classic, Neon, Minimal).
- **FR-UI-11:** Real-time oscilloscope / spectrum analyzer (toggleable).

---

## 6. Data Model

### 6.1 Module Graph
```typescript
interface Module {
  id: string;
  type: ModuleType;
  position: { x: number; y: number };
  params: Record<string, number | boolean | string>;
  inputs: Port[];
  outputs: Port[];
}

interface Port {
  id: string;
  type: 'audio' | 'cv' | 'gate' | 'trigger';
  signalType: 'continuous' | 'discrete';
}

interface Connection {
  id: string;
  sourceModuleId: string;
  sourcePortId: string;
  targetModuleId: string;
  targetPortId: string;
}
```

### 6.2 Project File Schema
```typescript
interface SanekProject {
  version: string;
  name: string;
  author: string;
  created: string;
  modified: string;
  modules: Module[];
  connections: Connection[];
  settings: ProjectSettings;
  samples: SampleReference[];
}
```

---

## 7. User Stories & Acceptance Criteria

### US-001: Create a Basic Synth Patch
- **As a** new user,
- **I want** to create a simple synth patch in under 60 seconds,
- **So that** I can start making music immediately.
- **AC:** User opens app → taps "New Patch" → hears default init sound → tweaks cutoff and resonance.

### US-002: Matrix Patching
- **As a** sound designer,
- **I want** to visually connect modules with virtual cables,
- **So that** I can understand signal flow at a glance.
- **AC:** User adds LFO → drags from LFO output to Filter Cutoff input → moving LFO rate modulates filter.

### US-003: Random Patch Generation
- **As a** producer,
- **I want** to generate random patches by category,
- **So that** I can find inspiration quickly.
- **AC:** User selects "Neuro Bass" → taps Random → system generates bass patch with distortion and mid focus.

### US-004: Cross-Device Workflow
- **As a** mobile user,
- **I want** to start a patch on my phone and finish on desktop,
- **So that** I can use the best screen for each stage.
- **AC:** User saves `.sanek` file on phone → opens same file on desktop → all modules and connections restored.

### US-005: Sample-to-Synth
- **As an** experimental artist,
- **I want** to import a drum sample and turn it into a wavetable,
- **So that** I can build new sounds from found audio.
- **AC:** User imports `kick.wav` → selects "Extract Wavetable" → oscillator plays back pitched kick cycle.

### US-006: Effects Rack
- **As a** producer,
- **I want** to add reverb and delay inside the synth,
- **So that** I don't need a separate DAW for spatial effects.
- **AC:** User adds Reverb module → tweaks decay and mix → sends synth output through reverb.

### US-007: FM Synthesis
- **As a** retro synth enthusiast,
- **I want** to build FM patches with multiple operators,
- **So that** I can create classic electric piano and bell tones.
- **AC:** User adds 4 operators → patches modulator → carrier → adjusts algorithm → hears FM timbre.

### US-008: Grouping & Macro Controls
- **As a** live performer,
- **I want** to group multiple parameters into a single macro knob,
- **So that** I can tweak complex sounds with one hand.
- **AC:** User selects Filter Cutoff + Res + LFO Rate → groups into "Filter Macro" → single knob controls all three.

---

## 8. Technical Architecture (Summary)

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | React 18 + TypeScript | Component architecture, strong typing, ecosystem. |
| **Build Tool** | Vite | Fast HMR, optimized builds. |
| **Styling** | Tailwind CSS | Rapid UI development, responsive utilities. |
| **Desktop Runtime** | Tauri (Rust) | Small bundle size, native performance, secure. |
| **Mobile Runtime** | Tauri Mobile | Shared codebase with desktop. |
| **Audio Engine** | Web Audio API + AudioWorklet | Low-latency DSP, no backend required. |
| **State Management** | Zustand | Lightweight, perfect for patch graph state. |
| **Graph Rendering** | React Flow | Out-of-the-box node editor, zoom/pan, drag-and-drop. |
| **Serialization** | JSON + base64 (samples) | Human-readable, versioned, diff-friendly. |
| **Testing** | Vitest (unit) + Playwright (E2E) | Fast, integrated with Vite. |
| **CI/CD** | GitHub Actions | Automated builds for all platforms. |

---

## 9. Out of Scope (Phase 1)

- VST/AU plugin hosting (future: LV2 support via Rust).
- Collaborative real-time editing (future: WebRTC sync).
- AI-driven sound generation (future: local ONNX models).
- Hardware synth integration beyond MIDI (future: OSC, CV via USB).
