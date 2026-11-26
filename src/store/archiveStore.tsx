import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { BallVariantId } from '../data/pokeballs';
import type { SpecimenId } from '../data/pokemon';
import { soundEngine } from '../audio/soundEngine';

export type ArchiveSection = 'hero' | 'biomes' | 'telemetry' | 'vault';
export type CameraPreset = 'hero' | 'closeup' | 'aerial' | 'orbit';
export type LightingMood = 'studio' | 'atmospheric';
export type QualityTier = 'ultra' | 'balanced' | 'eco';
export type CardRarity = 'illustration' | 'hypergold' | 'secretprism';

interface ArchiveState {
  activeSection: ArchiveSection;
  activeBall: BallVariantId;
  explodeProgress: number;
  isExploded: boolean;
  capturePulseNonce: number;
  activeSpecimen: SpecimenId;
  compareSpecimen: SpecimenId | null;
  cameraPreset: CameraPreset;
  lightingMood: LightingMood;
  qualityTier: QualityTier;
  audioEnabled: boolean;
  cardRarity: CardRarity;
  inspectedCardId: SpecimenId | null;
  fps: number;
}

interface ArchiveActions {
  setActiveSection: (s: ArchiveSection) => void;
  setActiveBall: (b: BallVariantId) => void;
  setExplodeProgress: (v: number) => void;
  setScrollExplodeProgress: (v: number) => void;
  toggleExploded: () => void;
  triggerCapturePulse: () => void;
  setActiveSpecimen: (id: SpecimenId) => void;
  setCompareSpecimen: (id: SpecimenId | null) => void;
  setCameraPreset: (p: CameraPreset) => void;
  setLightingMood: (m: LightingMood) => void;
  setQualityTier: (q: QualityTier) => void;
  toggleAudio: () => void;
  setCardRarity: (r: CardRarity) => void;
  setInspectedCardId: (id: SpecimenId | null) => void;
  reportFps: (fps: number) => void;
  scrollToSection: (s: ArchiveSection) => void;
}

const ArchiveContext = createContext<(ArchiveState & ArchiveActions) | null>(null);

export const ArchiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<ArchiveSection>('hero');
  const [activeBall, setActiveBallState] = useState<BallVariantId>('pokeball');
  const [manualExplode, setManualExplode] = useState<number>(0);
  const [scrollExplode, setScrollExplode] = useState<number>(0);
  const explodeProgress = Math.max(manualExplode, scrollExplode);
  const [capturePulseNonce, setCapturePulseNonce] = useState<number>(0);
  const [activeSpecimen, setActiveSpecimenState] = useState<SpecimenId>('charizard');
  const [compareSpecimen, setCompareSpecimen] = useState<SpecimenId | null>('rayquaza');
  const [cameraPreset, setCameraPresetState] = useState<CameraPreset>('hero');
  const [lightingMood, setLightingMoodState] = useState<LightingMood>('atmospheric');
  const [qualityTier, setQualityTierState] = useState<QualityTier>('ultra');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [cardRarity, setCardRarityState] = useState<CardRarity>('illustration');
  const [inspectedCardId, setInspectedCardId] = useState<SpecimenId | null>(null);
  const [fps, setFps] = useState<number>(60);
  const audioRef = useRef(audioEnabled);
  audioRef.current = audioEnabled;

  // Sync dynamic CSS accent tokens on root element
  useEffect(() => {
    document.documentElement.setAttribute('data-specimen', activeSpecimen);
    if (audioRef.current) {
      soundEngine.setBiomeAmbience(activeSpecimen);
    }
  }, [activeSpecimen]);

  const actions = useMemo<ArchiveActions>(
    () => ({
      setActiveSection,
      setActiveBall: (ball) => {
        setActiveBallState(ball);
        if (audioRef.current) soundEngine.playLatchRelease();
      },
      setExplodeProgress: (val) => {
        setManualExplode(Math.min(1, Math.max(0, val)));
      },
      setScrollExplodeProgress: (val) => {
        setScrollExplode(Math.min(1, Math.max(0, val)));
      },
      toggleExploded: () => {
        setManualExplode((prev) => {
          const next = prev > 0.35 ? 0 : 1;
          if (audioRef.current) soundEngine.playLatchRelease();
          return next;
        });
      },
      triggerCapturePulse: () => {
        setCapturePulseNonce((n) => n + 1);
        if (audioRef.current) soundEngine.playCapturePulse();
      },
      setActiveSpecimen: (id) => {
        setActiveSpecimenState(id);
        setCompareSpecimen((prev) => (prev === id ? null : prev));
        if (audioRef.current) {
          soundEngine.playClick();
          soundEngine.setBiomeAmbience(id);
        }
      },
      setCompareSpecimen: (id) => {
        setCompareSpecimen(id);
        if (audioRef.current) soundEngine.playClick();
      },
      setCameraPreset: (preset) => {
        setCameraPresetState(preset);
        if (audioRef.current) soundEngine.playClick();
      },
      setLightingMood: (mood) => {
        setLightingMoodState(mood);
        if (audioRef.current) soundEngine.playClick();
      },
      setQualityTier: (tier) => {
        setQualityTierState(tier);
        if (audioRef.current) soundEngine.playClick();
      },
      toggleAudio: () => {
        setAudioEnabled((prev) => {
          const next = !prev;
          soundEngine.setEnabled(next, activeSpecimen);
          if (next) soundEngine.playLatchRelease();
          return next;
        });
      },
      setCardRarity: (rarity) => {
        setCardRarityState(rarity);
        if (audioRef.current) soundEngine.playClick();
      },
      setInspectedCardId: (id) => {
        setInspectedCardId(id);
        if (audioRef.current) soundEngine.playClick();
      },
      reportFps: (nextFps) => {
        setFps(nextFps);
      },
      scrollToSection: (sec) => {
        setActiveSection(sec);
        const el = document.getElementById(`section-${sec}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (audioRef.current) soundEngine.playClick();
      },
    }),
    [activeSpecimen]
  );

  const value = useMemo(
    () => ({
      activeSection,
      activeBall,
      explodeProgress,
      isExploded: explodeProgress > 0.25,
      capturePulseNonce,
      activeSpecimen,
      compareSpecimen,
      cameraPreset,
      lightingMood,
      qualityTier,
      audioEnabled,
      cardRarity,
      inspectedCardId,
      fps,
      ...actions,
    }),
    [
      activeSection,
      activeBall,
      explodeProgress,
      capturePulseNonce,
      activeSpecimen,
      compareSpecimen,
      cameraPreset,
      lightingMood,
      qualityTier,
      audioEnabled,
      cardRarity,
      inspectedCardId,
      fps,
      actions,
    ]
  );

  return <ArchiveContext.Provider value={value}>{children}</ArchiveContext.Provider>;
};

export function useArchive() {
  const ctx = useContext(ArchiveContext);
  if (!ctx) throw new Error('useArchive must be used inside ArchiveProvider');
  return ctx;
}
