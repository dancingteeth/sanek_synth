import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Module, Connection, ProjectSettings, SanekProject, ModuleType } from '@/types';
import { MODULE_DEFINITIONS } from '@/lib/moduleDefinitions';
import { audioEngine } from '@/lib/audioEngine';

interface PatchStore {
  modules: Module[];
  connections: Connection[];
  selectedModuleId: string | null;
  settings: ProjectSettings;
  
  addModule: (type: ModuleType, x: number, y: number) => string;
  removeModule: (id: string) => void;
  updateModule: (id: string, updates: Partial<Module>) => void;
  updateModuleParam: (id: string, param: string, value: number | boolean | string) => void;
  selectModule: (id: string | null) => void;
  
  addConnection: (sourceModuleId: string, sourcePortId: string, targetModuleId: string, targetPortId: string) => void;
  removeConnection: (id: string) => void;
  
  randomizeSelected: () => void;
  
  clearPatch: () => void;
  initPatch: () => void;
  
  updateSettings: (updates: Partial<ProjectSettings>) => void;
  exportProject: () => SanekProject;
  importProject: (project: SanekProject) => void;
}

let moduleCounter = 0;
let connectionCounter = 0;

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
          type,
          name: `${def.name} ${get().modules.filter(m => m.type === type).length + 1}`,
          position: { x, y },
          params: { ...def.defaults },
          inputs: def.inputs.map(p => ({ ...p, id: `${id}_${p.id}` })),
          outputs: def.outputs.map(p => ({ ...p, id: `${id}_${p.id}` })),
        };

        set((state) => ({ modules: [...state.modules, module] }));
        
        // Wire audio engine
        try {
          if (audioEngine.getContext()) {
            audioEngine.createModuleNode(id, type, module.params);
          }
        } catch {
          // AudioEngine not initialized (e.g., in tests)
        }
        
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
        
        // Sync to audio engine
        try {
          audioEngine.setParam(id, param, value);
        } catch {
          // AudioEngine not initialized
        }
      },

      selectModule: (id) => set({ selectedModuleId: id }),

      addConnection: (sourceModuleId, sourcePortId, targetModuleId, targetPortId) => {
        const id = `conn_${Date.now()}_${connectionCounter++}`;
        set((state) => ({
          connections: [...state.connections, {
            id,
            sourceModuleId,
            sourcePortId,
            targetModuleId,
            targetPortId,
          }],
        }));
        
        // Wire audio engine
        try {
          audioEngine.connect(sourceModuleId, sourcePortId, targetModuleId, targetPortId);
        } catch {
          // AudioEngine not initialized
        }
      },

      removeConnection: (id) => {
        const conn = get().connections.find(c => c.id === id);
        if (conn) {
          try {
            audioEngine.disconnect(conn.sourceModuleId, conn.sourcePortId, conn.targetModuleId, conn.targetPortId);
          } catch {
            // AudioEngine not initialized
          }
        }
        set((state) => ({
          connections: state.connections.filter(c => c.id !== id),
        }));
      },

      randomizeSelected: () => {
        const { modules, selectedModuleId, updateModuleParam } = get();
        if (!selectedModuleId) return;
        
        const module = modules.find(m => m.id === selectedModuleId);
        if (!module) return;

        const def = MODULE_DEFINITIONS[module.type];
        Object.entries(module.params).forEach(([param, value]) => {
          if (typeof value === 'number') {
            const range = def.paramRanges?.[param];
            const min = range?.min ?? Math.min(value * 0.5, 0);
            const max = range?.max ?? Math.max(value * 1.5, 1);
            const newValue = min + Math.random() * (max - min);
            updateModuleParam(module.id, param, Math.max(min, Math.min(max, newValue)));
          }
        });
      },

      clearPatch: () => {
        set({ modules: [], connections: [], selectedModuleId: null });
      },

      initPatch: async () => {
        const { addModule, addConnection } = get();
        
        try {
          await audioEngine.init();
        } catch {}
        
        const oscId = addModule('oscillator', 100, 100);
        const filterId = addModule('filter', 400, 100);
        const outputId = addModule('output', 700, 100);
        
        const osc = get().modules.find(m => m.id === oscId);
        const filter = get().modules.find(m => m.id === filterId);
        const output = get().modules.find(m => m.id === outputId);
        
        if (osc && filter && output) {
          addConnection(oscId, osc.outputs[0]?.id || '', filterId, filter.inputs[0]?.id || '');
          addConnection(filterId, filter.outputs[0]?.id || '', outputId, output.inputs[0]?.id || '');
        }
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
