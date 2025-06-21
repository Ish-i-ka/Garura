// src/components/interview_ui/CodeQuestionViewer.tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Clipboard } from 'lucide-react';

export default function CodeQuestionViewer({ markdown }: { markdown: string }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
  };
  return (
    <div className="relative h-full overflow-hidden bg-slate-800/50 rounded-xl border border-slate-700 shadow-md">
      <div className="absolute top-3 right-3 z-10">
        <button 
          onClick={copyToClipboard}
          className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg backdrop-blur-sm transition-colors"
          title="Copy question to clipboard"
        >
          <Clipboard size={16} />
        </button>
      </div>
      <div className="prose prose-invert p-4 h-full overflow-y-auto max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
