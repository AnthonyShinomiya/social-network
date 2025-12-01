import { useState, useCallback } from "preact/hooks";
import JupiterNetwork from "./components/JupiterNetwork";
import { IdeaSidePanel } from "./components/IdeaSidePanel";
import TopRightHeader from "./components/TopRightHeader";

export default function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const handleNodeSelect = useCallback((node) => {
    setSelectedNode(node);
    setPanelOpen(true);
  }, []);

  return (
    <div class="relative w-screen h-screen bg-[#0b0c10] text-white overflow-hidden">
      <TopRightHeader />

      <IdeaSidePanel
        open={panelOpen}
        node={selectedNode}
        onClose={() => setPanelOpen(false)}
      />

      <JupiterNetwork onNodeSelect={handleNodeSelect} />
    </div>
  );
}
