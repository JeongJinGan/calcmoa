export function sliceAngle(count: number): number {
  return 360 / count;
}

export function polarPoint(cx: number, cy: number, r: number, angleFromTopDeg: number): { x: number; y: number } {
  const rad = (angleFromTopDeg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

export function describeSlice(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const start = polarPoint(cx, cy, r, startDeg);
  const end = polarPoint(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

export function pickRandomIndex(count: number): number {
  return Math.floor(Math.random() * count);
}

export function computeSpinRotation(currentRotation: number, targetIndex: number, count: number, extraSpins = 6): number {
  const angle = sliceAngle(count);
  const targetCenter = (targetIndex + 0.5) * angle;
  const desiredMod = (360 - (targetCenter % 360)) % 360;
  const currentMod = ((currentRotation % 360) + 360) % 360;

  let delta = desiredMod - currentMod;
  if (delta <= 0) delta += 360;

  return currentRotation + delta + extraSpins * 360;
}
