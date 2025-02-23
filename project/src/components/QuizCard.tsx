import { useState } from "react";

interface QuizCardProps {
  question: ParsedQuestion;
  selectedAnswer: string | undefined;
  timeRemaining: number;
  onAnswerSelect: (answer: string) => void;
  showFeedback: boolean;
  onNext: () => void;
  onSkip: () => void;
}

const QUESTION_TIMER = 30;

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  selectedAnswer,
  timeRemaining,
  onAnswerSelect,
  showFeedback,
  onNext,
  onSkip,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {question.question}
        </h3>

        {question.code && (
          <pre className="bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
            <code className="text-sm">{question.code}</code>
          </pre>
        )}

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = showFeedback && option === question.correctAnswer;
            const isWrong = showFeedback && isSelected && option !== question.correctAnswer;

            return (
              <button
                key={index}
                onClick={() => !showFeedback && onAnswerSelect(option)}
                disabled={showFeedback}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  isSelected
                    ? "bg-violet-100 border-violet-500"
                    : "bg-gray-50 hover:bg-gray-100"
                } ${
                  isCorrect
                    ? "bg-green-100 border-green-500"
                    : isWrong
                    ? "bg-red-100 border-red-500"
                    : ""
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timer Bar */}
      <div className="mt-4">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Time Remaining</span>
          <span>{timeRemaining}s</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full mt-2">
          <div
            className="h-full bg-violet-500 rounded-full transition-all"
            style={{ width: `${(timeRemaining / QUESTION_TIMER) * 100}%` }}
          />
        </div>
      </div>

      {/* Skip / Next Button */}
      <div className="mt-6 flex justify-end">
        {selectedAnswer ? (
          <button
            onClick={onNext}
            className="px-6 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition"
          >
            Next
          </button>
        ) : (
          <button
            onClick={onSkip}
            className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
};
