import React, { useState, useEffect } from 'react';
import { BookOpen, Brain, Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { QuizCard } from './components/QuizCard';
import { ProgressBar } from './components/ProgressBar';
import { QuizSummary } from './components/QuizSummary';
import { SubjectCard } from './components/SubjectCard';
import { DifficultySelector } from './components/DifficultySelector';
import { subjects, difficulties } from './data/quizzes';
import { fetchQuestions } from './services/api';
import type { ParsedQuestion } from './types';
import Image from './Assets/Frame-1.png';
import ChatWidget from './components/ChatWidget';

const QUESTION_TIMER = 30;

interface QuizState {
  questions: ParsedQuestion[];
  currentQuestionIndex: number;
  userAnswers: Record<string, string>;
  timeRemaining: number;
  quizStatus: 'idle' | 'in-progress' | 'completed';
  isLoading?: boolean;
  error?: string;
}

function App() {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: {},
    timeRemaining: QUESTION_TIMER,
    quizStatus: 'idle',
    isLoading: false
  });
  
  const [evaluationFeedback, setEvaluationFeedback] = useState<string>("");

  // Timer: Decrease timeRemaining every second
  useEffect(() => {
    if (quizState.quizStatus === 'in-progress') {
      const timer = setInterval(() => {
        setQuizState(prev => {
          if (prev.timeRemaining <= 0) {
            // When time is up for a question, auto-mark it as skipped
            if (prev.currentQuestionIndex < prev.questions.length - 1) {
              return {
                ...prev,
                currentQuestionIndex: prev.currentQuestionIndex + 1,
                timeRemaining: QUESTION_TIMER,
                userAnswers: {
                  ...prev.userAnswers,
                  [prev.questions[prev.currentQuestionIndex].id]: null
                }
              };
            } else {
              return { ...prev, quizStatus: 'completed' };
            }
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizState.quizStatus, quizState.currentQuestionIndex]);

  const startQuiz = async () => {
    setQuizState(prev => ({ ...prev, isLoading: true, error: undefined }));
    
    try {
      const fetchedQuestions = await fetchQuestions(selectedSubject, selectedDifficulty);
      
      setQuizState({
        questions: fetchedQuestions,
        currentQuestionIndex: 0,
        userAnswers: {},
        timeRemaining: QUESTION_TIMER,
        quizStatus: 'in-progress',
        isLoading: false
      });
    } catch (error) {
      setQuizState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load questions. Please try again.'
      }));
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    setQuizState(prev => ({
      ...prev,
      userAnswers: { ...prev.userAnswers, [currentQuestion.id]: answer }
    }));
  };

  // Move to next question
  const handleNextQuestion = () => {
    setQuizState(prev => {
      if (prev.currentQuestionIndex < prev.questions.length - 1) {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          timeRemaining: QUESTION_TIMER,
        };
      } else {
        return { ...prev, quizStatus: 'completed' };
      }
    });
  };

  // Skip the current question (marks it as skipped)
  const handleSkipQuestion = () => {
    setQuizState(prev => {
      if (prev.currentQuestionIndex < prev.questions.length - 1) {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          timeRemaining: QUESTION_TIMER,
          userAnswers: {
            ...prev.userAnswers,
            [prev.questions[prev.currentQuestionIndex].id]: null
          }
        };
      } else {
        return { ...prev, quizStatus: 'completed' };
      }
    });
  };

  const resetQuiz = () => {
    setSelectedSubject('');
    setSelectedDifficulty('');
    setQuizState({
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: {},
      timeRemaining: QUESTION_TIMER,
      quizStatus: 'idle',
      isLoading: false
    });
    setEvaluationFeedback("");
  };

  const Header = () => (
    <div className="w-full bg-gradient-to-r from-violet-500 to-purple-600 p-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-white" />
          <h1 className="text-2xl font-bold text-white">ExamEase</h1>
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    if (quizState.quizStatus === 'idle') {
      if (!selectedSubject) {
        return (
          <div className="min-h-screen bg-gradient-to-b from-purple-50 to-violet-100 animate-fadeIn">
            <Header />
            <div className="max-w-6xl mx-auto px-4 py-12">
              <div className="text-center mb-12">
                <div className="inline-block p-3 bg-white rounded-full mb-8 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all">
                  <BookOpen className="w-12 h-12 text-violet-600" />
                </div>
                <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600">
                  Welcome to ExamEase
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
                  Challenge your knowledge with our interactive, <strong>AI-powered</strong> quiz and assessment system. Take quizzes on a variety of subjects, receive real-time feedback, and gain valuable insights into your performance.
                </p>
              </div>

              {/* New prompt line before subjects */}
              <p className="text-center text-lg text-purple-600 mb-6">
                You can take tests on a wide range of subjects—choose one below:
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {subjects.map(subject => (
                  <div key={subject.id} className="transform hover:-translate-y-2 transition-all duration-300">
                    <SubjectCard
                      {...subject}
                      selected={selectedSubject === subject.id}
                      onSelect={() => setSelectedSubject(subject.id)}
                    />
                  </div>
                ))}
              </div>

              {/* Additional content section */}
              <section className="mt-16">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
                  Why Choose ExamEase?
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <BookOpen className="w-10 h-10 text-violet-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Diverse Quiz Topics</h3>
                    <p className="text-gray-600">
                      Explore a wide range of AI-based quizzes covering various subjects to test your general knowledge.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <Brain className="w-10 h-10 text-purple-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Instant Feedback</h3>
                    <p className="text-gray-600">
                      Receive immediate insights on your answers to understand your strengths and areas for improvement.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <Sparkles className="w-10 h-10 text-purple-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">AI-Powered Assistance</h3>
                    <p className="text-gray-600">
                      Track your performance and get last-minute prep help from our integrated AI chatbot.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        );
      }

      if (!selectedDifficulty) {
        return (
          <div className="min-h-screen bg-gradient-to-b from-purple-50 to-violet-100 animate-fadeIn">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-12">
              <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600">
                  Choose Your Challenge Level
                </h2>
                <DifficultySelector
                  difficulties={difficulties}
                  selected={selectedDifficulty}
                  onSelect={setSelectedDifficulty}
                />
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-violet-100 flex items-center justify-center animate-fadeIn">
          <div className="max-w-2xl w-full px-4 py-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600">
                Ready to Challenge Yourself?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                You've selected {subjects.find(s => s.id === selectedSubject)?.name} at {difficulties.find(d => d.id === selectedDifficulty)?.name} level.
              </p>
              <img 
                src={Image} 
                alt="person image" 
                className="mb-4 w-1/2 rounded-md mx-auto" 
              />
              {quizState.error && (
                <p className="text-red-500 mb-4">{quizState.error}</p>
              )}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={startQuiz}
                  disabled={quizState.isLoading}
                  className="bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3 px-6 rounded-xl hover:opacity-90 transition-all hover:shadow-md disabled:opacity-50 flex items-center justify-center"
                >
                  {quizState.isLoading ? (
                    <>
                      <motion.div
                        className="w-6 h-6 border-4 border-t-transparent border-white rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      />
                      <span>Loading...</span>
                    </>
                  ) : 'Start Quiz'}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (quizState.quizStatus === 'completed') {
      const correctAnswers = Object.entries(quizState.userAnswers).filter(
        ([id, answer]) => {
          const question = quizState.questions.find(q => q.id === id);
          return question?.correctAnswer === answer;
        }
      ).length;
    
      // Construct quiz results array
      const quizResults = quizState.questions.map(q => ({
        id: q.id,
        question: q.question,
        userAnswer: quizState.userAnswers[q.id] || null,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      }));
    
      return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-violet-100 animate-fadeIn">
          <Header />
          <div className="flex items-center justify-center p-4 py-12">
            <QuizSummary
              score={correctAnswers}
              totalQuestions={quizState.questions.length}
              feedback={`You correctly answered ${correctAnswers} out of ${quizState.questions.length} questions.`}
              results={quizResults}
              onRestart={resetQuiz}
              onHome={resetQuiz}
            />
          </div>
        </div>
      );
    }
  
    // Quiz in progress page
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-violet-100 animate-fadeIn">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-12">
          <ProgressBar
            current={quizState.currentQuestionIndex}
            total={quizState.questions.length}
          />
          <div className="mt-8">
            <QuizCard
              question={currentQuestion}
              selectedAnswer={quizState.userAnswers[currentQuestion?.id]}
              timeRemaining={quizState.timeRemaining}
              onAnswerSelect={handleAnswerSelect}
              showFeedback={false} // Change based on logic if feedback is needed
              onNext={handleNextQuestion}
              onSkip={handleSkipQuestion}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderPage()}
      <ChatWidget />
    </>
  );
}

export default App;
