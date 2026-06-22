# Sanek Synth

A next-generation hybrid synthesizer combining modular patching, wavetable, FM, and generative design in a cross-platform desktop and mobile app.

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Audio:** Web Audio API (main thread, AudioWorklet planned)
- **Graph UI:** React Flow
- **Desktop:** Tauri (planned for Phase 1)

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
│   ├── ModuleNode.tsx
│   ├── ModulePanel.tsx
│   ├── Toolbar.tsx
│   └── Workspace.tsx
├── hooks/           # Custom React hooks
│   └── useAudio.ts
├── lib/             # Audio engine, module definitions
│   ├── audioEngine.ts
│   └── moduleDefinitions.ts
├── stores/          # Zustand state management
│   └── patchStore.ts
├── types/           # TypeScript interfaces
│   └── index.ts
└── main.tsx         # Entry point
```

## Current State (Phase 1)

- [x] PRD & FRD documents
- [x] Project scaffolding
- [x] Core audio engine skeleton (OSC, Filter, Amp, ADSR, Effects)
- [x] Matrix patching UI (React Flow)
- [x] Preset save/load (JSON export)
- [x] 16 module types defined
- [ ] Desktop build (Tauri)
- [ ] Full audio routing from patch graph
- [ ] MIDI support
- [ ] Wavetable import
