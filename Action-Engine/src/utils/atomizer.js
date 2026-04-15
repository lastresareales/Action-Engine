// AI-powered goal atomization using Groq API
// Falls back to intelligent mock generation if API is unavailable

const GROQ_API_KEY = localStorage.getItem('GROQ_API_KEY') || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Generate atomic steps from a goal using AI
 * @param {string} goalTitle - The main goal title
 * @param {string} goalDescription - Detailed description of the goal
 * @param {string} deadline - ISO date string for the deadline
 * @returns {Promise<Array>} Array of generated subtasks
 */
export const atomizeGoal = async (goalTitle, goalDescription, deadline) => {
  // Calculate days until deadline to estimate effort
  const daysUntilDeadline = Math.ceil(
    (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const prompt = `You are an expert productivity coach. Break down this goal into 5-7 concrete, actionable atomic steps that can be completed independently.

Goal: ${goalTitle}
Description: ${goalDescription}
Deadline: ${daysUntilDeadline} days from now

For each step, provide:
1. A clear, specific action (2-8 words)
2. Estimated duration in minutes (15-120)
3. Difficulty level (easy/medium/hard)

Format your response as a JSON array ONLY, like this:
[
  {"title": "Step description", "duration": 30, "difficulty": "medium"},
  {"title": "Another step", "duration": 45, "difficulty": "hard"}
]

Make steps realistic, sequential, and achievable. Include research, learning, practice, and refinement steps.`;

  try {
    // Try real API if key is available
    if (GROQ_API_KEY && GROQ_API_KEY.trim()) {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0].message.content;
        const parsed = JSON.parse(content);
        return parsed;
      }
    }

    // Fallback: intelligent mock generation based on goal patterns
    return generateMockSteps(goalTitle, goalDescription, daysUntilDeadline);
  } catch (error) {
    console.warn('Goal atomization error:', error);
    return generateMockSteps(goalTitle, goalDescription, daysUntilDeadline);
  }
};

/**
 * Generate mock steps with intelligent patterns
 */
const generateMockSteps = (title, description, daysUntilDeadline) => {
  const titleLower = title.toLowerCase();
  const descLower = (description || '').toLowerCase();

  // Detect goal type for better step generation
  const isLearning = /learn|study|understand|master|course|tutorial/i.test(titleLower + descLower);
  const isProject = /build|create|develop|launch|design|project/i.test(titleLower + descLower);
  const isHealth = /fitness|exercise|health|workout|diet|sleep/i.test(titleLower + descLower);
  const isCareer = /apply|interview|job|promotion|skill|certificate/i.test(titleLower + descLower);

  let steps = [];

  if (isLearning) {
    steps = [
      { title: 'Gather learning resources and materials', duration: 20, difficulty: 'easy' },
      { title: 'Understand core concepts and fundamentals', duration: 60, difficulty: 'medium' },
      { title: 'Work through practical examples', duration: 45, difficulty: 'medium' },
      { title: 'Complete hands-on projects or exercises', duration: 90, difficulty: 'hard' },
      { title: 'Review and consolidate knowledge', duration: 30, difficulty: 'medium' },
      { title: 'Test knowledge with assessments', duration: 40, difficulty: 'medium' },
    ];
  } else if (isProject) {
    steps = [
      { title: 'Define scope and requirements', duration: 45, difficulty: 'medium' },
      { title: 'Plan architecture and design', duration: 60, difficulty: 'hard' },
      { title: 'Set up development environment', duration: 30, difficulty: 'easy' },
      { title: 'Implement core functionality', duration: 120, difficulty: 'hard' },
      { title: 'Test and debug thoroughly', duration: 60, difficulty: 'medium' },
      { title: 'Polish and optimize', duration: 45, difficulty: 'medium' },
      { title: 'Document and prepare for launch', duration: 30, difficulty: 'easy' },
    ];
  } else if (isHealth) {
    steps = [
      { title: 'Research and create plan', duration: 30, difficulty: 'easy' },
      { title: 'Set up tracking system', duration: 20, difficulty: 'easy' },
      { title: 'Start consistent practice', duration: 45, difficulty: 'medium' },
      { title: 'Track progress and adjust', duration: 25, difficulty: 'easy' },
      { title: 'Build sustainable habits', duration: 30, difficulty: 'medium' },
    ];
  } else if (isCareer) {
    steps = [
      { title: 'Update resume and portfolio', duration: 60, difficulty: 'medium' },
      { title: 'Research companies and roles', duration: 45, difficulty: 'easy' },
      { title: 'Prepare for interviews', duration: 90, difficulty: 'hard' },
      { title: 'Apply to positions', duration: 40, difficulty: 'medium' },
      { title: 'Follow up and network', duration: 30, difficulty: 'easy' },
      { title: 'Negotiate offer', duration: 45, difficulty: 'hard' },
    ];
  } else {
    // Generic fallback steps
    steps = [
      { title: 'Define clear objectives', duration: 30, difficulty: 'easy' },
      { title: 'Create action plan', duration: 45, difficulty: 'medium' },
      { title: 'Gather necessary resources', duration: 30, difficulty: 'easy' },
      { title: 'Execute primary tasks', duration: 90, difficulty: 'hard' },
      { title: 'Review and iterate', duration: 40, difficulty: 'medium' },
      { title: 'Complete and document', duration: 30, difficulty: 'easy' },
    ];
  }

  // Adjust number of steps based on deadline
  if (daysUntilDeadline < 7) {
    steps = steps.slice(0, 4); // Fewer steps for tight deadlines
  } else if (daysUntilDeadline > 30) {
    // Keep all steps for longer deadlines
  } else {
    steps = steps.slice(0, 5); // Medium number for normal deadlines
  }

  return steps;
};

/**
 * Set Groq API key for AI-powered atomization
 */
export const setGroqApiKey = (apiKey) => {
  localStorage.setItem('GROQ_API_KEY', apiKey);
};

/**
 * Get current Groq API key status
 */
export const hasApiKey = () => {
  const key = localStorage.getItem('GROQ_API_KEY');
  return key && key.trim().length > 0;
};
