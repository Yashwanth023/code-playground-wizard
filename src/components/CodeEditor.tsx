
import React, { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { indentWithTab } from '@codemirror/commands';
import { oneDark } from '@codemirror/theme-one-dark';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  initialValue?: string;
  onChange?: (code: string) => void;
  className?: string;
  theme?: 'light' | 'dark';
  language?: 'javascript' | 'python' | 'html' | 'css' | 'c';
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialValue = '// Write your JavaScript code here\n\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
  onChange,
  className,
  theme = 'dark',
  language = 'javascript'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorView, setEditorView] = useState<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;
    
    // If we already have an editor view, destroy it
    if (editorView) {
      editorView.destroy();
    }

    // Set up language extension based on selected language
    let languageExtension;
    switch (language) {
      case 'python':
        languageExtension = python();
        break;
      case 'html':
        languageExtension = html();
        break;
      case 'css':
        languageExtension = css();
        break;
      case 'c':
        // For C language, we use JavaScript syntax highlighting as CodeMirror doesn't have a dedicated C language mode
        languageExtension = javascript();
        break;
      case 'javascript':
      default:
        languageExtension = javascript();
    }

    // Set up extensions
    const extensions = [
      languageExtension,
      keymap.of([indentWithTab]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged && onChange) {
          onChange(update.state.doc.toString());
        }
      }),
      EditorView.theme({
        "&": {
          height: "100%",
          minHeight: "300px",
          fontSize: "14px",
        },
        ".cm-scroller": {
          overflow: "auto",
          fontFamily: "'Fira Code', monospace"
        },
      })
    ];

    // Add the theme extension based on the theme prop
    if (theme === 'dark') {
      extensions.push(oneDark);
    }

    // Create a new editor view
    const startState = EditorState.create({
      doc: initialValue,
      extensions
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current
    });

    setEditorView(view);

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, [editorRef, initialValue, onChange, theme, language]);

  return (
    <div 
      ref={editorRef} 
      className={cn(
        "rounded-md border overflow-hidden",
        theme === 'dark' ? 'bg-editor border-gray-700' : 'bg-white border-gray-300',
        className
      )} 
    />
  );
};

export default CodeEditor;
