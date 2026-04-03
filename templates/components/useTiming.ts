import { useState, useEffect } from "react";
import { staticFile, delayRender, continueRender } from "remotion";

export interface TimingSection {
  name: string;
  label?: string;
  start_time: number;
  end_time: number;
  duration: number;
  start_frame: number;
  duration_frames: number;
  is_silent?: boolean;
}

export interface TimingData {
  total_duration: number;
  fps: number;
  total_frames: number;
  speech_rate?: string;
  sections: TimingSection[];
}

// Module-level cache so multiple components share one fetch
let cachedTiming: TimingData | null = null;
let fetchPromise: Promise<TimingData> | null = null;

function fetchTiming(): Promise<TimingData> {
  if (!fetchPromise) {
    fetchPromise = fetch(staticFile("timing.json"))
      .then((r) => r.json())
      .then((data: TimingData) => {
        cachedTiming = data;
        return data;
      });
  }
  return fetchPromise;
}

/**
 * Load timing.json at runtime via staticFile().
 * Works with --public-dir so each video can have its own timing data.
 * Uses delayRender/continueRender to block rendering until loaded.
 */
export const useTiming = (): TimingData => {
  const [timing, setTiming] = useState<TimingData | null>(cachedTiming);
  const [handle] = useState(() =>
    cachedTiming ? null : delayRender("Loading timing.json"),
  );

  useEffect(() => {
    if (cachedTiming) {
      setTiming(cachedTiming);
      return;
    }
    fetchTiming().then((data) => {
      setTiming(data);
      if (handle !== null) continueRender(handle);
    });
  }, [handle]);

  // Return placeholder while loading (render is delayed anyway)
  if (!timing) {
    return { total_duration: 0, fps: 30, total_frames: 1, sections: [] };
  }
  return timing;
};

/**
 * Standalone fetch for use in calculateMetadata (non-hook context).
 * Returns the cached value if already fetched.
 */
export const fetchTimingData = (): Promise<TimingData> => fetchTiming();
