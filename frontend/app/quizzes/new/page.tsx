'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Toggle from '@/components/ui/Toggle';
import { quizService, QuizStatus } from '@/lib/quiz';
import { Settings, Clock, Lock, Upload } from 'lucide-react';
import { authService } from '@/lib/auth';

export default function NewQuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    enableNegativeMarking: false,
    showInstantFeedback: true,
    showInGradebook: true,
    timeLimit: undefined as number | undefined,
    maxAttempts: 1,
    shuffleQuestions: false,
    accessCode: '',
    requireAccessCode: false,
    allowAnonymous: false,
    scheduledStart: '',
    scheduledEnd: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Only instructors can create assessments
    if (!authService.isInstructor()) {
      router.push('/dashboard');
      return;
    }
  }, []);

  const handleSave = async (publish = false) => {
    try {
      setLoading(true);
      const quiz = await quizService.create({
        ...quizData,
        status: publish ? QuizStatus.PUBLISHED : QuizStatus.DRAFT,
      });
      router.push(`/quizzes/${quiz.id}/edit`);
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sidebarSteps = [
    { id: 1, label: 'General', icon: Settings, active: step === 1 },
    { id: 2, label: 'Timing & Attempts', icon: Clock, active: step === 2 },
    { id: 3, label: 'Access Control', icon: Lock, active: step === 3 },
    { id: 4, label: 'Publishing', icon: Upload, active: step === 4 },
  ];

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden md:ml-64">
        {/* Sidebar Steps */}
        <aside className="hidden md:block md:w-64 bg-white border-r border-gray-200 p-6">
          <div className="mb-8">
            {/* <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">e</span>
              </div>
              <span className="font-orbitron font-bold text-xl">educate.io</span>
            </div> */}
            <p className="text-sm text-gray-600 mt-10">Assessment Setup</p>
          </div>
          <nav className="space-y-2">
            {sidebarSteps.map((stepItem) => {
              const Icon = stepItem.icon;
              return (
                <button
                  key={stepItem.id}
                  onClick={() => setStep(stepItem.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    stepItem.active
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{stepItem.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 md:mt-0">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-orbitron text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {step === 1 && 'General Settings'}
              {step === 2 && 'Timing & Attempts'}
              {step === 3 && 'Access Control'}
              {step === 4 && 'Publishing'}
            </h1>
            <p className="text-gray-600 mb-6 md:mb-8">
              {step === 1 && 'Define the basic parameters and rules for your quiz.'}
              {step === 2 && 'Configure time limits and attempt controls for your quiz.'}
              {step === 3 && 'Set up access restrictions and security settings.'}
              {step === 4 && 'Review and publish your assessment to make it available to entrepreneurs.'}
            </p>

            {/* Step 1: General Settings */}
            {step === 1 && (
              <>
                <Card className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Assessment Details</h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Give your assessment a clear title and an optional description to guide
                      entrepreneurs through the learning objectives.
                    </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assessment Title
                      </label>
                      <input
                        type="text"
                        value={quizData.title}
                        onChange={(e) =>
                          setQuizData({ ...quizData, title: e.target.value })
                        }
                        placeholder="Agency Growth Fundamentals"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        value={quizData.description}
                        onChange={(e) =>
                          setQuizData({ ...quizData, description: e.target.value })
                        }
                        placeholder="This quiz covers the major movements and artists from the late 19th to the mid-20th century. Please answer all questions to the best of your ability."
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </Card>

                <Card>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Scoring & Feedback
                  </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Configure how scores are calculated and when entrepreneurs see their results.
                    </p>

                  <div className="space-y-6">
                    <Toggle
                      label="Enable Negative Marking"
                      description="Deduct points for incorrect answers."
                      checked={quizData.enableNegativeMarking}
                      onChange={(checked) =>
                        setQuizData({ ...quizData, enableNegativeMarking: checked })
                      }
                    />

                    <Toggle
                      label="Show Instant Feedback"
                      description="Reveal correct answers immediately after each question to enhance learning."
                      checked={quizData.showInstantFeedback}
                      onChange={(checked) =>
                        setQuizData({ ...quizData, showInstantFeedback: checked })
                      }
                    />

                    <Toggle
                      label="Show in Performance"
                      description="Automatically include assessment scores in the performance dashboard."
                      checked={quizData.showInGradebook}
                      onChange={(checked) =>
                        setQuizData({ ...quizData, showInGradebook: checked })
                      }
                    />
                  </div>
                </Card>
              </>
            )}

            {/* Step 2: Timing & Attempts */}
            {step === 2 && (
              <>
                <Card className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Time Limit</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Set an optional time limit for completing the quiz. Leave empty for no time limit.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Limit (minutes)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={quizData.timeLimit || ''}
                        onChange={(e) =>
                          setQuizData({
                            ...quizData,
                            timeLimit: e.target.value ? parseInt(e.target.value) : undefined,
                          })
                        }
                        placeholder="e.g., 30 (leave empty for no limit)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {quizData.timeLimit && (
                        <p className="text-sm text-gray-500 mt-2">
                          Entrepreneurs will have {quizData.timeLimit} minutes to complete this assessment.
                        </p>
                      )}
                    </div>
                  </div>
                </Card>

                <Card className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Attempt Controls</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Configure how many times students can attempt this quiz.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Attempts
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={quizData.maxAttempts}
                        onChange={(e) =>
                          setQuizData({
                            ...quizData,
                            maxAttempts: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Entrepreneurs can attempt this assessment up to {quizData.maxAttempts} time
                        {quizData.maxAttempts > 1 ? 's' : ''}.
                      </p>
                    </div>

                    <Toggle
                      label="Shuffle Questions"
                      description="Randomize the order of questions for each attempt."
                      checked={quizData.shuffleQuestions}
                      onChange={(checked) =>
                        setQuizData({ ...quizData, shuffleQuestions: checked })
                      }
                    />
                  </div>
                </Card>

                <Card>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Schedule</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Optionally schedule when the quiz becomes available and when it expires.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date & Time (Optional)
                      </label>
                      <input
                        type="datetime-local"
                        value={quizData.scheduledStart}
                        onChange={(e) =>
                          setQuizData({ ...quizData, scheduledStart: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date & Time (Optional)
                      </label>
                      <input
                        type="datetime-local"
                        value={quizData.scheduledEnd}
                        onChange={(e) =>
                          setQuizData({ ...quizData, scheduledEnd: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </Card>
              </>
            )}

            {/* Step 3: Access Control */}
            {step === 3 && (
              <>
                <Card className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Access Code</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Require entrepreneurs to enter an access code before taking the assessment.
                  </p>

                  <div className="space-y-4">
                    <Toggle
                      label="Require Access Code"
                      description="Entrepreneurs must enter a code to access the assessment."
                      checked={quizData.requireAccessCode}
                      onChange={(checked) =>
                        setQuizData({ ...quizData, requireAccessCode: checked })
                      }
                    />

                    {quizData.requireAccessCode && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Access Code
                        </label>
                        <input
                          type="text"
                          value={quizData.accessCode}
                          onChange={(e) =>
                            setQuizData({ ...quizData, accessCode: e.target.value })
                          }
                          placeholder="Enter access code (e.g., QUIZ2024)"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Share this code with entrepreneurs who should have access to the assessment.
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

                <Card>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Privacy Settings</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Control who can access and view the quiz.
                  </p>

                  <div className="space-y-6">
                    <Toggle
                      label="Allow Anonymous Access"
                      description="Allow entrepreneurs to take the assessment without logging in."
                      checked={quizData.allowAnonymous}
                      onChange={(checked) =>
                        setQuizData({ ...quizData, allowAnonymous: checked })
                      }
                    />
                  </div>
                </Card>
              </>
            )}

            {/* Step 4: Publishing */}
            {step === 4 && (
              <>
                <Card className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Review Assessment Details</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Review all your assessment settings before publishing.
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Basic Information</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Title:</span> {quizData.title || 'Not set'}
                        </p>
                        <p>
                          <span className="font-medium">Description:</span>{' '}
                          {quizData.description || 'No description'}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Timing & Attempts</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Time Limit:</span>{' '}
                          {quizData.timeLimit ? `${quizData.timeLimit} minutes` : 'No limit'}
                        </p>
                        <p>
                          <span className="font-medium">Max Attempts:</span> {quizData.maxAttempts}
                        </p>
                        <p>
                          <span className="font-medium">Shuffle Questions:</span>{' '}
                          {quizData.shuffleQuestions ? 'Yes' : 'No'}
                        </p>
                        {quizData.scheduledStart && (
                          <p>
                            <span className="font-medium">Start:</span>{' '}
                            {new Date(quizData.scheduledStart).toLocaleString()}
                          </p>
                        )}
                        {quizData.scheduledEnd && (
                          <p>
                            <span className="font-medium">End:</span>{' '}
                            {new Date(quizData.scheduledEnd).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Access Control</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Access Code Required:</span>{' '}
                          {quizData.requireAccessCode ? 'Yes' : 'No'}
                        </p>
                        {quizData.requireAccessCode && (
                          <p>
                            <span className="font-medium">Access Code:</span>{' '}
                            {quizData.accessCode || 'Not set'}
                          </p>
                        )}
                        <p>
                          <span className="font-medium">Allow Anonymous:</span>{' '}
                          {quizData.allowAnonymous ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Scoring & Feedback</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Negative Marking:</span>{' '}
                          {quizData.enableNegativeMarking ? 'Enabled' : 'Disabled'}
                        </p>
                        <p>
                          <span className="font-medium">Instant Feedback:</span>{' '}
                          {quizData.showInstantFeedback ? 'Enabled' : 'Disabled'}
                        </p>
                        <p>
                          <span className="font-medium">Show in Performance:</span>{' '}
                          {quizData.showInGradebook ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to Publish</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Once published, your assessment will be available to entrepreneurs based on your access
                    settings. You can still edit the assessment after publishing.
                  </p>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> After publishing, you'll be able to add questions to
                      your assessment. Make sure to add all necessary questions in the assessment editor.
                    </p>
                  </div>
                </Card>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between gap-4 mt-8">
              {step > 1 && (
                <Button
                  variant="secondary"
                  onClick={() => setStep(step - 1)}
                  disabled={loading}
                >
                  Previous
                </Button>
              )}
              <div className="flex gap-4 ml-auto">
                {step < 4 ? (
                  <Button onClick={() => setStep(step + 1)} disabled={loading || (step === 1 && !quizData.title)}>
                    Next
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => handleSave(false)}
                      disabled={loading || !quizData.title}
                    >
                      Save as Draft
                    </Button>
                    <Button
                      onClick={() => handleSave(true)}
                      disabled={loading || !quizData.title}
                    >
                      Save & Publish
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

