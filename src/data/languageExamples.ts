
export interface LanguageExample {
  language: 'javascript' | 'python' | 'html' | 'css' | 'c';
  initialCode: string;
}

export const languageExamples: Record<string, LanguageExample> = {
  javascript: {
    language: 'javascript',
    initialCode: `// Write your JavaScript code here

function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
`,
  },
  python: {
    language: 'python',
    initialCode: `# Write your Python code here

def greet(name):
    return f"Hello, {name}!"

print(greet("World"))

# You can also use input
# name = input("What's your name? ")
# print(f"Nice to meet you, {name}")
`,
  },
  html: {
    language: 'html',
    initialCode: `<!-- Write your HTML code here -->
<!DOCTYPE html>
<html>
<head>
  <title>My HTML Page</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: navy; }
    .container { border: 1px solid #ccc; padding: 20px; }
  </style>
</head>
<body>
  <h1>Hello, World!</h1>
  <div class="container">
    <p>This is a simple HTML page.</p>
    <button onclick="alert('Button clicked!')">Click Me</button>
  </div>
</body>
</html>
`,
  },
  css: {
    language: 'css',
    initialCode: `/* Write your CSS code here */
.preview-container {
  font-family: Arial, sans-serif;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

p {
  line-height: 1.6;
  color: #34495e;
}

a {
  color: #3498db;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}

.box {
  margin-top: 20px;
  padding: 15px;
  background-color: #f1f1f1;
  border-left: 5px solid #3498db;
}
`,
  },
  c: {
    language: 'c',
    initialCode: `// Write your C code here
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    
    // Variables and arithmetic
    int a = 5, b = 7;
    printf("%d + %d = %d\\n", a, b, a + b);
    
    // Input example (uncomment to use)
    /*
    int number;
    printf("Enter a number: ");
    scanf("%d", &number);
    printf("You entered: %d\\n", number);
    */
    
    return 0;
}`,
  }
};
