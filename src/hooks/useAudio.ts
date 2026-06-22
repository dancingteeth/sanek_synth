import { useCallback, useEffect, useRef } from 'react';
import { audioEngine } from '@/lib/audioEngine';

export function useKeyboard() {
  const activeOscillators = useRef<Map<string, { osc: OscillatorNode; gain: GainNode }>>(new Map());

  const noteOn = useCallback(async (freq: number) => {
    await audioEngine.init();
    await audioEngine.resume();
    const ctx = audioEngine.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    gain.gain.value = 0.3;
    
    osc.connect(gain);
    gain.connect(audioEngine.getMasterGain());
    osc.start();
    
    const id = `keyboard_${Date.now()}`;
    activeOscillators.current.set(id, { osc, gain });
    return id;
  }, []);

  const noteOff = useCallback((id: string) => {
    const entry = activeOscillators.current.get(id);
    if (entry) {
      try {
        entry.gain.gain.setValueAtTime(0, audioEngine.getContext().currentTime);
        entry.osc.stop(audioEngine.getContext().currentTime + 0.05);
      } catch {}
      activeOscillators.current.delete(id);
    }
  }, []);

  const allNotesOff = useCallback(() => {
    activeOscillators.current.forEach((entry) => {
      try {
        entry.gain.gain.setValueAtTime(0, audioEngine.getContext().currentTime);
        entry.osc.stop(audioEngine.getContext().currentTime + 0.05);
      } catch {}
    });
    activeOscillators.current.clear();
  }, []);

  return { noteOn, noteOff, allNotesOff };
}

export function useMidi() {
  useEffect(() => {
    const handleMIDIMessage = (event: MIDIMessageEvent) => {
      const data = event.data;
      if (!data || data.length < 3) return;
      const status = data[0];
      const note = data[1];
      const velocity = data[2];
      const command = status >> 4;
      
      if (command === 9 && velocity > 0) {
        const freq = 440 * Math.pow(2, (note - 69) / 12);
        console.log('MIDI Note On:', note, freq.toFixed(2), 'Hz');
      } else if (command === 8 || (command === 9 && velocity === 0)) {
        console.log('MIDI Note Off:', note);
      }
    };

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then((midi) => {
        const inputs = Array.from(midi.inputs.values());
        inputs.forEach(input => {
          input.onmidimessage = handleMIDIMessage;
        });
        console.log(`MIDI: ${inputs.length} input(s) connected`);
      }).catch(console.warn);
    }
  }, []);
}
