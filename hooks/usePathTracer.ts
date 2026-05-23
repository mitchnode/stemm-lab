import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, PanResponder } from "react-native";

export const BUTTON_RADIUS = 40;
const HIT_RADIUS = BUTTON_RADIUS + 10;
const WAYPOINT_COUNT = 10;
const SEGMENT_DURATION_MS = 1800;
const START_DELAY_MS = 2500;
const PADDING = BUTTON_RADIUS + 60;
const PT_BUTTON_SIZE = BUTTON_RADIUS * 2;

export type Motion = "idle" | "ready" | "moving" | "done";

interface PathTracerReturn {
  PT_BUTTON_SIZE: number;
  motion: Motion;
  totalMissTime: number;
  bestTime: number | null;
  isMissing: boolean;
  buttonAnim: Animated.ValueXY;
  waypointCoords: { x: number; y: number }[];
  start: () => void;
  panHandlers: ReturnType<typeof PanResponder.create>["panHandlers"];
}

const generateWaypoints = (count: number): { x: number; y: number }[] => {
  const { width, height } = Dimensions.get("window");
  const points: { x: number; y: number }[] = [];

  points.push({
    x: width / 2 - BUTTON_RADIUS,
    y: height / 2 - BUTTON_RADIUS,
  });

  for (let i = 1; i < count; i++) {
    points.push({
      x: Math.random() * (width - PADDING * 2) + PADDING,
      y: Math.random() * (height - PADDING * 2 - 120) + PADDING + 60,
    });
  }
  return points;
};

export function usePathTracer(): PathTracerReturn {
  const [motion, setMotion] = useState<Motion>("idle");
  const [totalMissTime, setTotalMissTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [isMissing, setIsMissing] = useState(false);
  const [waypointCoords, setWaypointCoords] = useState<
    { x: number; y: number }[]
  >([]);

  const buttonAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const buttonPositionRef = useRef({ x: 0, y: 0 });
  const missStartRef = useRef<number | null>(null);
  const accumulatedMissRef = useRef(0);
  const isMissingRef = useRef(false);
  const isTouchingRef = useRef(false);
  const motionRef = useRef<Motion>("idle");
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const id = buttonAnim.addListener(({ x, y }) => {
      buttonPositionRef.current = { x, y };
    });
    return () => buttonAnim.removeListener(id);
  }, [buttonAnim]);

  const recordMiss = useCallback(() => {
    if (isMissingRef.current) return;
    console.log("Miss");
    isMissingRef.current = true;
    missStartRef.current = Date.now();
    setIsMissing(true);
  }, []);

  const recordHit = useCallback(() => {
    if (!isMissingRef.current) return;
    console.log("Hit");
    isMissingRef.current = false;
    if (missStartRef.current !== null) {
      accumulatedMissRef.current += Date.now() - missStartRef.current;
      missStartRef.current = null;
      setTotalMissTime(accumulatedMissRef.current);
    }
    setIsMissing(false);
  }, []);

  const isOnButton = useCallback((touchX: number, touchY: number): boolean => {
    const { x, y } = buttonPositionRef.current;
    const centerX = x + BUTTON_RADIUS;
    const centerY = y + BUTTON_RADIUS;
    const dist = Math.sqrt(
      Math.pow(touchX - centerX, 2) + Math.pow(touchY - centerY, 2),
    );
    return dist <= HIT_RADIUS;
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => motionRef.current === "moving",
      onMoveShouldSetPanResponder: () => motionRef.current === "moving",
      onPanResponderGrant: (event) => {
        if (motionRef.current !== "moving") return;
        console.log("Touching");
        isTouchingRef.current = true;
        const { pageX, pageY } = event.nativeEvent;
        if (isOnButton(pageX, pageY)) {
          recordHit();
        } else {
          recordMiss();
        }
      },
      onPanResponderMove: (event) => {
        if (motionRef.current !== "moving") return;
        const { pageX, pageY } = event.nativeEvent;
        if (isOnButton(pageX, pageY)) {
          recordHit();
        } else {
          recordMiss();
        }
      },
      onPanResponderRelease: () => {
        isTouchingRef.current = false;
        if (motionRef.current === "moving") {
          recordMiss();
        }
      },
      onPanResponderTerminate: () => {
        isTouchingRef.current = false;
        if (motionRef.current === "moving") {
          recordMiss();
        }
      },
    }),
  ).current;

  const start = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }

    accumulatedMissRef.current = 0;
    missStartRef.current = null;
    isMissingRef.current = false;
    isTouchingRef.current = false;
    setTotalMissTime(0);
    setIsMissing(false);

    const waypoints = generateWaypoints(WAYPOINT_COUNT);
    setWaypointCoords(waypoints);

    buttonAnim.setValue(waypoints[0]);
    setMotion("ready");

    const startDelayTimer = setTimeout(() => {
      setMotion("moving");

      const segments = waypoints.slice(1).map((wp) =>
        Animated.timing(buttonAnim, {
          toValue: wp,
          duration: SEGMENT_DURATION_MS,
          useNativeDriver: true,
        }),
      );

      const sequence = Animated.sequence(segments);
      animationRef.current = sequence;

      sequence.start(({ finished }) => {
        if (finished) {
          if (isMissingRef.current && missStartRef.current !== null) {
            accumulatedMissRef.current += Date.now() - missStartRef.current;
            missStartRef.current = null;
          }
          setTotalMissTime(accumulatedMissRef.current);
          setBestTime((prev) =>
            prev === null || accumulatedMissRef.current < prev
              ? accumulatedMissRef.current
              : prev,
          );
          setIsMissing(false);
          setMotion("done");
        }
      });
    }, START_DELAY_MS);

    return () => clearTimeout(startDelayTimer);
  }, [buttonAnim]);

  useEffect(() => {
    const cleanup = start();
    return () => {
      cleanup?.();
      if (animationRef.current) animationRef.current.stop();
    };
  }, []);

  return {
    PT_BUTTON_SIZE,
    motion,
    totalMissTime,
    bestTime,
    isMissing,
    buttonAnim,
    waypointCoords,
    start,
    panHandlers: panResponder.panHandlers,
  };
}
