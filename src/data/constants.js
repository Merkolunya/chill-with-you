export const TRACKS = [
  { id: 1, name: 'Cozy Afternoon', artist: 'Lo-Fi Chill', dur: '3:42' },
  { id: 2, name: 'Midnight Study', artist: 'Dreamy Beats', dur: '4:15' },
  { id: 3, name: 'Rainy Window', artist: 'Ambient Wave', dur: '3:58' },
  { id: 4, name: 'Sunlit Pages', artist: 'Warm Keys', dur: '4:01' },
  { id: 5, name: 'Stargazer', artist: 'Night Owl', dur: '5:20' },
]

export const AMBIENT = [
  { id: 'rain', name: 'Rain', icon: '🌧️' },
  { id: 'fire', name: 'Fire', icon: '🔥' },
  { id: 'birds', name: 'Birds', icon: '🐦' },
  { id: 'wind', name: 'Wind', icon: '🍃' },
  { id: 'cricket', name: 'Crickets', icon: '🦗' },
  { id: 'waves', name: 'Ocean', icon: '🌊' },
]

export const EPISODES = [
  {
    id: 1, xp: 0, title: 'First Meeting',
    lines: [
      { s: 'Satone', t: "Oh! Hi there... I didn't expect anyone else to be working this late." },
      { s: 'You', t: 'Hey! I just needed a quiet place to focus.' },
      { s: 'Satone', t: 'Me too... Mind if we keep each other company?' },
      { s: 'Satone', t: "It's nice not to be alone, you know? ✨" },
    ],
  },
  {
    id: 2, xp: 100, title: "Writer's Block",
    lines: [
      { s: 'Satone', t: "Ugh... I've been staring at this blank page for an hour..." },
      { s: 'You', t: 'Maybe take a short break?' },
      { s: 'Satone', t: "You're right... Want some virtual coffee? ☕" },
      { s: 'Satone', t: 'Thanks for being here. It really helps.' },
    ],
  },
  {
    id: 3, xp: 300, title: 'Breakthrough',
    lines: [
      { s: 'Satone', t: 'I DID IT! I finished chapter 3! 🎉' },
      { s: 'You', t: "That's amazing!" },
      { s: 'Satone', t: "I couldn't have done it without you..." },
      { s: 'Satone', t: 'Having someone here... it means everything.' },
    ],
  },
  {
    id: 4, xp: 600, title: 'Late Night Talk',
    lines: [
      { s: 'Satone', t: 'Hey... can I ask you something personal?' },
      { s: 'You', t: 'Of course.' },
      { s: 'Satone', t: 'Do you ever feel the world is too loud... but also too quiet?' },
      { s: 'Satone', t: "That's why I write. And why I'm glad you're here. 💫" },
    ],
  },
  {
    id: 5, xp: 1000, title: 'Our Story',
    lines: [
      { s: 'Satone', t: "I think I'm going to write about us." },
      { s: 'You', t: 'About us?' },
      { s: 'Satone', t: 'Two people who found each other in the quiet hours...' },
      { s: 'Satone', t: 'And how working together made everything possible. 💕' },
    ],
  },
]

export const ACHIEVEMENTS = [
  { id: 1, name: 'First Step', icon: '🌱', xpReq: 50 },
  { id: 2, name: 'On Fire', icon: '🔥', xpReq: 150 },
  { id: 3, name: 'Task Master', icon: '✅', xpReq: 250 },
  { id: 4, name: 'Habit Builder', icon: '💪', xpReq: 400 },
  { id: 5, name: 'Deep Focus', icon: '🧠', xpReq: 600 },
  { id: 6, name: 'Story Lover', icon: '📖', xpReq: 300 },
  { id: 7, name: 'Night Owl', icon: '🦉', xpReq: 500 },
  { id: 8, name: 'Zen Master', icon: '🧘', xpReq: 1500 },
]

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const DEFAULT_TODOS = [
  { id: 1, text: 'Design', done: false },
  { id: 2, text: 'Web development', done: false },
  { id: 3, text: 'Social media content', done: false },
]

export const DEFAULT_HABITS = [
  { id: 1, name: 'Drink water', icon: '💧', done: false },
  { id: 2, name: 'Stretch break', icon: '🧘', done: false },
  { id: 3, name: 'Read 10 pages', icon: '📖', done: false },
  { id: 4, name: 'Meditate', icon: '🧠', done: false },
]

export const WEEKLY_DATA = [
  { day: 'Mon', focus: 45 },
  { day: 'Tue', focus: 90 },
  { day: 'Wed', focus: 30 },
  { day: 'Thu', focus: 120 },
  { day: 'Fri', focus: 75 },
  { day: 'Sat', focus: 50 },
  { day: 'Sun', focus: 60 },
]
