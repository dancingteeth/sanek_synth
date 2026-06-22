export type ModuleType =
  | 'oscillator'
  | 'wavetable'
  | 'fm-carrier'
  | 'fm-modulator'
  | 'filter'
  | 'lfo'
  | 'adsr'
  | 'random'
  | 'mixer'
  | 'vca'
  | 'output'
  | 'reverb'
  | 'delay'
  | 'distortion'
  | 'noise'
  | 'sample';

export type PortType = 'audio' | 'cv' | 'gate' | 'trigger';

export interface Port {
  id: string;
  type: PortType;
  name: string;
  direction: 'input' | 'output';
}

export interface ModuleParams {
  [key: string]: number | boolean | string;
}

export interface Module {
  id: string;
  type: ModuleType;
  name: string;
  position: { x: number; y: number };
  params: ModuleParams;
  inputs: Port[];
  outputs: Port[];
}

export interface Connection {
  id: string;
  sourceModuleId: string;
  sourcePortId: string;
  targetModuleId: string;
  targetPortId: string;
}

export interface ProjectSettings {
  polyphony: number;
  sampleRate: number;
  theme: 'dark' | 'light';
  autoSave: boolean;
  masterVolume: number;
}

export interface SampleReference {
  id: string;
  name: string;
  path: string;
  data?: string;
  duration: number;
}

export interface SanekProject {
  version: string;
  name: string;
  author: string;
  created: string;
  modified: string;
  modules: Module[];
  connections: Connection[];
  settings: ProjectSettings;
  samples: SampleReference[];
}

export interface ModuleDefinition {
  type: ModuleType;
  name: string;
  category: 'source' | 'effect' | 'modulation' | 'utility';
  inputs: (Omit<Port, 'id'> & { id?: string })[];
  outputs: (Omit<Port, 'id'> & { id?: string })[];
  defaults: ModuleParams;
  paramRanges?: Record<string, { min: number; max: number; step?: number }>;
}
