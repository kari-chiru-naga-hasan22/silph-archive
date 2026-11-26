import type { SpecimenId } from '../data/pokemon';

class SilphSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambienceGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private ambienceNodes: AudioNode[] = [];
  private noiseBuffer: AudioBuffer | null = null;
  private enabled = false;
  private currentSpecimen: SpecimenId = 'charizard';

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return null;
      this.ctx = new Ctx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.0;

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.78;

      this.ambienceGain = this.ctx.createGain();
      this.ambienceGain.gain.value = 0.24;

      this.ambienceGain.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Pre-generate 2s stereo white noise buffer for mechanical air/water textures
      const sampleRate = this.ctx.sampleRate;
      const buf = this.ctx.createBuffer(1, sampleRate * 2, sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      this.noiseBuffer = buf;
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume().catch(() => undefined);
    }
    return this.ctx;
  }

  public setEnabled(enabled: boolean, specimen: SpecimenId): void {
    this.enabled = enabled;
    this.currentSpecimen = specimen;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    const now = ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(enabled ? 0.55 : 0.0, now, 0.08);
    if (enabled) {
      this.setBiomeAmbience(specimen);
    } else {
      this.stopAmbienceNodes();
    }
  }

  public playClick(): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1650, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.032);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  public playHoverTick(): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, now);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.016);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.02);
  }

  public playLatchRelease(): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    const now = ctx.currentTime;

    // Mechanical double detent click
    [0, 0.055].forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(idx === 0 ? 920 : 1280, now + offset);
      osc.frequency.exponentialRampToValueAtTime(180, now + offset + 0.038);
      gain.gain.setValueAtTime(0.12, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.042);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + offset);
      osc.stop(now + offset + 0.045);
    });

    // Pneumatic release hiss
    if (this.noiseBuffer) {
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.Q.value = 1.6;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      src.start(now);
      src.stop(now + 0.26);
    }
  }

  public playCapturePulse(): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    const now = ctx.currentTime;

    // 3 wobble pulses + lock harmonic chord
    [0, 0.34, 0.68].forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const startFreq = 260 + idx * 45;
      osc.frequency.setValueAtTime(startFreq, now + offset);
      osc.frequency.exponentialRampToValueAtTime(95, now + offset + 0.16);
      gain.gain.setValueAtTime(0.22, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.18);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + offset);
      osc.stop(now + offset + 0.2);
    });

    // Lock chime at 1.02s
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const t = now + 1.02 + i * 0.04;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.1, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(t);
      osc.stop(t + 0.6);
    });
  }

  private stopAmbienceNodes(): void {
    this.ambienceNodes.forEach((node) => {
      try {
        if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          (node as AudioScheduledSourceNode).stop();
        }
        node.disconnect();
      } catch {
        // Ignore already-stopped nodes
      }
    });
    this.ambienceNodes = [];
  }

  public setBiomeAmbience(specimen: SpecimenId): void {
    this.currentSpecimen = specimen;
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.ambienceGain) return;

    this.stopAmbienceNodes();
    const now = ctx.currentTime;

    const specs: Record<SpecimenId, { base: number; fifth: number; filterFreq: number; noiseGain: number }> = {
      charizard: { base: 65.41, fifth: 98.0, filterFreq: 320, noiseGain: 0.06 },
      pikachu: { base: 110.0, fifth: 164.81, filterFreq: 1450, noiseGain: 0.04 },
      greninja: { base: 82.41, fifth: 123.47, filterFreq: 540, noiseGain: 0.08 },
      rayquaza: { base: 130.81, fifth: 196.0, filterFreq: 980, noiseGain: 0.03 },
    };

    const cfg = specs[specimen];
    const drone1 = ctx.createOscillator();
    const drone2 = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const subGain = ctx.createGain();

    drone1.type = 'sawtooth';
    drone1.frequency.setValueAtTime(cfg.base, now);
    drone2.type = 'triangle';
    drone2.frequency.setValueAtTime(cfg.fifth, now);

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.22, now);
    lfoGain.gain.setValueAtTime(120, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cfg.filterFreq, now);
    filter.Q.value = 1.8;

    subGain.gain.setValueAtTime(0.08, now);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    drone1.connect(filter);
    drone2.connect(filter);
    filter.connect(subGain);
    subGain.connect(this.ambienceGain);

    drone1.start(now);
    drone2.start(now);
    lfo.start(now);

    this.ambienceNodes.push(drone1, drone2, lfo, lfoGain, filter, subGain);

    if (this.noiseBuffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      noise.loop = true;
      const nFilter = ctx.createBiquadFilter();
      nFilter.type = 'bandpass';
      nFilter.frequency.setValueAtTime(cfg.filterFreq * 1.4, now);
      nFilter.Q.value = 0.9;
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(cfg.noiseGain, now);
      noise.connect(nFilter);
      nFilter.connect(nGain);
      nGain.connect(this.ambienceGain);
      noise.start(now);
      this.ambienceNodes.push(noise, nFilter, nGain);
    }
  }

  public getSpectrumBars(count = 16): number[] {
    if (!this.enabled || !this.analyser) {
      return new Array(count).fill(0.12);
    }
    const buf = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(buf);
    const out: number[] = [];
    for (let i = 0; i < count; i++) {
      const idx = Math.min(buf.length - 1, Math.floor((i / count) * (buf.length * 0.7)));
      const norm = buf[idx] / 255;
      out.push(Math.max(0.14, norm));
    }
    return out;
  }

  public getSpecimen(): SpecimenId {
    return this.currentSpecimen;
  }
}

export const soundEngine = new SilphSoundEngine();
