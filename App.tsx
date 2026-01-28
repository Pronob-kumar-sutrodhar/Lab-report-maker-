import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Sparkles, AlertCircle, Plus, Link as LinkIcon, Sun, Moon, CircleHelp, User, RotateCcw, UserPlus } from 'lucide-react';
import { Button } from './components/Button';
import { ResultViewer } from './components/ResultViewer';
import { ProblemForm } from './components/ProblemForm';
import { HelpModal } from './components/HelpModal';
import { SignupModal } from './components/SignupModal';
import { EmailVerificationModal } from './components/EmailVerificationModal';
import { processLabReport } from './services/geminiService';
import { LabData, GenerationState, Problem } from './types';

const INITIAL_LAB_INFO = {
  studentId: '',
  labNumber: '',
  labTitle: '',
  codeforcesLink: ''
};

const App: React.FC = () => {
  const [labInfo, setLabInfo] = useState(INITIAL_LAB_INFO);

  const [problems, setProblems] = useState<Problem[]>([
    { id: 'init-1', title: '', description: '', code: '' }
  ]);

  const [expandedProblemId, setExpandedProblemId] = useState<string | null>('init-1');

  const [generation, setGeneration] = useState<GenerationState>({
    status: 'idle',
    result: null,
    error: null
  });

  const [resetKey, setResetKey] = useState(0);

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  const [showHelp, setShowHelp] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  
  // Verification State
  const [verificationToken, setVerificationToken] = useState<string | null>(null);

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowHelp(true);
      localStorage.setItem('hasVisited', 'true');
    }

    // Theme initialization
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // Check URL for verification token
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    if (token) {
      setVerificationToken(token);
      // Clean up URL without reloading
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLabInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleProblemChange = (id: string, field: keyof Problem, value: string) => {
    setProblems(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const addProblem = () => {
    const newId = `prob-${Date.now()}`;
    setProblems(prev => [...prev, { id: newId, title: '', description: '', code: '' }]);
    setExpandedProblemId(newId);
  };

  const removeProblem = (id: string) => {
    setProblems(prev => prev.filter(p => p.id !== id));
    if (expandedProblemId === id) {
      setExpandedProblemId(null);
    }
  };

  const toggleProblem = (id: string) => {
    setExpandedProblemId(prev => prev === id ? null : id);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all details? This will clear all your inputs and the generated report.")) {
      setLabInfo(INITIAL_LAB_INFO);
      
      const newProblemId = `reset-${Date.now()}`;
      setProblems([{ id: newProblemId, title: '', description: '', code: '' }]);
      setExpandedProblemId(newProblemId);
      
      setGeneration({
        status: 'idle',
        result: null,
        error: null
      });

      setResetKey(prev => prev + 1);

      if (sidebarRef.current) {
        sidebarRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleGenerate = async () => {
    if (!labInfo.labNumber.trim() || !labInfo.labTitle.trim()) {
       setGeneration({ status: 'error', result: null, error: 'Please enter Lab Number and Title.' });
       return;
    }
    if (problems.length === 0 || !problems[0].code.trim()) {
      setGeneration({ status: 'error', result: null, error: 'Please provide at least one problem with code.' });
      return;
    }

    setGeneration({ status: 'generating', result: null, error: null });

    const labData: LabData = {
      ...labInfo,
      problems
    };

    try {
      const result = await processLabReport(labData);
      setGeneration({ status: 'success', result, error: null });
    } catch (err) {
      setGeneration({
        status: 'error',
        result: null,
        error: err instanceof Error ? err.message : 'An unknown error occurred'
      });
    }
  };

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col overflow-hidden transition-colors duration-200">
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <SignupModal isOpen={showSignup} onClose={() => setShowSignup(false)} />
      {verificationToken && (
        <EmailVerificationModal 
          token={verificationToken} 
          onClose={() => setVerificationToken(null)} 
        />
      )}

      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 z-20 transition-colors">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <BookOpen size={20} />
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Report Generator</h1>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={handleReset}
               className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors hidden sm:block"
               title="Reset Details"
             >
               <RotateCcw size={20} />
             </button>
             <button 
               onClick={() => setShowHelp(true)}
               className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors hidden sm:block"
               title="Show Instructions"
             >
               <CircleHelp size={20} />
             </button>
             <button 
               onClick={toggleTheme}
               className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
               title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
             >
               {isDark ? <Sun size={20} /> : <Moon size={20} />}
             </button>

             <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

             <Button 
                onClick={() => setShowSignup(true)}
                variant="secondary"
                className="!py-1.5 !px-3 text-sm"
              >
                <UserPlus size={16} />
                <span className="hidden sm:inline">Sign Up</span>
              </Button>

             <Button 
                onClick={handleGenerate} 
                isLoading={generation.status === 'generating'}
                className="!py-1.5 !px-4 text-sm"
              >
                <Sparkles size={16} />
                <span className="hidden sm:inline">Generate</span>
              </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden max-w-[1600px] mx-auto w-full">
        
        {/* Left Sidebar: Inputs */}
        <div className="w-full md:w-[450px] lg:w-[500px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full z-10 shadow-lg md:shadow-none transition-colors">
          
          <div 
            ref={sidebarRef}
            className="flex-1 overflow-y-auto custom-scrollbar p-6"
          >
            {/* The resetKey prop ensures that this entire tree is re-created on reset */}
            <div key={resetKey} className="space-y-6">
              {/* Lab Info Section */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">Lab Details</h2>
                
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      Student ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={14} className="text-slate-400" />
                      </div>
                      <input
                        name="studentId"
                        value={labInfo.studentId}
                        onChange={handleInfoChange}
                        placeholder="e.g. 21301548"
                        autoComplete="off"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Lab Number</label>
                    <input
                      name="labNumber"
                      value={labInfo.labNumber}
                      onChange={handleInfoChange}
                      placeholder="e.g. 4"
                      autoComplete="off"
                      className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Lab Title</label>
                    <input
                      name="labTitle"
                      value={labInfo.labTitle}
                      onChange={handleInfoChange}
                      placeholder="e.g. Arrays"
                      autoComplete="off"
                      className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      Codeforces Submission Link <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon size={14} className="text-slate-400" />
                      </div>
                      <input
                        name="codeforcesLink"
                        value={labInfo.codeforcesLink}
                        onChange={handleInfoChange}
                        placeholder="https://codeforces.com/..."
                        autoComplete="off"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 my-4"></div>

              {/* Problems Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Problems</h2>
                   <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{problems.length} total</span>
                </div>

                <div className="flex flex-col gap-3">
                  {problems.map((problem, idx) => (
                    <ProblemForm
                      key={problem.id}
                      index={idx}
                      problem={problem}
                      expanded={expandedProblemId === problem.id}
                      onToggle={() => toggleProblem(problem.id)}
                      onChange={handleProblemChange}
                      onRemove={removeProblem}
                      canRemove={problems.length > 1}
                    />
                  ))}
                </div>

                <Button 
                  onClick={addProblem} 
                  variant="outline" 
                  className="w-full border-dashed border-2 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:border-slate-700 dark:hover:border-blue-500 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                >
                  <Plus size={18} />
                  Add Another Problem
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center">
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
              Made with love by PRONOB
            </p>
          </div>

          {/* Footer Error Display */}
          {generation.error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-t border-red-100 dark:border-red-900/50 text-red-700 dark:text-red-300 text-sm flex items-start gap-2 shrink-0">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>{generation.error}</p>
            </div>
          )}
        </div>

        {/* Right Content: Output */}
        <div className="flex-1 h-full bg-slate-100 dark:bg-slate-950 overflow-hidden flex flex-col p-4 md:p-8 transition-colors">
            {generation.status === 'idle' ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
                <BookOpen size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-medium text-slate-600 dark:text-slate-300">No report generated yet</p>
                <p className="text-sm">Fill in the lab details on the left and click Generate.</p>
              </div>
            ) : generation.result ? (
              <ResultViewer content={generation.result} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                 <div className="relative w-16 h-16 mb-4">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                 </div>
                 <p className="text-slate-600 dark:text-slate-300 font-medium">Analyzing C++ code...</p>
                 <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Structuring report & generating discussions...</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default App;