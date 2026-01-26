import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, FileText, Code } from 'lucide-react';
import { Button } from './Button';

interface ResultViewerProps {
  content: string;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({ content }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'raw'>('preview');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full transition-colors">
      <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-200/50 dark:bg-slate-700/50 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'preview' 
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2"><FileText size={14} /> Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'raw' 
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2"><Code size={14} /> Markdown</span>
          </button>
        </div>
        <Button variant="outline" onClick={handleCopy} className="!py-1.5 !px-3 text-sm">
          {copied ? <Check size={16} className="text-green-600 dark:text-green-400" /> : <Copy size={16} />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-800">
        {activeTab === 'preview' ? (
          <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-pre:bg-slate-900 prose-pre:text-slate-50">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <pre className="font-mono text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
            {content}
          </pre>
        )}
      </div>
    </div>
  );
};