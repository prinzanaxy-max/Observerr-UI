export const STUDENT_SETTINGS_CHANGED = 'observerr:student-settings-changed';

export const notifyStudentSettingsChanged = (institutionalId: string) => {
  window.dispatchEvent(
    new CustomEvent(STUDENT_SETTINGS_CHANGED, { detail: { institutionalId } }),
  );
};
