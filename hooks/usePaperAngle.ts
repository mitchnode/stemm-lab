import { useCallback, useState } from "react";

export interface UsePaperAngleReturn {
  currentAngleDeg: number;
  baselineAngleDeg: number;
  reset: () => void;
  setCurrentAngleDeg: (deg: number) => void;
}

export const BASELINE_ANGLE = 0;

export function usePaperAngle(): UsePaperAngleReturn {
  const [currentAngleDeg, setCurrentAngleDeg] = useState(0);

  const reset = useCallback(() => {
    setCurrentAngleDeg(0);
  }, []);

  return {
    currentAngleDeg,
    baselineAngleDeg: BASELINE_ANGLE,
    reset,
    setCurrentAngleDeg,
  };
}
