import { useState } from 'react';
import Button from '../components/Button';

export default function TimeBlocker({ availableTasks }) {
  const [availableMinutes, setAvailableMinutes] = useState(45);
  const [suggestedTask, setSuggestedTask] = useState(null);

  const findOptimalTask = () => {
    // 1. Only look at tasks that are NOT completed
    const pendingTasks = availableTasks.filter(task => !task.completed);
    
    // 2. Filter tasks that fit within the time gap
    const fittingTasks = pendingTasks.filter(task => task.duration <= availableMinutes);
    
    if (fittingTasks.length > 0) {
      // 3. Sort to find the longest task that fits (Highest ROI)
      fittingTasks.sort((a, b) => b.duration - a.duration);
      setSuggestedTask(fittingTasks[0]);
    } else {
      setSuggestedTask({ text: "Schedule clear. Suggestion: Review math formulas or hydrate.", duration: 0 });
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
      <h2>Gap Optimization</h2>
      
      <div style={{ marginTop: '15px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#4b5563' }}>Available Time (Minutes):</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="number" 
            value={availableMinutes}
            onChange={(e) => setAvailableMinutes(Number(e.target.value))}
            style={{ width: '80px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <Button onClick={findOptimalTask} variant="success">
            Calculate Action
          </Button>
        </div>
      </div>

      {suggestedTask && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#166534' }}>Recommended Deployment:</h4>
          <p style={{ margin: 0, fontSize: '1.1rem', color: '#15803d' }}>
            {suggestedTask.text} {suggestedTask.duration > 0 && `(${suggestedTask.duration}m)`}
          </p>
        </div>
      )}
    </div>
  );
}