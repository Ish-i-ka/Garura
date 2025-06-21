import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import PreLaunchScreen from './screens/01_PreLaunchScreen';
import ScanFailedScreen from './screens/01a_ScanFailedScreen';
import RoomEntryScreen from './screens/02_RoomEntryScreen';
import PermissionScreen from './screens/03_PermissionScreen';
import InterviewRoomScreen from './screens/04_InterviewRoomScreen';
import { Toaster } from 'sonner';

const screenComponents = {
  'pre-launch': <PreLaunchScreen />,
  'scan-failed': <ScanFailedScreen />,
  'room-entry': <RoomEntryScreen />,
  'permissions': <PermissionScreen />,
  'interview': <InterviewRoomScreen />,
};

export default function App() {
  const { screen, setScreen, setScanFailed } = useAppStore();

  // --- THIS IS THE FINAL FIX ---
  // The scan logic now lives in the stable parent component.
  // It runs ONLY ONCE when the app first mounts.
  useEffect(() => {
  const runScan = async () => {
    console.log("[DEBUG] Starting security scan...");
    const result = await window.electronAPI.runPreLaunchScan();
    console.log(`[DEBUG] Scan result: ${JSON.stringify(result)}`);

    if (result.success) {
      setScreen('room-entry');
    } else {
      setScanFailed(result.reason || 'An unknown security error occurred.');
    }
  };
  
  if (screen === 'pre-launch') {
    runScan();
  }
}, [screen, setScreen, setScanFailed]);

  const CurrentScreen = screenComponents[screen];

  return (
    <div className="h-screen w-screen bg-slate-900 text-white">
      {CurrentScreen}
      <Toaster position="top-center" richColors />
    </div>
  );
}