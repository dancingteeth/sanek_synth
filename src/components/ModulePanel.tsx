import { usePatchStore } from '@/stores/patchStore';
import { MODULE_DEFINITIONS } from '@/lib/moduleDefinitions';

const MODULE_CATEGORIES = [
  { id: 'source', name: 'Sources', color: 'bg-emerald-500/20 border-emerald-500/50' },
  { id: 'effect', name: 'Effects', color: 'bg-blue-500/20 border-blue-500/50' },
  { id: 'modulation', name: 'Modulation', color: 'bg-purple-500/20 border-purple-500/50' },
  { id: 'utility', name: 'Utility', color: 'bg-amber-500/20 border-amber-500/50' },
];

export function ModulePanel() {
  const { addModule } = usePatchStore();

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
                    onClick={() => addModule(type, 100 + Math.random() * 200, 100 + Math.random() * 200)}
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
