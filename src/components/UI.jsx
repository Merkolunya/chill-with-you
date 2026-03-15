export function Card({ children, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#1a1a1e',
        borderRadius: 24,
        padding: '22px 24px',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function Toggle({ on, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        cursor: 'pointer',
        background: on ? '#c9463d' : 'rgba(255,255,255,0.1)',
        padding: 2,
        transition: 'all 0.25s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: on ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          background: '#fff',
          transition: 'all 0.25s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}
      />
    </div>
  )
}

export function Badge({ children, active }) {
  return (
    <div
      style={{
        background: active ? 'rgba(201,70,61,0.12)' : 'rgba(255,255,255,0.04)',
        border: active
          ? '1.5px solid rgba(201,70,61,0.25)'
          : '1.5px solid rgba(255,255,255,0.06)',
        borderRadius: 20,
        padding: '4px 14px',
        fontSize: 11,
        fontWeight: 600,
        color: active ? '#c9463d' : 'rgba(255,255,255,0.5)',
      }}
    >
      {children}
    </div>
  )
}

export function PillButton({ children, active, onClick, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 14px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        background: active ? 'transparent' : 'rgba(255,255,255,0.04)',
        border: active
          ? '1.5px solid #c9463d'
          : '1.5px solid rgba(255,255,255,0.06)',
        color: active ? '#c9463d' : 'rgba(255,255,255,0.5)',
        transition: 'all 0.2s',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

export function SmallIconBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 26,
        height: 26,
        borderRadius: 7,
        background: 'rgba(201,70,61,0.12)',
        border: '1px solid rgba(201,70,61,0.2)',
        color: '#c9463d',
        fontSize: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </button>
  )
}
