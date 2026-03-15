import { EPISODES } from '../data/constants'

export default function StoryOverlay({ epIdx, lineIdx, onAdvance, onClose }) {
  const ep = EPISODES[epIdx]
  const line = ep.lines[lineIdx]
  const isLast = lineIdx >= ep.lines.length - 1

  const handleClick = () => {
    if (isLast) onClose()
    else onAdvance()
  }

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: 28,
        cursor: 'pointer',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <div
        style={{ maxWidth: 520, width: '100%', animation: 'fadeUp 0.3s ease' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              margin: '0 auto 10px',
              background:
                'linear-gradient(135deg,rgba(201,70,61,0.3),rgba(201,70,61,0.1))',
              border: '2px solid rgba(201,70,61,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
            }}
          >
            📝
          </div>
          <div style={{ fontSize: 11, opacity: 0.4 }}>
            Ep.{ep.id}: {ep.title}
          </div>
        </div>
        <div
          onClick={handleClick}
          style={{
            background: '#1a1a1e',
            borderRadius: 18,
            padding: '22px 24px',
            border: '1.5px solid rgba(201,70,61,0.2)',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 7,
              color: line.s === 'Satone' ? '#e8a09c' : '#9cc5e8',
            }}
          >
            {line.s}
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.85 }}>
            {line.t}
          </div>
          <div
            style={{
              textAlign: 'right',
              marginTop: 14,
              fontSize: 11,
              opacity: 0.3,
            }}
          >
            ▼ Click · {lineIdx + 1}/{ep.lines.length}
          </div>
        </div>
      </div>
    </div>
  )
}
