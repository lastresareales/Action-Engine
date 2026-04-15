export default function ProgressBar({ progress = 0, label = '', showPercentage = true, size = 'md' }) {
  const sizeStyles = {
    sm: { height: '6px', textSize: '0.75rem' },
    md: { height: '10px', textSize: '0.85rem' },
    lg: { height: '14px', textSize: '0.95rem' },
  };

  const style = sizeStyles[size] || sizeStyles.md;
  
  // Modern gradient color based on progress
  const getColor = () => {
    if (progress < 33) return 'linear-gradient(90deg, #ef4444, #f87171)';
    if (progress < 66) return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
    return 'linear-gradient(90deg, #10b981, #34d399)';
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        width: '100%',
        height: style.height,
        backgroundColor: 'var(--bg-tertiary)',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
      }}>
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: getColor(),
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '20px',
            boxShadow: `0 0 20px ${progress < 33 ? 'rgba(239, 68, 68, 0.4)' : progress < 66 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
          }}
        />
      </div>
      {(label || showPercentage) && (
        <div style={{
          marginTop: '8px',
          fontSize: style.textSize,
          color: 'var(--text-secondary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontWeight: '500' }}>{label}</span>
          {showPercentage && <span style={{ fontWeight: '600', color: 'var(--primary-light)' }}>{progress}%</span>}
        </div>
      )}
    </div>
  );
}
