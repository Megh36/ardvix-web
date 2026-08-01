/**
 * Point-sampling for the Ardvix mark (public/ardvix-mark.svg), hardcoded
 * from the path data directly rather than parsed at runtime — the mark is
 * two simple closed polygons (straight `L` segments only, no curves), so a
 * general SVG path parser would be pure overhead for a prototype.
 *
 * Outer triangle:  M12 3.34 L22 20.66 L2 20.66 Z
 * Inner arrow cut: M12 9.34 L16.8 17.66 L13.5 17.66 L13.5 20.66 L10.5 20.66
 *                  L10.5 17.66 L7.2 17.66 Z
 * fill-rule="evenodd" — the rendered silhouette is the triangle with the
 * arrow shape subtracted (a hole), which is what "area fill" sampling below
 * has to respect (inside triangle AND outside arrow).
 */

type Vec2 = { x: number; y: number };

const TRIANGLE: Vec2[] = [
  { x: 12, y: 3.34 },
  { x: 22, y: 20.66 },
  { x: 2, y: 20.66 },
];

const ARROW: Vec2[] = [
  { x: 12, y: 9.34 },
  { x: 16.8, y: 17.66 },
  { x: 13.5, y: 17.66 },
  { x: 13.5, y: 20.66 },
  { x: 10.5, y: 20.66 },
  { x: 10.5, y: 17.66 },
  { x: 7.2, y: 17.66 },
];

// Mark's natural center in SVG units (triangle bounding box) — every
// sampled point below is emitted pre-centered on (0, 0) so the caller only
// has to apply a scale (and Y-flip) to place it in world space.
const CENTER: Vec2 = { x: 12, y: 12 };

function polygonPerimeter(poly: Vec2[]): number {
  let total = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    total += Math.hypot(b.x - a.x, b.y - a.y);
  }
  return total;
}

/** `count` points spaced evenly (by arc length) around a closed polygon. */
function samplePerimeter(poly: Vec2[], count: number): Vec2[] {
  const edgeLengths = poly.map((p, i) => {
    const next = poly[(i + 1) % poly.length];
    return Math.hypot(next.x - p.x, next.y - p.y);
  });
  const total = edgeLengths.reduce((a, b) => a + b, 0);

  const points: Vec2[] = [];
  for (let i = 0; i < count; i++) {
    let target = (i / count) * total;
    let edge = 0;
    while (edge < edgeLengths.length && target > edgeLengths[edge]) {
      target -= edgeLengths[edge];
      edge++;
    }
    if (edge >= poly.length) edge = poly.length - 1;
    const a = poly[edge];
    const b = poly[(edge + 1) % poly.length];
    const t = edgeLengths[edge] > 0 ? target / edgeLengths[edge] : 0;
    points.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
  }
  return points;
}

/** Standard ray-casting point-in-polygon test — works for any simple
 * (non-self-intersecting) polygon, convex or not. */
function pointInPolygon(p: Vec2, poly: Vec2[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    const intersects =
      yi > p.y !== yj > p.y &&
      p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

/** Rejection-samples `count` points inside "triangle minus arrow". */
function sampleAreaFill(count: number): Vec2[] {
  const minX = Math.min(...TRIANGLE.map((p) => p.x));
  const maxX = Math.max(...TRIANGLE.map((p) => p.x));
  const minY = Math.min(...TRIANGLE.map((p) => p.y));
  const maxY = Math.max(...TRIANGLE.map((p) => p.y));

  const points: Vec2[] = [];
  let guard = 0;
  const guardLimit = count * 200; // generous ceiling, this always converges fast in practice
  while (points.length < count && guard < guardLimit) {
    guard++;
    const p = {
      x: minX + Math.random() * (maxX - minX),
      y: minY + Math.random() * (maxY - minY),
    };
    if (pointInPolygon(p, TRIANGLE) && !pointInPolygon(p, ARROW)) {
      points.push(p);
    }
  }
  return points;
}

/**
 * Builds the full target-point set for `convergingCount` particles: ~60%
 * along the silhouette's perimeter (both the outer triangle edge and the
 * inner arrow cutout edge, so the hole reads clearly), ~40% scattered
 * across the filled area, so the shape reads as solid rather than just an
 * outline. Every point comes back pre-centered on (0, 0) in SVG units.
 */
export function buildMarkTargets(convergingCount: number): Float32Array {
  const perimeterCount = Math.round(convergingCount * 0.6);
  const areaCount = convergingCount - perimeterCount;

  const triLen = polygonPerimeter(TRIANGLE);
  const arrowLen = polygonPerimeter(ARROW);
  const triPerimCount = Math.round(
    perimeterCount * (triLen / (triLen + arrowLen))
  );
  const arrowPerimCount = perimeterCount - triPerimCount;

  const perimeterPoints = [
    ...samplePerimeter(TRIANGLE, triPerimCount),
    ...samplePerimeter(ARROW, arrowPerimCount),
  ];
  const areaPoints = sampleAreaFill(areaCount);

  const all = [...perimeterPoints, ...areaPoints];
  const out = new Float32Array(convergingCount * 2);
  for (let i = 0; i < convergingCount; i++) {
    const p = all[i % all.length]; // defensive: guard shortfall never trips in practice
    out[i * 2] = p.x - CENTER.x;
    out[i * 2 + 1] = p.y - CENTER.y;
  }
  return out;
}

/** Half-height of the mark's bounding box in SVG units — used to scale
 * the target points so the mark occupies a given fraction of viewport
 * height (viewportHeight * fraction) / (2 * MARK_HALF_HEIGHT_SVG). */
export const MARK_HEIGHT_SVG =
  Math.max(...TRIANGLE.map((p) => p.y)) - Math.min(...TRIANGLE.map((p) => p.y));
