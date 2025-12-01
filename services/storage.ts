import { Session, Tag } from '../types';
import { DEFAULT_TAGS } from '../constants';

const SESSIONS_KEY = 'meow_schedule_sessions';
const TAGS_KEY = 'meow_schedule_tags';

export const saveSessions = (sessions: Session[]) => {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

export const getSessions = (): Session[] => {
  const data = localStorage.getItem(SESSIONS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTags = (tags: Tag[]) => {
  localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
};

export const getTags = (): Tag[] => {
  const data = localStorage.getItem(TAGS_KEY);
  return data ? JSON.parse(data) : DEFAULT_TAGS;
};
