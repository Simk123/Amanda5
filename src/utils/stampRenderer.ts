/**
 * Generates an SVG path or cutout pattern for authentic postage stamp perforations.
 */

export interface StampDimension {
  width: number;
  height: number;
  holeRadius?: number;
  spacing?: number;
}

export function generateStampSvgPath(
  width: number,
  height: number,
  radius: number = 5,
  spacing: number = 18
): string {
  // Generate outer rectangular path with inward semi-circular notches (perforations)
  const numX = Math.floor((width - 20) / spacing);
  const numY = Math.floor((height - 20) / spacing);
  const actualSpacingX = (width - 20) / numX;
  const actualSpacingY = (height - 20) / numY;

  let path = `M 10 0 `;

  // Top edge (moving right)
  for (let i = 0; i < numX; i++) {
    const xCenter = 10 + (i + 0.5) * actualSpacingX;
    path += `L ${xCenter - radius} 0 `;
    path += `A ${radius} ${radius} 0 0 0 ${xCenter + radius} 0 `;
  }
  path += `L ${width - 10} 0 `;
  path += `A 10 10 0 0 1 ${width} 10 `;

  // Right edge (moving down)
  for (let i = 0; i < numY; i++) {
    const yCenter = 10 + (i + 0.5) * actualSpacingY;
    path += `L ${width} ${yCenter - radius} `;
    path += `A ${radius} ${radius} 0 0 0 ${width} ${yCenter + radius} `;
  }
  path += `L ${width} ${height - 10} `;
  path += `A 10 10 0 0 1 ${width - 10} ${height} `;

  // Bottom edge (moving left)
  for (let i = numX - 1; i >= 0; i--) {
    const xCenter = 10 + (i + 0.5) * actualSpacingX;
    path += `L ${xCenter + radius} ${height} `;
    path += `A ${radius} ${radius} 0 0 0 ${xCenter - radius} ${height} `;
  }
  path += `L 10 ${height} `;
  path += `A 10 10 0 0 1 0 ${height - 10} `;

  // Left edge (moving up)
  for (let i = numY - 1; i >= 0; i--) {
    const yCenter = 10 + (i + 0.5) * actualSpacingY;
    path += `L 0 ${yCenter + radius} `;
    path += `A ${radius} ${radius} 0 0 0 0 ${yCenter - radius} `;
  }
  path += `L 0 10 `;
  path += `A 10 10 0 0 1 10 0 Z`;

  return path;
}
