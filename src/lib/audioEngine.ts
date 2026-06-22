export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private analyser: AnalyserNode | null = null;
  private moduleNodes: Map<string, AudioNode> = new Map();
  private isInitialized = false;

  async init() {
    if (this.isInitialized) return;
    
    this.ctx = new AudioContext({ sampleRate: 44100 });
    this.masterGain = this.ctx.createGain();
    this.compressor = this.ctx.createDynamicsCompressor();
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 2048;

    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    this.isInitialized = true;
  }

  getContext() {
    if (!this.ctx) throw new Error('AudioEngine not initialized');
    return this.ctx;
  }

  getMasterGain() {
    if (!this.masterGain) throw new Error('AudioEngine not initialized');
    return this.masterGain;
  }

  getAnalyser() {
    if (!this.analyser) throw new Error('AudioEngine not initialized');
    return this.analyser;
  }

  async resume() {
    if (this.ctx?.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  createModuleNode(moduleId: string, type: string): AudioNode {
    const ctx = this.getContext();
    let node: AudioNode;

    switch (type) {
      case 'oscillator':
      case 'wavetable':
      case 'fm-carrier':
      case 'fm-modulator':
      case 'noise':
      case 'sample':
        node = ctx.createOscillator();
        break;
      case 'filter':
        node = ctx.createBiquadFilter();
        break;
      case 'lfo':
        node = ctx.createOscillator();
        break;
      case 'adsr':
      case 'random':
        node = ctx.createGain();
        break;
      case 'reverb':
        node = ctx.createConvolver();
        break;
      case 'delay':
        node = ctx.createDelay(5);
        break;
      case 'distortion':
        node = ctx.createWaveShaper();
        break;
      case 'compressor':
        node = ctx.createDynamicsCompressor();
        break;
      case 'eq':
        node = ctx.createBiquadFilter();
        break;
      case 'mixer':
        node = ctx.createGain();
        break;
      case 'output':
        node = ctx.createGain();
        break;
      default:
        node = ctx.createGain();
    }

    this.moduleNodes.set(moduleId, node);
    return node;
  }

  getModuleNode(moduleId: string): AudioNode | undefined {
    return this.moduleNodes.get(moduleId);
  }

  connect(sourceId: string, _sourcePort: string, targetId: string, _targetPort: string) {
    const source = this.moduleNodes.get(sourceId);
    const target = this.moduleNodes.get(targetId);
    if (!source || !target) return;
    
    try {
      source.connect(target);
    } catch (e) {
      console.warn('Connection failed:', e);
    }
  }

  disconnect(sourceId: string, _sourcePort: string, targetId: string, _targetPort: string) {
    const source = this.moduleNodes.get(sourceId);
    const target = this.moduleNodes.get(targetId);
    if (!source || !target) return;
    
    try {
      source.disconnect(target);
    } catch (e) {
      console.warn('Disconnect failed:', e);
    }
  }

  setParam(moduleId: string, param: string, value: number | boolean | string) {
    const node = this.moduleNodes.get(moduleId);
    if (!node) return;

    try {
      if (node instanceof BiquadFilterNode) {
        switch (param) {
          case 'cutoff':
            node.frequency.value = Number(value);
            break;
          case 'resonance':
            node.Q.value = Number(value);
            break;
          case 'type':
            node.type = value as BiquadFilterType;
            break;
        }
      } else if (node instanceof GainNode) {
        node.gain.value = Number(value);
      } else if (node instanceof DelayNode) {
        node.delayTime.value = Number(value);
      }
    } catch (e) {
      console.warn('Param set failed:', moduleId, param, e);
    }
  }

  dispose() {
    this.moduleNodes.forEach((node) => {
      try {
        node.disconnect();
        if ('stop' in node && typeof node.stop === 'function') {
          (node as OscillatorNode).stop();
        }
      } catch {}
    });
    this.moduleNodes.clear();
    this.ctx?.close();
    this.isInitialized = false;
  }
}

export const audioEngine = new AudioEngine();
