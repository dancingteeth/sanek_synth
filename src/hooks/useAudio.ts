import { useCallback } from 'react';
import { usePatchStore } from '@/stores/patchStore';
import { audioEngine } from '@/lib/audioEngine';

export function useKeyboard() {
  const noteOn = useCallback((freq: number) => {
    audioEngine.resume();
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
    return id;
  }, []);

  const noteOff = useCallback((id: string) => {
    // Note off would require tracking active oscillators in a real implementation
  }, []);

  return { noteOn, noteOff };
}

export function useMidi() {
  useEffect(() => {
    const handleMIDIMessage = (event: MIDIMessageEvent) => {
      const data = event.data;
      if (!data) return;
      const status = data[0];
      const note = data[1];
      const velocity = data[2];
      const command = status >> 4;
      
      if (command === 9 && velocity > 0) {
        const freq = 440 * Math.pow(2, (note - 69) / 12);
        console.log('MIDI Note On:', note, freq);
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
      });
    }
  }, []);
}
