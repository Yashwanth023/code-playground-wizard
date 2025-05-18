
type OutputCallback = (type: 'output' | 'error' | 'info', content: string) => void;
type SupportedLanguage = 'javascript' | 'python' | 'html' | 'css' | 'c';

declare global {
  interface Window {
    Sk?: any; // Skulpt global object
    skulptReady?: boolean;
    loadSkulpt?: () => Promise<void>;
    pythonInput?: (prompt: string) => Promise<string>;
    Module?: any; // For JSCPP (C language support)
    JSCPP?: any; // Adding JSCPP to the window type
    jscppReady?: boolean; // Flag to track if JSCPP is loaded
  }
}

class CodeExecutor {
  private waitForInput: ((input: string) => void) | null = null;
  private skulptLoadAttempted = false;
  private jscppLoadAttempted = false;

  constructor() {
    this.loadSkulptIfNeeded = this.loadSkulptIfNeeded.bind(this);
    this.loadJSCPP = this.loadJSCPP.bind(this);
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
      case 'c':
        this.executeC(code, outputCallback);
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

    if (this.skulptLoadAttempted) {
      return Promise.reject(new Error("Failed to load Skulpt after previous attempt"));
    }

    this.skulptLoadAttempted = true;

    return new Promise<void>((resolve, reject) => {
      try {
        // Load Skulpt main script
        const skulptScript = document.createElement('script');
        skulptScript.src = 'https://skulpt.org/js/skulpt.min.js';
        skulptScript.async = true;
        
        skulptScript.onerror = () => {
          console.error('Failed to load Skulpt');
          reject(new Error('Failed to load Skulpt'));
        };
        
        // Load Skulpt standard library after main script
        skulptScript.onload = () => {
          const skulptStdlibScript = document.createElement('script');
          skulptStdlibScript.src = 'https://skulpt.org/js/skulpt-stdlib.js';
          skulptStdlibScript.async = true;
          
          skulptStdlibScript.onload = () => {
            console.log('Skulpt successfully loaded');
            window.skulptReady = true;
            resolve();
          };
          
          skulptStdlibScript.onerror = () => {
            console.error('Failed to load Skulpt standard library');
            reject(new Error('Failed to load Skulpt standard library'));
          };
          
          document.head.appendChild(skulptStdlibScript);
        };
        
        document.head.appendChild(skulptScript);
      } catch (error) {
        console.error('Error during Skulpt loading:', error);
        reject(error);
      }
    });
  }

  /**
   * Load JSCPP (C in browser) from CDN
   */
  private loadJSCPP(): Promise<void> {
    // Check if JSCPP is already loaded and ready
    if (window.jscppReady && window.JSCPP) {
      console.log('JSCPP is already loaded and ready');
      return Promise.resolve();
    }

    // If we've already tried to load JSCPP and failed, don't try again
    if (this.jscppLoadAttempted && !window.jscppReady) {
      console.error('JSCPP loading previously failed, not trying again');
      return Promise.reject(new Error("Failed to load JSCPP after previous attempt"));
    }

    this.jscppLoadAttempted = true;
    console.log('Starting to load JSCPP...');

    return new Promise<void>((resolve, reject) => {
      try {
        // Remove any previous JSCPP script to avoid conflicts
        const existingScript = document.getElementById('jscpp-script');
        if (existingScript) {
          document.head.removeChild(existingScript);
        }

        // Create a new script element with an alternative CDN
        const jscppScript = document.createElement('script');
        jscppScript.id = 'jscpp-script';
        jscppScript.src = 'https://unpkg.com/jscpp@2.0.2/dist/JSCPP.es5.min.js';
        jscppScript.async = true;
        jscppScript.crossOrigin = 'anonymous';

        // Handle successful loading
        jscppScript.onload = () => {
          // Check if JSCPP is actually available in the window object
          if (window.JSCPP) {
            console.log('JSCPP loaded successfully and is available in window');
            window.jscppReady = true;
            resolve();
          } else {
            console.error('JSCPP script loaded but JSCPP is not available in window');
            reject(new Error('JSCPP script loaded but JSCPP is not available'));
          }
        };

        // Handle loading errors
        jscppScript.onerror = () => {
          console.error('Failed to load JSCPP from unpkg, trying fallback source');
          
          // Try a fallback source if the first one fails
          const fallbackScript = document.createElement('script');
          fallbackScript.id = 'jscpp-script-fallback';
          fallbackScript.src = 'https://cdn.jsdelivr.net/npm/jscpp@2.0.2/dist/JSCPP.min.js';
          fallbackScript.async = true;
          
          fallbackScript.onload = () => {
            if (window.JSCPP) {
              console.log('JSCPP loaded successfully from fallback source');
              window.jscppReady = true;
              resolve();
            } else {
              console.error('JSCPP fallback script loaded but JSCPP is not available in window');
              reject(new Error('JSCPP fallback loading failed'));
            }
          };
          
          fallbackScript.onerror = (error) => {
            console.error('Both JSCPP loading attempts failed');
            reject(new Error('Failed to load JSCPP from all sources. Please try again later.'));
          };
          
          document.head.appendChild(fallbackScript);
        };

        // Add the script to the document
        document.head.appendChild(jscppScript);
        console.log('JSCPP script added to document head');
      } catch (error) {
        console.error('Error during JSCPP loading:', error);
        reject(error);
      }
    });
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
      outputCallback('info', 'Loading Python interpreter...');
      
      // Load Skulpt if not already loaded
      await this.loadSkulptIfNeeded();
      
      if (!window.Sk) {
        outputCallback('error', 'Failed to load Python interpreter. Please try again or refresh the page.');
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

  /**
   * Execute C code using JSCPP
   */
  private async executeC(code: string, outputCallback: OutputCallback): Promise<void> {
    try {
      outputCallback('info', 'Loading C interpreter...');
      
      try {
        await this.loadJSCPP();
        console.log('JSCPP load completed successfully');
        outputCallback('info', 'C interpreter loaded successfully.');
      } catch (loadError) {
        console.error('JSCPP loading failed:', loadError);
        outputCallback('error', `Failed to load C interpreter: ${loadError instanceof Error ? loadError.message : 'Unknown error'}`);
        return;
      }
      
      if (!window.JSCPP) {
        console.error('JSCPP is not available after successful loading');
        outputCallback('error', 'Failed to initialize C interpreter. Please try refreshing the page.');
        return;
      }
      
      outputCallback('info', 'Running C code...');
      console.log('Preparing to run C code with JSCPP');
      
      // Setup C input handler
      let inputBuffer: string[] = [];
      let inputIndex = 0;
      
      // Create custom input function
      const getInput = async (): Promise<string> => {
        return new Promise<string>((resolve) => {
          if (inputIndex < inputBuffer.length) {
            // Use existing input if available
            resolve(inputBuffer[inputIndex++]);
          } else {
            // Otherwise, request new input
            outputCallback('info', 'Enter input:');
            this.waitForInput = (input: string) => {
              this.waitForInput = null;
              inputBuffer.push(input);
              resolve(input);
            };
          }
        });
      };
      
      // Configure C execution
      const config = {
        stdio: {
          write: (text: string) => {
            outputCallback('output', text);
          },
          read: async () => {
            const input = await getInput();
            return input;
          }
        },
        // Add verbose option to get more detailed error messages
        verbose: true
      };
      
      // Execute the C code
      try {
        console.log('Executing C code with JSCPP...', code.slice(0, 50) + '...');
        const result = window.JSCPP.run(code, '', config);
        console.log('C code execution completed, result:', result);
        if (result !== undefined && result !== null && result !== '') {
          outputCallback('output', `Result: ${result}`);
        }
      } catch (error) {
        console.error('Error during C code execution:', error);
        if (error instanceof Error) {
          outputCallback('error', `C Error: ${error.message}`);
        } else {
          outputCallback('error', `C Error: ${String(error)}`);
        }
      }
      
    } catch (error) {
      console.error('Error in executeC:', error);
      if (error instanceof Error) {
        outputCallback('error', `Error: ${error.message}`);
      } else {
        outputCallback('error', 'An unknown error occurred while executing C code.');
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
