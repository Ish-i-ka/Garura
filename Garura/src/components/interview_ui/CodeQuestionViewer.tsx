// src/components/interview_ui/CodeQuestionViewer.tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function CodeQuestionViewer({ markdown }: { markdown: string }) {
  return (
    <div className="prose prose-invert p-4 bg-slate-800/50 rounded-lg border border-slate-700 h-full overflow-y-auto">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}