import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { createCalendarEvent } from '../utils/models';
import { storage } from '../utils/storage';
import calendarImg from '../assets/calender.png';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [autoScheduleMessage, setAutoScheduleMessage] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'work',
    notes: '',
  });

  useEffect(() => {
    const savedEvents = storage.getEvents();
    setEvents(savedEvents);
  }, []);

  useEffect(() => {
    storage.saveEvents(events);
  }, [events]);

  const handleAddEvent = () => {
    if (!newEvent.title || !selectedDate) return;

    const startTime = new Date(selectedDate);
    startTime.setHours(9, 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(10, 0, 0);

    const event = createCalendarEvent(
      newEvent.title,
      startTime.toISOString(),
      endTime.toISOString(),
      newEvent.category,
      newEvent.notes
    );

    setEvents([...events, event]);
    setNewEvent({ title: '', category: 'work', notes: '' });
    setShowEventForm(false);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  };

  const getWorkBoundsForDate = (date) => {
    const preferences = storage.getPreferences();
    const startHour = preferences?.preferredWorkHours?.start ?? 9;
    const endHour = preferences?.preferredWorkHours?.end ?? 17;

    const workStart = new Date(date);
    workStart.setHours(startHour, 0, 0, 0);

    const workEnd = new Date(date);
    workEnd.setHours(endHour, 0, 0, 0);

    return { workStart, workEnd };
  };

  const getFreeSlotsForDate = (date) => {
    const { workStart, workEnd } = getWorkBoundsForDate(date);
    const dayEvents = getEventsForDate(date)
      .map(event => ({
        start: new Date(event.startTime),
        end: new Date(event.endTime),
      }))
      .sort((a, b) => a.start - b.start);

    const freeSlots = [];
    let cursor = new Date(workStart);

    for (const busy of dayEvents) {
      if (busy.end <= workStart || busy.start >= workEnd) continue;

      const normalizedStart = busy.start < workStart ? new Date(workStart) : busy.start;
      const normalizedEnd = busy.end > workEnd ? new Date(workEnd) : busy.end;

      if (normalizedStart > cursor) {
        freeSlots.push({
          start: new Date(cursor),
          end: new Date(normalizedStart),
        });
      }

      if (normalizedEnd > cursor) {
        cursor = new Date(normalizedEnd);
      }
    }

    if (cursor < workEnd) {
      freeSlots.push({
        start: new Date(cursor),
        end: new Date(workEnd),
      });
    }

    return freeSlots.filter(slot => slot.end > slot.start);
  };

  const getAvailableMinutesForDate = (date) => {
    const freeSlots = getFreeSlotsForDate(date);
    return freeSlots.reduce((sum, slot) => {
      const minutes = Math.floor((slot.end - slot.start) / (1000 * 60));
      return sum + minutes;
    }, 0);
  };

  const getEstimatedROI = (task) => {
    if (typeof task.estimatedROI === 'number') return task.estimatedROI;
    const difficultyScore = { easy: 1, medium: 2, hard: 3 }[task.difficulty] || 2;
    const durationScore = Math.min((task.duration || 30) / 15, 3);
    return parseFloat((difficultyScore * durationScore * 10).toFixed(1));
  };

  const mapGoalCategoryToEventCategory = (goalCategory) => {
    const mapping = {
      career: 'work',
      learning: 'learning',
      health: 'exercise',
      personal: 'personal',
      general: 'work',
    };
    return mapping[goalCategory] || 'work';
  };

  const handleGenerateROISchedule = () => {
    if (!selectedDate) return;

    const selectedDayEvents = getEventsForDate(selectedDate);
    const existingRoiCount = selectedDayEvents.filter(event => event.roiGenerated).length;
    const dailyRoiLimit = 2;
    const remainingRoiQuota = dailyRoiLimit - existingRoiCount;

    if (remainingRoiQuota <= 0) {
      setAutoScheduleMessage('Daily ROI limit reached (max 2 activities).');
      return;
    }

    const freeSlots = getFreeSlotsForDate(selectedDate);
    if (freeSlots.length === 0) {
      setAutoScheduleMessage('No available time blocks on this day.');
      return;
    }

    const savedGoals = storage.getGoals();
    const pendingTasks = savedGoals.flatMap(goal =>
      (goal.subtasks || [])
        .filter(task => !task.completed)
        .map(task => ({
          ...task,
          goalId: goal.id,
          goalTitle: goal.title,
          goalCategory: goal.category,
          estimatedROI: getEstimatedROI(task),
          roiPerMinute: getEstimatedROI(task) / Math.max(task.duration || 1, 1),
        }))
    );

    if (pendingTasks.length === 0) {
      setAutoScheduleMessage('No pending goal steps available for ROI scheduling.');
      return;
    }

    const sortedTasks = [...pendingTasks].sort((a, b) => b.roiPerMinute - a.roiPerMinute);
    const scheduledEvents = [];

    const getBestTaskIndexForSlot = (tasks, remainingMinutes) => {
      if (remainingMinutes >= 60) {
        const hourOrLongerIndex = tasks.findIndex(task => {
          const duration = task.duration || 30;
          return duration >= 60 && duration <= remainingMinutes;
        });

        if (hourOrLongerIndex !== -1) return hourOrLongerIndex;
      }

      return tasks.findIndex(task => (task.duration || 30) <= remainingMinutes);
    };

    for (const slot of freeSlots) {
      if (scheduledEvents.length >= remainingRoiQuota) break;

      let slotCursor = new Date(slot.start);
      let remainingMinutes = Math.floor((slot.end - slot.start) / (1000 * 60));

      while (remainingMinutes >= 5) {
        if (scheduledEvents.length >= remainingRoiQuota) break;

        const taskIndex = getBestTaskIndexForSlot(sortedTasks, remainingMinutes);
        if (taskIndex === -1) break;

        const task = sortedTasks[taskIndex];
        const taskDuration = task.duration || 30;
        const endTime = new Date(slotCursor.getTime() + taskDuration * 60 * 1000);

        const event = createCalendarEvent(
          task.title,
          slotCursor.toISOString(),
          endTime.toISOString(),
          mapGoalCategoryToEventCategory(task.goalCategory),
          `Auto-generated ROI activity from goal: ${task.goalTitle}`
        );

        event.id = `${event.id}-${scheduledEvents.length}`;
        event.linkedGoalId = task.goalId;
        event.roiGenerated = true;

        scheduledEvents.push(event);
        sortedTasks.splice(taskIndex, 1);

        slotCursor = endTime;
        remainingMinutes -= taskDuration;
      }
    }

    if (scheduledEvents.length === 0) {
      setAutoScheduleMessage('There is free time, but no tasks fit the available slots.');
      return;
    }

    setEvents(prev => [...prev, ...scheduledEvents]);
    setAutoScheduleMessage(`Scheduled ${scheduledEvents.length} high-ROI activit${scheduledEvents.length === 1 ? 'y' : 'ies'} on this day (${existingRoiCount + scheduledEvents.length}/2 used).`);
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const selectedDateAvailableMinutes = selectedDate ? getAvailableMinutesForDate(selectedDate) : 0;

  return (
    <div style={{
      padding: '24px',
      backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.58), rgba(30, 41, 59, 0.48)), url(${calendarImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: 'rgba(15, 23, 42, 0.25)',
      borderRadius: '12px',
      border: '1px solid rgba(148, 163, 184, 0.35)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(7px) saturate(130%)',
      WebkitBackdropFilter: 'blur(7px) saturate(130%)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            variant="secondary"
          >
            ← Prev
          </Button>
          <span style={{ minWidth: '200px', textAlign: 'center', fontWeight: '600', color: 'var(--text-primary)' }}>{monthName}</span>
          <Button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            variant="secondary"
          >
            Next →
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '6px',
        marginBottom: '24px',
      }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            style={{
              padding: '10px',
              fontWeight: '700',
              textAlign: 'center',
              color: 'var(--text-tertiary)',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const dayEvents = day ? getEventsForDate(day) : [];
          const isToday = day && new Date().toDateString() === day.toDateString();

          return (
            <div
              key={index}
              onClick={() => {
                if (!day) return;
                setSelectedDate(day);
                setAutoScheduleMessage('');
              }}
              style={{
                padding: '10px',
                minHeight: '90px',
                backgroundColor: 'transparent',
                border: selectedDate?.toDateString() === day?.toDateString() ? '1px solid var(--primary)' : '1px solid rgba(148, 163, 184, 0.45)',
                borderRadius: '8px',
                cursor: day ? 'pointer' : 'default',
                fontSize: '0.85rem',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (day) {
                  e.currentTarget.style.borderColor = 'var(--primary-light)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.12)';
                }
              }}
              onMouseLeave={(e) => {
                if (day) {
                  e.currentTarget.style.borderColor = selectedDate?.toDateString() === day?.toDateString() ? 'var(--primary)' : 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {day && (
                <>
                  <div style={{
                    fontWeight: '700',
                    marginBottom: '6px',
                    color: isToday ? 'var(--primary)' : 'var(--text-primary)',
                    fontSize: '1rem',
                  }}>
                    {day.getDate()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        style={{
                          backgroundColor: event.color,
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontWeight: '600',
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: '600' }}>
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Event Management */}
      {selectedDate && (
        <div style={{
          padding: '18px',
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          borderRadius: '10px',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '12px', color: 'var(--success)', fontWeight: '700' }}>
            {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <Badge variant={selectedDateAvailableMinutes > 0 ? 'success' : 'danger'} size="sm">
              {selectedDateAvailableMinutes} min available
            </Badge>
            <Button
              onClick={handleGenerateROISchedule}
              variant="warning"
              disabled={selectedDateAvailableMinutes <= 0}
            >
              Generate ROI Activities
            </Button>
          </div>

          {autoScheduleMessage && (
            <div style={{
              marginBottom: '12px',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
            }}>
              {autoScheduleMessage}
            </div>
          )}

          {selectedDateEvents.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              {selectedDateEvents.map(event => (
                <div
                  key={event.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    border: `2px solid ${event.color}`,
                  }}
                >
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>{event.title}</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                      {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {event.notes && <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>{event.notes}</div>}
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#fca5a5',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      padding: '6px 10px',
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
          )}

          <Button
            onClick={() => setShowEventForm(!showEventForm)}
            variant="success"
          >
            {showEventForm ? '✕ Cancel' : '+ Add Event'}
          </Button>

          {showEventForm && (
            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <input
                type="text"
                placeholder="Event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  boxSizing: 'border-box',
                }}
              />
              <select
                value={newEvent.category}
                onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  boxSizing: 'border-box',
                }}
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="exercise">Exercise</option>
                <option value="learning">Learning</option>
                <option value="break">Break</option>
              </select>
              <textarea
                placeholder="Notes (optional)"
                value={newEvent.notes}
                onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  minHeight: '60px',
                }}
              />
              <Button onClick={handleAddEvent} variant="success">
                Save Event
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
