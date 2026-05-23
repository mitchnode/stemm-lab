import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";

interface ReactionTimerReturn {
  BUTTON_SIZE: number;
  reactionTime: number | null;
  buttonPosition: { x: number; y: number };
  bestTime: number | null;
  ready: boolean;
  start: () => void;
  handlePress: () => void;
}

const BUTTON_SIZE = 80;
const MIN_DELAY = 3000;
const MAX_DELAY = 12000;

export function useReactionTimer(): ReactionTimerReturn {
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const { width, height } = useWindowDimensions();

  const appearTime = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);

  const getButtonPosition = useCallback(() => {
    const padding = 60;
    const x = Math.random() * (width - BUTTON_SIZE - padding * 2) + padding;
    const y =
      Math.random() * (height - BUTTON_SIZE - padding * 2 - 120) + padding + 60;
    return { x, y };
  }, []);

  const start = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setReactionTime(null);

    const delay = Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY;

    timeoutRef.current = setTimeout(() => {
      setButtonPosition(getButtonPosition());
      setReady(true);
      appearTime.current = Date.now();
    }, delay);
  }, [getButtonPosition]);

  const handlePress = useCallback(() => {
    const elapsed = Date.now() - appearTime.current;
    setReactionTime(elapsed);
    setBestTime((prev) => (prev === null || elapsed < prev ? elapsed : prev));

    /* Animated.spring(resultAnim, {
      toValue: 1,
      friction: 6,
      tension: 100,
      useNativeDriver: true,
    }).start(); */
    setReady(false);
  }, []);

  useEffect(() => {
    start();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      //setReady(false);
    };
  }, []);

  return {
    BUTTON_SIZE,
    reactionTime,
    buttonPosition,
    bestTime,
    ready,
    start,
    handlePress,
  };
}
