import { describe, expect, it } from 'vitest';
import { DEFAULT_FORM_STATE } from '../data/createExamData';
import {
  clearExamDraft,
  examDraftStorageKey,
  readExamDraft,
  writeExamDraft,
} from './examDraft';

const memoryStorage = () => {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
};

describe('exam draft persistence', () => {
  it('round trips a valid per-user draft and timestamp', () => {
    const storage = memoryStorage();
    const savedAt = new Date('2026-08-02T12:00:00.000Z');
    const form = { ...DEFAULT_FORM_STATE, title: 'Recovery exam' };

    writeExamDraft(storage, 'LEC-1', form, savedAt);

    expect(readExamDraft(storage, 'LEC-1')).toEqual({ form, savedAt });
    expect(readExamDraft(storage, 'LEC-2')).toBeNull();
  });

  it('ignores corrupt and structurally invalid drafts', () => {
    const storage = memoryStorage();
    storage.setItem(examDraftStorageKey('LEC-1'), '{broken');
    expect(readExamDraft(storage, 'LEC-1')).toBeNull();

    storage.setItem(examDraftStorageKey('LEC-1'), JSON.stringify({
      version: 1,
      savedAt: 'not-a-date',
      form: { title: 'partial' },
    }));
    expect(readExamDraft(storage, 'LEC-1')).toBeNull();
  });

  it('clears a published or discarded draft', () => {
    const storage = memoryStorage();
    writeExamDraft(storage, 'LEC-1', DEFAULT_FORM_STATE);
    clearExamDraft(storage, 'LEC-1');
    expect(readExamDraft(storage, 'LEC-1')).toBeNull();
  });
});
