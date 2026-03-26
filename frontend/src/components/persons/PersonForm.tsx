import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Person } from '../../types';

const schema = z.object({
  last_name: z.string().min(1, '姓は必須です'),
  first_name: z.string().min(1, '名は必須です'),
  gender: z.enum(['male', 'female', 'other', 'unknown']),
  birth_date: z.string().optional(),
  death_date: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  person?: Person;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PersonForm({ person, onSubmit, onCancel, isLoading }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      last_name: '',
      first_name: '',
      gender: 'unknown',
      birth_date: '',
      death_date: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (person) {
      reset({
        last_name: person.last_name,
        first_name: person.first_name,
        gender: person.gender,
        birth_date: person.birth_date ?? '',
        death_date: person.death_date ?? '',
        notes: person.notes ?? '',
      });
    }
  }, [person, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>姓 *</label>
          <input style={styles.input} {...register('last_name')} placeholder="例: 山田" />
          {errors.last_name && <span style={styles.error}>{errors.last_name.message}</span>}
        </div>
        <div style={styles.field}>
          <label style={styles.label}>名 *</label>
          <input style={styles.input} {...register('first_name')} placeholder="例: 太郎" />
          {errors.first_name && <span style={styles.error}>{errors.first_name.message}</span>}
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>性別</label>
        <select style={styles.input} {...register('gender')}>
          <option value="unknown">不明</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
        </select>
      </div>

      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>生年月日</label>
          <input style={styles.input} type="date" {...register('birth_date')} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>没年月日</label>
          <input style={styles.input} type="date" {...register('death_date')} />
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>備考</label>
        <textarea style={{ ...styles.input, minHeight: 80 }} {...register('notes')} />
      </div>

      <div style={styles.actions}>
        <button type="button" style={styles.cancelBtn} onClick={onCancel}>キャンセル</button>
        <button type="submit" style={styles.submitBtn} disabled={isLoading}>
          {isLoading ? '保存中...' : '保存'}
        </button>
      </div>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  row: { display: 'flex', gap: 12 },
  field: { display: 'flex', flexDirection: 'column', gap: 4, flex: 1 },
  label: { fontSize: 13, fontWeight: 600, color: '#374151' },
  input: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  error: { fontSize: 12, color: '#ef4444' },
  actions: { display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 },
  cancelBtn: {
    padding: '8px 16px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    background: 'white',
    cursor: 'pointer',
    fontSize: 14,
  },
  submitBtn: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: 6,
    background: '#3b82f6',
    color: 'white',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
  },
};
