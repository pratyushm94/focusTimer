import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api"

const DURATION = 1 * 60; // 10 minnutes

export function useTimer({onSessionSaved = {}}) {
    const [secondsLeft, setSecondsLeft] = useState(DURATION);// to display time left for a complete session
    const [running, setRunning] = useState(false); // is a session ongoing
    const [phase, setPhase] = useState("idle") // idle/running or done
    const startTimeRef = useRef(null); // to store start time without rendering
    const intervalRef = useRef(null); // for ticking timer to store countdown without rerendering

    useEffect(() => {
        if(!running) return // no need to run effect when timer stoped
        intervalRef.current = setInterval(() => { // store the timerId, to clear it later when session is done/stopped etc
            setSecondsLeft((prev) => {
                if (prev <= 1) { //countdown reached end
                    clearInterval(intervalRef.current); //
                    setRunning(false);
                    setPhase('done');
                    saveSession(true);
                    return 0;
                }
                return prev - 1; // tick down the timer count 
            });
        },1000)
        return () => clearInterval(intervalRef.current); //cleanup fn that runs before next effect run
    }, [running])

    const saveSession = useCallback(async (completed = false) => {
    if (!startTimeRef.current) return;
    const endTime = new Date();
    const durationSeconds = Math.round((endTime - startTimeRef.current) / 1000);
    const savedStart = startTimeRef.current; // capture before clearing
    startTimeRef.current = null; // clear immediately to prevent double saves
    try {
      await api.post('/sessions', {
        startTime: savedStart.toISOString(),
        endTime: endTime.toISOString(),
        durationSeconds,
        completed,
      });
      onSessionSaved?.(); // optional chaining, safely call in case it might not exist
    } catch (err) {
      console.error('Failed to save session:', err);
      startTimeRef.current = savedStart; // restore on error
    }
    }, [onSessionSaved]);
    const start = useCallback(() => {
    startTimeRef.current = new Date();
    setSecondsLeft(DURATION);
    setPhase('running');
    setRunning(true);
  }, []);

  const stop = useCallback(async () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setPhase('idle');
    await saveSession(false);
    setSecondsLeft(DURATION);
    startTimeRef.current = null;
  }, [saveSession]);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setPhase('idle');
    setSecondsLeft(DURATION);
    startTimeRef.current = null;
  }, []);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  const progress = ((DURATION - secondsLeft) / DURATION) * 100;

  return { minutes, seconds, secondsLeft, progress, phase, running, start, stop, reset };
}

