import GoalTracker from './features/GoalTracker';
import Calendar from './features/Calendar';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', fontFamily: 'inherit' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '40px 20px',
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            margin: '0 0 12px 0',
            background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-1px',
          }}>
            ⚙️ Action Engine
          </h1>
          <p style={{
            margin: 0,
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            fontWeight: '500',
          }}>
            Break down goals → Track progress → Maximize productivity
          </p>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Main Grid Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '28px',
          marginBottom: '40px',
        }}>
          {/* Left Column: Goal Tracker */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
          }}>
            <GoalTracker />
          </div>

          {/* Right Column: Calendar */}
          <div>
            <Calendar />
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '40px 20px',
        color: 'var(--text-tertiary)',
        marginTop: '60px',
        borderTop: '1px solid var(--border)',
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(10px)',
      }}>
        <p style={{
          margin: 0,
          fontSize: '0.95rem',
          fontWeight: '500',
        }}>
          ✨ Built with modern tech • Designed for high-performance teams
        </p>
      </footer>
    </div>
  );
}