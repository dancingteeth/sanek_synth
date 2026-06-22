import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { usePatchStore } from '@/stores/patchStore';
import type { Module } from '@/types';

interface ModuleNodeData {
  module: Module;
  isSelected: boolean;
}

function ModuleNode({ data, id }: NodeProps<ModuleNodeData>) {
  const { updateModuleParam, removeModule, selectModule } = usePatchStore();
  const module = data.module;

  const handleParamChange = (param: string, value: number | boolean | string) => {
    updateModuleParam(id, param, value);
  };

  const categoryColors: Record<string, string> = {
    source: 'border-emerald-500/50 bg-emerald-500/10',
    effect: 'border-blue-500/50 bg-blue-500/10',
    modulation: 'border-purple-500/50 bg-purple-500/10',
    utility: 'border-amber-500/50 bg-amber-500/10',
  };

  return (
    <div
      className={`min-w-[180px] rounded-lg border-2 bg-synth-panel shadow-lg ${
        data.isSelected ? 'border-synth-accent' : categoryColors[module.type] || 'border-synth-border'
      }`}
      onClick={() => selectModule(id)}
    >
      <div className="px-3 py-2 border-b border-synth-border flex items-center justify-between">
        <span className="text-sm font-semibold text-synth-text">{module.name}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeModule(id);
          }}
          className="text-synth-muted hover:text-red-400 text-xs px-1"
        >
          ×
        </button>
      </div>
      
      <div className="p-3 space-y-2">
        {Object.entries(module.params).map(([key, value]) => {
          if (typeof value === 'boolean') {
            return (
              <label key={key} className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleParamChange(key, e.target.checked)}
                  className="accent-synth-accent"
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="text-synth-muted capitalize">{key}</span>
              </label>
            );
          }
          
          if (typeof value === 'number') {
            const isInteger = Number.isInteger(value);
            return (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-synth-muted capitalize">{key}</span>
                  <span className="text-synth-text font-mono">
                    {isInteger ? value : value.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={value * 3 || 100}
                  step={isInteger ? 1 : 0.01}
                  value={value}
                  onChange={(e) => handleParamChange(key, isInteger ? parseInt(e.target.value) : parseFloat(e.target.value))}
                  className="w-full h-1 accent-synth-accent"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            );
          }
          
          return (
            <div key={key} className="text-xs">
              <span className="text-synth-muted capitalize">{key}: </span>
              <span className="text-synth-text font-mono">{value}</span>
            </div>
          );
        })}
      </div>

      {module.inputs.length > 0 && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
          {module.inputs.map((input) => (
            <Handle
              key={input.id}
              type="target"
              position={Position.Left}
              id={input.id}
              className="w-3 h-3 bg-synth-accent border-2 border-synth-bg"
            />
          ))}
        </div>
      )}

      {module.outputs.length > 0 && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
          {module.outputs.map((output) => (
            <Handle
              key={output.id}
              type="source"
              position={Position.Right}
              id={output.id}
              className="w-3 h-3 bg-synth-accent2 border-2 border-synth-bg"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(ModuleNode);
