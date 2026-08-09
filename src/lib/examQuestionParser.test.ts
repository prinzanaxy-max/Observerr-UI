import { describe, expect, it } from 'vitest';
import { parseExamQuestions } from './examQuestionParser';

describe('parseExamQuestions', () => {
  it('parses strict A-D questions', () => {
    const result = parseExamQuestions(`1. What is 2 + 2?
A. 1
B. 2
C. 4
D. 5
Answer: C

2. Pick A
A) Alpha
B) Beta
C) Gamma
D) Delta
Answer: A`);

    expect(result.errors).toEqual([]);
    expect(result.questions).toHaveLength(2);
    expect(result.questions[0]).toMatchObject({
      text: 'What is 2 + 2?',
      correctAnswer: 'C',
      options: { C: '4' },
      points: 1,
    });
  });

  it('rejects incomplete and out-of-order input', () => {
    const result = parseExamQuestions(`2. Broken question
A. One
B. Two
Answer: E`);

    expect(result.questions).toEqual([]);
    expect(result.errors.join(' ')).toContain('expected question 1');
    expect(result.errors.join(' ')).toContain('missing options C, D');
    expect(result.errors.join(' ')).toContain('invalid format');
  });

  it('reports duplicate options and answer keys without accepting the import', () => {
    const result = parseExamQuestions(`1. Duplicate fields
A. One
A. Again
B. Two
C. Three
D. Four
Answer: A
Answer: B`);

    expect(result.questions).toHaveLength(1);
    expect(result.errors).toEqual([
      'Line 3: duplicate option A.',
      'Line 8: duplicate answer key.',
    ]);
  });

  it('continues sequence validation after an invalid question', () => {
    const result = parseExamQuestions(`1. Missing options
Answer: A
2. Complete
A. One
B. Two
C. Three
D. Four
Answer: D`);

    expect(result.questions).toHaveLength(1);
    expect(result.errors.join(' ')).not.toContain('expected question 1, found 2');
  });
});
