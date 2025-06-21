import { Shield, Loader2 } from "lucide-react";

export default function PreLaunchScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 text-center p-4">
      <div className="relative flex items-center justify-center h-32 w-32">
        <Shield className="h-24 w-24 text-blue-500" />
        <Loader2 className="absolute h-32 w-32 animate-spin text-blue-400/50" />
      </div>
      <div>
        <h1 className="text-3xl font-bold">System Security Check</h1>
        <p className="text-slate-400 mt-2">Preparing secure interview environment...</p>
      </div>
      <div className="w-full max-w-md text-slate-500">
        <p>Please wait, this may take a moment.</p>
      </div>
    </div>
  );
}