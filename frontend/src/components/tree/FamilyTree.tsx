import { useEffect, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from '@dagrejs/dagre';
import { useQuery } from '@tanstack/react-query';
import { treeApi } from '../../api/tree';
import { PersonNode } from './PersonNode';
import { SpouseEdge } from './SpouseEdge';

const nodeTypes = { personNode: PersonNode };
const edgeTypes = { spouseEdge: SpouseEdge };

const NODE_WIDTH = 160;
const NODE_HEIGHT = 60;

function applyDagreLayout(nodes: Node[], edges: Edge[]): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', ranksep: 100, nodesep: 60 });

  nodes.forEach(node => g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT }));

  // Only use parent_child edges for hierarchy layout
  edges
    .filter(e => e.type === 'parentChildEdge')
    .forEach(e => g.setEdge(e.source, e.target));

  dagre.layout(g);

  return nodes.map(node => {
    const pos = g.node(node.id);
    return {
      ...node,
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
    };
  });
}

interface Props {
  onSelectPerson?: (personId: number) => void;
}

export function FamilyTree({ onSelectPerson }: Props) {
  const { data: treeData, isLoading, error } = useQuery({
    queryKey: ['tree'],
    queryFn: () => treeApi.get(),
  });

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!treeData) return;

    const rawNodes: Node[] = treeData.nodes.map(n => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: n.data,
    }));

    const rawEdges: Edge[] = treeData.edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: e.type,
      data: e.data,
      animated: false,
    }));

    const layoutedNodes = applyDagreLayout(rawNodes, rawEdges);
    setNodes(layoutedNodes);
    setEdges(rawEdges);
  }, [treeData, setNodes, setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const personId = (node.data as { id: number }).id;
    onSelectPerson?.(personId);
  }, [onSelectPerson]);

  const defaultEdgeOptions = useMemo(() => ({
    style: { stroke: '#6b7280', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#6b7280' },
  }), []);

  if (isLoading) {
    return <div style={styles.center}>読み込み中...</div>;
  }

  if (error) {
    return <div style={styles.center}>エラーが発生しました</div>;
  }

  if (nodes.length === 0) {
    return (
      <div style={styles.center}>
        <p style={{ color: '#6b7280', fontSize: 16 }}>
          家系図がまだありません。<br />左側の「人物」タブから人物を追加してください。
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background />
        <Controls />
        <MiniMap nodeStrokeWidth={3} />
      </ReactFlow>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  center: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100%', textAlign: 'center',
  },
};
