
export interface CodeExample {
  id: string;
  title: string;
  description: string;
  code: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export const codeExamples: CodeExample[] = [
  {
    id: 'hello-world',
    title: 'Hello World',
    description: 'A simple program to output a greeting message.',
    code: '// This is a comment. Comments help explain code but don\'t run.\n\n// This line prints "Hello World!" to the console\nconsole.log("Hello World!");\n\n// Try changing the message above to your name!',
    level: 'beginner'
  },
  {
    id: 'variables',
    title: 'Variables',
    description: 'Learn how to use variables to store data.',
    code: '// Variables store data that can be used throughout your program\n\n// Create a variable using \'let\' (you can change its value later)\nlet name = "Coder";\n\n// Create a variable with \'const\' (its value cannot be changed)\nconst age = 12;\n\n// Use the variables in your program\nconsole.log("Hello, " + name + "!");\nconsole.log(`You are ${age} years old.`);\n\n// Try changing the name and age values!',
    level: 'beginner'
  },
  {
    id: 'user-input',
    title: 'User Input',
    description: 'Get input from the user and respond to it.',
    code: '// This program asks for your name and responds\n\n// The prompt function asks a question and waits for an answer\nconst name = await prompt("What is your name?");\n\n// Let\'s greet the user with their name\nconsole.log(`Hello, ${name}! Welcome to coding!`);\n\n// Ask another question\nconst favColor = await prompt("What is your favorite color?");\nconsole.log(`${favColor} is a great color!`);',
    level: 'beginner'
  },
  {
    id: 'conditionals',
    title: 'Conditionals',
    description: 'Make decisions in your code with if statements.',
    code: '// Conditionals let your program make decisions\n\n// Get user input for their age\nconst ageInput = await prompt("How old are you?");\nconst age = Number(ageInput); // Convert string to number\n\n// Use if/else to make a decision\nif (age < 13) {\n  console.log("You\'re still a kid!");\n} else if (age < 20) {\n  console.log("You\'re a teenager!");\n} else {\n  console.log("You\'re an adult!");\n}\n\n// Another example with logical operators\nconst likesCoding = await prompt("Do you like coding? (yes/no)");\n\nif (likesCoding.toLowerCase() === "yes" || likesCoding.toLowerCase() === "y") {\n  console.log("That\'s awesome! Keep learning!");\n} else {\n  console.log("Give it time, you might grow to love it!");\n}',
    level: 'beginner'
  },
  {
    id: 'loops',
    title: 'Loops',
    description: 'Repeat code multiple times with loops.',
    code: '// Loops allow you to run code multiple times\n\n// A for loop counts from 1 to 5\nconsole.log("Counting with a for loop:");\nfor (let i = 1; i <= 5; i++) {\n  console.log(`Count: ${i}`);\n}\n\n// A while loop that counts down\nconsole.log("\\nCounting down with a while loop:");\nlet countdown = 3;\nwhile (countdown > 0) {\n  console.log(`${countdown}...`);\n  countdown--;\n}\nconsole.log("Blast off! 🚀");',
    level: 'beginner'
  }
];
