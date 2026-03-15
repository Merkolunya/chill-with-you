export const fmt = (s) => {
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

export const getHeat = (w, d) => {
  const seed = (w * 7 + d + 3) * 17 % 100
  if (seed < 30) return 0.2
  if (seed < 50) return 0.45
  if (seed < 70) return 0.65
  if (seed < 85) return 0.8
  return 0.95
}
