import { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { usePatchStore } from '@/stores/patchStore';
import { ModuleNode } from './ModuleNode';

const nodeTypes = {
  module: ModuleNode,
};

export function Workspace() {
  const { modules, connections, addModule, addConnection, selectModule, selectedModuleId } = usePatchStore();
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Sync store modules to React Flow nodes
  const syncNodes = useCallback(() => {
    const flowNodes: Node[] = modules.map(m => ({
      id: m.id,
      type: 'module',
      position: { x: m.x, y: m.y },
      data: { 
        module: m,
        isSelected: selectedModuleId === m.id,
      },
    }));
    setNodes(flowNodes);
  }, [modules, selectedModuleId, setNodes]);

  const syncEdges = useCallback(() => {
    const flowEdges: Edge[] = connections.map(c => ({
      id: c.id,
      source: c.sourceModuleId,
      target: c.targetModuleId,
      sourceHandle: c.sourcePortId,
      targetHandle: c.targetPortId,
      animated: true,
      style: { stroke: '#7c3aed', strokeWidth: 2 },
    }));
    setEdges(flowEdges);
  }, [connections, setEdges]);

  // Sync when store changes
  if (nodes.length !== modules.length || edges.length !== connections.length) {
    syncNodes();
    syncEdges();
  }

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        addConnection(params.source, params.sourceHandle || '', params.target, params.targetHandle || '');
      }
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#7c3aed', strokeWidth: 2 } }, eds));
    },
    [addConnection, setEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectModule(node.id);
    },
    [selectModule]
  );

  const onPaneClick = useCallback(() => {
    selectModule(null);
  }, [selectModule]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = {
        x: event.clientX - 200,
        y: event.clientY - 50,
      };

      addModule(type, position.x, position.y);
    },
    [addModule]
  );

  return (
    <div className="flex-1 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#7c3aed', strokeWidth: 2 },
        }}
      >
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            const data = node.data as { module?: { type: string } };
            switch (data.module?.type) {
              case 'oscillator':
              case 'wavetable':
              case 'noise':
              case 'sample':
                return '#10b981';
              case 'filter':
              case 'reverb':
              case 'delay':
              case 'distortion':
                return '#3b82f6';
              case 'lfo':
              case 'adsr':
              case 'random':
                return '#a855f7';
              default:
                return '#64748b';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.8)"
        />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#2a2a3a" />
      </ReactFlow>
      
      {modules.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-synth-muted">
            <p className="text-lg mb-2">No modules yet</p>
            <p className="text-sm">Add modules from the left panel or click New Patch</p>
          </div>
        </div>
      )}
    </div>
  );
}
