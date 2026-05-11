import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { personApi } from '../api/persons';
import type { PersonCreate, PersonUpdate } from '../types';

export function usePersons(search?: string) {
  return useQuery({
    queryKey: ['persons', search],
    queryFn: () => personApi.list(search),
  });
}

export function usePerson(id: number) {
  return useQuery({
    queryKey: ['persons', id],
    queryFn: () => personApi.get(id),
    enabled: id > 0,
  });
}

export function useCreatePerson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PersonCreate) => personApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['persons'] });
      qc.invalidateQueries({ queryKey: ['tree'] });
    },
  });
}

export function useUpdatePerson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PersonUpdate }) => personApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['persons'] });
      qc.invalidateQueries({ queryKey: ['tree'] });
    },
  });
}

export function useDeletePerson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => personApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['persons'] });
      qc.invalidateQueries({ queryKey: ['tree'] });
      qc.invalidateQueries({ queryKey: ['relationships'] });
    },
  });
}
