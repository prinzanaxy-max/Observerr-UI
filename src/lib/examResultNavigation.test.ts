import { describe, expect, it } from 'vitest';
import { lecturerExamPath, studentExamActionPath } from './examResultNavigation';

describe('exam result navigation', () => {
  it('opens a completed student exam result when available', () => {
    expect(studentExamActionPath(9, 'view-results', 44)).toBe('/student/results/44');
    expect(studentExamActionPath(9, 'view-results')).toBe('/student/results');
  });

  it('routes completed lecturer exams to grading', () => {
    expect(lecturerExamPath(9, 'completed')).toBe('/lecturer/exams/9/results');
    expect(lecturerExamPath(9, 'upcoming')).toBeNull();
  });
});
