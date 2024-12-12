import React, { useState, useEffect, useCallback } from 'react';
import { json, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Timer, X } from 'lucide-react';
import axiosInstance from '../../axiosInstance';

const TIMER_DURATION = 30;

const QuizComponent = () => {
  const navigate = useNavigate();
  const { topicId } = useParams();
  
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [showResults, setShowResults] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quizSession, setQuizSession] = useState({
    startTime: new Date().toISOString(),
    attempts: []
  });

  const currentQuiz = quizzes[currentQuizIndex];
  const isLastQuestion = currentQuizIndex === quizzes.length - 1;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const updateProgress = useCallback(async () => {
    if (!topicId || quizSession.attempts.length === 0) return;

    try {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      
      const results = quizSession.attempts.map(attempt => {
        const quiz = quizzes.find(q => q.Quiz_id === attempt.quiz_id);
        return {
          stu_id: userData?.[0]?.stu_id,
          course_id: userData?.[0]?.course_id,
          Quiz_id: attempt.quiz_id,
          Course_Topic_id: parseInt(topicId),
          wrong_quiz: attempt.is_correct ? 0 : 1,
          correct_quiz: attempt.is_correct ? 1 : 0,
          total_quiz: 1
        };
      });

      const response = await axiosInstance.post('/tracking/updateProgress', { results });
      
      if (response.status === 200) {
        setShowResults(true);
      }
    } catch (error) {
      setSubmissionError(error.response?.data?.error || 'Failed to submit quiz results');
      console.error('Failed to update progress:', error);
    }
  }, [topicId, quizSession.attempts, quizzes]);

  const fetchQuizzes = useCallback(async () => {
    if (!topicId) {
      setError('Topic ID is required');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/quiz/TopicQuiz/${topicId}`);
      const data = response.data;
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid quiz data format');
      }

      const transformedQuizzes = data.map((quiz) => ({
        ...quiz,
        options: quiz.quiz_option,
        correctAnswer: JSON.parse(quiz.Quiz_Correct_ans)[0].id,
      }));

      setQuizzes(transformedQuizzes);
    } catch (err) {
      setError(err.message || 'Failed to load quiz questions');
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    let timer;
    if (timeLeft > 0 && !showResults) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft, showResults]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleTimeUp = useCallback(() => {
    if (!isLastQuestion) {
      handleNext();
    } else {
      updateProgress();
    }
  }, [isLastQuestion, updateProgress]);

  const handleAnswerSelect = useCallback((optionId) => {
    if (!currentQuiz) return;
    
    const isCorrect = optionId === currentQuiz.correctAnswer;
    
    setQuizSession(prev => ({
      ...prev,
      attempts: [
        ...prev.attempts.filter(a => a.quiz_id !== currentQuiz.Quiz_id),
        {
          quiz_id: currentQuiz.Quiz_id,
          selected_option_id: optionId,
          is_correct: isCorrect,
          timestamp: new Date().toISOString()
        }
      ]
    }));

    setSelectedAnswer(optionId);
  }, [currentQuiz]);

  const handleNext = useCallback(() => {
    if (selectedAnswer === null) return;

    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(TIMER_DURATION);
    } else if (isLastQuestion) {
      updateProgress();
    }
  }, [currentQuizIndex, isLastQuestion, quizzes.length, selectedAnswer, updateProgress]);

  const handlePrevious = useCallback(() => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(prev => prev - 1);
      const previousAttempt = quizSession.attempts.find(
        a => a.quiz_id === quizzes[currentQuizIndex - 1].Quiz_id
      );
      setSelectedAnswer(previousAttempt?.selected_option_id || null);
      setTimeLeft(TIMER_DURATION);
    }
  }, [currentQuizIndex, quizSession.attempts, quizzes]);


  // Rest of your component (ResultsModal, loading, error states, and return JSX) remains the same
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  const ResultsModal = () => {
    const attemptedQuizzes = quizSession.attempts;
    const correctAnswers = attemptedQuizzes.filter(a => a.is_correct).length;
    const wrongAnswers = attemptedQuizzes.length - correctAnswers;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 h-[90vh] overflow-y-auto">
          {submissionError ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {submissionError}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Quiz Results</h2>
                <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-green-800 font-medium">Correct</h3>
                  <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-red-800 font-medium">Wrong</h3>
                  <p className="text-2xl font-bold text-red-600">{wrongAnswers}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-blue-800 font-medium">Total Questions</h3>
                  <p className="text-2xl font-bold text-blue-600">{quizzes.length}</p>
                </div>
              </div>

              <div className="space-y-6">
                {quizzes.map((quiz, index) => {
                  const attempt = attemptedQuizzes.find(a => a.quiz_id === quiz.Quiz_id);
                  const options = Array.isArray(quiz.options) ? JSON.parse(quiz.options) : [];
                  const selectedOption = options.find(opt => opt.id === attempt?.selected_option_id);
                  const correctOption = options.find(opt => opt.id === quiz.correctAnswer);

                  return (
                    <div key={quiz.Quiz_id} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium">Q{index + 1}. {quiz.Quiz_Question}</h4>
                      {attempt ? (
                        <>
                          <p className={attempt.is_correct ? 'text-green-600' : 'text-red-600'}>
                            Your answer: {selectedOption?.text || 'Not attempted'}
                          </p>
                          <p className="font-medium mt-2">
                            Correct answer: {correctOption?.text}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500">Not attempted</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

    {/* Parse the options once, if needed */}
  const options = Array.isArray(currentQuiz?.options) 
    ? currentQuiz?.options 
    : currentQuiz?.options ? JSON.parse(currentQuiz?.options) : [];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {currentQuiz?.Quiz_name}
            </h2>
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-orange-600" />
              <span className="font-mono text-lg font-medium">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {currentQuiz?.Quiz_Question}
          </h3>

          <div className="space-y-3">


  {Array.isArray(options) && options.length > 0 ? (
    options.map((option, index) => {
      const optionLabel = String.fromCharCode(65 + index); // 'A', 'B', 'C', etc.
      const isSelected = selectedAnswer === option.id;

      return (
        <div
          key={option.id}
          onClick={() => handleAnswerSelect(option.id)} // Handles the option selection
          className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer 
            ${isSelected ? 'bg-slate-900 border-blue-500 text-white' : 'hover:bg-slate-50 border-slate-200 text-slate-700'}`}
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
              ${isSelected ? 'border-blue text-indigo-600' : 'border-slate-400 text-slate-400'}`}
          >
            <span className="font-medium text-inherit">{optionLabel}</span> {/* Option Label (A, B, C, etc.) */}
          </div>
          <p>{option.text}</p> {/* Option Text */}
        </div>
      );
    })
  ) : (
    <p>No options available</p> // Message when options are not an array or empty
  )}
</div>

        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuizIndex === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
            ${currentQuizIndex === 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-800 text-white hover:bg-gray-700'}`}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>
        
        <span className="text-gray-600">
          Question {currentQuizIndex + 1} of {quizzes.length}
        </span>
        
        <button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
            ${selectedAnswer === null 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-800 text-white hover:bg-gray-700'}`}
        >
          {isLastQuestion ? 'Finish' : 'Next'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {showResults && <ResultsModal />}
    </div>
  );
};

export default QuizComponent;