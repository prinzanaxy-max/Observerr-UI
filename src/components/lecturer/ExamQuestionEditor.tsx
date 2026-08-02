import { useRef, useState, type ChangeEvent } from 'react';
import type { AnswerChoice, AuthoringQuestion } from '../../data/createExamData';
import { createEmptyQuestion } from '../../data/createExamData';
import { parseExamQuestions } from '../../lib/examQuestionParser';
import Icon from '../student/Icon';

const LETTERS: AnswerChoice[] = ['A', 'B', 'C', 'D'];

type Props = {
  questions: AuthoringQuestion[];
  onChange: (questions: AuthoringQuestion[]) => void;
};

export default function ExamQuestionEditor({ questions, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [preview, setPreview] = useState<AuthoringQuestion[] | null>(null);

  const update = (index: number, patch: Partial<AuthoringQuestion>) =>
    onChange(questions.map((question, i) => (i === index ? { ...question, ...patch } : question)));

  const move = (index: number, offset: number) => {
    const target = index + offset;
    if (target < 0 || target >= questions.length) return;
    const next = [...questions];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const importFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      let text: string;
      if (file.name.toLowerCase().endsWith('.txt')) {
        text = await file.text();
      } else if (file.name.toLowerCase().endsWith('.docx')) {
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
        text = result.value;
      } else {
        setImportErrors(['Only .txt and .docx files are supported.']);
        return;
      }
      const result = parseExamQuestions(text);
      setImportErrors(result.errors);
      setPreview(result.errors.length === 0 && result.questions.length ? result.questions : null);
    } catch {
      setImportErrors(['The file could not be read. Check that it is a valid TXT or DOCX document.']);
      setPreview(null);
    }
  };

  return (
    <section className="bg-student-surface rounded-[24px] p-5 md:p-6 lecturer-card-elevation">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-student-title-lg font-student font-semibold text-student-on-surface">Questions</h2>
          <p className="text-student-body-sm text-student-on-surface-variant mt-1">
            {questions.length} question{questions.length === 1 ? '' : 's'} · {questions.reduce((sum, q) => sum + (q.points || 0), 0)} points
          </p>
        </div>
        <div className="flex gap-2">
          <label className="flex items-center gap-2 text-sm">
            Count
            <input
              aria-label="Question count"
              type="number"
              min={1}
              value={questions.length}
              onChange={(event) => {
                const count = Math.max(1, Number(event.target.value) || 1);
                onChange(count < questions.length
                  ? questions.slice(0, count)
                  : [...questions, ...Array.from({ length: count - questions.length }, (_, i) => createEmptyQuestion(questions.length + i))]);
              }}
              className="w-16 rounded-full border border-student-outline-variant bg-transparent px-3 py-2"
            />
          </label>
          <input ref={fileRef} className="hidden" type="file" accept=".txt,.docx" onChange={importFile} />
          <button type="button" onClick={() => fileRef.current?.click()} className="px-4 py-2 rounded-full border border-student-outline-variant text-sm font-medium">
            Import TXT/DOCX
          </button>
          <button type="button" onClick={() => onChange([...questions, createEmptyQuestion(questions.length)])} className="px-4 py-2 rounded-full bg-student-primary text-student-on-primary text-sm font-semibold">
            Add question
          </button>
        </div>
      </div>

      {(importErrors.length > 0 || preview) && (
        <div className="mb-5 rounded-xl border border-student-outline-variant p-4">
          {importErrors.map((error) => <p key={error} className="text-sm text-student-error">{error}</p>)}
          {preview && (
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-sm">{preview.length} valid question{preview.length === 1 ? '' : 's'} ready to import.</span>
              <button type="button" onClick={() => { onChange(preview); setPreview(null); setImportErrors([]); }} className="text-sm font-semibold text-student-primary">
                Replace with preview
              </button>
            </div>
          )}
        </div>
      )}

      <div className="space-y-5">
        {questions.map((question, index) => (
          <article key={question.id} className="rounded-2xl border border-student-outline-variant p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <strong className="text-sm">Question {index + 1}</strong>
              <div className="flex gap-1">
                <button type="button" aria-label="Move question up" disabled={index === 0} onClick={() => move(index, -1)} className="p-2 disabled:opacity-30"><Icon name="arrow_upward" /></button>
                <button type="button" aria-label="Move question down" disabled={index === questions.length - 1} onClick={() => move(index, 1)} className="p-2 disabled:opacity-30"><Icon name="arrow_downward" /></button>
                <button type="button" aria-label="Remove question" disabled={questions.length === 1} onClick={() => onChange(questions.filter((_, i) => i !== index))} className="p-2 text-student-error disabled:opacity-30"><Icon name="delete" /></button>
              </div>
            </div>
            <textarea value={question.text} onChange={(e) => update(index, { text: e.target.value })} rows={2} placeholder="Question text" className="w-full rounded-xl border border-student-outline-variant bg-transparent px-3 py-2 mb-3" />
            <div className="grid sm:grid-cols-2 gap-3">
              {LETTERS.map((letter) => (
                <label key={letter} className="flex items-center gap-2">
                  <input type="radio" name={`correct-${question.id}`} checked={question.correctAnswer === letter} onChange={() => update(index, { correctAnswer: letter })} aria-label={`${letter} is correct`} />
                  <span className="font-semibold">{letter}</span>
                  <input value={question.options[letter]} onChange={(e) => update(index, { options: { ...question.options, [letter]: e.target.value } })} placeholder={`Option ${letter}`} className="min-w-0 flex-1 rounded-xl border border-student-outline-variant bg-transparent px-3 py-2" />
                </label>
              ))}
            </div>
            <label className="flex items-center gap-2 mt-3 text-sm">
              Points
              <input type="number" min={1} step={1} value={question.points} onChange={(e) => update(index, { points: Number(e.target.value) })} className="w-20 rounded-xl border border-student-outline-variant bg-transparent px-3 py-2" />
            </label>
          </article>
        ))}
      </div>
      <p className="mt-4 text-xs text-student-on-surface-variant">
        Import format: “1. Question”, then A-D options, then “Answer: C”. Each question defaults to 1 point.
      </p>
    </section>
  );
}
