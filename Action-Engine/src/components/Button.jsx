export default function Button({ children, onClick, variant = 'primary', disabled = false, style = {} }) {
  const baseStyle = {
    padding: '10px 18px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    transition: 'all 0.2s ease',
    fontSize: '0.95rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
    ...style,
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--primary)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
    },
    secondary: {
      backgroundColor: 'var(--bg-tertiary)',
      color: 'var(--text-secondary)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    success: {
      backgroundColor: 'var(--success)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    },
    danger: {
      backgroundColor: 'var(--danger)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
    },
    warning: {
      backgroundColor: 'var(--warning)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
    },
  };

  const baseVariant = variants[variant] || variants.primary;

  const hoverStyle = !disabled ? {
    transform: 'translateY(-2px)',
    boxShadow: `0 6px 20px ${variant === 'primary' ? 'rgba(99, 102, 241, 0.4)' : 'rgba(0, 0, 0, 0.15)'}`,
  } : {};

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) {
          Object.assign(e.target.style, hoverStyle);
        }
      }}
      onMouseLeave={(e) => {
        Object.assign(e.target.style, {
          transform: 'translateY(0)',
          boxShadow: baseVariant.boxShadow,
        });
      }}
      style={{
        ...baseStyle,
        ...baseVariant,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}
