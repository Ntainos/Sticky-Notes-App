import type { NoteTemplate } from '../types';
import { colors } from '../../../theme/colors';

export const templateToColor = (template: NoteTemplate): string => {
  switch (template) {
    case 'pink':
      return colors.stickyPink;
    case 'blue':
      return colors.stickyBlue;
    case 'green':
      return colors.stickyGreen;
    case 'yellow':
    default:
      return colors.stickyYellow;
  }
};
