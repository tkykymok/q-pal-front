import { useState, useEffect, useRef, FC } from 'react';
import {createDateFromString} from '@/domain/utils/utils';

interface TimerProps {
  holdStartDatetime: string;
  onTimesUp?: () => void;
}

const Timer: FC<TimerProps> = ({ holdStartDatetime, onTimesUp }) => {
  const endTime = createDateFromString(holdStartDatetime).getTime() + 30 * 60 * 1000; // 30 minutes in milliseconds
  const currentTime = new Date().getTime();
  const initialTimeLeft = Math.round((endTime - currentTime) / 1000); // Convert milliseconds to seconds

  const [timeLeft, setTimeLeft] = useState(
    initialTimeLeft < 0 || isNaN(initialTimeLeft) ? 0 : initialTimeLeft
  );
  const timerIdRef = useRef<NodeJS.Timeout | undefined>();

  useEffect(() => {
    if (timeLeft > 0) {
      timerIdRef.current = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
    }

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && onTimesUp) {
      onTimesUp();
    }
  }, [timeLeft, onTimesUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex space-x-2 select-none">
      <div>保留時間残り:</div>
      <div className={`${timeLeft === 0 && 'text-red-500'}`}>
        {minutes}:{seconds < 10 ? '0' : ''}
        {seconds}
      </div>
    </div>
  );
};

export default Timer;
