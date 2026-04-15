import { useState, useEffect } from 'react';
import GoalForm from '../components/GoalForm';
import GoalItem from '../components/GoalItem';
import Button from '../components/Button';
import { createGoal, createSubtask } from '../utils/models';
import { storage } from '../utils/storage';
import goalsImg from '../assets/goals.png';

export default function GoalTracker() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Load goals from localStorage on mount
  useEffect(() => {
    const savedGoals = storage.getGoals();
    if (savedGoals.length > 0) {
      setGoals(savedGoals);
    }
  }, []);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    storage.saveGoals(goals);
  }, [goals]);

  const handleAddGoal = (goalData) => {
    const newGoal = createGoal(
      goalData.title,
      goalData.description,
      goalData.deadline,
      goalData.category,
      goalData.priority
    );

    // Add subtasks to the goal
    const subtasksWithId = goalData.subtasks.map((st, index) =>
      createSubtask(newGoal.id, st.title, st.duration, st.difficulty, index)
    );

    newGoal.subtasks = subtasksWithId;
    newGoal.progress = 0;

    setGoals([...goals, newGoal]);
    setShowForm(false);
  };

  const handleToggleStep = (goalId, stepIndex) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedGoal = { ...goal };
        updatedGoal.subtasks = [...goal.subtasks];
        updatedGoal.subtasks[stepIndex] = {
          ...updatedGoal.subtasks[stepIndex],
          completed: !updatedGoal.subtasks[stepIndex].completed,
          completedAt: !updatedGoal.subtasks[stepIndex].completed ? new Date().toISOString() : null,
        };

        // Check if all steps are completed
        if (updatedGoal.subtasks.every(st => st.completed)) {
          updatedGoal.completed = true;
          updatedGoal.completedAt = new Date().toISOString();
        } else {
          updatedGoal.completed = false;
        }

        return updatedGoal;
      }
      return goal;
    }));
  };

  const handleRemoveGoal = (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setGoals(goals.filter(g => g.id !== goalId));
    }
  };

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  return (
    <div style={{
      padding: '24px',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '12px',
      border: '1px solid var(--border)',
      height: 'fit-content',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <img src={goalsImg} alt="Goal Tracker" style={{ height: '48px', width: 'auto' }} />
        <Button onClick={() => setShowForm(!showForm)} variant="primary">
          {showForm ? '✕' : '+ New Goal'}
        </Button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '20px' }}>
          <GoalForm
            onAddGoal={handleAddGoal}
            onClose={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Active Goals */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          color: 'var(--text-secondary)',
          marginBottom: '16px',
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontWeight: '700',
        }}>
          ✨ Active Goals ({activeGoals.length})
        </h3>
        {activeGoals.length === 0 ? (
          <div style={{
            padding: '24px',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: '10px',
            color: 'var(--text-tertiary)',
            textAlign: 'center',
            border: '2px dashed var(--border-light)',
          }}>
            No active goals. Create one to get started!
          </div>
        ) : (
          activeGoals.map(goal => (
            <GoalItem
              key={goal.id}
              goal={goal}
              onToggleStep={handleToggleStep}
              onRemove={handleRemoveGoal}
            />
          ))
        )}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h3 style={{
            color: 'var(--success)',
            marginBottom: '16px',
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: '700',
          }}>
            ✓ Completed ({completedGoals.length})
          </h3>
          {completedGoals.map(goal => (
            <GoalItem
              key={goal.id}
              goal={goal}
              onToggleStep={handleToggleStep}
              onRemove={handleRemoveGoal}
            />
          ))}
        </div>
      )}
    </div>
  );
}
