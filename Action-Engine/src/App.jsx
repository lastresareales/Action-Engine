import GoalTracker from './features/GoalTracker';
import Calendar from './features/Calendar';
import bannerImg from './assets/banner(1).png';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', fontFamily: 'inherit' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: 0,
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
      }}>
        <img
          src={bannerImg}
          alt="Action Engine"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.3))',
          }}
        />
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