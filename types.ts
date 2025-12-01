export interface Tag {
  id: string;
  name: string;
  color: string; // Tailwind color class snippet like 'bg-red-200 text-red-800'
}

export interface Session {
  id: string;
  title: string;
  clientName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  tags: string[]; // Array of Tag IDs
  notes?: string;
}

export interface CalendarDay {
  date: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  sessions: Session[];
}

export type ViewMode = 'calendar' | 'tags' | 'stats';
