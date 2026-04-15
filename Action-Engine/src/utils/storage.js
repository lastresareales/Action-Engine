// localStorage utilities for persisting goals, tasks, and calendar events

const STORAGE_KEYS = {
  GOALS: 'actionEngine_goals',
  EVENTS: 'actionEngine_events',
  PREFERENCES: 'actionEngine_preferences',
};

export const storage = {
  // Goals management
  getGoals: () => {
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    return data ? JSON.parse(data) : [];
  },
  
  saveGoals: (goals) => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  },

  // Events management
  getEvents: () => {
    const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return data ? JSON.parse(data) : [];
  },
  
  saveEvents: (events) => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },

  // Preferences
  getPreferences: () => {
    const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return data ? JSON.parse(data) : {
      preferredWorkHours: { start: 9, end: 17 },
      focusTime: 90, // minutes
      breakTime: 15, // minutes
    };
  },
  
  savePreferences: (prefs) => {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  },

  // Clear all data (for debugging)
  clear: () => {
    localStorage.removeItem(STORAGE_KEYS.GOALS);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
  },
};
