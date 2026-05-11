import type { Person } from '../../types';

interface Props {
  persons: Person[];
  onEdit: (person: Person) => void;
  onDelete: (person: Person) => void;
  onSelect: (person: Person) => void;
  selectedId?: number;
}

const genderLabel: Record<string, string> = {
  male: '男',
  female: '女',
  other: '他',
  unknown: '?',
};

const genderColor: Record<string, string> = {
  male: '#3b82f6',
  female: '#ec4899',
  other: '#8b5cf6',
  unknown: '#9ca3af',
};

export function PersonList({ persons, onEdit, onDelete, onSelect, selectedId }: Props) {
  if (persons.length === 0) {
    return (
      <div style={styles.empty}>
        人物が登録されていません。<br />「+ 人物を追加」から始めましょう。
      </div>
    );
  }

  return (
    <div style={styles.list}>
      {persons.map(p => (
        <div
          key={p.id}
          style={{
            ...styles.card,
            borderLeft: `4px solid ${genderColor[p.gender] ?? '#9ca3af'}`,
            background: selectedId === p.id ? '#eff6ff' : 'white',
          }}
          onClick={() => onSelect(p)}
        >
          <div style={styles.cardMain}>
            <span style={styles.genderBadge}>
              {genderLabel[p.gender] ?? '?'}
            </span>
            <div style={styles.nameBlock}>
              <span style={styles.name}>{p.last_name} {p.first_name}</span>
              {(p.birth_date || p.death_date) && (
                <span style={styles.dates}>
                  {p.birth_date?.slice(0, 4) ?? '?'} – {p.death_date?.slice(0, 4) ?? ''}
                </span>
              )}
            </div>
          </div>
          <div style={styles.actions} onClick={e => e.stopPropagation()}>
            <button style={styles.editBtn} onClick={() => onEdit(p)}>編集</button>
            <button style={styles.deleteBtn} onClick={() => onDelete(p)}>削除</button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  list: { display: 'flex', flexDirection: 'column', gap: 8 },
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  cardMain: { display: 'flex', alignItems: 'center', gap: 10 },
  genderBadge: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
    color: '#6b7280',
  },
  nameBlock: { display: 'flex', flexDirection: 'column' },
  name: { fontSize: 15, fontWeight: 600, color: '#111827' },
  dates: { fontSize: 12, color: '#6b7280' },
  actions: { display: 'flex', gap: 6 },
  editBtn: {
    padding: '4px 10px',
    fontSize: 12,
    border: '1px solid #d1d5db',
    borderRadius: 4,
    background: 'white',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '4px 10px',
    fontSize: 12,
    border: '1px solid #fca5a5',
    borderRadius: 4,
    background: '#fef2f2',
    color: '#dc2626',
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 14,
    padding: '40px 20px',
    lineHeight: 1.6,
  },
};
