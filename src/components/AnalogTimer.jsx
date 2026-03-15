import { fmt } from '../data/utils'

export default function AnalogTimer({
  mode,
  time,
  running,
  progress,
  handAngle,
  sessions,
  rounds,
  workMin,
  breakMin,
  onToggle,
  onChangeWork,
  onChangeBreak,
  onChangeRounds,
}) {
  return (
    <div
      style={{
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Mode badge */}
      <div
        style={{
          position: 'absolute',
          top: 18,
          left: 22,
          background:
            mode === 'work'
              ? 'rgba(201,70,61,0.12)'
              : 'rgba(52,211,153,0.12)',
          border:
            mode === 'work'
              ? '1px solid rgba(201,70,61,0.25)'
              : '1px solid rgba(52,211,153,0.25)',
          borderRadius: 20,
          padding: '3px 12px',
          fontSize: 11,
          fontWeight: 600,
          color: mode === 'work' ? '#e8a09c' : '#6ee8a0',
          textTransform: 'uppercase',
        }}
      >
        {mode === 'work' ? 'Focus' : 'Break'}
      </div>

      {/* Session dots */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 22,
          display: 'flex',
          gap: 4,
        }}
      >
        {Array.from({ length: rounds }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background:
                i < sessions ? '#c9463d' : 'rgba(255,255,255,0.1)',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>

      {/* SVG clock */}
      <div
        style={{
          position: 'relative',
          width: 220,
          height: 220,
          margin: '18px 0 14px',
        }}
      >
        <svg width="220" height="220" viewBox="0 0 220 220">
          <circle
            cx="110"
            cy="110"
            r="104"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="2"
          />
          {Array.from({ length: 60 }).map((_, i) => {
            const a = (i / 60) * 360 - 90
            const r1 = i % 5 === 0 ? 88 : 94
            const r2 = 100
            const rad = (a * Math.PI) / 180
            return (
              <line
                key={i}
                x1={110 + r1 * Math.cos(rad)}
                y1={110 + r1 * Math.sin(rad)}
                x2={110 + r2 * Math.cos(rad)}
                y2={110 + r2 * Math.sin(rad)}
                stroke={
                  i % 5 === 0
                    ? 'rgba(255,255,255,0.35)'
                    : 'rgba(255,255,255,0.12)'
                }
                strokeWidth={i % 5 === 0 ? 2.5 : 1}
                strokeLinecap="round"
              />
            )
          })}
          {/* Background arc */}
          <circle
            cx="110"
            cy="110"
            r="78"
            fill="none"
            stroke="rgba(201,70,61,0.12)"
            strokeWidth="28"
          />
          {/* Progress arc */}
          {progress > 0 && (
            <circle
              cx="110"
              cy="110"
              r="78"
              fill="none"
              stroke="rgba(220,120,110,0.35)"
              strokeWidth="28"
              strokeDasharray={2 * Math.PI * 78}
              strokeDashoffset={2 * Math.PI * 78 * (1 - progress)}
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: 'center',
                transition: 'stroke-dashoffset 1s linear',
              }}
            />
          )}
          {/* Inner circle */}
          <circle cx="110" cy="110" r="64" fill="#1a1a1e" />
          {/* Hand */}
          {(() => {
            const a = ((handAngle - 90) * Math.PI) / 180
            return (
              <>
                <line
                  x1="110"
                  y1="110"
                  x2={110 + 72 * Math.cos(a)}
                  y2={110 + 72 * Math.sin(a)}
                  stroke="#c9463d"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="110" cy="110" r="4.5" fill="#fff" />
              </>
            )
          })()}
        </svg>
      </div>

      {/* Digital display */}
      <div
        style={{
          fontSize: 44,
          fontWeight: 300,
          letterSpacing: 3,
          fontVariantNumeric: 'tabular-nums',
          marginBottom: 18,
        }}
      >
        {fmt(time)}
      </div>

      {/* Start / Pause */}
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          maxWidth: 260,
          padding: '12px 0',
          borderRadius: 13,
          background: running ? 'rgba(201,70,61,0.15)' : '#c9463d',
          border: running
            ? '1.5px solid rgba(201,70,61,0.4)'
            : '1.5px solid #c9463d',
          color: running ? '#e8a09c' : '#fff',
          fontSize: 15,
          fontWeight: 600,
          transition: 'all 0.25s',
        }}
      >
        {running ? 'Pause session' : 'Start session'}
      </button>

      {/* Quick settings */}
      <div
        style={{
          display: 'flex',
          gap: 14,
          marginTop: 14,
          opacity: 0.5,
          fontSize: 12,
        }}
      >
        <span
          onClick={onChangeWork}
          style={{
            cursor: 'pointer',
            borderBottom: '1px dashed rgba(255,255,255,0.3)',
          }}
        >
          Work:{workMin}m
        </span>
        <span
          onClick={onChangeBreak}
          style={{
            cursor: 'pointer',
            borderBottom: '1px dashed rgba(255,255,255,0.3)',
          }}
        >
          Break:{breakMin}m
        </span>
        <span
          onClick={onChangeRounds}
          style={{
            cursor: 'pointer',
            borderBottom: '1px dashed rgba(255,255,255,0.3)',
          }}
        >
          Rounds:{rounds}
        </span>
      </div>
    </div>
  )
}
