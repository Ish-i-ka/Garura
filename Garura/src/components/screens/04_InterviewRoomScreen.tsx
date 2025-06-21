'use client';

import { useAppStore } from "../../store/useAppStore";
import { useEffect, useState } from "react";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  Call,
  useCall,
  SpeakerLayout,
  ToggleAudioPublishingButton,
  ScreenShareButton,
} from "@stream-io/video-react-sdk";
import { Loader2, XCircle, AlertTriangle, Send } from "lucide-react";
import { nanoid } from "nanoid";
import { toast } from "sonner";

// Import all the UI components for the right-hand pane
import CodeQuestionViewer from "../interview_ui/CodeQuestionViewer";
import CodeEditor from "../interview_ui/CodeEditor";
import QuizInterface from "../interview_ui/QuizInterface";
import Whiteboard from "../interview_ui/Whiteboard";
import IntervieweeChat from "../interview_ui/IntervieweeChat";

// A small, dedicated helper component to manage the call state.
// This enforces the "microphone always on" rule robustly.
const CallManager = () => {
  const call = useCall();
  useEffect(() => {
    if (call) {
      const enableMic = () => {
        // Check if microphone is disabled
        if (call.microphone.state.status === 'disabled') {
          call.microphone.enable();
        }
      };
      enableMic(); // Enable on mount.
      const interval = setInterval(enableMic, 3000); // Re-check every 3 seconds to enforce.
      return () => clearInterval(interval); // Cleanup on unmount.
    }
  }, [call]);
  return null; // This component renders no UI itself.
}

// This is the main screen for the entire live interview experience.
export default function InterviewRoomScreen() {
  const { roomCode, sessionConfig } = useAppStore();
  
  // State for the connection and video client
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  
  // A single, unified state for managing the connection lifecycle
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  // State for the dynamic UI content driven by the interviewer
  const [codingQuestion, setCodingQuestion] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<any | null>(null); // 'any' is acceptable here as quiz shape is dynamic
  const [currentCode, setCurrentCode] = useState<string>(''); // Holds the live code from the editor
  const [ctrlWarning, setCtrlWarning] = useState<string | null>(null);

  // This single, consolidated useEffect handles the entire setup and event listening.
  useEffect(() => {
    if (!roomCode) {
      setErrorMessage('Critical error: Room code is missing.');
      setConnectionStatus('error');
      return;
    }

    const userId = `interviewee-${nanoid(8)}`;
    const apiKey = import.meta.env.VITE_STREAM_API_KEY;
    if (!apiKey) {
      setErrorMessage("Configuration error: Stream API key is missing from .env file.");
      setConnectionStatus('error');
      return;
    }
    
    let videoClient: StreamVideoClient;

    const setupConnectionAndListeners = async () => {
      try {
        // 1. Fetch the token from our secure main process
        const { token } = await window.electronAPI.getStreamToken(userId, roomCode);
        
        // 2. Create and connect the video client
        videoClient = new StreamVideoClient({ apiKey, user: { id: userId, name: "Interviewee" }, token });
        const videoCall = videoClient.call('default', roomCode);
        await videoCall.join();
        
        // 3. Set the state to render the UI
        setClient(videoClient);
        setCall(videoCall);
        setConnectionStatus('success');

      } catch (err: any) {
        console.error("Connection setup failed:", err);
        setErrorMessage(err.message || "An unknown error occurred while connecting to the interview.");
        setConnectionStatus('error');
      }
    };
    
    setupConnectionAndListeners();
    
    // --- All event listeners are set up once and cleaned up on unmount ---
    const cleanupEnd = window.electronAPI.onInterviewEnded(() => {
      setErrorMessage("This interview has been ended by the host. The application will close shortly.");
      setConnectionStatus('error');
    });
    const cleanupQuestion = window.electronAPI.onNewCodingQuestion((markdown) => {
      setQuizData(null); // Ensure only one panel shows at a time
      setCodingQuestion(markdown);
      toast.info("A new coding question has been posted.");
    });
    const cleanupQuiz = window.electronAPI.onQuizStarted((data) => {
      setCodingQuestion(null); // Ensure only one panel shows
      setQuizData(data);
      toast.info("The quiz has started!");
    });
    const cleanupCtrl = window.electronAPI.onCtrlKeyWarning((count) => {
      setCtrlWarning(`Warning: System key pressed (${count}/3). Please avoid OS shortcuts.`);
    });

    return () => {
      videoClient?.disconnectUser();
      cleanupEnd();
      cleanupQuestion();
      cleanupQuiz();
      cleanupCtrl();
    };
  }, [roomCode]); // This effect runs only once when the roomCode is available.

  // --- Action Handlers ---
  const handleSendMessage = (text: string) => {
    if (roomCode) window.electronAPI.sendChatMessage({ roomCode, text });
  };
  const handleCodeSubmit = () => {
    if (roomCode) {
      window.electronAPI.submitCode({ roomCode, code: currentCode });
      toast.success("Your code has been submitted to the interviewer.");
    }
  };

  // --- RENDER LOGIC ---

  if (connectionStatus === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
        <h1 className="text-2xl font-bold">Connecting to Interview...</h1>
      </div>
    );
  }

  if (connectionStatus === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <XCircle className="h-16 w-16 text-red-500" />
        <h1 className="text-2xl font-bold">Session Disconnected</h1>
        <p className="text-slate-400 max-w-md">{errorMessage}</p>
      </div>
    );
  }
  
  return (
    // We are certain client and call exist here because status is 'success'
    <StreamVideo client={client!}>
      <StreamCall call={call!}>
        <CallManager />
        <div className="h-screen w-screen flex bg-slate-900 relative">
          
          {ctrlWarning && (
            <div 
              // This key makes React treat it as a new element each time, re-triggering animation
              key={ctrlWarning}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-yellow-500 text-black font-semibold p-3 rounded-lg flex items-center gap-2 animate-in fade-in-5 slide-in-from-top-5"
            >
              <AlertTriangle size={20} />
              {ctrlWarning}
            </div>
          )}
          
          {/* Main Content Area (Video + Chat) */}
          <div className="flex-grow h-full flex flex-col p-4 gap-4">
            <div className="flex-grow relative min-h-0">
                <SpeakerLayout participantsBarPosition="right" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-800/80 backdrop-blur-sm p-3 rounded-full border border-slate-700">
                    {/* The mic button is visible but programmatically forced ON by CallManager */}
                    <ToggleAudioPublishingButton />
                    <ScreenShareButton />
                </div>
            </div>
            <div className="h-[25%] min-h-[160px]">
                 <IntervieweeChat onSendMessage={handleSendMessage}/>
            </div>
          </div>
          
          {/* Right Pane: Dynamic Content */}
          <div className="w-[40%] min-w-[450px] max-w-[600px] h-full bg-slate-800 border-l-2 border-slate-700 p-4 flex flex-col gap-4">
            {codingQuestion && sessionConfig.hasCodingChallenge && (
              <div className="flex-1 flex flex-col gap-4 min-h-0">
                <div className="h-[40%]"><CodeQuestionViewer markdown={codingQuestion} /></div>
                <div className="h-[55%]"><CodeEditor onChange={setCurrentCode} /></div>
                <button onClick={handleCodeSubmit} className="flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-base">
                  <Send size={18} className="mr-2"/> Submit Code
                </button>
              </div>
            )}
            {quizData && sessionConfig.hasQuiz && (
              <div className="flex-1 min-h-0"><QuizInterface quizData={quizData} /></div>
            )}
            {sessionConfig.hasWhiteboard && !codingQuestion && !quizData && (
                <div className="flex-1 min-h-0"><Whiteboard /></div>
            )}
            {!codingQuestion && !quizData && !sessionConfig.hasWhiteboard && (
              <div className="flex-1 flex items-center justify-center text-slate-500 rounded-lg border-2 border-dashed border-slate-600">
                <p>Awaiting instructions from the interviewer.</p>
              </div>
            )}
          </div>
        </div>
      </StreamCall>
    </StreamVideo>
  );
}