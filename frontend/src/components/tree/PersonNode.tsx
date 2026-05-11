import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { TreeNodeData } from '../../types';

const genderColor: Record<string, string> = {
  male: '#3b82f6',
  female: '#ec4899',
  other: '#8b5cf6',
  unknown: '#9ca3af',
};

export function PersonNode({ data, selected }: NodeProps & { data: TreeNodeData }) {
  const color = genderColor[data.gender] ?? '#9ca3af';
  const birthYear = data.birth_date?.slice(0, 4);
  const deathYear = data.death_date?.slice(0, 4);
  const years = birthYear ? `${birthYear}${deathYear ? ' – ' + deathYear : ' –'}` : '';

  return (
    <div style={{
      ...styles.node,
      borderLeft: `4px solid ${color}`,
      boxShadow: selected ? `0 0 0 2px ${color}` : '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      <Handle type="target" position={Position.Top} style={styles.handle} />
      <div style={styles.name}>{data.last_name} {data.first_name}</div>
      {years && <div style={styles.years}>{years}</div>}
      <Handle type="source" position={Position.Bottom} style={styles.handle} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  node: {
    background: 'white',
    borderRadius: 8,
    padding: '10px 14px',
    minWidth: 140,
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
  },
  name: { fontWeight: 700, fontSize: 14, color: '#111827', whiteSpace: 'nowrap' },
  years: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  handle: { background: '#d1d5db', width: 8, height: 8 },
};
