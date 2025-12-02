import { Note } from '../types';

const now = new Date().toISOString();

export const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Coffee date',
    body: "Don't forget our coffee date at 16:00",
    template: 'postit',
    sender: 'them',
    deliveryStyle: 'sticky',
    createdAt: now,
    spaceId: 'space-us',
  },
  {
    id: '2',
    title: 'Groceries',
    body: ['- Milk', '- Eggs', '- Pasta', '- Something sweet'].join('\n'),
    template: 'cute',
    sender: 'you',
    deliveryStyle: 'sticky',
    createdAt: now,
    spaceId: 'space-us',
  },
  {
    id: '3',
    title: 'Proud of you',
    body: 'Good luck with your exam today, you got this.',
    template: 'calm',
    sender: 'them',
    deliveryStyle: 'sticky',
    createdAt: now,
    spaceId: 'space-us',
  },
  {
    id: '4',
    title: 'Dinner idea',
    body: "Carbonara tonight? I'll bring the parmesan!",
    template: 'fresh',
    sender: 'you',
    deliveryStyle: 'sticky',
    createdAt: now,
    spaceId: 'space-us',
  },
];
