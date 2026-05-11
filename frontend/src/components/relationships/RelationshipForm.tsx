import { useState } from 'react';
import { usePersons } from '../../hooks/usePersons';
import { useCreateRelationship } from '../../hooks/useRelationships';
import type { RelationshipType } from '../../types';

interface Props {
  currentPersonId: number;
  onClose: () => void;
}

export function RelationshipForm({ currentPersonId, onClose }: Props) {
  const { data: persons = [] } = usePersons();
  const createRel = useCreateRelationship();

  const [type, setType] = useState<RelationshipType>('parent_child');
  const [role, setRole] = useState<'parent' | 'child'>('child');
  const [targetId, setTargetId] = useState<number | ''>('');
  const [birthOrder, setBirthOrder] = useState<number | ''>('');
  const [error, setError] = useState('');

  const others = persons.filter(p => p.id !== currentPersonId);

  const handleSubmit = async () => {
    if (targetId === '') {
      setError('対象人物を選択してください');
      return;
    }
    setError('');

    let p1 = currentPersonId;
    let p2 = targetId as number;

    if (type === 'parent_child') {
      if (role === 'child') {
        // currentPerson is child → target is parent
        p1 = targetId as number;
        p2 = currentPersonId;
      }
      // role === 'parent': currentPerson is parent → p1=currentPerson, p2=target
    }

    try {
      await createRel.mutateAsync({
        person1_id: p1,
        person2_id: p2,
        relationship_type: type,
        birth_order: type === 'parent_child' && birthOrder !== '' ? (birthOrder as number) : null,
      });
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? '登録に失敗しました');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>関係を追加</h3>

        <div style={styles.field}>
          <label style={styles.label}>関係の種類</label>
          <select style={styles.input} value={type} onChange={e => setType(e.target.value as RelationshipType)}>
            <option value="parent_child">親子</option>
            <option value="spouse">配偶者</option>
          </select>
        </div>

        {type === 'parent_child' && (
          <div style={styles.field}>
            <label style={styles.label}>この人物の立場</label>
            <select style={styles.input} value={role} onChange={e => setRole(e.target.value as 'parent' | 'child')}>
              <option value="child">子（対象人物が親）</option>
              <option value="parent">親（対象人物が子）</option>
            </select>
          </div>
        )}

        <div style={styles.field}>
          <label style={styles.label}>対象人物</label>
          <select style={styles.input} value={targetId} onChange={e => setTargetId(Number(e.target.value))}>
            <option value="">-- 選択してください --</option>
            {others.map(p => (
              <option key={p.id} value={p.id}>{p.last_name} {p.first_name}</option>
            ))}
          </select>
        </div>

        {type === 'parent_child' && role === 'parent' && (
          <div style={styles.field}>
            <label style={styles.label}>生まれ順（長男=1、次男=2…）</label>
            <input
              style={styles.input}
              type="number"
              min={1}
              placeholder="省略可"
              value={birthOrder}
              onChange={e => setBirthOrder(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
        )}

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onClose}>キャンセル</button>
          <button style={styles.submitBtn} onClick={handleSubmit} disabled={createRel.isPending}>
            {createRel.isPending ? '登録中...' : '登録'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
  },
  modal: {
    background: 'white', borderRadius: 12, padding: 24, width: 400,
    display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
  },
  title: { margin: 0, fontSize: 18, fontWeight: 700 },
  field: { display: 'flex', flexDirection: 'column', gap: 4 },
  label: { fontSize: 13, fontWeight: 600, color: '#374151' },
  input: { padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 },
  error: { color: '#dc2626', fontSize: 13, margin: 0 },
  actions: { display: 'flex', gap: 8, justifyContent: 'flex-end' },
  cancelBtn: { padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: 6, background: 'white', cursor: 'pointer', fontSize: 14 },
  submitBtn: { padding: '8px 16px', border: 'none', borderRadius: 6, background: '#3b82f6', color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600 },
};
