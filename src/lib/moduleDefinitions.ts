export const MODULE_DEFINITIONS: Record<string, {
  type: string;
  name: string;
  category: string;
  inputs: { id: string; type: string; name: string }[];
  outputs: { id: string; type: string; name: string }[];
  defaults: Record<string, number | boolean | string>;
}> = {
  oscillator: {
    type: 'oscillator',
    name: 'Oscillator',
    category: 'source',
    inputs: [
      { id: 'pitch', type: 'cv', name: 'Pitch' },
      { id: 'fm', type: 'cv', name: 'FM' },
    ],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out' },
    ],
    defaults: {
      waveform: 'sawtooth',
      frequency: 440,
      detune: 0,
      gain: 0.5,
      unison: 1,
      unisonDetune: 10,
    },
  },
  wavetable: {
    type: 'wavetable',
    name: 'Wavetable',
    category: 'source',
    inputs: [
      { id: 'pitch', type: 'cv', name: 'Pitch' },
      { id: 'pos', type: 'cv', name: 'Position' },
    ],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out' },
    ],
    defaults: {
      position: 0,
      gain: 0.5,
    },
  },
  'fm-carrier': {
    type: 'fm-carrier',
    name: 'FM Carrier',
    category: 'source',
    inputs: [
      { id: 'mod', type: 'audio', name: 'Mod' },
      { id: 'pitch', type: 'cv', name: 'Pitch' },
    ],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out' },
    ],
    defaults: {
      frequency: 440,
      gain: 0.5,
      algorithm: 1,
    },
  },
  'fm-modulator': {
    type: 'fm-modulator',
    name: 'FM Modulator',
    category: 'source',
    inputs: [
      { id: 'pitch', type: 'cv', name: 'Pitch' },
    ],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out' },
    ],
    defaults: {
      frequency: 440,
      gain: 0.5,
      ratio: 1,
    },
  },
  filter: {
    type: 'filter',
    name: 'Filter',
    category: 'effect',
    inputs: [
      { id: 'in', type: 'audio', name: 'In' },
      { id: 'cutoff', type: 'cv', name: 'Cutoff' },
      { id: 'resonance', type: 'cv', name: 'Res' },
    ],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out' },
    ],
    defaults: {
      type: 'lowpass',
      cutoff: 2000,
      resonance: 1,
      drive: 0,
      envAmount: 0,
    },
  },
  lfo: {
    type: 'lfo',
    name: 'LFO',
    category: 'modulation',
    inputs: [],
    outputs: [
      { id: 'out', type: 'cv', name: 'Out' },
    ],
    defaults: {
      waveform: 'sine',
      rate: 1,
      amount: 0.5,
      delay: 0,
      fade: 0,
      sync: false,
    },
  },
  adsr: {
    type: 'adsr',
    name: 'ADSR',
    category: 'modulation',
    inputs: [
      { id: 'gate', type: 'gate', name: 'Gate' },
    ],
    outputs: [
      { id: 'out', type: 'cv', name: 'Out' },
    ],
    defaults: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.7,
      release: 0.3,
      delay: 0,
    },
  },
  random: {
    type: 'random',
    name: 'Random',
    category: 'modulation',
    inputs: [
      { id: 'trigger', type: 'trigger', name: 'Trig' },
    ],
    outputs: [
      { id: 'out', type: 'cv', name: 'Out' },
    ],
    defaults: {
      mode: 'unipolar',
      rate: 4,
      smooth: 0.5,
    },
  },
  mixer: {
    type: 'mixer',
    name: 'Mixer',
    category: 'utility',
    inputs: [
      { id: 'in1', type: 'audio', name: 'In 1' },
      { id: 'in2', type: 'audio', name: 'In 2' },
      { id: 'in3', type: 'audio', name: 'In 3' },
      { id: 'in4', type: 'audio', name: 'In 4' },
    ],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out' },
    ],
    defaults: {
      gain1: 0.5,
      gain2: 0.5,
      gain3: 0,
      gain4: 0,
      pan1: 0,
      pan2: 0,
    },
  },
  output: {
    type: 'output',
    name: 'Output',
    category: 'utility',
    inputs: [
      { id: 'in', type: 'audio', name: 'In' },
      { id: 'cv', type: 'cv', name: 'CV' },
    ],
    outputs: [],
    defaults: {
      volume: 0.8,
      pan: 0,
    },
  },
  reverb: {
    type: 'reverb',
    name: 'Reverb',
    category: 'effect',
    inputs: [
      { id: 'in', type: 'audio', name: 'In' },
    ],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out' },
    ],
    defaults: {
      decay: 2,
      damping: 0.5,
      mix: 0.3,
      preDelay: 0.01,
    },
  },
  delay: {
    type: 'delay',
    name: 'Delay',
    category: 'effect',
    inputs: [
      { id: 'in', type: 'audio', name: 'In' },
      { id: 'time', type: 'cv', name: 'Time' },
      { id: 'fb', type: 'cv', name: 'FB' },
    ],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out' },
    ],
    defaults: {
      time: 0.3,
      feedback: 0.4,
      mix: 0.3,
      sync: false,
    },
  },
  distortion: {
    type: 'distortion',
    name: 'Distortion',
    category: 'effect',
    inputs: [
      { id: 'in', type: 'audio', name: 'In' },
    ],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out' },
    ],
    defaults: {
      drive: 0.5,
      tone: 0.5,
      mix: 1,
    },
  },
  noise: {
    type: 'noise',
    name: 'Noise',
    category: 'source',
    inputs: [],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out' },
    ],
    defaults: {
      type: 'white',
      gain: 0.3,
    },
  },
  sample: {
    type: 'sample',
    name: 'Sample',
    category: 'source',
    inputs: [
      { id: 'pitch', type: 'cv', name: 'Pitch' },
    ],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out' },
    ],
    defaults: {
      loop: false,
      gain: 0.5,
      start: 0,
      end: 1,
    },
  },
};

export const RANDOM_CATEGORIES = [
  { id: 'neuro', name: 'Neuro Bass', color: '#ef4444' },
  { id: 'ambient', name: 'Ambient', color: '#3b82f6' },
  { id: 'drums', name: 'Drums', color: '#f59e0b' },
  { id: 'experimental', name: 'Experimental', color: '#8b5cf6' },
] as const;
