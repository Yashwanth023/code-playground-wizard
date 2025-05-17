
import React, { useState, useEffect, useCallback } from 'react';
import CodeEditor from './CodeEditor';
import Terminal from './Terminal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { codeExamples } from '@/data/codeExamples';
import codeExecutor from '@/services/codeExecutor';
import { Save, Trash, Columns } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TerminalMessage {
  type: 'output' | 'error' | 'info' | 'input';
  content: string;
}

const CodePlayground: React.FC = () => {
  const [code, setCode] = useState(codeExamples[0].code);
  const [terminalOutput, setTerminalOutput] = useState<TerminalMessage[]>([
    { type: 'info', content: 'Welcome to Code Playground! Click "Run" to execute your code.' }
  ]);
  const [selectedExample, setSelectedExample] = useState<string>(codeExamples[0].id);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [layout, setLayout] = useState<'split' | 'tabs'>('split');
  
  const { toast } = useToast();

  // Save code to localStorage
  useEffect(() => {
    const savedCode = localStorage.getItem('savedCode');
    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  const saveCode = () => {
    localStorage.setItem('savedCode', code);
    toast({
      title: "Code saved",
      description: "Your code has been saved to local storage.",
      duration: 3000,
    });
  };

  const clearSavedCode = () => {
    localStorage.removeItem('savedCode');
    toast({
      title: "Saved code cleared",
      description: "Your saved code has been removed from local storage.",
      variant: "destructive",
      duration: 3000,
    });
  };

  const handleExampleChange = (exampleId: string) => {
    const example = codeExamples.find(ex => ex.id === exampleId);
    if (example) {
      setCode(example.code);
      setSelectedExample(exampleId);
    }
  };

  const handleRun = useCallback((codeToRun: string) => {
    if (codeToRun === 'clear') {
      setTerminalOutput([{ type: 'info', content: 'Terminal cleared.' }]);
      return;
    }
    
    // Clear previous output
    setTerminalOutput([{ type: 'info', content: 'Running code...' }]);

    // Execute the code
    codeExecutor.executeJavaScript(
      code,
      (type, content) => {
        setTerminalOutput(prev => [...prev, { type, content }]);
      }
    );

    // Check if the code is waiting for input
    const checkInputStatus = setInterval(() => {
      const isWaiting = codeExecutor.isWaitingForInput();
      setIsWaitingForInput(isWaiting);
      if (!isWaiting) {
        clearInterval(checkInputStatus);
      }
    }, 100);

    return () => clearInterval(checkInputStatus);
  }, [code]);

  const handleInput = (input: string) => {
    codeExecutor.handleInput(input);
    setIsWaitingForInput(false);
  };

  const toggleLayout = () => {
    setLayout(prev => prev === 'split' ? 'tabs' : 'split');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4 animate-slide-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-primary">Code Playground</h2>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleLayout}
            className="flex items-center gap-1"
          >
            <Columns className="h-4 w-4" />
            {layout === 'split' ? 'Tab View' : 'Split View'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={saveCode}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearSavedCode}
            className="flex items-center gap-1"
          >
            <Trash className="h-4 w-4" />
            Clear Saved
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <h3 className="text-sm font-medium mb-2">Examples</h3>
          <div className="flex flex-wrap gap-2">
            {codeExamples.map((example) => (
              <Button 
                key={example.id}
                variant={selectedExample === example.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleExampleChange(example.id)}
                className="text-xs"
              >
                {example.title}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {layout === 'split' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="min-h-[400px] flex flex-col">
            <CardContent className="p-3 flex-1">
              <h3 className="text-sm font-medium mb-2">Editor</h3>
              <CodeEditor 
                initialValue={code} 
                onChange={setCode}
                className="h-full min-h-[350px]"
              />
            </CardContent>
          </Card>
          
          <Card className="min-h-[400px] flex flex-col">
            <CardContent className="p-3 flex-1">
              <Terminal 
                onRun={handleRun}
                code={code}
                waitingForInput={isWaitingForInput}
                onInputSubmit={handleInput}
                terminalOutput={terminalOutput}
                className="h-full"
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="min-h-[500px]">
          <CardContent className="p-0 pt-3">
            <Tabs defaultValue="editor" className="w-full h-full">
              <div className="px-4">
                <TabsList className="mb-2">
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="terminal">Terminal</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="editor" className="h-[450px] px-4 pb-4">
                <CodeEditor 
                  initialValue={code} 
                  onChange={setCode}
                  className="h-full" 
                />
              </TabsContent>
              
              <TabsContent value="terminal" className="h-[450px] px-4 pb-4">
                <Terminal 
                  onRun={handleRun} 
                  code={code}
                  waitingForInput={isWaitingForInput}
                  onInputSubmit={handleInput}
                  terminalOutput={terminalOutput}
                  className="h-full" 
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">
          {codeExamples.find(ex => ex.id === selectedExample)?.title || 'Custom Code'} 
        </h3>
        <p className="text-muted-foreground">
          {codeExamples.find(ex => ex.id === selectedExample)?.description || 'Write and run your own JavaScript code.'}
        </p>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => handleRun(code)} className="bg-primary hover:bg-primary/90">
            Run Code
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;
