import { describe, it, expect, beforeEach } from 'vitest';
import { usePatchStore } from '@/stores/patchStore';

describe('patchStore', () => {
  beforeEach(() => {
    localStorage.clear();
    usePatchStore.setState({
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
    });
  });

  it('initPatch creates 3 modules and 2 connections', () => {
    usePatchStore.getState().initPatch();
    
    const state = usePatchStore.getState();
    expect(state.modules).toHaveLength(3);
    expect(state.connections).toHaveLength(2);
    
    const types = state.modules.map(m => m.type);
    expect(types).toContain('oscillator');
    expect(types).toContain('filter');
    expect(types).toContain('output');
  });

  it('addModule and removeModule work correctly', () => {
    const id = usePatchStore.getState().addModule('oscillator', 100, 100);
    expect(usePatchStore.getState().modules).toHaveLength(1);
    
    usePatchStore.getState().removeModule(id);
    expect(usePatchStore.getState().modules).toHaveLength(0);
  });

  it('addConnection and removeConnection work correctly', () => {
    usePatchStore.getState().initPatch();
    const stateBefore = usePatchStore.getState();
    console.log('connections before remove:', stateBefore.connections.length, stateBefore.connections.map(c => c.id));
    const connectionId = stateBefore.connections[0].id;
    
    usePatchStore.getState().removeConnection(connectionId);
    const stateAfter = usePatchStore.getState();
    console.log('connections after remove:', stateAfter.connections.length, stateAfter.connections.map(c => c.id));
    expect(stateAfter.connections).toHaveLength(1);
  });

  it('updateModuleParam updates module params', () => {
    const id = usePatchStore.getState().addModule('oscillator', 0, 0);
    usePatchStore.getState().updateModuleParam(id, 'frequency', 880);
    
    const module = usePatchStore.getState().modules.find(m => m.id === id);
    expect(module?.params.frequency).toBe(880);
  });

  it('exportProject returns valid SanekProject', () => {
    usePatchStore.getState().initPatch();
    const project = usePatchStore.getState().exportProject();
    
    expect(project.version).toBe('0.1.0');
    expect(project.modules).toHaveLength(3);
    expect(project.connections).toHaveLength(2);
    expect(project.settings).toBeDefined();
  });
});
