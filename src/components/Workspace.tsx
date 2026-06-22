import { useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  Connection,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { usePatchStore } from '@/stores/patchStore';
import ModuleNode from './ModuleNode';
import { MODULE_DEFINITIONS } from '@/lib/moduleDefinitions';
import type { ModuleType } from '@/types';

const nodeTypes = {
  module: ModuleNode,
};

export function Workspace() {
  const modules = usePatchStore((s) => s.modules);
  const connections = usePatchStore((s) => s.connections);
  const addModule = usePatchStore((s) => s.addModule);
  const addConnection = usePatchStore((s) => s.addConnection);
  const selectModule = usePatchStore((s) => s.selectModule);
  const selectedModuleId = usePatchStore((s) => s.selectedModuleId);

  const nodes: Node[] = useMemo(() => 
    modules.map(m => ({
      id: m.id,
      type: 'module',
      position: m.position,
      data: { 
        module: m,
        isSelected: selectedModuleId === m.id,
      },
    })),
    [modules, selectedModuleId]
  );

  const edges: Edge[] = useMemo(() => 
    connections.map(c => ({
      id: c.id,
      source: c.sourceModuleId,
      target: c.targetModuleId,
      sourceHandle: c.sourcePortId,
      targetHandle: c.targetPortId,
      animated: true,
      style: { stroke: '#7c3aed', strokeWidth: 2 },
    })),
    [connections]
  );

  const onNodesChange = useCallback((changes: any) => {
    for (const change of changes) {
      if (change.type === 'position' && change.position) {
        usePatchStore.getState().updateModule(change.id, {
          position: { x: change.position.x, y: change.position.y },
        });
      }
    }
  }, []);

  const onEdgesChange = useCallback((changes: any) => {
    for (const change of changes) {
      if (change.type === 'remove') {
        usePatchStore.getState().removeConnection(change.id);
      }
    }
  }, []);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        addConnection(params.source, params.sourceHandle || '', params.target, params.targetHandle || '');
      }
    },
    [addConnection]
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
      if (!(type in MODULE_DEFINITIONS)) return;

      const position = {
        x: event.clientX - 200,
        y: event.clientY - 50,
      };

      addModule(type as ModuleType, position.x, position.y);
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
            const data = node.data as { module?: { type: ModuleType } };
            const def = data.module ? MODULE_DEFINITIONS[data.module.type] : undefined;
            switch (def?.category) {
              case 'source':
                return '#10b981';
              case 'effect':
                return '#3b82f6';
              case 'modulation':
                return '#a855f7';
              case 'utility':
                return '#f59e0b';
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
