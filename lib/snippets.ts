export interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const codeSnippets: CodeSnippet[] = [
  {
    id: 'practice',
    title: 'Practice',
    language: 'typescript',
    difficulty: 'easy',
    code: `type User = {
  id: string;
  name: string;
};

export function formatUser(user: User): string {
  return \`\${user.name} (#\${user.id})\`;
}`
  }
];
