import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { KeyRound, Loader2 } from "lucide-react";

export default function RoomEntryScreen() {
    const setRoomDetails = useAppStore((state) => state.setRoomDetails);
    const [roomCode, setRoomCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomCode) return;
        setIsLoading(true);
        setError('');
        try {
            const result = await window.electronAPI.verifyRoomCode(roomCode);
            if (result.isValid) {
                setRoomDetails(roomCode, result.sessionConfig);
            }
        } catch (err: any) {
            setError(err.message || 'Invalid room code.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <KeyRound className="h-12 w-12 text-blue-500" />
            <h1 className="text-3xl font-bold">Join Interview</h1>
            <p className="text-slate-400">Please enter the room code provided by your interviewer.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xs mt-4">
                <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    placeholder="ENTER ROOM CODE"
                    className="p-4 text-center text-2xl font-mono tracking-widest bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button type="submit" disabled={isLoading} className="flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold disabled:bg-slate-500">
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Join'}
                </button>
                {error && <p className="text-red-500 text-center">{error}</p>}
            </form>
        </div>
    );
}