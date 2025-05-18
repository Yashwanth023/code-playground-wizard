
type OutputCallback = (type: 'output' | 'error' | 'info', content: string) => void;
type SupportedLanguage = 'javascript' | 'python' | 'html' | 'css';

declare global {
  interface Window {
    Sk?: any; // Skulpt global object
    skulptReady?: boolean;
    loadSkulpt?: () => Promise<void>;
    pythonInput?: (prompt: string) => Promise<string>;
  }
}

class CodeExecutor {
  private waitForInput: ((input: string) => void) | null = null;

  constructor() {
    this.loadSkulptIfNeeded = this.loadSkulptIfNeeded.bind(this);
  }

  /**
   * Execute code based on the selected language
   */
  executeCode(
    code: string,
    language: SupportedLanguage = 'javascript',
    outputCallback: OutputCallback
  ): void {
    switch (language) {
      case 'javascript':
        this.executeJavaScript(code, outputCallback);
        break;
      case 'python':
        this.executePython(code, outputCallback);
        break;
      case 'html':
        this.executeHTML(code, outputCallback);
        break;
      case 'css':
        this.executeCSS(code, outputCallback);
        break;
      default:
        outputCallback('error', `Unsupported language: ${language}`);
    }
  }

  /**
   * Load Skulpt (Python in browser) from CDN
   */
  private async loadSkulptIfNeeded(): Promise<void> {
    if (window.skulptReady) {
      return Promise.resolve();
    }

    if (!window.loadSkulpt) {
      window.loadSkulpt = () => {
        return new Promise<void>((resolve, reject) => {
          // Load Skulpt and Skulpt standard library
          const skulptScript = document.createElement('script');
          skulptScript.src = 'https://skulpt.org/js/skulpt.min.js';
          skulptScript.async = true;
          
          const skulptStdlibScript = document.createElement('script');
          skulptStdlibScript.src = 'https://skulpt.org/js/skulpt-stdlib.js';
          skulptStdlibScript.async = true;
          
          skulptStdlibScript.onload = () => {
            window.skulptReady = true;
            resolve();
          };
          
          skulptStdlibScript.onerror = () => {
            reject(new Error('Failed to load Skulpt standard library'));
          };
          
          skulptScript.onerror = () => {
            reject(new Error('Failed to load Skulpt'));
          };
          
          document.head.appendChild(skulptScript);
          document.head.appendChild(skulptStdlibScript);
        });
      };
    }
    
    return window.loadSkulpt!();
  }

  /**
   * Execute JavaScript code with console output captured
   */
  private executeJavaScript(
    code: string, 
    outputCallback: OutputCallback
  ): void {
    // Create a new function to execute the code
    try {
      // Create custom console methods
      const customConsole = {
        log: (...args: any[]) => {
          const output = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          outputCallback('output', output);
        },
        error: (...args: any[]) => {
          const output = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          outputCallback('error', output);
        },
        warn: (...args: any[]) => {
          const output = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          outputCallback('output', `⚠️ ${output}`);
        },
        info: (...args: any[]) => {
          const output = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          outputCallback('info', output);
        },
      };

      // Create a prompt function to handle user input
      const prompt = (message: string): Promise<string> => {
        return new Promise((resolve) => {
          outputCallback('info', message || 'Enter input:');
          this.waitForInput = (input: string) => {
            this.waitForInput = null;
            resolve(input);
          };
        });
      };

      // Create the function context
      const contextObj = {
        console: customConsole,
        prompt,
      };
      
      // Create the function parameters and body
      const paramNames = Object.keys(contextObj);
      const paramValues = Object.values(contextObj);

      // Create and execute the function
      const executeCode = new Function(...paramNames, code);
      
      // Run the code with the custom context
      Promise.resolve(executeCode(...paramValues))
        .catch(error => {
          outputCallback('error', `${error.name}: ${error.message}`);
        });
    } catch (error) {
      if (error instanceof Error) {
        outputCallback('error', `${error.name}: ${error.message}`);
      } else {
        outputCallback('error', 'An unknown error occurred.');
      }
    }
  }

  /**
   * Execute Python code using Skulpt
   */
  private async executePython(code: string, outputCallback: OutputCallback): Promise<void> {
    try {
      // Load Skulpt if not already loaded
      await this.loadSkulptIfNeeded();
      
      if (!window.Sk) {
        outputCallback('error', 'Failed to load Python interpreter. Please try again.');
        return;
      }

      outputCallback('info', 'Running Python code...');
      
      // Create function for handling Python input (user interaction)
      window.pythonInput = (prompt) => {
        return new Promise((resolve) => {
          outputCallback('info', prompt || 'Enter input:');
          this.waitForInput = (input: string) => {
            this.waitForInput = null;
            resolve(input);
          };
        });
      };

      // Setup Skulpt configuration
      window.Sk.configure({
        output: (text: string) => {
          outputCallback('output', text);
        },
        read: (filename: string) => {
          if (window.Sk.builtinFiles === undefined || 
              window.Sk.builtinFiles.files[filename] === undefined) {
            throw new Error(`File not found: ${filename}`);
          }
          return window.Sk.builtinFiles.files[filename];
        },
        inputfun: window.pythonInput,
        inputfunTakesPrompt: true
      });
      
      // Run the Python code
      const pythonPromise = new Promise<void>((resolve, reject) => {
        try {
          window.Sk.misceval.asyncToPromise(() => {
            return window.Sk.importMainWithBody('<stdin>', false, code, true);
          }).then(() => {
            resolve();
          }).catch((err: any) => {
            outputCallback('error', `${err.toString()}`);
            resolve(); // Resolve anyway to continue execution
          });
        } catch (e) {
          outputCallback('error', e instanceof Error ? e.message : 'Unknown error');
          resolve(); // Resolve anyway to continue execution
        }
      });
      
      await pythonPromise;
      
    } catch (error) {
      if (error instanceof Error) {
        outputCallback('error', `Error: ${error.message}`);
      } else {
        outputCallback('error', 'An unknown error occurred while executing Python code.');
      }
    }
  }

  /**
   * Execute HTML code by rendering it in an iframe
   */
  private executeHTML(code: string, outputCallback: OutputCallback): void {
    try {
      // Create iframe HTML
      const iframeHTML = `
        <iframe 
          id="html-preview" 
          srcdoc="${encodeURIComponent(code)}" 
          style="width: 100%; height: 200px; border: none;"
        ></iframe>
      `;
      
      outputCallback('info', 'HTML preview:');
      outputCallback('output', iframeHTML);
    } catch (error) {
      if (error instanceof Error) {
        outputCallback('error', `Error rendering HTML: ${error.message}`);
      } else {
        outputCallback('error', 'An unknown error occurred while rendering HTML.');
      }
    }
  }

  /**
   * Execute CSS code with a preview
   */
  private executeCSS(code: string, outputCallback: OutputCallback): void {
    try {
      // Create a simple HTML with the CSS applied
      const htmlWithCSS = `
        <div id="css-preview">
          <style>${code}</style>
          <div class="preview-container">
            <h1>Heading 1</h1>
            <p>This is a paragraph with <a href="#">a link</a> inside it.</p>
            <button>Button</button>
            <div class="box">A div with class "box"</div>
          </div>
        </div>
      `;
      
      outputCallback('info', 'CSS preview:');
      outputCallback('output', htmlWithCSS);
    } catch (error) {
      if (error instanceof Error) {
        outputCallback('error', `Error applying CSS: ${error.message}`);
      } else {
        outputCallback('error', 'An unknown error occurred while applying CSS.');
      }
    }
  }

  handleInput(input: string): void {
    if (this.waitForInput) {
      const callback = this.waitForInput;
      this.waitForInput = null;
      callback(input);
    }
  }

  isWaitingForInput(): boolean {
    return this.waitForInput !== null;
  }
}

export default new CodeExecutor();
