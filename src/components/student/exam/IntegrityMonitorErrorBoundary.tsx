import { Component, type ErrorInfo, type ReactNode } from 'react';
import Icon from '../Icon';

type Props = {
  children: ReactNode;
  onUnavailable?: () => void;
};

type State = {
  hasError: boolean;
};

class IntegrityMonitorErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[IntegrityMonitor]', error, info.componentStack);
    this.props.onUnavailable?.();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-amber-300/50 bg-amber-50 px-4 py-3 flex items-start gap-3 font-student">
          <Icon name="videocam_off" className="text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-student-body-md font-semibold text-amber-900">Proctoring unavailable</p>
            <p className="text-student-body-md text-amber-800/80">
              Webcam monitoring could not start. You may continue the exam, but integrity events
              will not be recorded for this session.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default IntegrityMonitorErrorBoundary;
