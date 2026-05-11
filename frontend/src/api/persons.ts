import client from './client';
import type { Person, PersonCreate, PersonUpdate } from '../types';

export const personApi = {
  list: (search?: string) =>
    client.get<Person[]>('/persons', { params: search ? { search } : {} }).then(r => r.data),

  get: (id: number) =>
    client.get<Person>(`/persons/${id}`).then(r => r.data),

  create: (data: PersonCreate) =>
    client.post<Person>('/persons', data).then(r => r.data),

  update: (id: number, data: PersonUpdate) =>
    client.put<Person>(`/persons/${id}`, data).then(r => r.data),

  delete: (id: number) =>
    client.delete(`/persons/${id}`),
};
