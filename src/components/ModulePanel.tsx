import { usePatchStore } from '@/stores/patchStore';
import { MODULE_DEFINITIONS } from '@/lib/moduleDefinitions';
import type { ModuleType } from '@/types';

const MODULE_CATEGORIES = [
  { id: 'source', name: 'Sources', color: 'border-emerald-500/50 bg-emerald-500/10' },
  { id: 'effect', name: 'Effects', color: 'border-blue-500/50 bg-blue-500/10' },
  { id: 'modulation', name: 'Modulation', color: 'border-purple-500/50 bg-purple-500/10' },
  { id: 'utility', name: 'Utility', color: 'border-amber-500/50 bg-amber-500/10' },
];

export function ModulePanel() {
  const addModule = usePatchStore((s) => s.addModule);

  const handleDragStart = (e: React.DragEvent, type: ModuleType) => {
    e.dataTransfer.setData('application/reactflow', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-synth-panel border-r border-synth-border flex flex-col">
      <div className="p-3 border-b border-synth-border">
        <h2 className="text-sm font-semibold text-synth-muted uppercase tracking-wider">Modules</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {MODULE_CATEGORIES.map((category) => (
          <div key={category.id}>
            <h3 className="text-xs font-medium text-synth-muted mb-2 px-1">{category.name}</h3>
            <div className="space-y-1">
              {Object.entries(MODULE_DEFINITIONS)
                .filter(([, def]) => def.category === category.id)
                .map(([type, def]) => (
                  <button
                    key={type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, type as ModuleType)}
                    onClick={() => addModule(type as ModuleType, 100 + Math.random() * 200, 100 + Math.random() * 200)}
                    className={`w-full text-left px-3 py-2 rounded border text-sm hover:bg-synth-border/50 transition-colors ${category.color}`}
                  >
                    {def.name}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
