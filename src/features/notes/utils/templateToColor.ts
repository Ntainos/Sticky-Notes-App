import colors from '../../../theme/colors';
import { NoteTemplate } from '../types';

export type TemplateColors = {
  background: string;
  text: string;
  footerText: string;
  pin: string;
};

const TEMPLATE_COLORS: Record<NoteTemplate, TemplateColors> = {
  postit: {
    background: colors.notePostIt,
    text: colors.textPrimary,
    footerText: colors.textSecondary,
    pin: 'rgba(148, 163, 184, 0.7)',
  },
  cute: {
    background: colors.noteCute,
    text: colors.textPrimary,
    footerText: colors.textSecondary,
    pin: 'rgba(148, 163, 184, 0.7)',
  },
  calm: {
    background: colors.noteCalm,
    text: colors.textPrimary,
    footerText: colors.textSecondary,
    pin: 'rgba(148, 163, 184, 0.7)',
  },
  fresh: {
    background: colors.noteFresh,
    text: colors.textPrimary,
    footerText: colors.textSecondary,
    pin: 'rgba(148, 163, 184, 0.7)',
  },
};

export const templateToColor = (template: NoteTemplate): TemplateColors => {
  return TEMPLATE_COLORS[template] ?? TEMPLATE_COLORS.postit;
};
