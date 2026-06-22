# Sanek Synth

A next-generation hybrid synthesizer combining modular patching, wavetable, FM, and generative design in a cross-platform desktop and mobile app.

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Audio:** Web Audio API (AudioWorklet-ready)
- **Desktop:** Tauri (Rust)
- **Graph UI:** React Flow

## Getting Started

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
```

## Project Structure

```
src/
├── components/      # React UI components
├── hooks/           # Custom React hooks
├── lib/             # Audio engine, module definitions
├── stores/          # Zustand state management
├── types/           # TypeScript interfaces
└── main.tsx         # Entry point
```

## Phase 1 Goals

- [x] PRD & FRD documents
- [x] Project scaffolding
- [ ] Core audio engine (OSC, Filter, Amp, ADSR)
- [ ] Matrix patching UI
- [ ] Preset save/load
- [ ] Desktop build (Tauri)
