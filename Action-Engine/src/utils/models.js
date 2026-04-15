// Data models for goals, tasks, and events

export const createGoal = (title, description, deadline, category = 'general', priority = 'medium') => {
  return {
    id: Date.now(),
    title,
    description,
    deadline, // ISO string: "2026-05-15"
    category, // 'health', 'career', 'learning', 'personal', 'general'
    priority, // 'low', 'medium', 'high'
    subtasks: [],
    createdAt: new Date().toISOString(),
    completedAt: null,
    completed: false,
    progress: 0, // 0-100
  };
};

export const createSubtask = (goalId, title, duration = 30, difficulty = 'medium', order = 0) => {
  return {
    id: Date.now(),
    goalId,
    title,
    duration, // minutes
    difficulty, // 'easy', 'medium', 'hard'
    completed: false,
    order, // determines sequence
    estimatedROI: calculateROI(difficulty, duration),
    completedAt: null,
  };
};

export const createCalendarEvent = (title, startTime, endTime, category = 'work', notes = '') => {
  return {
    id: Date.now(),
    title,
    startTime, // ISO string
    endTime, // ISO string
    category, // 'work', 'personal', 'exercise', 'learning', 'break'
    notes,
    color: getCategoryColor(category),
    synced: false,
    linkedGoalId: null, // Can link to a goal
  };
};

// ROI calculation: harder tasks and longer durations = higher ROI
const calculateROI = (difficulty, duration) => {
  const difficultyScore = { easy: 1, medium: 2, hard: 3 }[difficulty] || 2;
  const durationScore = Math.min(duration / 15, 3); // 15min = 1 point, caps at 3
  return parseFloat((difficultyScore * durationScore * 10).toFixed(1));
};

const getCategoryColor = (category) => {
  const colors = {
    work: '#3b82f6',
    personal: '#8b5cf6',
    exercise: '#ec4899',
    learning: '#f59e0b',
    break: '#10b981',
  };
  return colors[category] || '#6b7280';
};

// Calculate goal progress based on completed subtasks
export const calculateGoalProgress = (goal) => {
  if (!goal.subtasks || goal.subtasks.length === 0) return 0;
  const completed = goal.subtasks.filter(t => t.completed).length;
  return Math.round((completed / goal.subtasks.length) * 100);
};

// Get high-ROI recommendations based on available time and calendar
export const getHighROIRecommendations = (availableMinutes, subtasks, scheduledEvents) => {
  // Filter out completed tasks
  const pending = subtasks.filter(t => !t.completed);
  
  // Filter tasks that fit in available time
  const fitting = pending.filter(t => t.duration <= availableMinutes);
  
  if (fitting.length === 0) {
    return [];
  }
  
  // Sort by ROI/duration ratio (highest value per minute)
  fitting.sort((a, b) => {
    const roiPerMin_a = a.estimatedROI / a.duration;
    const roiPerMin_b = b.estimatedROI / b.duration;
    return roiPerMin_b - roiPerMin_a;
  });
  
  // Return top 3 recommendations with their rationale
  return fitting.slice(0, 3).map(task => ({
    ...task,
    roiPerMinute: parseFloat((task.estimatedROI / task.duration).toFixed(2)),
    rationale: `${task.difficulty} difficulty task - High value for ${task.duration}m`,
  }));
};

// Get goal deadline status
export const getDeadlineStatus = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
  
  if (daysLeft < 0) return { status: 'overdue', daysLeft: Math.abs(daysLeft), label: 'OVERDUE' };
  if (daysLeft === 0) return { status: 'today', daysLeft: 0, label: 'DUE TODAY' };
  if (daysLeft <= 3) return { status: 'urgent', daysLeft, label: `${daysLeft}d left` };
  if (daysLeft <= 7) return { status: 'soon', daysLeft, label: `${daysLeft}d left` };
  return { status: 'normal', daysLeft, label: `${daysLeft}d left` };
};
