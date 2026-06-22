import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Module, Connection, ProjectSettings, SanekProject } from '@/types';
import { MODULE_DEFINITIONS } from '@/lib/moduleDefinitions';

interface PatchStore {
  modules: Module[];
  connections: Connection[];
  selectedModuleId: string | null;
  settings: ProjectSettings;
  
  addModule: (type: string, x: number, y: number) => string;
  removeModule: (id: string) => void;
  updateModule: (id: string, updates: Partial<Module>) => void;
  updateModuleParam: (id: string, param: string, value: number | boolean | string) => void;
  selectModule: (id: string | null) => void;
  
  addConnection: (sourceModuleId: string, sourcePortId: string, targetModuleId: string, targetPortId: string) => void;
  removeConnection: (id: string) => void;
  
  randomizeSelected: () => void;
  randomizeCategory: (category: string) => void;
  
  clearPatch: () => void;
  initPatch: () => void;
  
  updateSettings: (updates: Partial<ProjectSettings>) => void;
  exportProject: () => SanekProject;
  importProject: (project: SanekProject) => void;
}

let moduleCounter = 0;

export const usePatchStore = create<PatchStore>()(
  persist(
    (set, get) => ({
      modules: [],
      connections: [],
      selectedModuleId: null,
      settings: {
        polyphony: 8,
        sampleRate: 44100,
        theme: 'dark',
        autoSave: true,
        masterVolume: 0.8,
      },

      addModule: (type, x, y) => {
        const id = `module_${Date.now()}_${moduleCounter++}`;
        const def = MODULE_DEFINITIONS[type];
        if (!def) return id;

        const module: Module = {
          id,
          type: type as Module['type'],
          name: `${def.name} ${get().modules.filter(m => m.type === type).length + 1}`,
          x,
          y,
          params: { ...def.defaults },
          inputs: def.inputs.map(p => ({ ...p, id: `${id}_${p.id}` })),
          outputs: def.outputs.map(p => ({ ...p, id: `${id}_${p.id}` })),
        };

        set((state) => ({ modules: [...state.modules, module] }));
        return id;
      },

      removeModule: (id) => {
        set((state) => ({
          modules: state.modules.filter(m => m.id !== id),
          connections: state.connections.filter(
            c => c.sourceModuleId !== id && c.targetModuleId !== id
          ),
          selectedModuleId: state.selectedModuleId === id ? null : state.selectedModuleId,
        }));
      },

      updateModule: (id, updates) => {
        set((state) => ({
          modules: state.modules.map(m =>
            m.id === id ? { ...m, ...updates } : m
          ),
        }));
      },

      updateModuleParam: (id, param, value) => {
        set((state) => ({
          modules: state.modules.map(m =>
            m.id === id ? { ...m, params: { ...m.params, [param]: value } } : m
          ),
        }));
      },

      selectModule: (id) => set({ selectedModuleId: id }),

      addConnection: (sourceModuleId, sourcePortId, targetModuleId, targetPortId) => {
        const id = `conn_${Date.now()}`;
        set((state) => ({
          connections: [...state.connections, {
            id,
            sourceModuleId,
            sourcePortId,
            targetModuleId,
            targetPortId,
          }],
        }));
      },

      removeConnection: (id) => {
        set((state) => ({
          connections: state.connections.filter(c => c.id !== id),
        }));
      },

      randomizeSelected: () => {
        const { modules, selectedModuleId, updateModuleParam } = get();
        if (!selectedModuleId) return;
        
        const module = modules.find(m => m.id === selectedModuleId);
        if (!module) return;

        Object.keys(module.params).forEach(param => {
          const def = MODULE_DEFINITIONS[module.type];
          const defaultValue = def?.defaults[param];
          if (typeof defaultValue === 'number') {
            const range = Math.abs(defaultValue) * 2 || 1;
            const value = defaultValue + (Math.random() - 0.5) * range;
            updateModuleParam(module.id, param, Math.max(0, value));
          }
        });
      },

      randomizeCategory: (category) => {
        // Placeholder for categorized random patch generation
        const { modules, addModule, updateModuleParam } = get();
        // Implementation will be in Phase 2
      },

      clearPatch: () => {
        set({ modules: [], connections: [], selectedModuleId: null });
      },

      initPatch: () => {
        const { addModule, addConnection, clearPatch } = get();
        clearPatch();
        
        const oscId = addModule('oscillator', 100, 100);
        const filterId = addModule('filter', 400, 100);
        const outputId = addModule('output', 700, 100);
        
        // Simple init connections: osc -> filter -> output
        setTimeout(() => {
          const osc = get().modules.find(m => m.id === oscId);
          const filter = get().modules.find(m => m.id === filterId);
          const output = get().modules.find(m => m.id === outputId);
          
          if (osc && filter && output) {
            addConnection(oscId, osc.outputs[0]?.id || '', filterId, filter.inputs[0]?.id || '');
            addConnection(filterId, filter.outputs[0]?.id || '', outputId, output.inputs[0]?.id || '');
          }
        }, 0);
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      exportProject: () => {
        const { modules, connections, settings } = get();
        return {
          version: '0.1.0',
          name: 'Untitled Patch',
          author: '',
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
          modules,
          connections,
          settings,
          samples: [],
        };
      },

      importProject: (project) => {
        set({
          modules: project.modules,
          connections: project.connections,
          settings: project.settings,
        });
      },
    }),
    {
      name: 'sanek-synth-storage',
      partialize: (state) => ({
        modules: state.modules,
        connections: state.connections,
        settings: state.settings,
      }),
    }
  )
);
