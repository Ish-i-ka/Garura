// src/components/screens/03_PermissionScreen.tsx
'use client';

import { useAppStore } from "../../store/useAppStore";
import { CheckCircle, Mic, Video, Monitor, Loader2 } from "lucide-react";
import { 
  DeviceSettings, 
  StreamVideo, 
  StreamVideoClient, 
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";

export default function PermissionScreen() {
  const { setScreen, roomCode } = useAppStore();

  // We ONLY need a dummy client for the <DeviceSettings> component to work.
  // We do NOT need a call object. This was a source of previous errors.
  const [dummyClient, setDummyClient] = useState<StreamVideoClient | null>(null);

  useEffect(() => {
    // This is a temporary client just for this setup screen.
    // It will be discarded when we move to the real interview.
    const tempApiKey = 'placeholder_api_key'; // This can be any string.
    const tempUserId = `permission-check-${nanoid()}`;
    const client = new StreamVideoClient({ apiKey: tempApiKey, user: { id: tempUserId } });
    setDummyClient(client);

    return () => {
      // Clean up the dummy client when the component unmounts.
      client.disconnectUser();
    };
  }, []);

  const handleContinue = () => {
    // This logic is correct.
    window.electronAPI.connectSocket(roomCode!);
    setScreen('interview');
  };

  // Show a loading state until the dummy client is initialized.
  if (!dummyClient) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
          <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
          <p className="text-slate-400">Initializing device check...</p>
      </div>
    );
  }

  // This is the final, correct UI structure.
  return (
    // The <StreamVideo> provider is required for <DeviceSettings>.
    <StreamVideo client={dummyClient}>
      <div className="flex flex-col items-center justify-center h-full gap-6 p-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h1 className="text-3xl font-bold">Final Permission Check</h1>
        <p className="text-slate-400 max-w-md text-center">
          Please click "Allow" in the browser pop-ups to enable your camera and microphone.
        </p>

        <div className="flex items-center gap-8 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="flex flex-col items-center gap-2 text-slate-300"><Video className="h-8 w-8" /><span>Camera</span></div>
          <div className="flex flex-col items-center gap-2 text-slate-300"><Mic className="h-8 w-8" /><span>Microphone</span></div>
          <div className="flex flex-col items-center gap-2 text-slate-300"><Monitor className="h-8 w-8" /><span>Screen Share</span></div>
        </div>

        {/* This component will now work correctly. It handles the permission prompts itself. */}
        <div className="w-full max-w-lg p-2 bg-slate-900/50 rounded-lg border border-slate-700">
          <DeviceSettings />
        </div>

        {/* The button is always enabled. We trust the user to grant permissions. */}
        <button
          onClick={handleContinue}
          className="p-4 w-full max-w-sm bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold"
        >
          Continue to Interview
        </button>
      </div>
    </StreamVideo>
  );
}