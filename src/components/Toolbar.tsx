import { usePatchStore } from '@/stores/patchStore';
import { ManualModal } from './ManualModal';

export function Toolbar() {
  const { initPatch, settings, updateSettings, exportProject } = usePatchStore();

  const handleExport = () => {
    const project = exportProject();
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '_')}.sanek`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-12 bg-synth-panel border-b border-synth-border flex items-center px-4 gap-2">
      <h1 className="text-lg font-bold text-synth-accent mr-4">Sanek Synth</h1>

      <button
        onClick={initPatch}
        className="px-3 py-1.5 bg-synth-accent hover:bg-synth-accent/80 rounded text-sm font-medium transition-colors"
      >
        New Patch
      </button>

      <button
        onClick={handleExport}
        className="px-3 py-1.5 bg-synth-border hover:bg-synth-border/80 rounded text-sm font-medium transition-colors"
      >
        Export
      </button>

      <ManualModal />

      <div className="ml-auto flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-synth-muted">
          <span>Master</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.masterVolume}
            onChange={(e) => updateSettings({ masterVolume: parseFloat(e.target.value) })}
            className="w-24 accent-synth-accent"
          />
        </label>
      </div>
    </div>
  );
}
