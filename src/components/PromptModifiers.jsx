import { useState, useEffect } from 'react';
import { Card, Button, ToggleButtonGroup, ToggleButton, Badge, Collapse, Row, Col, ListGroup } from 'react-bootstrap';
import { ChevronUp, ChevronDown } from 'react-bootstrap-icons';

const PromptModifiers = ({ onPromptChange }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
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
    const currentIndex = selectedPlatforms.indexOf(platformId);
    const newSelectedPlatforms = [...selectedPlatforms];
    
    if (currentIndex === -1) {
      newSelectedPlatforms.push(platformId);
    } else {
      newSelectedPlatforms.splice(currentIndex, 1);
    }
    
    setSelectedPlatforms(newSelectedPlatforms);
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

  const hasActiveModifiers = selectedPlatforms.length > 0 || selectedTone !== 'default';
  const activeModifiersCount = selectedPlatforms.length + (selectedTone !== 'default' ? 1 : 0);

  return (
    <Card className="mb-4">
      <Card.Header 
        className="d-flex justify-content-between align-items-center py-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer' }}
      >
        <div className="d-flex align-items-center">
          <h6 className="mb-0">Message Options</h6>
          {hasActiveModifiers && (
            <Badge bg="primary" pill className="ms-2">
              {activeModifiersCount} active
            </Badge>
          )}
        </div>
        <Button variant="link" className="p-0 text-decoration-none">
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </Card.Header>
      
      <Collapse in={isOpen}>
        <div>
          <Card.Body>
            <div className="mb-3">
              <h6 className="mb-2">Platform</h6>
              <div className="d-flex flex-wrap gap-2">
                {platforms.map((platform) => (
                  <Button
                    key={platform.id}
                    variant={selectedPlatforms.includes(platform.id) ? "primary" : "outline-secondary"}
                    size="sm"
                    onClick={() => togglePlatform(platform.id)}
                    className="rounded-pill"
                  >
                    {platform.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h6 className="mb-2">Tone of Voice</h6>
              <div className="d-flex flex-wrap gap-2">
                {tones.map((tone) => (
                  <Button
                    key={tone.id}
                    variant={selectedTone === tone.id ? "primary" : "outline-secondary"}
                    size="sm"
                    onClick={() => setSelectedTone(tone.id)}
                    className="rounded-pill"
                  >
                    {tone.label}
                  </Button>
                ))}
              </div>
            </div>

            {hasActiveModifiers && (
              <div className="mt-3 small">
                <p className="mb-1">Active modifiers:</p>
                <ListGroup variant="flush" className="small">
                  {selectedPlatforms.map(id => (
                    <ListGroup.Item key={id} className="py-1">
                      • {platforms.find(p => p.id === id)?.label} post
                    </ListGroup.Item>
                  ))}
                  {selectedTone !== 'default' && (
                    <ListGroup.Item className="py-1">
                      • {tones.find(t => t.id === selectedTone)?.label} tone
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </div>
            )}
          </Card.Body>
        </div>
      </Collapse>
    </Card>
  );
};

export default PromptModifiers;