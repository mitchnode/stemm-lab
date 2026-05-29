import { useTheme } from "@/theme";
import React from "react";
import Svg, { Circle, Line } from "react-native-svg";

interface Props {
  width: number;
  height: number;
  currentAngleDeg: number;
  baselineAngleDeg: number;
}

interface Point {
  x: number;
  y: number;
}

interface LineEndpoints {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const LINE_LENGTH_FRAC = 0.7;

const PIVOT_X = 0.5;
const PIVOT_Y = 0.85;

export const AngleOverlay: React.FC<Props> = ({
  width,
  height,
  currentAngleDeg,
  baselineAngleDeg,
}) => {
  const { colors } = useTheme();
  const pivot = {
    x: width * PIVOT_X,
    y: height * PIVOT_Y,
  };

  const angleToLine = (
    pivot: Point,
    angleDeg: number,
    lineLength: number,
  ): LineEndpoints => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x1: pivot.x,
      y1: pivot.y,
      x2: pivot.x + Math.cos(rad) * lineLength,
      y2: pivot.y + Math.sin(rad) * lineLength,
    };
  };

  const lineLength = height * LINE_LENGTH_FRAC;
  const baseLine = angleToLine(pivot, baselineAngleDeg, lineLength);
  const currentLine = angleToLine(pivot, currentAngleDeg, lineLength);

  return (
    <Svg
      width={width}
      height={height}
      style={{ position: "absolute", top: 0, left: 0 }}
      pointerEvents="none"
    >
      <Line
        x1={baseLine.x1}
        y1={baseLine.y1}
        x2={baseLine.x2}
        y2={baseLine.y2}
        stroke={colors.primary + 80}
        strokeWidth={2}
        strokeDasharray="10,6"
        strokeLinecap="round"
      />

      <Line
        x1={pivot.x - 100}
        y1={pivot.y}
        x2={pivot.x + 100}
        y2={pivot.y}
        stroke={colors.light + 70}
        strokeWidth={2}
        strokeDasharray="4,4"
      />

      <Line
        x1={currentLine.x1}
        y1={currentLine.y1}
        x2={currentLine.x2}
        y2={currentLine.y2}
        stroke={colors.primary}
        strokeWidth={3}
        strokeLinecap="round"
      />

      <Circle cx={pivot.x} cy={pivot.y} r={4} fill={colors.primary} />
    </Svg>
  );
};
