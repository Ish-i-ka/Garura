import { useAppStore } from "../../store/useAppStore";
import { ShieldAlert } from "lucide-react";

export default function ScanFailedScreen() {
  const errorMessage = useAppStore((state) => state.errorMessage);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 text-center p-4">
      <ShieldAlert className="h-24 w-24 text-red-500" />
      <div>
        <h1 className="text-3xl font-bold text-red-400">Security Check Failed</h1>
        <p className="text-slate-400 mt-2">The application cannot continue.</p>
      </div>
      <div className="w-full max-w-lg bg-slate-800 p-6 rounded-lg border border-red-700">
        <p className="font-semibold text-lg">Reason:</p>
        <p className="text-red-300 mt-2">{errorMessage}</p>
        <p className="text-slate-500 text-sm mt-4">Please resolve the issue and restart the application.</p>
      </div>
    </div>
  );
}