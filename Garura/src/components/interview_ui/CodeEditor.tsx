// src/components/interview_ui/CodeEditor.tsx
'use client';

import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { LanguageSupport } from '@codemirror/language';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { Play, Loader2, ChevronDown } from 'lucide-react';

type Language = 'javascript' | 'python' | 'java' | 'cpp';

const languageMap: Record<Language, { label: string, extension: LanguageSupport, defaultCode: string }> = {
  javascript: { label: 'JavaScript', extension: javascript({ jsx: true, typescript: true }), defaultCode: `console.log("Hello, JavaScript!");` },
  python: { label: 'Python', extension: python(), defaultCode: `print("Hello, Python!")` },
  java: { label: 'Java', extension: java(), defaultCode: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}` },
  cpp: { label: 'C++', extension: cpp(), defaultCode: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, C++!";\n    return 0;\n}` },
};

interface ExecutionResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: { description: string };
  time: string;
  memory: number;
}

export default function CodeEditor({ onChange }: { onChange: (value: string) => void }) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState(languageMap.javascript.defaultCode);
  const [output, setOutput] = useState<ExecutionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = (lang: Language) => {
    const newCode = languageMap[lang].defaultCode;
    setSelectedLanguage(lang);
    setCode(newCode);
    onChange(newCode);
    setOutput(null); // Clear output on language change
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    onChange(value);
  };

  const handleRunCode = async () => {
    setIsLoading(true);
    setOutput(null);
    try {
      const result: ExecutionResult = await window.electronAPI.runCode({
        code: code,
        language: selectedLanguage,
      });
      setOutput(result);
    } catch (error) {
      console.error("Code execution failed", error);
      setOutput({
        status: { description: 'Error' },
        stderr: 'Failed to communicate with the execution service.',
        stdout: null, compile_output: null, message: null, time: '0', memory: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col gap-3">
      {/* Editor Panel */}
      <div className="flex-grow h-[60%] flex flex-col rounded-xl border border-slate-700 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 shadow-lg">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-slate-700 backdrop-blur-sm">
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value as Language)}
              className="appearance-none bg-slate-700/60 text-white text-sm rounded-lg px-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600 hover:bg-slate-700 transition-colors"
            >
              {Object.entries(languageMap).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
          </div>
          <button
            onClick={handleRunCode}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-lg font-medium text-sm disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            Run Code
          </button>
        </div>
        <div className="flex-grow h-full w-full overflow-auto">
          <CodeMirror 
            value={code} 
            onChange={handleCodeChange} 
            height="100%" 
            extensions={[languageMap[selectedLanguage].extension]} 
            theme={vscodeDark} 
            style={{ height: '100%' }} 
          />
        </div>
      </div>

      {/* Output Panel */}
      <div className="h-[40%] flex flex-col rounded-xl border border-slate-700 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 shadow-lg">
        <div className="px-4 py-2 bg-slate-800/80 border-b border-slate-700 text-sm font-semibold backdrop-blur-sm">
          Output
        </div>
        <div className="p-4 font-mono text-sm overflow-y-auto whitespace-pre-wrap bg-slate-900/50 flex-grow">
          {isLoading && <p className="text-yellow-400">Executing...</p>}
          {output && (
            <div>
              <p className={`font-bold ${output.status.description === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                Status: {output.status.description}
              </p>
              <p className="text-slate-400">Time: {output.time}s | Memory: {output.memory} KB</p>
              <hr className="my-2 border-slate-700" />
              {output.stdout && <div><p className="font-semibold text-slate-300">Output:</p>{output.stdout}</div>}
              {output.stderr && <div><p className="font-semibold text-red-400">Error:</p>{output.stderr}</div>}
              {output.compile_output && <div><p className="font-semibold text-yellow-400">Compiler Output:</p>{output.compile_output}</div>}
            </div>
          )}
          {!output && !isLoading && <p className="text-slate-500">Click "Run Code" to see the output here.</p>}
        </div>
      </div>
    </div>
  );
}