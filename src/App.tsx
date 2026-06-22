import { useRef, useState, useCallback, useEffect } from 'react';
import { Toolbar } from '@/components/Toolbar';
import { ModulePanel } from '@/components/ModulePanel';
import { Workspace } from '@/components/Workspace';
import { audioEngine } from '@/lib/audioEngine';
import { usePatchStore } from '@/stores/patchStore';

function Keyboard() {
  const modules = usePatchStore((s) => s.modules);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const activeOscillators = useRef<Map<string, { osc: OscillatorNode; gain: GainNode }>>(new Map());

  const getFrequency = (octave: number, noteIndex: number) => {
    const midiNote = (octave + 1) * 12 + noteIndex;
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  };

  const triggerPatchGates = useCallback(async () => {
    await audioEngine.init();
    await audioEngine.resume();
    modules.forEach((m) => {
      try {
        audioEngine.triggerGate(m.id);
      } catch {}
    });
  }, [modules]);

  const releasePatchGates = useCallback(() => {
    modules.forEach((m) => {
      try {
        audioEngine.releaseGate(m.id);
      } catch {}
    });
  }, [modules]);

  const handleNoteStart = async (octave: number, noteIndex: number) => {
    const id = `${octave}_${noteIndex}`;
    const freq = getFrequency(octave, noteIndex);

    // Trigger patched modules
    await triggerPatchGates();

    // Also play test oscillator for immediate feedback
    try {
      const ctx = audioEngine.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      gain.gain.value = 0.2;
      osc.connect(gain);
      gain.connect(audioEngine.getMasterGain());
      osc.start();
      activeOscillators.current.set(id, { osc, gain });
    } catch {}

    setActiveNotes(prev => new Set(prev).add(id));
  };

  const handleNoteEnd = (id: string) => {
    // Release patched modules
    releasePatchGates();

    // Stop test oscillator
    const entry = activeOscillators.current.get(id);
    if (entry) {
      try {
        entry.osc.stop();
        entry.gain.disconnect();
      } catch {}
      activeOscillators.current.delete(id);
    }

    setActiveNotes(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const whiteNotes = [0, 2, 4, 5, 7, 9, 11];
  const blackNotes = [1, 3, 6, 8, 10];
  const octaves = [3, 4, 5];

  return (
    <div className="h-32 bg-synth-panel border-t border-synth-border flex items-center justify-center px-4">
      <div className="flex relative h-full">
        {octaves.map((octave) => (
          <div key={octave} className="flex relative">
            {whiteNotes.map((noteIndex) => {
              const id = `${octave}_${noteIndex}`;
              const isActive = activeNotes.has(id);
              return (
                <button
                  key={id}
                  onMouseDown={() => handleNoteStart(octave, noteIndex)}
                  onMouseUp={() => handleNoteEnd(id)}
                  onMouseLeave={() => handleNoteEnd(id)}
                  className={`w-8 h-full border border-synth-border rounded-b mx-px transition-colors ${isActive ? 'bg-synth-accent' : 'bg-white hover:bg-gray-200'}`}
                />
              );
            })}
            {blackNotes.map((noteIndex) => {
              const id = `${octave}_${noteIndex}`;
              const isActive = activeNotes.has(id);
              const leftOffset = { 1: 24, 3: 56, 6: 120, 8: 152, 10: 184 }[noteIndex] || 0;
              return (
                <button
                  key={id}
                  onMouseDown={() => handleNoteStart(octave, noteIndex)}
                  onMouseUp={() => handleNoteEnd(id)}
                  onMouseLeave={() => handleNoteEnd(id)}
                  className={`absolute w-5 h-2/3 bg-gray-800 rounded-b border border-synth-border z-10 transition-colors ${isActive ? 'bg-synth-accent' : 'hover:bg-gray-700'}`}
                  style={{ left: `${leftOffset}px` }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    usePatchStore.getState().initPatch();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-synth-bg">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <ModulePanel />
        <Workspace />
      </div>
      <Keyboard />
    </div>
  );
}

export default App;