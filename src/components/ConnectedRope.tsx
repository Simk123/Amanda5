import React, { useMemo } from 'react';
import { Contribution } from '../types';

interface ConnectedRopeProps {
  contributions: Contribution[];
}

interface Point {
  x: number;
  y: number;
}

export const ConnectedRope: React.FC<ConnectedRopeProps> = ({ contributions }) => {
  // Compute anchor attachment points for all charms
  const points: Point[] = useMemo(() => {
    if (!contributions || contributions.length === 0) return [];

    // Map each contribution to the top hanger loop of its charm
    // For TributePiece: charm is on the left, hanger is at (posX + 96, posY + 2)
    // For BeadedCharm: hanger is at (posX + (width||240)/2, posY + 2)
    // For PostalLetter without charm: top center (posX + 150, posY + 2)
    const rawPoints = contributions.map((c) => {
      let anchorX = c.posX + 96;
      let anchorY = c.posY + 2;

      if (c.type === 'charm') {
        anchorX = c.posX + (c.width ? c.width / 2 : 120);
        anchorY = c.posY + 2;
      } else if (c.type === 'letter') {
        anchorX = c.posX + 150;
        anchorY = c.posY + 2;
      }

      return { x: anchorX, y: anchorY };
    });

    if (rawPoints.length <= 1) return rawPoints;

    // Order points along a smooth spatial path (e.g. left to right with organic flow)
    const sorted = [...rawPoints].sort((a, b) => {
      if (Math.abs(a.x - b.x) > 100) {
        return a.x - b.x;
      }
      return a.y - b.y;
    });

    return sorted;
  }, [contributions]);

  // Generate smooth curved SVG path string connecting all points with slight natural catenary droop
  const { pathData, beadSpacers, bounds } = useMemo(() => {
    if (points.length === 0) {
      return { pathData: '', beadSpacers: [], bounds: { minX: 0, minY: 0, maxX: 1000, maxY: 1000 } };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    points.forEach((p) => {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    });

    // Add margin for curves and endpoints
    minX -= 250;
    minY -= 200;
    maxX += 250;
    maxY += 250;

    if (points.length === 1) {
      const p = points[0];
      const p1 = `M ${p.x - 120} ${p.y - 40} Q ${p.x - 60} ${p.y + 20}, ${p.x} ${p.y} Q ${p.x + 60} ${p.y + 20}, ${p.x + 120} ${p.y - 40}`;
      return {
        pathData: p1,
        beadSpacers: [
          { x: p.x - 60, y: p.y - 10 },
          { x: p.x + 60, y: p.y - 10 },
        ],
        bounds: { minX, minY, maxX, maxY },
      };
    }

    // Extended endpoints for the rope garland to trail gracefully on left and right
    const first = points[0];
    const last = points[points.length - 1];

    const extendedStart: Point = {
      x: first.x - 180,
      y: first.y - 60,
    };
    const extendedEnd: Point = {
      x: last.x + 180,
      y: last.y - 60,
    };

    const allNodes = [extendedStart, ...points, extendedEnd];

    // Build smooth cubic Bézier spline through all points
    let d = `M ${allNodes[0].x} ${allNodes[0].y}`;
    const beads: Point[] = [];

    for (let i = 0; i < allNodes.length - 1; i++) {
      const p0 = i > 0 ? allNodes[i - 1] : allNodes[i];
      const p1 = allNodes[i];
      const p2 = allNodes[i + 1];
      const p3 = i < allNodes.length - 2 ? allNodes[i + 2] : p2;

      // Distance between p1 and p2
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      // Gentle natural catenary droop proportional to distance
      const sag = Math.min(dist * 0.16, 85);

      // Control points for Catmull-Rom to Cubic Bezier conversion with sag
      const cp1x = p1.x + (p2.x - p0.x) / 5;
      const cp1y = p1.y + (p2.y - p0.y) / 5 + sag * 0.7;

      const cp2x = p2.x - (p3.x - p1.x) / 5;
      const cp2y = p2.y - (p3.y - p1.y) / 5 + sag * 0.7;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;

      // Calculate bead spacers along this segment
      if (dist > 80) {
        const midT = 0.5;
        // Cubic bezier point at midT
        const bx =
          (1 - midT) ** 3 * p1.x +
          3 * (1 - midT) ** 2 * midT * cp1x +
          3 * (1 - midT) * midT ** 2 * cp2x +
          midT ** 3 * p2.x;
        const by =
          (1 - midT) ** 3 * p1.y +
          3 * (1 - midT) ** 2 * midT * cp1y +
          3 * (1 - midT) * midT ** 2 * cp2y +
          midT ** 3 * p2.y;
        beads.push({ x: bx, y: by });
      }
    }

    return { pathData: d, beadSpacers: beads, bounds: { minX, minY, maxX, maxY } };
  }, [points]);

  if (points.length === 0 || !pathData) return null;

  return (
    <svg
      className="absolute top-0 left-0 overflow-visible pointer-events-none z-5"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <defs>
        {/* Metallic Gold Cord Gradient */}
        <linearGradient id="ropeGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff8db" />
          <stop offset="25%" stopColor="#e5c158" />
          <stop offset="50%" stopColor="#fef08a" />
          <stop offset="75%" stopColor="#b48c36" />
          <stop offset="100%" stopColor="#fad060" />
        </linearGradient>

        {/* Silver & Pearl Bead Shading */}
        <radialGradient id="pearlSpacer" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#f1ede2" />
          <stop offset="85%" stopColor="#d4cebe" />
          <stop offset="100%" stopColor="#8c8577" />
        </radialGradient>

        {/* Golden Spacer Bead Shading */}
        <radialGradient id="goldSpacer" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="40%" stopColor="#fbbf24" />
          <stop offset="85%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#78350f" />
        </radialGradient>

        {/* Ruby Seed Bead Shading */}
        <radialGradient id="rubySpacer" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="45%" stopColor="#dc2626" />
          <stop offset="85%" stopColor="#991b1b" />
          <stop offset="100%" stopColor="#450a0a" />
        </radialGradient>

        {/* Rope Shadow Filter */}
        <filter id="ropeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.95" />
        </filter>
      </defs>

      {/* 1. Deep Ambient Drop Shadow of the Rope */}
      <path
        d={pathData}
        fill="none"
        stroke="#000000"
        strokeWidth="6"
        strokeOpacity="0.8"
        strokeLinecap="round"
        transform="translate(0, 10)"
        filter="blur(4px)"
      />

      {/* 2. Main Metallic Twisted Jewelry Cord Base */}
      <path
        d={pathData}
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* 3. Gold & Silver Interwoven Highlight Cord */}
      <path
        d={pathData}
        fill="none"
        stroke="url(#ropeGold)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="8 3"
        filter="url(#ropeShadow)"
      />

      {/* 4. Fine Glistening Center Fiber */}
      <path
        d={pathData}
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.75"
        strokeDasharray="4 6"
      />

      {/* 5. Intermediate Pearl & Crystal Spacer Beads along the cord */}
      {beadSpacers.map((b, idx) => (
        <g key={`spacer-${idx}`} transform={`translate(${b.x}, ${b.y})`}>
          {/* Outer Ring Gold */}
          <circle cx="0" cy="0" r="5" fill="url(#pearlSpacer)" stroke="#ffffff" strokeWidth="0.8" />
          <circle cx="-6" cy="0" r="2.8" fill="url(#goldSpacer)" />
          <circle cx="6" cy="0" r="2.8" fill="url(#rubySpacer)" />
        </g>
      ))}

      {/* 6. Connector Jump Rings & Silver Swivel Mounts at every Charm Attachment */}
      {points.map((p, idx) => (
        <g key={`anchor-${idx}`} transform={`translate(${p.x}, ${p.y})`}>
          {/* Ambient Glow */}
          <circle cx="0" cy="0" r="10" fill="rgba(0,0,0,0.5)" filter="blur(2px)" />

          {/* Golden/Silver Double Jump Ring Clasp */}
          <circle
            cx="0"
            cy="0"
            r="6"
            fill="none"
            stroke="url(#ropeGold)"
            strokeWidth="2.4"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.9))"
          />
          <circle cx="0" cy="0" r="3.5" fill="#0c0a09" stroke="#ffffff" strokeWidth="0.8" />

          {/* Tiny Ruby & Gold Spacer Beads flanking the clasp */}
          <circle cx="-8" cy="-1" r="3" fill="url(#rubySpacer)" stroke="#ffffff" strokeWidth="0.4" />
          <circle cx="8" cy="-1" r="3" fill="url(#goldSpacer)" stroke="#ffffff" strokeWidth="0.4" />
        </g>
      ))}
    </svg>
  );
};
