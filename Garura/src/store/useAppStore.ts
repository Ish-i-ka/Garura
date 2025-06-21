import { create } from 'zustand';

type AppScreen = 'pre-launch' | 'scan-failed' | 'room-entry' | 'permissions' | 'interview';

interface AppState {
  screen: AppScreen;
  errorMessage: string;
  roomCode: string | null;
  sessionConfig: any | null;
  setScreen: (screen: AppScreen) => void;
  setScanFailed: (reason: string) => void;
  setRoomDetails: (code: string, config: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
  screen: 'pre-launch',
  errorMessage: '',
  roomCode: null,
  sessionConfig: null,
  setScreen: (screen) => set({ screen }),
  setScanFailed: (reason) => set({screen : 'scan-failed', errorMessage: reason}),
  setRoomDetails: (code, config) => set({ roomCode: code, sessionConfig: config, screen: 'permissions' }),
}));