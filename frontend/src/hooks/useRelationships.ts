import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { relationshipApi } from '../api/relationships';
import type { RelationshipCreate, RelationshipUpdate } from '../types';

export function useRelationships(personId?: number) {
  return useQuery({
    queryKey: ['relationships', personId],
    queryFn: () => relationshipApi.list(personId),
  });
}

export function useCreateRelationship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: RelationshipCreate) => relationshipApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['relationships'] });
      qc.invalidateQueries({ queryKey: ['tree'] });
    },
  });
}

export function useUpdateRelationship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RelationshipUpdate }) =>
      relationshipApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['relationships'] });
      qc.invalidateQueries({ queryKey: ['tree'] });
    },
  });
}

export function useDeleteRelationship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => relationshipApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['relationships'] });
      qc.invalidateQueries({ queryKey: ['tree'] });
    },
  });
}
