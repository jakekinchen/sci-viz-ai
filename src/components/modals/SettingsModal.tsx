import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';

const MODEL_OPTIONS = [
  { value: 'llama3-70b', label: 'Llama 3 70B' },
  { value: 'mixtral-8x7b', label: 'Mixtral 8x7B' },
  { value: 'gemma-7b', label: 'Gemma 7B' },
];

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    selectedModel: string;
    useInteractiveMode: boolean;
  };
  onSettingsChange: (settings: { selectedModel: string; useInteractiveMode: boolean }) => void;
}

const AI_MODELS = [
  // OpenAI Models
  { id: 'o3-mini', name: 'OpenAI: O3-Mini' },
  { id: 'o1', name: 'OpenAI: O1' },
  { id: 'gpt-4.5-preview', name: 'OpenAI: GPT-4.5 Preview' },
  { id: 'gpt-4', name: 'OpenAI: GPT-4' },
  { id: 'gpt-4o', name: 'OpenAI: GPT-4 Optimized' },
  { id: 'gpt-3.5', name: 'OpenAI: GPT-3.5' },
  
  // Anthropic Models
  { id: 'claude-3-7-sonnet-latest', name: 'Anthropic: Claude 3.7 Sonnet' },
  { id: 'claude-3-5-sonnet-latest', name: 'Anthropic: Claude 3.5 Sonnet' },
  
  // Other Models
  { id: 'llama3-70b-8192', name: 'Groq: Llama3 70B' },
  { id: 'qwen-2.5-coder-32b', name: 'Groq: Qwen 2.5 Coder 32B' },
  { id: 'llama-2', name: 'Meta: Llama 2' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  settings,
  onSettingsChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" onClick={onClose} />

        <div className="relative inline-block w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-gray-800 rounded-lg shadow-xl">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <h2 className="text-2xl font-semibold mb-6 text-white">Settings</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Model Selection
              </label>
              <select
                value={settings.selectedModel}
                onChange={(e) => onSettingsChange({ 
                  ...settings, 
                  selectedModel: e.target.value 
                })}
                className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
              >
                {AI_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">
                Use Interactive Mode
              </span>
              <Switch
                checked={settings.useInteractiveMode}
                onChange={(checked) => onSettingsChange({ 
                  ...settings, 
                  useInteractiveMode: checked 
                })}
                className={`${
                  settings.useInteractiveMode ? 'bg-blue-600' : 'bg-gray-600'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
              >
                <span
                  className={`${
                    settings.useInteractiveMode ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 