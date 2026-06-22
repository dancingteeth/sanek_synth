export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private analyser: AnalyserNode | null = null;
  private moduleNodes: Map<string, AudioNode> = new Map();
  private moduleGains: Map<string, GainNode> = new Map();
  private adsrEnvelopes: Map<string, ADSR> = new Map();
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

  triggerADSR(moduleId: string) {
    const env = this.adsrEnvelopes.get(moduleId);
    if (env) {
      env.trigger();
    }
  }

  releaseADSR(moduleId: string) {
    const env = this.adsrEnvelopes.get(moduleId);
    if (env) {
      env.release();
    }
  }

  createModuleNode(moduleId: string, type: string, params: Record<string, number | boolean | string>) {
    const ctx = this.getContext();
    let node: AudioNode;
    let gain: GainNode;

    switch (type) {
      case 'oscillator':
      case 'wavetable':
      case 'fm-carrier':
      case 'fm-modulator': {
        const osc = ctx.createOscillator();
        osc.type = (params.waveform as OscillatorType) || 'sawtooth';
        osc.frequency.value = (params.frequency as number) || 440;
        osc.detune.value = (params.detune as number) || 0;
        gain = ctx.createGain();
        gain.gain.value = (params.gain as number) || 0.5;
        osc.connect(gain);
        osc.start();
        node = osc;
        break;
      }
      case 'noise': {
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;
        gain = ctx.createGain();
        gain.gain.value = (params.gain as number) || 0.3;
        noise.connect(gain);
        noise.start();
        node = noise;
        break;
      }
      case 'filter': {
        const filter = ctx.createBiquadFilter();
        filter.type = (params.type as BiquadFilterType) || 'lowpass';
        filter.frequency.value = (params.cutoff as number) || 2000;
        filter.Q.value = (params.resonance as number) || 1;
        gain = ctx.createGain();
        gain.gain.value = 1;
        filter.connect(gain);
        node = filter;
        break;
      }
      case 'lfo': {
        const lfo = ctx.createOscillator();
        lfo.type = (params.waveform as OscillatorType) || 'sine';
        lfo.frequency.value = (params.rate as number) || 1;
        gain = ctx.createGain();
        gain.gain.value = (params.amount as number) || 0.5;
        lfo.connect(gain);
        lfo.start();
        node = lfo;
        break;
      }
      case 'adsr': {
        gain = ctx.createGain();
        gain.gain.value = 0;
        const envelope = new ADSR(ctx, gain);
        this.adsrEnvelopes.set(moduleId, envelope);
        node = gain;
        break;
      }
      case 'vca': {
        gain = ctx.createGain();
        gain.gain.value = (params.gain as number) || 1;
        node = gain;
        break;
      }
      case 'random':
      case 'mixer':
      case 'compressor':
      case 'eq': {
        gain = ctx.createGain();
        gain.gain.value = (params.gain as number) || (params.volume as number) || 1;
        node = gain;
        break;
      }
      case 'output': {
        gain = ctx.createGain();
        gain.gain.value = (params.volume as number) || 0.8;
        gain.connect(this.masterGain!);
        node = gain;
        break;
      }
      case 'reverb': {
        gain = ctx.createGain();
        gain.gain.value = (params.mix as number) || 0.3;
        node = gain; // Simplified — real reverb needs convolver buffer
        break;
      }
      case 'delay': {
        const delay = ctx.createDelay(5);
        delay.delayTime.value = (params.time as number) || 0.3;
        const fb = ctx.createGain();
        fb.gain.value = (params.feedback as number) || 0.4;
        delay.connect(fb);
        fb.connect(delay);
        gain = ctx.createGain();
        gain.gain.value = (params.mix as number) || 0.3;
        delay.connect(gain);
        node = delay;
        break;
      }
      case 'distortion': {
        const shaper = ctx.createWaveShaper();
        shaper.curve = this.makeDistortionCurve((params.drive as number) || 0.5);
        gain = ctx.createGain();
        gain.gain.value = (params.mix as number) || 1;
        shaper.connect(gain);
        node = shaper;
        break;
      }
      case 'sample': {
        gain = ctx.createGain();
        gain.gain.value = (params.gain as number) || 0.5;
        node = gain;
        break;
      }
      default: {
        gain = ctx.createGain();
        gain.gain.value = 1;
        node = gain;
      }
    }

    this.moduleNodes.set(moduleId, node);
    this.moduleGains.set(moduleId, gain);
    return node;
  }

  private makeDistortionCurve(amount: number) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < samples; ++i) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }

  getModuleNode(moduleId: string): AudioNode | undefined {
    return this.moduleNodes.get(moduleId);
  }

  getModuleGain(moduleId: string): GainNode | undefined {
    return this.moduleGains.get(moduleId);
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
      } else if (node instanceof OscillatorNode) {
        switch (param) {
          case 'frequency':
            node.frequency.value = Number(value);
            break;
          case 'detune':
            node.detune.value = Number(value);
            break;
          case 'type':
            node.type = value as OscillatorType;
            break;
        }
      }

      const env = this.adsrEnvelopes.get(moduleId);
      if (env) {
        switch (param) {
          case 'attack':
            env.setParams({ attack: Number(value) });
            break;
          case 'decay':
            env.setParams({ decay: Number(value) });
            break;
          case 'sustain':
            env.setParams({ sustain: Number(value) });
            break;
          case 'release':
            env.setParams({ release: Number(value) });
            break;
        }
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
    this.moduleGains.clear();
    this.adsrEnvelopes.clear();
    this.ctx?.close();
    this.isInitialized = false;
  }
}

class ADSR {
  private ctx: AudioContext;
  private gain: GainNode;
  private attack: number;
  private decay: number;
  private sustain: number;
  private releaseTime: number;

  constructor(ctx: AudioContext, gain: GainNode) {
    this.ctx = ctx;
    this.gain = gain;
    this.attack = 0.01;
    this.decay = 0.1;
    this.sustain = 0.7;
    this.releaseTime = 0.3;
  }

  setParams(params: { attack?: number; decay?: number; sustain?: number; release?: number }) {
    if (params.attack !== undefined) this.attack = params.attack;
    if (params.decay !== undefined) this.decay = params.decay;
    if (params.sustain !== undefined) this.sustain = params.sustain;
    if (params.release !== undefined) this.releaseTime = params.release;
  }

  trigger() {
    const now = this.ctx.currentTime;
    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setValueAtTime(0, now);
    this.gain.gain.linearRampToValueAtTime(1, now + this.attack);
    this.gain.gain.linearRampToValueAtTime(this.sustain, now + this.attack + this.decay);
  }

  release() {
    const now = this.ctx.currentTime;
    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setValueAtTime(this.gain.gain.value, now);
    this.gain.gain.linearRampToValueAtTime(0, now + this.releaseTime);
  }
}

export const audioEngine = new AudioEngine();
