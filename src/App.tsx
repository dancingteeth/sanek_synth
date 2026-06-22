import { useRef, useState } from 'react';
import { Toolbar } from '@/components/Toolbar';
import { ModulePanel } from '@/components/ModulePanel';
import { Workspace } from '@/components/Workspace';
import { useKeyboard } from '@/hooks/useAudio';
import { usePatchStore } from '@/stores/patchStore';
import { audioEngine } from '@/lib/audioEngine';

function Keyboard() {
  const { noteOn, noteOff } = useKeyboard();
  const modules = usePatchStore((s) => s.modules);
  const activeRef = useRef<Map<string, string>>(new Map());
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());

  const getFrequency = (octave: number, noteIndex: number) => {
    const midiNote = (octave + 1) * 12 + noteIndex;
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  };

  const triggerADSRs = () => {
    modules.forEach((m) => {
      if (m.type === 'adsr') {
        audioEngine.triggerADSR(m.id);
      }
    });
  };

  const releaseADSRs = () => {
    modules.forEach((m) => {
      if (m.type === 'adsr') {
        audioEngine.releaseADSR(m.id);
      }
    });
  };

  const handleNoteStart = async (octave: number, noteIndex: number) => {
    const id = `${octave}_${noteIndex}`;
    const freq = getFrequency(octave, noteIndex);
    const noteId = await noteOn(freq);
    triggerADSRs();
    activeRef.current.set(id, noteId);
    setActiveNotes(prev => new Set(prev).add(id));
  };

  const handleNoteEnd = (id: string) => {
    const noteId = activeRef.current.get(id);
    if (noteId) {
      noteOff(noteId);
      activeRef.current.delete(id);
    }
    releaseADSRs();
    setActiveNotes(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const whiteNotes = [0, 2, 4, 5, 7, 9, 11];
  const blackNotes = [1, 3, 6, 8, 10];

  return (
    <div className="h-32 bg-synth-panel border-t border-synth-border flex items-center justify-center px-4">
      <div className="flex relative h-full">
        {[3, 4, 5].map((octave) => (
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
                  className={`w-8 h-full border border-synth-border rounded-b mx-px transition-colors ${
                    isActive ? 'bg-synth-accent' : 'bg-white hover:bg-gray-200'
                  }`}
                />
              );
            })}
            {blackNotes.map((noteIndex) => {
              const id = `${octave}_${noteIndex}`;
              const isActive = activeNotes.has(id);
              const leftOffset = {
                1: 24,
                3: 56,
                6: 120,
                8: 152,
                10: 184,
              }[noteIndex] || 0;
              return (
                <button
                  key={id}
                  onMouseDown={() => handleNoteStart(octave, noteIndex)}
                  onMouseUp={() => handleNoteEnd(id)}
                  onMouseLeave={() => handleNoteEnd(id)}
                  className={`absolute w-5 h-2/3 bg-gray-800 rounded-b border border-synth-border z-10 transition-colors ${
                    isActive ? 'bg-synth-accent' : 'hover:bg-gray-700'
                  }`}
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
  useKeyboard();

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
