import type { ModuleType, ModuleDefinition } from '@/types';

export const MODULE_DEFINITIONS: Record<ModuleType, ModuleDefinition> = {
  oscillator: {
    type: 'oscillator',
    name: 'Oscillator',
    category: 'source',
    inputs: [
      { id: 'pitch', type: 'cv', name: 'Pitch', direction: 'input' },
      { id: 'fm', type: 'cv', name: 'FM', direction: 'input' },
      { id: 'gate', type: 'gate', name: 'Gate', direction: 'input' },
    ],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out', direction: 'output' },
    ],
    defaults: {
      waveform: 'sawtooth',
      frequency: 440,
      detune: 0,
      gain: 0.5,
      unison: 1,
      unisonDetune: 10,
    },
    paramRanges: {
      frequency: { min: 20, max: 20000, step: 1 },
      detune: { min: -100, max: 100, step: 1 },
      gain: { min: 0, max: 1, step: 0.01 },
      unison: { min: 1, max: 16, step: 1 },
      unisonDetune: { min: 0, max: 100, step: 1 },
    },
  },
  wavetable: {
    type: 'wavetable',
    name: 'Wavetable',
    category: 'source',
    inputs: [
      { id: 'pitch', type: 'cv', name: 'Pitch', direction: 'input' },
      { id: 'pos', type: 'cv', name: 'Position', direction: 'input' },
    ],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out', direction: 'output' },
    ],
    defaults: {
      position: 0,
      gain: 0.5,
    },
    paramRanges: {
      position: { min: 0, max: 1, step: 0.01 },
      gain: { min: 0, max: 1, step: 0.01 },
    },
  },
  'fm-carrier': {
    type: 'fm-carrier',
    name: 'FM Carrier',
    category: 'source',
    inputs: [
      { id: 'mod', type: 'audio', name: 'Mod', direction: 'input' },
      { id: 'pitch', type: 'cv', name: 'Pitch', direction: 'input' },
    ],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out', direction: 'output' },
    ],
    defaults: {
      frequency: 440,
      gain: 0.5,
      algorithm: 1,
    },
    paramRanges: {
      frequency: { min: 20, max: 20000, step: 1 },
      gain: { min: 0, max: 1, step: 0.01 },
      algorithm: { min: 1, max: 8, step: 1 },
    },
  },
  'fm-modulator': {
    type: 'fm-modulator',
    name: 'FM Modulator',
    category: 'source',
    inputs: [
      { id: 'pitch', type: 'cv', name: 'Pitch', direction: 'input' },
    ],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out', direction: 'output' },
    ],
    defaults: {
      frequency: 440,
      gain: 0.5,
      ratio: 1,
    },
    paramRanges: {
      frequency: { min: 20, max: 20000, step: 1 },
      gain: { min: 0, max: 1, step: 0.01 },
      ratio: { min: 0.1, max: 16, step: 0.1 },
    },
  },
  filter: {
    type: 'filter',
    name: 'Filter',
    category: 'effect',
    inputs: [
      { id: 'in', type: 'audio', name: 'In', direction: 'input' },
      { id: 'cutoff', type: 'cv', name: 'Cutoff', direction: 'input' },
      { id: 'resonance', type: 'cv', name: 'Res', direction: 'input' },
    ],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out', direction: 'output' },
    ],
    defaults: {
      type: 'lowpass',
      cutoff: 2000,
      resonance: 1,
      drive: 0,
      envAmount: 0,
    },
    paramRanges: {
      cutoff: { min: 20, max: 20000, step: 1 },
      resonance: { min: 0, max: 30, step: 0.1 },
      drive: { min: 0, max: 1, step: 0.01 },
      envAmount: { min: -1, max: 1, step: 0.01 },
    },
  },
  lfo: {
    type: 'lfo',
    name: 'LFO',
    category: 'modulation',
    inputs: [],
    outputs: [
      { id: 'out', type: 'cv', name: 'Out', direction: 'output' },
    ],
    defaults: {
      waveform: 'sine',
      rate: 1,
      amount: 0.5,
      delay: 0,
      fade: 0,
      sync: false,
    },
    paramRanges: {
      rate: { min: 0.1, max: 20, step: 0.1 },
      amount: { min: 0, max: 1, step: 0.01 },
      delay: { min: 0, max: 5, step: 0.01 },
      fade: { min: 0, max: 5, step: 0.01 },
    },
  },
  adsr: {
    type: 'adsr',
    name: 'ADSR',
    category: 'modulation',
    inputs: [
      { id: 'gate', type: 'gate', name: 'Gate', direction: 'input' },
    ],
    outputs: [
      { id: 'out', type: 'cv', name: 'Out', direction: 'output' },
    ],
    defaults: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.7,
      release: 0.3,
      delay: 0,
    },
    paramRanges: {
      attack: { min: 0, max: 5, step: 0.01 },
      decay: { min: 0, max: 5, step: 0.01 },
      sustain: { min: 0, max: 1, step: 0.01 },
      release: { min: 0, max: 10, step: 0.01 },
      delay: { min: 0, max: 5, step: 0.01 },
    },
  },
  random: {
    type: 'random',
    name: 'Random',
    category: 'modulation',
    inputs: [
      { id: 'trigger', type: 'trigger', name: 'Trig', direction: 'input' },
    ],
    outputs: [
      { id: 'out', type: 'cv', name: 'Out', direction: 'output' },
    ],
    defaults: {
      mode: 'unipolar',
      rate: 4,
      smooth: 0.5,
    },
    paramRanges: {
      rate: { min: 0.1, max: 20, step: 0.1 },
      smooth: { min: 0, max: 1, step: 0.01 },
    },
  },
  mixer: {
    type: 'mixer',
    name: 'Mixer',
    category: 'utility',
    inputs: [
      { id: 'in1', type: 'audio', name: 'In 1', direction: 'input' },
      { id: 'in2', type: 'audio', name: 'In 2', direction: 'input' },
      { id: 'in3', type: 'audio', name: 'In 3', direction: 'input' },
      { id: 'in4', type: 'audio', name: 'In 4', direction: 'input' },
    ],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out', direction: 'output' },
    ],
    defaults: {
      gain1: 0.5,
      gain2: 0.5,
      gain3: 0,
      gain4: 0,
      pan1: 0,
      pan2: 0,
    },
    paramRanges: {
      gain1: { min: 0, max: 1, step: 0.01 },
      gain2: { min: 0, max: 1, step: 0.01 },
      gain3: { min: 0, max: 1, step: 0.01 },
      gain4: { min: 0, max: 1, step: 0.01 },
      pan1: { min: -1, max: 1, step: 0.01 },
      pan2: { min: -1, max: 1, step: 0.01 },
    },
  },
  output: {
    type: 'output',
    name: 'Output',
    category: 'utility',
    inputs: [
      { id: 'in', type: 'audio', name: 'In', direction: 'input' },
      { id: 'cv', type: 'cv', name: 'CV', direction: 'input' },
      { id: 'gate', type: 'gate', name: 'Gate', direction: 'input' },
    ],
    outputs: [],
    defaults: {
      volume: 0.8,
      pan: 0,
    },
    paramRanges: {
      volume: { min: 0, max: 1, step: 0.01 },
      pan: { min: -1, max: 1, step: 0.01 },
    },
  },
  reverb: {
    type: 'reverb',
    name: 'Reverb',
    category: 'effect',
    inputs: [
      { id: 'in', type: 'audio', name: 'In', direction: 'input' },
    ],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out', direction: 'output' },
    ],
    defaults: {
      decay: 2,
      damping: 0.5,
      mix: 0.3,
      preDelay: 0.01,
    },
    paramRanges: {
      decay: { min: 0.1, max: 10, step: 0.1 },
      damping: { min: 0, max: 1, step: 0.01 },
      mix: { min: 0, max: 1, step: 0.01 },
      preDelay: { min: 0, max: 0.5, step: 0.01 },
    },
  },
  delay: {
    type: 'delay',
    name: 'Delay',
    category: 'effect',
    inputs: [
      { id: 'in', type: 'audio', name: 'In', direction: 'input' },
      { id: 'time', type: 'cv', name: 'Time', direction: 'input' },
      { id: 'fb', type: 'cv', name: 'FB', direction: 'input' },
    ],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out', direction: 'output' },
    ],
    defaults: {
      time: 0.3,
      feedback: 0.4,
      mix: 0.3,
      sync: false,
    },
    paramRanges: {
      time: { min: 0, max: 2, step: 0.01 },
      feedback: { min: 0, max: 0.95, step: 0.01 },
      mix: { min: 0, max: 1, step: 0.01 },
    },
  },
  distortion: {
    type: 'distortion',
    name: 'Distortion',
    category: 'effect',
    inputs: [
      { id: 'in', type: 'audio', name: 'In', direction: 'input' },
    ],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out', direction: 'output' },
    ],
    defaults: {
      drive: 0.5,
      tone: 0.5,
      mix: 1,
    },
    paramRanges: {
      drive: { min: 0, max: 1, step: 0.01 },
      tone: { min: 0, max: 1, step: 0.01 },
      mix: { min: 0, max: 1, step: 0.01 },
    },
  },
  vca: {
    type: 'vca',
    name: 'VCA',
    category: 'utility',
    inputs: [
      { id: 'in', type: 'audio', name: 'In', direction: 'input' },
      { id: 'cv', type: 'cv', name: 'CV', direction: 'input' },
    ],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out', direction: 'output' },
    ],
    defaults: {
      gain: 1,
    },
    paramRanges: {
      gain: { min: 0, max: 1, step: 0.01 },
    },
  },
  noise: {
    type: 'noise',
    name: 'Noise',
    category: 'source',
    inputs: [],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out', direction: 'output' },
    ],
    defaults: {
      type: 'white',
      gain: 0.3,
    },
    paramRanges: {
      gain: { min: 0, max: 1, step: 0.01 },
    },
  },
  sample: {
    type: 'sample',
    name: 'Sample',
    category: 'source',
    inputs: [
      { id: 'pitch', type: 'cv', name: 'Pitch', direction: 'input' },
    ],
    outputs: [
      { id: 'out', type: 'audio', name: 'Out', direction: 'output' },
    ],
    defaults: {
      loop: false,
      gain: 0.5,
      start: 0,
      end: 1,
    },
    paramRanges: {
      gain: { min: 0, max: 1, step: 0.01 },
      start: { min: 0, max: 1, step: 0.01 },
      end: { min: 0, max: 1, step: 0.01 },
    },
  },
};

export const RANDOM_CATEGORIES = [
  { id: 'neuro', name: 'Neuro Bass', color: '#ef4444' },
  { id: 'ambient', name: 'Ambient', color: '#3b82f6' },
  { id: 'drums', name: 'Drums', color: '#f59e0b' },
  { id: 'experimental', name: 'Experimental', color: '#8b5cf6' },
] as const;
