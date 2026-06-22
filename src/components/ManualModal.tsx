import { useState } from 'react';

export function ManualModal() {
  const [isOpen, setIsOpen] = useState(false);

  const manualContent = `# Sanek Synth Manual

## Overview
Sanek Synth is a modular synthesizer with patching, wavetable, FM, and generative capabilities.

## Getting Started
1. Add modules from the left panel
2. Click and drag between ports to connect them
3. Use the keyboard at the bottom to play notes
4. Adjust parameters by clicking on modules

## Module Types
- **Sources**: Oscillator, Wavetable, FM Carrier, FM Modulator, Noise, Sample
- **Effects**: Filter, Reverb, Delay, Distortion
- **Modulation**: LFO, ADSR, Random
- **Utility**: Mixer, Output

## Tips
- Right-click a module to remove it
- Use the MiniMap to navigate large patches
- Export your patch as a .sanek file to share`;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 bg-synth-border hover:bg-synth-border/80 rounded text-sm font-medium transition-colors"
      >
        Manual
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-synth-panel border border-synth-border rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-synth-border">
              <h2 className="text-lg font-semibold text-synth-text">Manual</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-synth-muted hover:text-synth-text text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-y-auto text-sm text-synth-text whitespace-pre-wrap font-mono">
              {manualContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}