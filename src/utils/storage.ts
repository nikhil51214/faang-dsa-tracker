// utils/storage.ts - LocalStorage utilities

import { AppState } from '../types';

const STORAGE_KEY = 'faang-dsa-state';

export const StorageUtils = {
  loadState: (): AppState | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load state from localStorage:', e);
    }
    return null;
  },

  saveState: (state: AppState): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  },

  clearState: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear localStorage:', e);
    }
  },

  exportState: (state: AppState): string => {
    return JSON.stringify(state, null, 2);
  },

  importState: (jsonString: string): AppState | null => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      return null;
    }
  },

  createBackup: (state: AppState): void => {
    const timestamp = new Date().toISOString();
    const backupKey = `${STORAGE_KEY}-backup-${timestamp}`;
    try {
      localStorage.setItem(backupKey, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to create backup:', e);
    }
  },

  getBackups: (): { key: string; timestamp: string }[] => {
    const backups: { key: string; timestamp: string }[] = [];
    const prefix = `${STORAGE_KEY}-backup-`;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        const timestamp = key.replace(prefix, '');
        backups.push({ key, timestamp });
      }
    }

    return backups.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },
};