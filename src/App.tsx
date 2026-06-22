import { Toolbar } from '@/components/Toolbar';
import { ModulePanel } from '@/components/ModulePanel';
import { Workspace } from '@/components/Workspace';
import { useKeyboard } from '@/hooks/useAudio';

function App() {
  useKeyboard();

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-synth-bg">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <ModulePanel />
        <Workspace />
      </div>
    </div>
  );
}

export default App;
