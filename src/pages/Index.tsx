
import React from 'react';
import { Card } from '@/components/ui/card';
import CodePlayground from '@/components/CodePlayground';
import ThemeToggle from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b py-4">
        <div className="container max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary h-8 w-8 rounded-md flex items-center justify-center text-white font-bold">
              CP
            </div>
            <h1 className="text-xl font-bold">Code Playground</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-grow container py-6">
        <CodePlayground />
      </main>

      <footer className="border-t py-4">
        <div className="container max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Code Playground Wizard - A simple in-browser JavaScript editor for learning to code</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
