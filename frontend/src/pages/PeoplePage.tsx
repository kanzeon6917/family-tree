import { useState } from 'react';
import { PersonList } from '../components/persons/PersonList';
import { PersonForm } from '../components/persons/PersonForm';
import { PersonDetail } from '../components/persons/PersonDetail';
import { usePersons, useCreatePerson, useUpdatePerson, useDeletePerson } from '../hooks/usePersons';
import type { Person } from '../types';

type Mode = 'list' | 'create' | 'edit' | 'detail';

export function PeoplePage() {
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<Mode>('list');
  const [selected, setSelected] = useState<Person | null>(null);

  const { data: persons = [], isLoading } = usePersons(search || undefined);
  const createPerson = useCreatePerson();
  const updatePerson = useUpdatePerson();
  const deletePerson = useDeletePerson();

  const handleCreate = async (data: any) => {
    await createPerson.mutateAsync({
      ...data,
      birth_date: data.birth_date || null,
      death_date: data.death_date || null,
      notes: data.notes || null,
    });
    setMode('list');
  };

  const handleUpdate = async (data: any) => {
    if (!selected) return;
    await updatePerson.mutateAsync({
      id: selected.id,
      data: {
        ...data,
        birth_date: data.birth_date || null,
        death_date: data.death_date || null,
        notes: data.notes || null,
      },
    });
    setMode('list');
    setSelected(null);
  };

  const handleDelete = async (person: Person) => {
    if (!confirm(`「${person.last_name} ${person.first_name}」を削除しますか？`)) return;
    await deletePerson.mutateAsync(person.id);
    if (selected?.id === person.id) {
      setSelected(null);
      setMode('list');
    }
  };

  if (mode === 'create') {
    return (
      <div style={styles.page}>
        <h2 style={styles.title}>人物を追加</h2>
        <PersonForm
          onSubmit={handleCreate}
          onCancel={() => setMode('list')}
          isLoading={createPerson.isPending}
        />
      </div>
    );
  }

  if (mode === 'edit' && selected) {
    return (
      <div style={styles.page}>
        <h2 style={styles.title}>人物を編集</h2>
        <PersonForm
          person={selected}
          onSubmit={handleUpdate}
          onCancel={() => { setMode('list'); setSelected(null); }}
          isLoading={updatePerson.isPending}
        />
      </div>
    );
  }

  if (mode === 'detail' && selected) {
    return (
      <div style={styles.page}>
        <PersonDetail person={selected} onClose={() => { setMode('list'); setSelected(null); }} />
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>人物一覧</h2>
        <button style={styles.addBtn} onClick={() => setMode('create')}>+ 人物を追加</button>
      </div>
      <input
        style={styles.search}
        placeholder="名前で検索..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {isLoading ? (
        <p style={{ color: '#9ca3af', textAlign: 'center' }}>読み込み中...</p>
      ) : (
        <PersonList
          persons={persons}
          selectedId={selected?.id}
          onEdit={p => { setSelected(p); setMode('edit'); }}
          onDelete={handleDelete}
          onSelect={p => { setSelected(p); setMode('detail'); }}
        />
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: 20, display: 'flex', flexDirection: 'column', gap: 16, height: '100%', boxSizing: 'border-box', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' },
  addBtn: { padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  search: { padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none' },
};
