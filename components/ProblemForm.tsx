import React from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Editor } from './Editor';
import { Problem } from '../types';

interface ProblemFormProps {
  index: number;
  problem: Problem;
  expanded: boolean;
  onToggle: () => void;
  onChange: (id: string, field: keyof Problem, value: string) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export const ProblemForm: React.FC<ProblemFormProps> = ({
  index,
  problem,
  expanded,
  onToggle,
  onChange,
  onRemove,
  canRemove
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-200 overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-sm border border-blue-200 dark:border-blue-800">
            {index + 1}
          </div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-200">
            {problem.title || `Problem ${index + 1}`}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {canRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(problem.id);
              }}
              className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Remove Problem"
            >
              <Trash2 size={18} />
            </button>
          )}
          {expanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="p-4 flex flex-col gap-4 border-t border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Problem Heading (Optional)</label>
            <input
              type="text"
              value={problem.title}
              onChange={(e) => onChange(problem.id, 'title', e.target.value)}
              placeholder={`e.g., Problem ${index + 1}`}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Problem Description</label>
            <textarea
              value={problem.description}
              onChange={(e) => onChange(problem.id, 'description', e.target.value)}
              placeholder="Paste the problem description here..."
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all h-24 resize-none text-sm"
            />
          </div>

          <Editor
            label="C++ Source Code"
            value={problem.code}
            onChange={(e) => onChange(problem.id, 'code', e.target.value)}
            placeholder="// Paste your C++ code here..."
            className="font-mono text-sm min-h-[300px]"
          />
        </div>
      )}
    </div>
  );
};