
interface CodeExample {
  id: string;
  title: string;
  description: string;
  code: string;
}

export const codeExamples: CodeExample[] = [
  {
    id: 'hello-world',
    title: 'Hello World',
    description: 'A simple hello world example to get you started.',
    code: '// Write your first program\nconsole.log("Hello, World!");\n'
  },
  {
    id: 'variables',
    title: 'Variables',
    description: 'Learn how to declare and use variables in JavaScript.',
    code: '// Variables in JavaScript\nlet name = "Coder";\nconst age = 14;\nlet lovesToCode = true;\n\nconsole.log(`My name is ${name}`);\nconsole.log(`I am ${age} years old`);\nconsole.log(`I ${lovesToCode ? "love" : "don\'t love"} to code!`);\n'
  },
  {
    id: 'user-input',
    title: 'User Input',
    description: 'Get input from the user via the prompt function.',
    code: '// Getting user input\nconst name = await prompt("What is your name?");\nconsole.log(`Hello, ${name}! Welcome to coding!`);\n\nconst age = await prompt("How old are you?");\nconsole.log(`${age} is a great age to learn coding!`);\n'
  },
  {
    id: 'loops',
    title: 'Loops',
    description: 'Learn how to create loops in JavaScript.',
    code: '// For loop example\nconsole.log("Counting from 1 to 5:");\nfor (let i = 1; i <= 5; i++) {\n  console.log(i);\n}\n\n// While loop example\nconsole.log("\\nCounting down from 5 to 1:");\nlet count = 5;\nwhile (count > 0) {\n  console.log(count);\n  count--;\n}\n'
  },
  {
    id: 'conditions',
    title: 'Conditions',
    description: 'Learn how to use conditional statements.',
    code: '// If-else statements\nconst age = await prompt("Enter your age:");\nconst numAge = Number(age);\n\nif (isNaN(numAge)) {\n  console.error("That\'s not a valid age!");\n} else if (numAge < 13) {\n  console.log("You\'re still a kid, but coding is cool at any age!");\n} else if (numAge < 20) {\n  console.log("You\'re a teenager! Perfect time to master coding!");\n} else {\n  console.log("You\'re an adult! It\'s never too late to code!");\n}\n'
  }
];
