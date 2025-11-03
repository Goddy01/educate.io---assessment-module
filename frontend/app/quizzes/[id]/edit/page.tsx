'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { quizService, questionService, Question, QuestionType } from '@/lib/quiz';
import { Save, Plus, GripVertical, Trash2 } from 'lucide-react';
import { authService } from '@/lib/auth';

export default function QuizEditorPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Only instructors can edit assessments
    if (!authService.isInstructor()) {
      router.push('/dashboard');
      return;
    }

    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      const quizData = await quizService.getById(quizId);
      setQuiz(quizData);
      const questionsData = await questionService.getByQuiz(quizId);
      setQuestions(questionsData);
      if (questionsData.length > 0) {
        setSelectedQuestion(questionsData[0]);
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion: Partial<Question> = {
      quizId,
      type: QuestionType.MULTIPLE_CHOICE,
      prompt: '',
      options: ['', '', ''],
      correctAnswers: [0],
      points: 1,
      order: questions.length,
    };
    // In a real app, you'd create this via API first
    const tempId = `temp-${Date.now()}`;
    const question = { ...newQuestion, id: tempId } as Question;
    setQuestions([...questions, question]);
    setSelectedQuestion(question);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading quiz editor...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden md:ml-64">
        {/* Question List Sidebar */}
        <aside className="hidden md:block md:w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <div className="mb-4">
            <h2 className="font-orbitron font-bold text-lg mb-1 truncate">{quiz?.title}</h2>
            <p className="text-sm text-gray-600">Quiz Editor</p>
          </div>
          <div className="space-y-2 mb-4">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setSelectedQuestion(q)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                  selectedQuestion?.id === q.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm font-medium truncate">
                  Q{index + 1}: {q.type.replace('_', ' ')}
                </span>
              </button>
            ))}
          </div>
          <Button
            onClick={handleAddQuestion}
            className="w-full flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Question
          </Button>
        </aside>

        {/* Main Editor */}
        <main className="flex-1 p-4 md:p-8 mt-16 md:mt-0 overflow-x-hidden">
          {selectedQuestion ? (
            <div className="max-w-4xl mx-auto">
              <h1 className="font-orbitron text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Edit Question {questions.indexOf(selectedQuestion) + 1}
              </h1>
              <p className="text-gray-600 mb-6">Modify the details for this question.</p>
              
              {/* Mobile Question Selector */}
              <div className="mb-6 md:hidden">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Question
                </label>
                <select
                  value={selectedQuestion.id}
                  onChange={(e) => {
                    const question = questions.find(q => q.id === e.target.value);
                    if (question) setSelectedQuestion(question);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {questions.map((q, index) => (
                    <option key={q.id} value={q.id}>
                      Q{index + 1}: {q.type.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <Card>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      QuestionType.MULTIPLE_CHOICE,
                      QuestionType.TRUE_FALSE,
                      QuestionType.MATCHING,
                      QuestionType.DRAG_DROP,
                    ].map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          setSelectedQuestion({ ...selectedQuestion, type } as Question)
                        }
                        className={`px-3 md:px-4 py-2 rounded-lg border-2 transition-colors text-sm ${
                          selectedQuestion.type === type
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {type.replace('_', '/')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Prompt
                  </label>
                  <textarea
                    value={selectedQuestion.prompt}
                    onChange={(e) =>
                      setSelectedQuestion({
                        ...selectedQuestion,
                        prompt: e.target.value,
                      } as Question)
                    }
                    placeholder="Enter your question here..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {selectedQuestion.type === QuestionType.MULTIPLE_CHOICE && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer Options
                    </label>
                    <div className="space-y-2">
                      {Array.isArray(selectedQuestion.options) &&
                        selectedQuestion.options.map((option: string, index: number) => (
                          <div key={index} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="correct"
                              checked={selectedQuestion.correctAnswers?.includes(index)}
                              onChange={() =>
                                setSelectedQuestion({
                                  ...selectedQuestion,
                                  correctAnswers: [index],
                                } as Question)
                              }
                              className="w-4 h-4 text-blue-600"
                            />
                            <input
                              type="text"
                              value={option || ''}
                              onChange={(e) => {
                                const newOptions = [...selectedQuestion.options];
                                newOptions[index] = e.target.value;
                                setSelectedQuestion({
                                  ...selectedQuestion,
                                  options: newOptions,
                                } as Question);
                              }}
                              placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              onClick={() => {
                                const newOptions = selectedQuestion.options.filter(
                                  (_: any, i: number) => i !== index,
                                );
                                setSelectedQuestion({
                                  ...selectedQuestion,
                                  options: newOptions,
                                } as Question);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      <button
                        onClick={() => {
                          setSelectedQuestion({
                            ...selectedQuestion,
                            options: [...selectedQuestion.options, ''],
                          } as Question);
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        + Add Option
                      </button>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Explanation (Optional)
                  </label>
                  <textarea
                    value={selectedQuestion.explanation || ''}
                    onChange={(e) =>
                      setSelectedQuestion({
                        ...selectedQuestion,
                        explanation: e.target.value,
                      } as Question)
                    }
                    placeholder="Provide an explanation for the correct answer (optional)"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button variant="ghost" onClick={() => router.push('/quizzes')}>
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        if (selectedQuestion.id?.startsWith('temp')) {
                          await questionService.create(selectedQuestion);
                        } else {
                          await questionService.update(selectedQuestion.id, selectedQuestion);
                        }
                        loadQuiz();
                      } catch (error) {
                        console.error('Error saving question:', error);
                      }
                    }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Question
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No question selected. Add a question to get started.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

