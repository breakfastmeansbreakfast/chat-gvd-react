import { useState, useEffect } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

const PromptModifiers = ({ onPromptChange }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState(new Set());
  const [selectedTone, setSelectedTone] = useState('default');
  const [isOpen, setIsOpen] = useState(false);

  const platforms = [
    { id: 'facebook', label: 'Facebook', instruction: 'user wants to generate a facebook post' },
    { id: 'instagram', label: 'Instagram', instruction: 'user wants to generate a instagram post' },
    { id: 'linkedin', label: 'LinkedIn', instruction: 'user wants to generate a linkedin post' },
    { id: 'x', label: 'X', instruction: 'user wants to generate a twitter post' }
  ];

  const tones = [
    { id: 'formal', label: 'More Formal', instruction: 'user wants a formal tone of voice' },
    { id: 'default', label: 'Default Tone', instruction: '' },
    { id: 'informal', label: 'Less Formal', instruction: 'user wants a less formal tone of voice' }
  ];

  useEffect(() => {
    updatePromptInstructions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlatforms, selectedTone]);

  const togglePlatform = (platformId) => {
    const newSelectedPlatforms = new Set(selectedPlatforms);
    if (newSelectedPlatforms.has(platformId)) {
      newSelectedPlatforms.delete(platformId);
    } else {
      newSelectedPlatforms.add(platformId);
    }
    setSelectedPlatforms(newSelectedPlatforms);
  };

  const setTone = (toneId) => {
    setSelectedTone(toneId);
  };

  const updatePromptInstructions = () => {
    const instructions = [];
    
    // Add platform instructions
    selectedPlatforms.forEach(platformId => {
      const platform = platforms.find(p => p.id === platformId);
      if (platform) {
        instructions.push(platform.instruction);
      }
    });
    
    // Add tone instruction
    const toneInstruction = tones.find(t => t.id === selectedTone)?.instruction;
    if (toneInstruction) {
      instructions.push(toneInstruction);
    }
    
    onPromptChange(instructions);
  };

  const hasActiveModifiers = selectedPlatforms.size > 0 || selectedTone !== 'default';

  return (
    <div className="card mb-6 overflow-hidden">
      <div 
        className="flex justify-between items-center cursor-pointer py-2 px-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <h3 className="font-medium">Message Options</h3>
          {hasActiveModifiers && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
              {selectedPlatforms.size + (selectedTone !== 'default' ? 1 : 0)} active
            </span>
          )}
        </div>
        <button className="text-gray-500">
          {isOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
        </button>
      </div>
      
      {isOpen && (
        <div className="p-4 border-t">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Platform</h4>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                    ${selectedPlatforms.has(platform.id)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  type="button"
                >
                  {platform.label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Tone of Voice</h4>
            <div className="flex flex-wrap gap-2">
              {tones.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setTone(tone.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                    ${selectedTone === tone.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  type="button"
                >
                  {tone.label}
                </button>
              ))}
            </div>
          </div>

          {hasActiveModifiers && (
            <div className="mt-4 text-sm text-gray-600">
              <p>Active modifiers:</p>
              <ul className="list-disc list-inside mt-1">
                {Array.from(selectedPlatforms).map(id => (
                  <li key={id}>{platforms.find(p => p.id === id)?.label} post</li>
                ))}
                {selectedTone !== 'default' && (
                  <li>{tones.find(t => t.id === selectedTone)?.label} tone</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PromptModifiers;