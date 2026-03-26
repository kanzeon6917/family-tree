import client from './client';
import type { TreeResponse } from '../types';

export const treeApi = {
  get: () => client.get<TreeResponse>('/tree').then(r => r.data),
};
