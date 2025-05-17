
type OutputCallback = (type: 'output' | 'error' | 'info', content: string) => void;

class CodeExecutor {
  private waitForInput: ((input: string) => void) | null = null;

  /**
   * Execute JavaScript code with console output captured
   */
  executeJavaScript(
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
