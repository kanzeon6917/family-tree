import { useState } from 'react';
import type { Person } from '../../types';
import { useRelationships, useDeleteRelationship } from '../../hooks/useRelationships';
import { usePersons } from '../../hooks/usePersons';
import { RelationshipForm } from '../relationships/RelationshipForm';

interface Props {
  person: Person;
  onClose: () => void;
}

const genderLabel: Record<string, string> = {
  male: '男性', female: '女性', other: 'その他', unknown: '不明',
};

export function PersonDetail({ person, onClose }: Props) {
  const [showRelForm, setShowRelForm] = useState(false);
  const { data: allPersons = [] } = usePersons();
  const { data: relationships = [] } = useRelationships(person.id);
  const deleteRel = useDeleteRelationship();

  const personMap = Object.fromEntries(allPersons.map(p => [p.id, p]));

  const parents = relationships
    .filter(r => r.relationship_type === 'parent_child' && r.person2_id === person.id)
    .map(r => ({ rel: r, person: personMap[r.person1_id] }))
    .filter(x => x.person);

  const children = relationships
    .filter(r => r.relationship_type === 'parent_child' && r.person1_id === person.id)
    .sort((a, b) => (a.birth_order ?? 999) - (b.birth_order ?? 999))
    .map(r => ({ rel: r, person: personMap[r.person2_id] }))
    .filter(x => x.person);

  const spouses = relationships
    .filter(r => r.relationship_type === 'spouse')
    .map(r => ({
      rel: r,
      person: personMap[r.person1_id === person.id ? r.person2_id : r.person1_id],
    }))
    .filter(x => x.person);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.name}>{person.last_name} {person.first_name}</h2>
          <span style={styles.gender}>{genderLabel[person.gender]}</span>
        </div>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>
      </div>

      <div style={styles.infoGrid}>
        <span style={styles.infoLabel}>生年月日</span>
        <span>{person.birth_date ?? '—'}</span>
        <span style={styles.infoLabel}>没年月日</span>
        <span>{person.death_date ?? '—'}</span>
        {person.notes && (
          <>
            <span style={styles.infoLabel}>備考</span>
            <span style={{ whiteSpace: 'pre-wrap' }}>{person.notes}</span>
          </>
        )}
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>親</h3>
        {parents.length === 0 ? <p style={styles.empty}>なし</p> : parents.map(({ rel, person: p }) => (
          <RelItem key={rel.id} name={`${p.last_name} ${p.first_name}`} onDelete={() => deleteRel.mutate(rel.id)} />
        ))}
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>子</h3>
        {children.length === 0 ? <p style={styles.empty}>なし</p> : children.map(({ rel, person: p }) => (
          <RelItem
            key={rel.id}
            name={`${p.last_name} ${p.first_name}`}
            suffix={rel.birth_order ? `（第${rel.birth_order}子）` : undefined}
            onDelete={() => deleteRel.mutate(rel.id)}
          />
        ))}
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>配偶者</h3>
        {spouses.length === 0 ? <p style={styles.empty}>なし</p> : spouses.map(({ rel, person: p }) => (
          <RelItem key={rel.id} name={`${p.last_name} ${p.first_name}`} onDelete={() => deleteRel.mutate(rel.id)} />
        ))}
      </div>

      <button style={styles.addRelBtn} onClick={() => setShowRelForm(true)}>
        + 関係を追加
      </button>

      {showRelForm && (
        <RelationshipForm
          currentPersonId={person.id}
          onClose={() => setShowRelForm(false)}
        />
      )}
    </div>
  );
}

function RelItem({ name, suffix, onDelete }: { name: string; suffix?: string; onDelete: () => void }) {
  return (
    <div style={styles.relItem}>
      <span>{name}{suffix && <span style={styles.suffix}>{suffix}</span>}</span>
      <button style={styles.deleteRelBtn} onClick={onDelete}>削除</button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: 16 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { margin: 0, fontSize: 20, fontWeight: 700 },
  gender: { fontSize: 13, color: '#6b7280', marginTop: 4, display: 'block' },
  closeBtn: { background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#6b7280' },
  infoGrid: { display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 16px', fontSize: 14 },
  infoLabel: { color: '#6b7280', fontWeight: 600 },
  section: { borderTop: '1px solid #e5e7eb', paddingTop: 12 },
  sectionTitle: { margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: '#374151' },
  empty: { fontSize: 13, color: '#9ca3af', margin: 0 },
  relItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', fontSize: 14 },
  suffix: { fontSize: 12, color: '#6b7280', marginLeft: 4 },
  deleteRelBtn: { padding: '2px 8px', fontSize: 12, border: '1px solid #fca5a5', borderRadius: 4, background: '#fef2f2', color: '#dc2626', cursor: 'pointer' },
  addRelBtn: { padding: '8px 16px', border: '1px dashed #3b82f6', borderRadius: 6, background: '#eff6ff', color: '#3b82f6', cursor: 'pointer', fontSize: 14, fontWeight: 600 },
};
