import { useState } from 'react';
import ProgressBar from './ProgressBar';
import Badge from './Badge';
import { calculateGoalProgress, getDeadlineStatus } from '../utils/models';

export default function GoalItem({ goal, onToggleStep, onRemove, onUpdateGoal }) {
  const [showDetails, setShowDetails] = useState(false);
  const progress = calculateGoalProgress(goal);
  const deadlineStatus = getDeadlineStatus(goal.deadline);

  const priorityColor = {
    high: 'danger',
    medium: 'warning',
    low: 'info',
  }[goal.priority];

  const deadlineColor = {
    overdue: 'danger',
    today: 'danger',
    urgent: 'warning',
    soon: 'warning',
    normal: 'success',
  }[deadlineStatus.status];

  return (
    <div style={{
      backgroundColor: 'transparent',
      border: '1px solid rgba(148, 163, 184, 0.45)',
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '12px',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 6px rgba(0, 0, 0, 0.12)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'var(--primary)';
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }}>
      {/* Goal header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: '700' }}>
            {goal.title}
          </h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Badge variant={priorityColor} size="sm">
              {goal.priority.toUpperCase()}
            </Badge>
            <Badge variant={deadlineColor} size="sm">
              {deadlineStatus.label}
            </Badge>
            <Badge variant="default" size="sm">
              {goal.category}
            </Badge>
          </div>
        </div>
        <button
          onClick={() => onRemove(goal.id)}
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#fca5a5',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '6px',
            cursor: 'pointer',
            padding: '6px 10px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(239, 68, 68, 0.2)';
            e.target.style.borderColor = 'rgba(239, 68, 68, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(239, 68, 68, 0.1)';
            e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)';
          }}
        >
          ✕
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '12px' }}>
        <ProgressBar progress={progress} label="Overall Progress" size="md" />
      </div>

      {/* Description */}
      {goal.description && (
        <p style={{
          marginBottom: '12px',
          color: 'var(--text-secondary)',
          fontSize: '0.95rem',
          fontStyle: 'italic',
        }}>
          {goal.description}
        </p>
      )}

      {/* Subtasks summary */}
      <div style={{
        marginTop: '12px',
        padding: '12px',
        backgroundColor: 'transparent',
        border: '1px solid rgba(129, 140, 248, 0.45)',
        borderRadius: '8px',
        fontSize: '0.9rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
            {goal.subtasks.filter(t => t.completed).length} of {goal.subtasks.length} steps completed
          </span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary-light)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => { e.target.style.color = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.target.style.color = 'var(--primary-light)'; }}
          >
            {showDetails ? '▼ Hide' : '▶ Show'} Details
          </button>
        </div>
      </div>

      {/* Expandable subtasks list */}
      {showDetails && (
        <div style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          {goal.subtasks.map((subtask, index) => (
            <div
              key={subtask.id || index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(148, 163, 184, 0.35)',
                borderRadius: '8px',
                marginBottom: '8px',
                opacity: subtask.completed ? 0.5 : 1,
                transition: 'all 0.2s ease',
              }}
            >
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => onToggleStep(goal.id, index)}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  accentColor: 'var(--success)',
                }}
              />
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    textDecoration: subtask.completed ? 'line-through' : 'none',
                    color: subtask.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
                    fontWeight: subtask.completed ? '400' : '500',
                  }}
                >
                  {subtask.title}
                </span>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  {subtask.duration}m • {subtask.difficulty} • ROI: {subtask.estimatedROI || 'N/A'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
