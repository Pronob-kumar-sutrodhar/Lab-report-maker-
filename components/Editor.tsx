import React from 'react';

interface EditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const Editor: React.FC<EditorProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
      <textarea
        className={`w-full p-4 rounded-lg border border-slate-300 bg-slate-50 font-mono text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-y min-h-[200px] dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:focus:border-blue-400 dark:focus:ring-blue-400 ${className}`}
        spellCheck={false}
        {...props}
      />
    </div>
  );
};