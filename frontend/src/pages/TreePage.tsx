import { useState } from 'react';
import { FamilyTree } from '../components/tree/FamilyTree';
import { PersonDetail } from '../components/persons/PersonDetail';
import { usePerson } from '../hooks/usePersons';

export function TreePage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: selectedPerson } = usePerson(selectedId ?? 0);

  return (
    <div style={styles.container}>
      <div style={styles.canvas}>
        <FamilyTree onSelectPerson={id => setSelectedId(id)} />
      </div>
      {selectedPerson && (
        <div style={styles.panel}>
          <PersonDetail person={selectedPerson} onClose={() => setSelectedId(null)} />
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', height: '100%', overflow: 'hidden' },
  canvas: { flex: 1, height: '100%' },
  panel: {
    width: 320,
    height: '100%',
    overflowY: 'auto',
    borderLeft: '1px solid #e5e7eb',
    padding: 20,
    boxSizing: 'border-box',
    background: 'white',
  },
};
