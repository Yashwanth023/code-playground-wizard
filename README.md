
# Code Playground

A powerful in-browser code editor that lets you write and execute code in multiple programming languages directly in your browser.

![Code Playground Screenshot](https://placeholder.svg/400x250/eee/999?text=Code+Playground)

## Features

- **Multi-language Support**: Write and execute code in JavaScript, Python, HTML, CSS, and C
- **Real-time Code Execution**: See the results of your code immediately
- **Syntax Highlighting**: CodeMirror integration provides proper syntax highlighting for all supported languages
- **Code Examples**: Pre-loaded examples to help you get started
- **Input Support**: Interactive input for JavaScript, Python, and C code
- **Dark/Light Mode**: Choose your preferred theme
- **Responsive Layout**: Works on desktop and mobile devices
- **Local Storage**: Save your code for future sessions

## Supported Languages

### JavaScript
Full JavaScript execution with console output and user input via prompts.

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet("World"));
```

### Python
Python execution powered by Skulpt, with full support for:
- Standard Python syntax
- Print output
- User input via the input() function
- Error handling

```python
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))

# You can also use input
name = input("What's your name? ")
print(f"Nice to meet you, {name}")
```

### C Programming
C language execution powered by JSCPP, with support for:
- Standard C syntax
- Console input/output via printf/scanf
- Basic C library functions
- Error handling

```c
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    
    // Variables and arithmetic
    int a = 5, b = 7;
    printf("%d + %d = %d\n", a, b, a + b);
    
    // User input
    int number;
    printf("Enter a number: ");
    scanf("%d", &number);
    printf("You entered: %d\n", number);
    
    return 0;
}
```

### HTML
Write and preview HTML code with CSS and JavaScript support.

```html
<div>
  <h1>Hello World</h1>
  <p>This HTML code is rendered in the browser.</p>
</div>
```

### CSS
Write CSS and see it applied to a sample HTML structure in real-time.

```css
body {
  font-family: Arial;
  color: navy;
}
```

## Technical Implementation

- **Frontend**: React with TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Code Editor**: CodeMirror 6
- **Python Execution**: Skulpt (browser-based Python interpreter)
- **C Execution**: JSCPP (browser-based C interpreter)
- **State Management**: React hooks and context

## Getting Started

To run the project locally:

```sh
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## How to Use

1. Choose a programming language from the options at the top
2. Write your code in the editor
3. Click "Run" to execute your code
4. See the output in the terminal panel
5. For input-required code, respond to prompts in the terminal
6. Save your code using the "Save" button for future sessions

