import { memo, useCallback, useEffect, useState, type ReactNode } from 'react';
import Icon from './student/Icon';
import { subscribeToForegroundMessages } from '../hooks/usePushNotifications';
import type { ForegroundPushPayload } from '../types/pushNotifications';

type ToastItem = ForegroundPushPayload & { id: number };

type PushNotificationToastProps = {
  toast: ToastItem | null;
  onDismiss: () => void;
};

const PushNotificationToast = memo(({ toast, onDismiss }: PushNotificationToastProps) => {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(onDismiss, 6000);
    return () => window.clearTimeout(timer);
  }, [onDismiss, toast]);

  if (!toast) return null;

  return (
    <div
      role="status"
      className="fixed bottom-6 right-6 z-[100] max-w-sm w-[calc(100%-3rem)] student-exam-glass-card rounded-2xl p-4 shadow-lg border border-student-primary-container/40"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-student-primary-container/30 flex items-center justify-center text-student-primary shrink-0">
          <Icon name="notifications" filled />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-student-body-lg font-student font-semibold text-student-on-surface">{toast.title}</p>
          <p className="text-student-body-md font-student text-student-on-surface-variant mt-1">{toast.body}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-student-on-surface-variant hover:text-student-on-surface transition-colors"
          aria-label="Dismiss notification"
        >
          <Icon name="close" className="text-[18px]" />
        </button>
      </div>
    </div>
  );
});

PushNotificationToast.displayName = 'PushNotificationToast';

let toastId = 0;

const PushNotificationProvider = memo(({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastItem | null>(null);

  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let cancelled = false;

    void subscribeToForegroundMessages((payload) => {
      toastId += 1;
      setToast({ ...payload, id: toastId });
    }).then((unsub) => {
      if (!cancelled) {
        unsubscribe = unsub;
      }
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  return (
    <>
      {children}
      <PushNotificationToast toast={toast} onDismiss={dismissToast} />
    </>
  );
});

PushNotificationProvider.displayName = 'PushNotificationProvider';

export default PushNotificationProvider;
