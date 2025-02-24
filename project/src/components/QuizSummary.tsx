import React, { useState } from 'react';
import { Trophy, BarChart2, Check, X, ChevronDown, ChevronUp, ArrowRight, RefreshCw } from 'lucide-react';

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
  let gradientColors = '';
  
  if (percentage >= 80) {
    message = 'Outstanding Performance! 🎉';
    color = 'text-green-500';
    gradientColors = 'from-green-400 to-emerald-400';
  } else if (percentage >= 60) {
    message = 'Good Work! Keep Learning! 👍';
    color = 'text-blue-500';
    gradientColors = 'from-blue-400 to-cyan-400';
  } else {
    message = 'Keep Practicing! You\'ll Get Better! 💪';
    color = 'text-red-500';
    gradientColors = 'from-red-400 to-orange-400';
  }

  return (
    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6 relative">
        <div className="p-6 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full transform hover:scale-110 transition-transform duration-300 relative">
            <Trophy className="w-16 h-16 text-white animate-pulse" />
            <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg">
              <div className={`text-xl font-bold ${color}`}>{Math.round(percentage)}%</div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-3">
          Quiz Completed!
        </h2>
        <p className={`text-xl font-medium ${color} mb-4 animate-bounce`}>{message}</p>
        
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl py-4 px-8 inline-block shadow-inner">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Score</div>
              <div className="text-3xl font-bold text-gray-900">{score}/{totalQuestions}</div>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Correct</div>
              <div className="text-3xl font-bold text-green-500">{score}</div>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Incorrect</div>
              <div className="text-3xl font-bold text-red-500">{totalQuestions - score}</div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-gray-700 italic">{feedback}</p>
      </div>

      {showDetails && (
        <div className="mb-8 animate-slideDown">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold flex items-center">
              <BarChart2 className="w-6 h-6 mr-2 text-purple-500" />
              Detailed Summary
            </h3>
          </div>
          <div className="space-y-4">
            {results.map((result) => (
              <div 
                key={result.id} 
                className="border-2 border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
              >
                <h4 className="font-semibold text-lg mb-4 text-gray-800">{result.question}</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {result.userAnswer === result.correctAnswer ? (
                        <Check className="w-6 h-6 text-green-500 mt-1" />
                      ) : (
                        <X className="w-6 h-6 text-red-500 mt-1" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-700">Your Answer:</p>
                      <p className="text-gray-600">
                        {result.userAnswer || <span className="italic text-gray-400">Skipped</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="w-6 h-6 text-purple-500 mt-1" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-700">Correct Answer:</p>
                      <p className="text-gray-600">{result.correctAnswer}</p>
                    </div>
                  </div>
                  <div className="pl-9 pt-2 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-purple-600">Explanation: </span>
                      {result.explanation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="group bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-xl hover:opacity-90 transition-all hover:shadow-lg flex items-center space-x-2"
        >
          <span>{showDetails ? "Hide Summary" : "Show Summary"}</span>
          {showDetails ? (
            <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          ) : (
            <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          )}
        </button>
        <button
          onClick={onRestart}
          className="group bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-xl hover:opacity-90 transition-all hover:shadow-lg flex items-center space-x-2"
        >
          <span>Try Another Quiz</span>
          <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>
    </div>
  );
}