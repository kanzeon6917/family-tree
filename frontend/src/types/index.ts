export type Gender = 'male' | 'female' | 'other' | 'unknown';
export type RelationshipType = 'parent_child' | 'spouse';

export interface Person {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  death_date: string | null;
  gender: Gender;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PersonCreate {
  first_name: string;
  last_name: string;
  birth_date?: string | null;
  death_date?: string | null;
  gender?: Gender;
  notes?: string | null;
}

export interface PersonUpdate extends Partial<PersonCreate> {}

export interface Relationship {
  id: number;
  person1_id: number;
  person2_id: number;
  relationship_type: RelationshipType;
  birth_order: number | null;
  created_at: string;
}

export interface RelationshipCreate {
  person1_id: number;
  person2_id: number;
  relationship_type: RelationshipType;
  birth_order?: number | null;
}

export interface RelationshipUpdate {
  birth_order?: number | null;
}

export interface TreeNodeData {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  death_date: string | null;
  gender: string;
}

export interface TreeNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: TreeNodeData;
}

export interface TreeEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  data: { relationship_type: string; birth_order: number | null; rel_id: number };
}

export interface TreeResponse {
  nodes: TreeNode[];
  edges: TreeEdge[];
}
