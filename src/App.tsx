import { useState, useCallback } from 'react';
import { Toolbar } from '@/components/Toolbar';
import { ModulePanel } from '@/components/ModulePanel';
import { Workspace } from '@/components/Workspace';
import { audioEngine } from '@/lib/audioEngine';
import { usePatchStore } from '@/stores/patchStore';

function Keyboard() {
  const modules = usePatchStore((s) => s.modules);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());

  const triggerGates = useCallback(() => {
    modules.forEach((m) => {
      if (m.type === 'adsr' || m.type === 'oscillator' || m.type === 'output') {
        audioEngine.triggerGate(m.id);
      }
    });
  }, [modules]);

  const releaseGates = useCallback(() => {
    modules.forEach((m) => {
      if (m.type === 'adsr' || m.type === 'oscillator' || m.type === 'output') {
        audioEngine.releaseGate(m.id);
      }
    });
  }, [modules]);

  const handleNoteStart = async () => {
    triggerGates();
  };

  const handleNoteEnd = () => {
    releaseGates();
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
                  onMouseDown={() => { handleNoteStart(); setActiveNotes(prev => new Set(prev).add(id)); }}
                  onMouseUp={() => { handleNoteEnd(); setActiveNotes(prev => { const next = new Set(prev); next.delete(id); return next; }); }}
                  onMouseLeave={() => { handleNoteEnd(); setActiveNotes(prev => { const next = new Set(prev); next.delete(id); return next; }); }}
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
                  onMouseDown={() => { handleNoteStart(); setActiveNotes(prev => new Set(prev).add(id)); }}
                  onMouseUp={() => { handleNoteEnd(); setActiveNotes(prev => { const next = new Set(prev); next.delete(id); return next; }); }}
                  onMouseLeave={() => { handleNoteEnd(); setActiveNotes(prev => { const next = new Set(prev); next.delete(id); return next; }); }}
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
  usePatchStore.getState().initPatch();

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