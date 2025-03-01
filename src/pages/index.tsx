import type { NextPage } from 'next';
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { VisualizationPanel } from '@/components/panels/VisualizationPanel';
import { InputPanel } from '@/components/panels/InputPanel';
import { TimeMachinePanel } from '@/components/panels/TimeMachinePanel';

const Home: NextPage = () => {
  const [currentScript, setCurrentScript] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ prompt: string; timestamp: Date }>>([]);
  const [isTimeMachineOpen, setIsTimeMachineOpen] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [settings, setSettings] = useState({
    selectedModel: 'o3-mini',
    useInteractiveMode: false,
  });

  const handlePromptSubmit = (prompt: string) => {
    // Add to history when a prompt is submitted
    setHistory(prev => [...prev, { prompt, timestamp: new Date() }]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header 
        onOpenTimeMachine={() => setIsTimeMachineOpen(true)}
        settings={settings}
        onSettingsChange={setSettings}
      />
      <main className="container mx-auto px-2 py-4 flex-grow">
        <div className="grid grid-cols-12 gap-2 h-[calc(100vh-8rem)]">
          <div className="col-span-3">
            <InputPanel 
              onVisualizationUpdate={setCurrentScript}
              onLoadingChange={setIsLoading}
              currentPrompt={currentPrompt}
              onPromptChange={setCurrentPrompt}
              onPromptSubmit={handlePromptSubmit}
              isInteractiveMode={settings.useInteractiveMode}
            />
          </div>
          <div className="col-span-9 relative">
            <VisualizationPanel 
              script={currentScript}
              isLoading={isLoading}
              isInteractiveMode={settings.useInteractiveMode}
            />
          </div>
        </div>
      </main>
      <TimeMachinePanel
        isOpen={isTimeMachineOpen}
        onClose={() => setIsTimeMachineOpen(false)}
        history={history}
        onSelectPrompt={setCurrentPrompt}
      />
      <Footer />
    </div>
  );
};

export default Home; 