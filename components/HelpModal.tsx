import React from 'react';
import { X, BookOpen, PenTool, Code2, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Welcome to Report Generator</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Generate academic lab reports in seconds.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">1. Enter Lab Details</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Fill in the Lab Number, Title, and optional Codeforces link in the sidebar.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <PenTool size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">2. Describe Problems</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Add titles and descriptions for each problem you solved.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Code2 size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">3. Paste Your Code</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Paste the C++ source code for each problem.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">4. Generate Report</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Click "Generate Report" to let AI format your submission with discussions and outputs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <Button onClick={onClose} className="w-full">
            Get Started
          </Button>
        </div>

      </div>
    </div>
  );
};