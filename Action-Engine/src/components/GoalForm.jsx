import { useState } from 'react';
import Button from './Button';
import { atomizeGoal } from '../utils/atomizer';

export default function GoalForm({ onAddGoal, onClose }) {
  const [stage, setStage] = useState('input'); // 'input' | 'atomizing' | 'review'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    category: 'general',
    priority: 'medium',
  });
  const [generatedSteps, setGeneratedSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAtomize = async () => {
    if (!formData.title || !formData.deadline) {
      alert('Please fill in title and deadline');
      return;
    }

    setIsLoading(true);
    setStage('atomizing');

    try {
      const steps = await atomizeGoal(formData.title, formData.description, formData.deadline);
      setGeneratedSteps(steps);
      setStage('review');
    } catch (error) {
      console.error('Error atomizing goal:', error);
      alert('Failed to generate steps. Please try again.');
      setStage('input');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStep = (index, field, value) => {
    const updated = [...generatedSteps];
    updated[index] = { ...updated[index], [field]: value };
    setGeneratedSteps(updated);
  };

  const handleRemoveStep = (index) => {
    setGeneratedSteps(generatedSteps.filter((_, i) => i !== index));
  };

  const handleAddStep = () => {
    setGeneratedSteps([
      ...generatedSteps,
      { title: '', duration: 30, difficulty: 'medium' },
    ]);
  };

  const handleConfirmSteps = () => {
    const validSteps = generatedSteps.filter(st => st.title.trim());
    if (validSteps.length === 0) {
      alert('Please have at least one step');
      return;
    }

    onAddGoal({
      ...formData,
      subtasks: validSteps,
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      deadline: '',
      category: 'general',
      priority: 'medium',
    });
    setGeneratedSteps([]);
    setStage('input');
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      deadline: '',
      category: 'general',
      priority: 'medium',
    });
    setGeneratedSteps([]);
    setStage('input');
    onClose();
  };

  // Stage 1: Input goal details
  if (stage === 'input') {
    return (
      <form onSubmit={(e) => { e.preventDefault(); handleAtomize(); }} style={{
        backgroundColor: 'var(--bg-tertiary)',
        padding: '20px',
        borderRadius: '10px',
        border: '2px solid var(--border)',
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '18px', fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-light)' }}>
          ✨ Create New Goal
        </h3>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--text-primary)' }}>Goal Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Learn TypeScript fundamentals"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              boxSizing: 'border-box',
              fontSize: '1rem',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--text-primary)' }}>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Why is this goal important? What's the outcome?"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              boxSizing: 'border-box',
              fontSize: '1rem',
              minHeight: '70px',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--text-primary)' }}>Deadline *</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--text-primary)' }}>Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                boxSizing: 'border-box',
              }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--text-primary)' }}>Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              boxSizing: 'border-box',
            }}
          >
            <option value="general">General</option>
            <option value="learning">Learning</option>
            <option value="career">Career</option>
            <option value="health">Health</option>
            <option value="personal">Personal</option>
          </select>
        </div>

        <div style={{
          padding: '12px',
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
          borderRadius: '8px',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          marginBottom: '18px',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
        }}>
          💡 <strong>Tip:</strong> Click "Atomize Goal" to automatically break this down into actionable steps!
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type="submit" variant="primary">
            Atomize Goal
          </Button>
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  // Stage 2: Atomizing (loading)
  if (stage === 'atomizing') {
    return (
      <div style={{
        backgroundColor: 'var(--bg-tertiary)',
        padding: '40px 20px',
        borderRadius: '10px',
        border: '2px solid var(--border)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px', animation: 'spin 2s linear infinite' }}>
          ⚙️
        </div>
        <h3 style={{ color: 'var(--primary-light)', marginBottom: '8px' }}>
          Atomizing Your Goal...
        </h3>
        <p style={{ color: 'var(--text-secondary)', margin: '0' }}>
          Breaking down "{formData.title}" into actionable steps
        </p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Stage 3: Review generated steps
  if (stage === 'review') {
    const totalDuration = generatedSteps.reduce((sum, s) => sum + (s.duration || 0), 0);

    return (
      <div style={{
        backgroundColor: 'var(--bg-tertiary)',
        padding: '20px',
        borderRadius: '10px',
        border: '2px solid var(--border)',
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '8px', fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-light)' }}>
          ✓ Goal Breakdown Complete!
        </h3>
        <p style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          <strong>"{formData.title}"</strong> has been broken down into {generatedSteps.length} steps ({totalDuration}m total)
        </p>

        <div style={{ marginBottom: '18px', maxHeight: '400px', overflowY: 'auto' }}>
          {generatedSteps.map((step, index) => (
            <div key={index} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 80px 100px 30px',
              gap: '8px',
              marginBottom: '10px',
              alignItems: 'end',
            }}>
              <input
                type="text"
                value={step.title}
                onChange={(e) => handleEditStep(index, 'title', e.target.value)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  fontSize: '0.9rem',
                  backgroundColor: 'var(--bg-secondary)',
                }}
              />
              <input
                type="number"
                value={step.duration}
                onChange={(e) => handleEditStep(index, 'duration', parseInt(e.target.value))}
                min="5"
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  fontSize: '0.9rem',
                  backgroundColor: 'var(--bg-secondary)',
                }}
              />
              <select
                value={step.difficulty}
                onChange={(e) => handleEditStep(index, 'difficulty', e.target.value)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  fontSize: '0.9rem',
                  backgroundColor: 'var(--bg-secondary)',
                }}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <button
                type="button"
                onClick={() => handleRemoveStep(index)}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#fca5a5',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  padding: '8px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <Button onClick={handleAddStep} variant="secondary" style={{ marginBottom: '16px', width: '100%' }}>
          + Add Another Step
        </Button>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button onClick={handleConfirmSteps} variant="success">
            Save Goal & Steps
          </Button>
          <Button onClick={() => setStage('input')} variant="secondary">
            Back to Edit
          </Button>
        </div>
      </div>
    );
  }
}
