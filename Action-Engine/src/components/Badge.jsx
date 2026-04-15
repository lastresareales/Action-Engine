export default function Badge({ children, variant = 'default', size = 'md' }) {
  const variants = {
    default: { bg: 'rgba(99, 102, 241, 0.15)', text: 'var(--primary-light)', border: '1px solid rgba(99, 102, 241, 0.3)' },
    primary: { bg: 'rgba(99, 102, 241, 0.2)', text: 'var(--primary-light)', border: '1px solid rgba(99, 102, 241, 0.4)' },
    success: { bg: 'rgba(16, 185, 129, 0.15)', text: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.3)' },
    warning: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fcd34d', border: '1px solid rgba(245, 158, 11, 0.3)' },
    danger: { bg: 'rgba(239, 68, 68, 0.15)', text: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)' },
    info: { bg: 'rgba(59, 130, 246, 0.15)', text: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.3)' },
  };

  const sizes = {
    sm: { padding: '3px 8px', fontSize: '0.75rem' },
    md: { padding: '4px 10px', fontSize: '0.85rem' },
    lg: { padding: '6px 14px', fontSize: '0.95rem' },
  };

  const style = variants[variant] || variants.default;
  const sizeStyle = sizes[size] || sizes.md;

  return (
    <span style={{
      backgroundColor: style.bg,
      color: style.text,
      border: style.border,
      borderRadius: '6px',
      fontWeight: '600',
      display: 'inline-block',
      ...sizeStyle,
      whiteSpace: 'nowrap',
      letterSpacing: '0.5px',
    }}>
      {children}
    </span>
  );
}
