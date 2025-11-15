// src/features/notes/data/initialNotes.ts

// Δεν χρησιμοποιώ τύπους εδώ για να μην σπάει τίποτα – είναι απλά demo notes.
export const initialNotes = [
  {
    id: '1',
    title: 'Coffee? ☕️',
    body: "Don't forget our coffee date at 16:00 💕",
    template: 'postIt',
    sender: 'them',
    createdAt: '2025-11-15T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Groceries 🛒',
    body: '- Milk\n- Eggs\n- Pasta\n- Something sweet 😉',
    template: 'cute',
    sender: 'you',
    createdAt: '2025-11-15T09:30:00.000Z',
  },
  {
    id: '3',
    title: 'Proud of you',
    body: 'Good luck with your exam today, you got this. ✨',
    template: 'calm',
    sender: 'them',
    createdAt: '2025-11-15T08:00:00.000Z',
  },
  {
    id: '4',
    title: 'Dinner idea 🍝',
    body: "Carbonara tonight? I'll bring the parmesan!",
    template: 'fresh',
    sender: 'you',
    createdAt: '2025-11-15T07:45:00.000Z',
  },
];
