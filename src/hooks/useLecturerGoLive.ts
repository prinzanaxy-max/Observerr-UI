import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resolveAndGoLive } from '../lib/lecturerGoLive';

export function useLecturerGoLive() {
  const navigate = useNavigate();
  const [goingLive, setGoingLive] = useState(false);
  const [goLiveError, setGoLiveError] = useState('');

  const goLive = useCallback(async () => {
    if (goingLive) return;
    setGoingLive(true);
    setGoLiveError('');
    try {
      const result = await resolveAndGoLive();
      if (!result.ok) {
        setGoLiveError(result.message);
        return;
      }
      navigate(`/lecturer/exams/${result.examId}/live`);
    } catch {
      setGoLiveError('Could not start or open a live exam. Please try again.');
    } finally {
      setGoingLive(false);
    }
  }, [goingLive, navigate]);

  return { goLive, goingLive, goLiveError, clearGoLiveError: () => setGoLiveError('') };
}
