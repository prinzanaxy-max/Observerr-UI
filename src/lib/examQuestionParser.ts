import type { AnswerChoice, AuthoringQuestion } from '../data/createExamData';

const LETTERS: AnswerChoice[] = ['A', 'B', 'C', 'D'];
const QUESTION_RE = /^(\d+)\.\s+(.+)$/;
const OPTION_RE = /^([A-D])(?:[.)])\s+(.+)$/i;
const ANSWER_RE = /^Answer:\s*([A-D])\s*$/i;

export type QuestionImportResult = {
  questions: AuthoringQuestion[];
  errors: string[];
};

export function parseExamQuestions(text: string): QuestionImportResult {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const questions: AuthoringQuestion[] = [];
  const errors: string[] = [];
  let current: Partial<AuthoringQuestion> & { sourceNumber?: number; sourceLine?: number } | null = null;
  let expectedNumber = 1;

  const finish = () => {
    if (!current) return;
    const label = `Question ${current.sourceNumber ?? questions.length + 1}`;
    const missing = LETTERS.filter((letter) => !current?.options?.[letter]?.trim());
    if (!current.text?.trim()) errors.push(`${label}: question text is required.`);
    if (missing.length) errors.push(`${label}: missing option${missing.length > 1 ? 's' : ''} ${missing.join(', ')}.`);
    if (!current.correctAnswer) errors.push(`${label}: add "Answer: A", B, C, or D.`);
    if (current.text?.trim() && !missing.length && current.correctAnswer) {
      questions.push({
        id: globalThis.crypto?.randomUUID?.() ?? `imported-${current.sourceNumber}-${questions.length}`,
        text: current.text.trim(),
        options: current.options as Record<AnswerChoice, string>,
        correctAnswer: current.correctAnswer,
        points: 1,
      });
    }
    current = null;
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) return;
    const question = line.match(QUESTION_RE);
    if (question) {
      finish();
      const sourceNumber = Number(question[1]);
      if (sourceNumber !== expectedNumber) {
        errors.push(`Line ${index + 1}: expected question ${expectedNumber}, found ${sourceNumber}.`);
      }
      expectedNumber += 1;
      current = {
        sourceNumber,
        sourceLine: index + 1,
        text: question[2],
        options: { A: '', B: '', C: '', D: '' },
      };
      return;
    }
    if (!current) {
      errors.push(`Line ${index + 1}: expected "1. Question text".`);
      return;
    }
    const option = line.match(OPTION_RE);
    if (option) {
      const letter = option[1].toUpperCase() as AnswerChoice;
      if (current.options?.[letter]) errors.push(`Line ${index + 1}: duplicate option ${letter}.`);
      if (current.options) current.options[letter] = option[2].trim();
      return;
    }
    const answer = line.match(ANSWER_RE);
    if (answer) {
      if (current.correctAnswer) errors.push(`Line ${index + 1}: duplicate answer key.`);
      current.correctAnswer = answer[1].toUpperCase() as AnswerChoice;
      return;
    }
    errors.push(`Line ${index + 1}: invalid format "${line}".`);
  });
  finish();

  if (!questions.length && !errors.length) errors.push('The file does not contain any questions.');
  return { questions, errors };
}
