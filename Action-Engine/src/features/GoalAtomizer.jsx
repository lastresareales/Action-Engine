import { useState } from 'react';
import Button from '../components/Button';

export default function GoalTracker({ tasks, onAddTasks, onToggleTask }) {
  const [goalInput, setGoalInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAtomizeGoal = () => {
    if (!goalInput) return;
    setIsProcessing(true);
    
    // Simulating Groq API AI generation
    setTimeout(() => {
      const mockAiResponse = [
        { id: Date.now(), text: `Prep for: ${goalInput} (Phase 1)`, duration: 15, completed: false },
        { id: Date.now() + 1, text: `Review logic structures for ${goalInput}`, duration: 30, completed: false },
      ];
      
      onAddTasks(mockAiResponse); // Sending data UP to App.jsx
      setIsProcessing(false);
      setGoalInput('');
    }, 1000);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
      <h2>Target Acquisition</h2>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <input 
          type="text" 
          value={goalInput}
          onChange={(e) => setGoalInput(e.target.value)}
          placeholder="Enter an academic objective..."
          style={{ flexGrow: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <Button onClick={handleAtomizeGoal} disabled={isProcessing} variant="primary">
          {isProcessing ? 'Processing...' : 'Atomize'}
        </Button>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {tasks.map(step => (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <input 
              type="checkbox" 
              checked={step.completed}
              onChange={() => onToggleTask(step.id)} // Triggers function in App.jsx
              style={{ width: '18px', height: '18px' }}
            />
            <span style={{ textDecoration: step.completed ? 'line-through' : 'none', flexGrow: 1, color: step.completed ? '#9ca3af' : '#111827' }}>
              {step.text}
            </span>
            <span style={{ backgroundColor: '#e0e7ff', color: '#4338ca', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              {step.duration}m
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}