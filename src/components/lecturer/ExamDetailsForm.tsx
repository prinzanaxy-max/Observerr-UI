import { memo } from 'react';
import Icon from '../student/Icon';
import type { CreateExamFormState } from '../../data/createExamData';
import { COURSE_OPTIONS } from '../../data/createExamData';

type ExamDetailsFormProps = {
  form: CreateExamFormState;
  onChange: (updates: Partial<CreateExamFormState>) => void;
};

const ExamDetailsForm = memo(({ form, onChange }: ExamDetailsFormProps) => (
  <section className="bg-student-surface rounded-2xl p-6 lecturer-card-elevation border border-student-surface-container/50">
    <h2 className="text-student-headline-sm font-student font-semibold mb-6 flex items-center gap-2">
      <Icon name="edit_document" className="text-student-primary" />
      Exam Details
    </h2>

    <div className="space-y-6">
      <div>
        <label htmlFor="exam-title" className="block text-student-label-md font-student text-student-on-surface-variant uppercase mb-2">
          Exam Title
        </label>
        <input
          id="exam-title"
          type="text"
          value={form.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Midterm: Introduction to Computer Science"
          className="w-full bg-student-surface-container-lowest border border-student-outline-variant rounded-lg px-4 py-3 font-student text-student-body-lg text-student-on-surface placeholder:text-student-outline focus:border-student-primary focus:ring-1 focus:ring-student-primary transition-colors"
        />
      </div>

      <div>
        <label htmlFor="course" className="block text-student-label-md font-student text-student-on-surface-variant uppercase mb-2">
          Associated Course
        </label>
        <div className="relative">
          <select
            id="course"
            value={form.courseId}
            onChange={(e) => onChange({ courseId: e.target.value })}
            className="w-full bg-student-surface-container-lowest border border-student-outline-variant rounded-lg px-4 py-3 font-student text-student-body-lg text-student-on-surface appearance-none focus:border-student-primary focus:ring-1 focus:ring-student-primary transition-colors cursor-pointer"
          >
            <option value="">Select a course</option>
            {COURSE_OPTIONS.map((course) => (
              <option key={course.value} value={course.value}>{course.label}</option>
            ))}
          </select>
          <Icon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 text-student-outline-variant pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="datetime" className="block text-student-label-md font-student text-student-on-surface-variant uppercase mb-2">
            Start Date &amp; Time
          </label>
          <div className="relative">
            <Icon name="calendar_month" className="absolute left-4 top-1/2 -translate-y-1/2 text-student-outline pointer-events-none" />
            <input
              id="datetime"
              type="datetime-local"
              value={form.startDateTime}
              onChange={(e) => onChange({ startDateTime: e.target.value })}
              className="w-full bg-student-surface-container-lowest border border-student-outline-variant rounded-lg pl-12 pr-4 py-3 font-student text-student-body-lg text-student-on-surface focus:border-student-primary focus:ring-1 focus:ring-student-primary transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="duration" className="block text-student-label-md font-student text-student-on-surface-variant uppercase mb-2">
            Duration (Minutes)
          </label>
          <div className="relative">
            <Icon name="timer" className="absolute left-4 top-1/2 -translate-y-1/2 text-student-outline pointer-events-none" />
            <input
              id="duration"
              type="number"
              min={15}
              step={15}
              value={form.durationMinutes}
              onChange={(e) => onChange({ durationMinutes: e.target.value })}
              placeholder="120"
              className="w-full bg-student-surface-container-lowest border border-student-outline-variant rounded-lg pl-12 pr-4 py-3 font-student text-student-body-lg text-student-on-surface focus:border-student-primary focus:ring-1 focus:ring-student-primary transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
));

ExamDetailsForm.displayName = 'ExamDetailsForm';

export default ExamDetailsForm;
