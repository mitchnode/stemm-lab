/* export interface Point {
  x: number;
  y: number;
}

export interface LineEndpoints {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function angleToLine(
  pivot: Point,
  angleDeg: number,
  lineLength: number,
): LineEndpoints {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x1: pivot.x,
    y1: pivot.y,
    x2: pivot.x + Math.cos(rad) * lineLength,
    y2: pivot.y + Math.sin(rad) * lineLength,
  };
} */

/* export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
} */

/* export function formatAngle(deg: number): string {
  return `${deg >= 0 ? "+" : ""}${deg.toFixed(1)}°`;
} */
