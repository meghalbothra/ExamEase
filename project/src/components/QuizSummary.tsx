import React, { useState } from 'react';
import { Trophy, BarChart2 } from 'lucide-react';

export interface QuizResult {
  id: string;
  question: string;
  userAnswer: string | null;
  correctAnswer: string;
  explanation: string;
}

interface QuizSummaryProps {
  score: number;
  totalQuestions: number;
  feedback: string;
  results: QuizResult[];
  onRestart: () => void;
}

export function QuizSummary({ 
  score, 
  totalQuestions, 
  feedback,
  results,
  onRestart
}: QuizSummaryProps) {
  const [showDetails, setShowDetails] = useState(false);
  const percentage = (score / totalQuestions) * 100;
  
  let message = '';
  let color = '';
  
  if (percentage >= 80) {
    message = 'Outstanding Performance! 🎉';
    color = 'text-green-500';
  } else if (percentage >= 60) {
    message = 'Good Work! Keep Learning! 👍';
    color = 'text-blue-500';
  } else {
    message = 'Keep Practicing! You\'ll Get Better! 💪';
    color = 'text-red-500';
  }

  return (
    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        {/* Trophy placed alone on its own line */}
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full">
            <Trophy className="w-12 h-12 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
        <p className={`text-xl font-medium ${color} mb-4`}>{message}</p>
        <div className="bg-gray-50 rounded-full py-3 px-6 inline-block">
          <span className="text-2xl font-bold text-gray-900">
            {score} / {totalQuestions}
          </span>
          <span className="text-gray-600 ml-2">
            ({Math.round(percentage)}%)
          </span>
        </div>
        <p className="mt-4 text-gray-700">{feedback}</p>
      </div>

      {showDetails && (
        <div className="mb-8 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold flex items-center">
              <BarChart2 className="w-6 h-6 mr-2 text-gray-700" />
              Detailed Summary
            </h3>
          </div>
          {results.map((result) => (
            <div key={result.id} className="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow duration-200">
              <h4 className="font-semibold text-lg mb-2">{result.question}</h4>
              <p className="mb-2">
                <span className="font-medium">Your Answer: </span>
                {result.userAnswer ? result.userAnswer : <span className="text-gray-500">Skipped</span>}
                {result.userAnswer === null ? (
                  <span className="text-blue-600 font-bold ml-2">(Skipped)</span>
                ) : result.userAnswer === result.correctAnswer ? (
                  <span className="text-green-600 font-bold ml-2">(Correct)</span>
                ) : (
                  <span className="text-red-600 font-bold ml-2">(Incorrect)</span>
                )}
              </p>
              <p className="mb-2">
                <span className="font-medium">Correct Answer: </span>
                {result.correctAnswer}
              </p>
              <p>
                <span className="font-medium">Explanation: </span>
                {result.explanation}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-purple-500 text-white py-3 px-6 rounded-xl hover:bg-purple-700 transition-colors"
        >
          {showDetails ? "Hide Summary" : "Show Summary"}
        </button>
        <button
          onClick={onRestart}
          className="bg-purple-500 text-white py-3 px-6 rounded-xl hover:bg-purple-700 transition-colors"
        >
          Try Another Quiz
        </button>
      </div>
    </div>
  );
}
