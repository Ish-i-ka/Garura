// ELECTRON APP: src/components/interview_ui/QuizInterface.tsx
import { useState, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";

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

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-3xl font-bold">Quiz Complete!</h2>
        {finalScore ? (
          <p className="text-5xl font-bold my-4">
            {finalScore.score} / {finalScore.totalQuestions}
          </p>
        ) : (
          <p>Calculating score...</p>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Question {currentQuestionIndex + 1}/{quizData.questions.length}</h2>
        <p className="text-2xl font-mono bg-red-500 text-white px-3 py-1 rounded">
          {timeLeft}s
        </p>
      </div>
      <p className="text-xl mb-6">{currentQuestion.question}</p>
      <div className="flex-1 flex flex-col gap-4">
        {currentQuestion.options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            className="w-full text-left p-4 rounded-lg bg-slate-700 hover:bg-blue-600 transition-colors"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}