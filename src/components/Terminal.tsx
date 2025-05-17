
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';

interface TerminalProps {
  onRun: (code: string, language: string) => void;
  code?: string;
  className?: string;
  theme?: 'light' | 'dark';
  waitingForInput?: boolean;
  onInputSubmit?: (input: string) => void;
  terminalOutput: { type: 'output' | 'error' | 'info' | 'input'; content: string }[];
  language?: string;
}

const Terminal: React.FC<TerminalProps> = ({
  onRun,
  code = '',
  className,
  theme = 'dark',
  waitingForInput = false,
  onInputSubmit,
  terminalOutput,
  language = 'javascript'
}) => {
  const [inputValue, setInputValue] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const clearOutput = () => {
    onRun('clear', language);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Call the onInputSubmit callback with the input value
    if (onInputSubmit) {
      onInputSubmit(inputValue);
    }
    
    // Clear the input field
    setInputValue('');
  };

  // Auto-scroll to the bottom when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  // Focus the input field when waiting for input
  useEffect(() => {
    if (waitingForInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [waitingForInput]);

  return (
    <div className={cn(
      "flex flex-col rounded-md border h-full",
      theme === 'dark' ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-gray-100 border-gray-300 text-gray-800',
      className
    )}>
      <div className="flex items-center justify-between p-2 bg-opacity-30 border-b border-gray-700">
        <h3 className="text-sm font-medium">Terminal</h3>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearOutput}
            className="text-xs"
          >
            Clear
          </Button>
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className="flex-1 p-3 overflow-y-auto font-mono text-sm"
        style={{ maxHeight: '300px' }}
      >
        {terminalOutput.map((line, i) => (
          <div 
            key={i} 
            className={cn(
              "mb-1",
              line.type === 'error' ? 'text-red-400' : 
              line.type === 'info' ? 'text-blue-400' : 
              line.type === 'input' ? 'text-yellow-400 terminal-input-line' : 'text-gray-300'
            )}
            dangerouslySetInnerHTML={{ __html: line.content }}
          >
          </div>
        ))}
        
        {waitingForInput && (
          <form onSubmit={handleInputSubmit} className="flex items-center mt-1">
            <span className="mr-2 text-green-400">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-gray-200"
              autoFocus
            />
          </form>
        )}
      </div>

      <Separator className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} />
      
      <div className="p-2 flex justify-end">
        <Button 
          onClick={() => onRun(code, language)}
          className="bg-green-600 hover:bg-green-700 text-white"
          size="sm"
        >
          <Play className="mr-1 h-4 w-4" />
          Run
        </Button>
      </div>
    </div>
  );
};

export default Terminal;
