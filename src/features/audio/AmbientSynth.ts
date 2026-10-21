import type { AmbientTrackId } from '../../types';

class AmbientSynthService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentTrackId: AmbientTrackId | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private rainBufferSource: AudioBufferSourceNode | null = null;
  private chimeInterval: ReturnType<typeof setInterval> | null = null;
  private volume: number = 0.5;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.1);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentTrack(): AmbientTrackId | null {
    return this.currentTrackId;
  }

  public isPlaying(): boolean {
    return this.currentTrackId !== null;
  }

  public stop() {
    if (this.chimeInterval) {
      clearInterval(this.chimeInterval);
      this.chimeInterval = null;
    }

    if (this.rainBufferSource) {
      try {
        this.rainBufferSource.stop();
        this.rainBufferSource.disconnect();
      } catch {
        // ignore
      }
      this.rainBufferSource = null;
    }

    this.activeNodes.forEach((node) => {
      if (typeof node !== 'number') {
        try {
          if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
            (node as AudioScheduledSourceNode).stop();
          }
          node.disconnect();
        } catch {
          // ignore
        }
      }
    });
    this.activeNodes = [];
    this.currentTrackId = null;
  }

  public play(trackId: AmbientTrackId) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    this.stop();
    this.currentTrackId = trackId;

    switch (trackId) {
      case 'zen':
        this.playZenHarmonics();
        break;
      case 'alpha':
        this.playAlphaWaves();
        break;
      case 'rain':
        this.playGentleRain();
        break;
      case 'cosmic':
        this.playCosmicPad();
        break;
    }
  }

  // 1. Zen Harmonics: Warm meditative drone + gentle periodic chimes
  private playZenHarmonics() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const droneFreqs = [146.83, 220.0, 293.66]; // D3, A3, D4 warm open fifth
    droneFreqs.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const filter = this.ctx!.createBiquadFilter();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      this.activeNodes.push(osc, filter, gain);
    });

    // Gentle periodic pentatonic chimes
    const pentatonic = [440.0, 493.88, 587.33, 659.25, 739.99, 880.0];
    const triggerChime = () => {
      if (!this.ctx || !this.masterGain || this.currentTrackId !== 'zen') return;
      const chimeNow = this.ctx.currentTime;
      const note = pentatonic[Math.floor(Math.random() * pentatonic.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, chimeNow);

      gain.gain.setValueAtTime(0.0001, chimeNow);
      gain.gain.linearRampToValueAtTime(0.04, chimeNow + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, chimeNow + 3.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(chimeNow);
      osc.stop(chimeNow + 3.6);
    };

    triggerChime();
    this.chimeInterval = setInterval(triggerChime, 4500);
  }

  // 2. Alpha Wave 10Hz Binaural Beats (200Hz L / 210Hz R)
  private playAlphaWaves() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const baseFreq = 196; // G3
    const alphaDifference = 10; // 10Hz Alpha rhythm

    // Left channel (196 Hz)
    const oscL = this.ctx.createOscillator();
    const panL = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    const gainL = this.ctx.createGain();

    oscL.type = 'sine';
    oscL.frequency.setValueAtTime(baseFreq, now);

    gainL.gain.setValueAtTime(0.001, now);
    gainL.gain.linearRampToValueAtTime(0.08, now + 1.5);

    if (panL) {
      panL.pan.setValueAtTime(-1, now);
      oscL.connect(gainL);
      gainL.connect(panL);
      panL.connect(this.masterGain);
      this.activeNodes.push(panL);
    } else {
      oscL.connect(gainL);
      gainL.connect(this.masterGain);
    }
    oscL.start(now);
    this.activeNodes.push(oscL, gainL);

    // Right channel (206 Hz -> 10Hz differential)
    const oscR = this.ctx.createOscillator();
    const panR = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    const gainR = this.ctx.createGain();

    oscR.type = 'sine';
    oscR.frequency.setValueAtTime(baseFreq + alphaDifference, now);

    gainR.gain.setValueAtTime(0.001, now);
    gainR.gain.linearRampToValueAtTime(0.08, now + 1.5);

    if (panR) {
      panR.pan.setValueAtTime(1, now);
      oscR.connect(gainR);
      gainR.connect(panR);
      panR.connect(this.masterGain);
      this.activeNodes.push(panR);
    } else {
      oscR.connect(gainR);
      gainR.connect(this.masterGain);
    }
    oscR.start(now);
    this.activeNodes.push(oscR, gainR);
  }

  // 3. Gentle Rain: Synthesized filtered noise
  private playGentleRain() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds looping noise
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise filtering
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filters for rain texture
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(900, now);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(120, now);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.001, now);
    rainGain.gain.linearRampToValueAtTime(0.12, now + 2);

    whiteNoise.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(rainGain);
    rainGain.connect(this.masterGain);

    whiteNoise.start(now);
    this.rainBufferSource = whiteNoise;
    this.activeNodes.push(highpass, lowpass, rainGain);
  }

  // 4. Cosmic Pad: Ethereal swelling pad
  private playCosmicPad() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const chords = [130.81, 164.81, 196.0, 246.94]; // C3, E3, G3, B3 (Cmaj7)
    chords.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const filter = this.ctx!.createBiquadFilter();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      filter.Q.setValueAtTime(3, now);

      // Slow resonant filter sweep
      filter.frequency.linearRampToValueAtTime(580, now + 4);
      filter.frequency.linearRampToValueAtTime(320, now + 8);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 2.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      this.activeNodes.push(osc, filter, gain);
    });
  }
}

export const ambientSynth = new AmbientSynthService();
