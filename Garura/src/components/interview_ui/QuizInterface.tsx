// ELECTRON APP: src/components/interview_ui/QuizInterface.tsx
import { useState, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { CheckCircle } from 'lucide-react';

export default function QuizInterface({ quizData }: { quizData: any }) {
  const roomCode = useAppStore((state) => state.roomCode);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quizData.duration);
  const [answers, setAnswers] = useState<string[]>(new Array(quizData.questions.length).fill(null));
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState<{ score: number; totalQuestions: number } | null>(null);

  const currentQuestion = quizData.questions[currentQuestionIndex];

  useEffect(() => {
    if (isFinished) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          goToNextQuestion();
          return quizData.duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, isFinished]);

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(quizData.duration);
    } else {
      submitQuiz();
    }
  };

  const handleAnswerSelect = (option: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = option;
    setAnswers(newAnswers);
    setTimeout(() => goToNextQuestion(), 300); // Give user feedback time
  };

  const submitQuiz = async () => {
    if (isFinished) return;
    setIsFinished(true);
    try {
      const result = await window.electronAPI.submitQuiz({ answers, questions: quizData.questions });
      setFinalScore(result);
      // Notify the server (and thus the interviewer) of the score
      window.electronAPI.notifyQuizScored({ roomCode: roomCode!, score: result.score, total: result.totalQuestions });
    } catch (error) {
      console.error("Failed to submit quiz", error);
    }
  };

  return (
    <div className="h-full flex flex-col rounded-xl border border-slate-700 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 shadow-lg">
      {isFinished ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
          <CheckCircle className="h-20 w-20 text-green-500 mb-4" />
          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          {finalScore ? (
            <>
              <div className="bg-slate-800/50 rounded-xl p-6 mb-4">
                <p className="text-5xl font-bold my-2 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  {finalScore.score}<span className="text-white">/</span>{finalScore.totalQuestions}
                </p>
                <p className="text-slate-400">Your Score</p>
              </div>
              <p className="text-slate-400 max-w-md">
                The interviewer has been notified of your results
              </p>
            </>
          ) : (
            <p className="text-slate-400">Calculating score...</p>
          )}
        </div>
      ) : (
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="bg-slate-800/50 px-3 py-1 rounded-lg">
              <h2 className="text-lg font-bold">
                Question <span className="text-blue-400">{currentQuestionIndex + 1}</span>
                <span className="text-slate-400">/{quizData.questions.length}</span>
              </h2>
            </div>
            <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-lg border border-red-500/30">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <p className="text-xl font-mono font-bold">
                {timeLeft}s
              </p>
            </div>
          </div>
          
          <p className="text-xl mb-6 px-2 py-4 bg-slate-800/30 rounded-lg border border-slate-700">
            {currentQuestion.question}
          </p>
          
          <div className="flex-1 grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className="w-full text-left p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 transition-all duration-200 hover:translate-x-1 hover:border-blue-500/50"
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full border border-slate-600 mr-3 flex items-center justify-center">
                    <span className="text-sm">{String.fromCharCode(65 + index)}</span>
                  </div>
                  {option}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}