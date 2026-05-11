import { BaseEdge, getStraightPath } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';

export function SpouseEdge({
  sourceX, sourceY, targetX, targetY,
  style,
}: EdgeProps) {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });

  return (
    <BaseEdge
      path={edgePath}
      style={{
        ...style,
        stroke: '#f59e0b',
        strokeWidth: 2,
        strokeDasharray: '6 3',
      }}
    />
  );
}
