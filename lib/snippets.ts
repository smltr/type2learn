export interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const codeSnippets: CodeSnippet[] = [
  {
    id: '1',
    title: 'Simple Function',
    language: 'javascript',
    difficulty: 'easy',
    code: `function greet(name) {
  return "Hello, " + name + "!";
}`
  },
  {
    id: '2',
    title: 'Array Map',
    language: 'javascript',
    difficulty: 'easy',
    code: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log(doubled);`
  },
  {
    id: '3',
    title: 'React Component',
    language: 'typescript',
    difficulty: 'medium',
    code: `interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  );
}`
  },
  {
    id: '4',
    title: 'Async Fetch',
    language: 'typescript',
    difficulty: 'medium',
    code: `async function fetchUser(id: number) {
  const response = await fetch(\`/api/users/\${id}\`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}`
  },
  {
    id: '5',
    title: 'Class with Constructor',
    language: 'typescript',
    difficulty: 'hard',
    code: `class Rectangle {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }
}`
  }
];
