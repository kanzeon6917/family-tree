import client from './client';
import type { Relationship, RelationshipCreate, RelationshipUpdate } from '../types';

export const relationshipApi = {
  list: (personId?: number) =>
    client.get<Relationship[]>('/relationships', {
      params: personId != null ? { person_id: personId } : {},
    }).then(r => r.data),

  create: (data: RelationshipCreate) =>
    client.post<Relationship>('/relationships', data).then(r => r.data),

  update: (id: number, data: RelationshipUpdate) =>
    client.put<Relationship>(`/relationships/${id}`, data).then(r => r.data),

  delete: (id: number) =>
    client.delete(`/relationships/${id}`),
};
