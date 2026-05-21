import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type Phase = 'work' | 'short-break' | 'long-break';

export type WorkSessionsByDate = Record<string, number>;

type PersistedSettings = {
  workMinutes: number;
  shortMinutes: number;
  longMinutes: number;
  workSessions: number;
  longBreakEnabled: boolean;
  phase: Phase;
  remainingSeconds: number;
  workSessionsByDate: WorkSessionsByDate;
};

export type Tone = {
  background: string;
  surface: string;
  accent: string;
  accentSoft: string;
  text: string;
  muted: string;
};

export const phaseLabels: Record<Phase, string> = {
  work: 'Trabajo',
  'short-break': 'Recreo corto',
  'long-break': 'Recreo largo',
};

export const MINUTES_MIN = 5;
export const MINUTES_MAX = 60;
export const MINUTES_STEP = 5;

const AUTO_ALARM_STOP_MS = 10 * 60 * 1000;
const STORAGE_KEY = 'pomodorus.settings.v1';

const defaultSettings: PersistedSettings = {
  workMinutes: 25,
  shortMinutes: 5,
  longMinutes: 15,
  workSessions: 0,
  longBreakEnabled: true,
  phase: 'work',
  remainingSeconds: 25 * 60,
  workSessionsByDate: {},
};

const tonePalette: Record<Phase, { active: Tone; paused: Tone }> = {
  work: {
    active: {
      background: '#2B1416',
      surface: '#3E1A1D',
      accent: '#D06A70',
      accentSoft: '#F3C7CA',
      text: '#F9F3F3',
      muted: '#D4B1B3',
    },
    paused: {
      background: '#1F1113',
      surface: '#2D1517',
      accent: '#9B5A5F',
      accentSoft: '#CFA9AC',
      text: '#E7DADA',
      muted: '#B79DA0',
    },
  },
  'short-break': {
    active: {
      background: '#10211A',
      surface: '#173126',
      accent: '#5BAF77',
      accentSoft: '#D6F0DE',
      text: '#F1FAF5',
      muted: '#B6D3C0',
    },
    paused: {
      background: '#0D1A15',
      surface: '#14271F',
      accent: '#3E8C5B',
      accentSoft: '#B9DCC5',
      text: '#DCEFE5',
      muted: '#A6C7B5',
    },
  },
  'long-break': {
    active: {
      background: '#0E1C2A',
      surface: '#15273A',
      accent: '#5E8BB6',
      accentSoft: '#D1E2F2',
      text: '#EEF4FA',
      muted: '#B8CCDE',
    },
    paused: {
      background: '#0B151F',
      surface: '#12202E',
      accent: '#476B8A',
      accentSoft: '#B7CCDD',
      text: '#DCE7F0',
      muted: '#A7BCCD',
    },
  },
};

const clampNumber = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const clampMinutes = (value: number) =>
  clampNumber(
    Math.round(value / MINUTES_STEP) * MINUTES_STEP,
    MINUTES_MIN,
    MINUTES_MAX,
  );

export const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const resolveDurationSeconds = (
  phase: Phase,
  settings: Pick<PersistedSettings, 'workMinutes' | 'shortMinutes' | 'longMinutes'>,
) => {
  if (phase === 'work') {
    return settings.workMinutes * 60;
  }
  if (phase === 'short-break') {
    return settings.shortMinutes * 60;
  }
  return settings.longMinutes * 60;
};

const normalizePhase = (value: unknown, fallback: Phase) => {
  if (value === 'work' || value === 'short-break' || value === 'long-break') {
    return value;
  }
  return fallback;
};

const normalizeBoolean = (value: unknown, fallback: boolean) => {
  if (typeof value === 'boolean') {
    return value;
  }
  return fallback;
};

const normalizeMinutes = (value: unknown, fallback: number) => {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return clampMinutes(parsed);
};

const normalizeSessions = (value: unknown, fallback: number) => {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.max(0, Math.floor(parsed));
};

const normalizeSeconds = (value: unknown, fallback: number, max: number) => {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return clampNumber(Math.round(parsed), 0, max);
};

const normalizeWorkSessionsByDate = (value: unknown) => {
  if (!value || typeof value !== 'object') {
    return {};
  }

  const entries = Object.entries(value as Record<string, unknown>);
  return entries.reduce<WorkSessionsByDate>((accumulator, [key, count]) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) {
      return accumulator;
    }

    const normalized = normalizeSessions(count, 0);
    if (normalized > 0) {
      accumulator[key] = normalized;
    }

    return accumulator;
  }, {});
};

const readCachedSettings = (): PersistedSettings => {
  if (typeof window === 'undefined') {
    return defaultSettings;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultSettings;
    }

    const data = JSON.parse(raw) as Partial<PersistedSettings>;
    const workMinutes = normalizeMinutes(
      data.workMinutes,
      defaultSettings.workMinutes,
    );
    const shortMinutes = normalizeMinutes(
      data.shortMinutes,
      defaultSettings.shortMinutes,
    );
    const longMinutes = normalizeMinutes(
      data.longMinutes,
      defaultSettings.longMinutes,
    );
    const phase = normalizePhase(data.phase, defaultSettings.phase);
    const durationSeconds = resolveDurationSeconds(phase, {
      workMinutes,
      shortMinutes,
      longMinutes,
    });

    return {
      workMinutes,
      shortMinutes,
      longMinutes,
      workSessions: normalizeSessions(
        data.workSessions,
        defaultSettings.workSessions,
      ),
      longBreakEnabled: normalizeBoolean(
        data.longBreakEnabled,
        defaultSettings.longBreakEnabled,
      ),
      phase,
      remainingSeconds: normalizeSeconds(
        data.remainingSeconds,
        durationSeconds,
        durationSeconds,
      ),
      workSessionsByDate: normalizeWorkSessionsByDate(
        data.workSessionsByDate,
      ),
    };
  } catch (error) {
    return defaultSettings;
  }
};

const writeCachedSettings = (settings: PersistedSettings) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    // Ignore storage errors (quota, blocked, etc.).
  }
};

export const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

type PomodoroContextValue = {
  tone: Tone;
  phase: Phase;
  isActive: boolean;
  isRunning: boolean;
  alarmActive: boolean;
  pendingPhase: Phase | null;
  remainingSeconds: number;
  progress: number;
  workSessions: number;
  workSessionsByDate: WorkSessionsByDate;
  workMinutes: number;
  shortMinutes: number;
  longMinutes: number;
  longBreakEnabled: boolean;
  primaryActionLabel: string;
  handlePrimaryAction: () => void;
  handleRestart: () => void;
  handleSkip: () => void;
  handleStopAlarm: () => void;
  handleResetSessions: () => void;
  handleWorkMinutesChange: (value: number) => void;
  handleShortMinutesChange: (value: number) => void;
  handleLongMinutesChange: (value: number) => void;
  handleLongBreakToggle: (checked: boolean) => void;
};

const PomodoroContext = createContext<PomodoroContextValue | null>(null);

const usePomodoroLogic = (): PomodoroContextValue => {
  const initialSettings = useMemo(() => readCachedSettings(), []);

  const [workMinutes, setWorkMinutes] = useState(initialSettings.workMinutes);
  const [shortMinutes, setShortMinutes] = useState(initialSettings.shortMinutes);
  const [longMinutes, setLongMinutes] = useState(initialSettings.longMinutes);
  const [longBreakEnabled, setLongBreakEnabled] = useState(
    initialSettings.longBreakEnabled,
  );
  const [phase, setPhase] = useState<Phase>(initialSettings.phase);
  const [pendingPhase, setPendingPhase] = useState<Phase | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(
    initialSettings.remainingSeconds,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);
  const [workSessions, setWorkSessions] = useState(
    initialSettings.workSessions,
  );
  const [workSessionsByDate, setWorkSessionsByDate] = useState(
    initialSettings.workSessionsByDate,
  );

  const alarmIntervalRef = useRef<number | null>(null);
  const alarmTimeoutRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastDurationRef = useRef(
    resolveDurationSeconds(initialSettings.phase, initialSettings),
  );
  const pendingPhaseRef = useRef<Phase | null>(pendingPhase);

  useEffect(() => {
    pendingPhaseRef.current = pendingPhase;
  }, [pendingPhase]);

  useEffect(() => {
    writeCachedSettings({
      workMinutes,
      shortMinutes,
      longMinutes,
      workSessions,
      longBreakEnabled,
      phase,
      remainingSeconds,
      workSessionsByDate,
    });
  }, [
    workMinutes,
    shortMinutes,
    longMinutes,
    workSessions,
    longBreakEnabled,
    phase,
    remainingSeconds,
    workSessionsByDate,
  ]);

  const getDurationSeconds = useCallback(
    (targetPhase: Phase) => {
      if (targetPhase === 'work') {
        return workMinutes * 60;
      }
      if (targetPhase === 'short-break') {
        return shortMinutes * 60;
      }
      return longMinutes * 60;
    },
    [workMinutes, shortMinutes, longMinutes],
  );

  const currentDurationSeconds = useMemo(
    () => getDurationSeconds(phase),
    [getDurationSeconds, phase],
  );

  const isActive = isRunning && !alarmActive;
  const tone = useMemo(() => {
    const mode = isActive ? 'active' : 'paused';
    return tonePalette[phase][mode];
  }, [phase, isActive]);

  const progress = useMemo(() => {
    if (currentDurationSeconds === 0) {
      return 0;
    }
    return Math.min(
      100,
      Math.max(
        0,
        Math.round(
          ((currentDurationSeconds - remainingSeconds) /
            currentDurationSeconds) *
            100,
        ),
      ),
    );
  }, [currentDurationSeconds, remainingSeconds]);

  const ensureAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    return audioContextRef.current;
  }, []);

  const playBeep = useCallback(() => {
    try {
      const audioContext = ensureAudioContext();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = 880;

      gain.gain.setValueAtTime(0, audioContext.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.32,
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.35);
    } catch (error) {
      // Ignore audio failures from autoplay or unavailable audio devices.
    }
  }, [ensureAudioContext]);

  const setPhaseAndReset = useCallback(
    (nextPhase: Phase) => {
      setPhase(nextPhase);
      setRemainingSeconds(getDurationSeconds(nextPhase));
    },
    [getDurationSeconds],
  );

  const moveToPendingPhase = useCallback(
    (shouldRun: boolean) => {
      const nextPhase = pendingPhaseRef.current ?? phase;
      setAlarmActive(false);
      setPendingPhase(null);
      setPhaseAndReset(nextPhase);
      setIsRunning(shouldRun);
    },
    [phase, setPhaseAndReset],
  );

  useEffect(() => {
    const previousDuration = lastDurationRef.current;

    if (!alarmActive && !isRunning) {
      const shouldSync = remainingSeconds === previousDuration;
      if (shouldSync || remainingSeconds > currentDurationSeconds) {
        setRemainingSeconds(currentDurationSeconds);
      }
    }

    lastDurationRef.current = currentDurationSeconds;
  }, [currentDurationSeconds, alarmActive, isRunning, remainingSeconds]);

  useEffect(() => {
    if (!isRunning || alarmActive) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning, alarmActive]);

  useEffect(() => {
    if (remainingSeconds > 0 || !isRunning) {
      return;
    }

    setIsRunning(false);
    setAlarmActive(true);

    const nextWorkSessions = phase === 'work' ? workSessions + 1 : workSessions;
    const useLongBreak =
      longBreakEnabled && phase === 'work' && nextWorkSessions % 4 === 0;
    const nextPhase =
      phase === 'work' ? (useLongBreak ? 'long-break' : 'short-break') : 'work';

    if (phase === 'work') {
      setWorkSessions(nextWorkSessions);
      const todayKey = formatDateKey(new Date());
      setWorkSessionsByDate((previous) => ({
        ...previous,
        [todayKey]: (previous[todayKey] ?? 0) + 1,
      }));
    }

    setPendingPhase(nextPhase);
  }, [remainingSeconds, isRunning, phase, workSessions, longBreakEnabled]);

  useEffect(() => {
    if (!alarmActive) {
      if (alarmIntervalRef.current) {
        window.clearInterval(alarmIntervalRef.current);
        alarmIntervalRef.current = null;
      }
      return undefined;
    }

    playBeep();
    alarmIntervalRef.current = window.setInterval(() => {
      playBeep();
    }, 1000);

    return () => {
      if (alarmIntervalRef.current) {
        window.clearInterval(alarmIntervalRef.current);
        alarmIntervalRef.current = null;
      }
    };
  }, [alarmActive, playBeep]);

  useEffect(() => {
    if (!alarmActive) {
      if (alarmTimeoutRef.current) {
        window.clearTimeout(alarmTimeoutRef.current);
        alarmTimeoutRef.current = null;
      }
      return undefined;
    }

    alarmTimeoutRef.current = window.setTimeout(() => {
      moveToPendingPhase(false);
    }, AUTO_ALARM_STOP_MS);

    return () => {
      if (alarmTimeoutRef.current) {
        window.clearTimeout(alarmTimeoutRef.current);
        alarmTimeoutRef.current = null;
      }
    };
  }, [alarmActive, moveToPendingPhase]);

  useEffect(() => {
    if (!longBreakEnabled && pendingPhase === 'long-break') {
      setPendingPhase('short-break');
    }
  }, [longBreakEnabled, pendingPhase]);

  const handlePrimaryAction = useCallback(() => {
    ensureAudioContext();
    if (alarmActive) {
      moveToPendingPhase(true);
      return;
    }
    setIsRunning((previous) => !previous);
  }, [ensureAudioContext, alarmActive, moveToPendingPhase]);

  const handleRestart = useCallback(() => {
    setAlarmActive(false);
    setPendingPhase(null);
    setRemainingSeconds(currentDurationSeconds);
  }, [currentDurationSeconds]);

  const handleSkip = useCallback(() => {
    const nextWorkSessions = phase === 'work' ? workSessions + 1 : workSessions;
    const useLongBreak =
      longBreakEnabled && phase === 'work' && nextWorkSessions % 4 === 0;
    const nextPhase =
      phase === 'work' ? (useLongBreak ? 'long-break' : 'short-break') : 'work';

    if (phase === 'work') {
      setWorkSessions(nextWorkSessions);
    }

    setAlarmActive(false);
    setPendingPhase(null);
    setPhaseAndReset(nextPhase);
  }, [phase, workSessions, longBreakEnabled, setPhaseAndReset]);

  const handleStopAlarm = useCallback(() => {
    moveToPendingPhase(false);
  }, [moveToPendingPhase]);

  const handleWorkMinutesChange = useCallback((value: number) => {
    setWorkMinutes(clampMinutes(value));
  }, []);

  const handleShortMinutesChange = useCallback((value: number) => {
    setShortMinutes(clampMinutes(value));
  }, []);

  const handleLongMinutesChange = useCallback((value: number) => {
    setLongMinutes(clampMinutes(value));
  }, []);

  const handleLongBreakToggle = useCallback((checked: boolean) => {
    setLongBreakEnabled(checked);
  }, []);

  const handleResetSessions = useCallback(() => {
    setWorkSessions(0);
  }, []);

  const primaryActionLabel = alarmActive
    ? 'Continuar'
    : isRunning
      ? 'Pausar'
      : remainingSeconds === currentDurationSeconds
        ? 'Iniciar'
        : 'Reanudar';

  return {
    tone,
    phase,
    isActive,
    isRunning,
    alarmActive,
    pendingPhase,
    remainingSeconds,
    progress,
    workSessions,
    workSessionsByDate,
    workMinutes,
    shortMinutes,
    longMinutes,
    longBreakEnabled,
    primaryActionLabel,
    handlePrimaryAction,
    handleRestart,
    handleSkip,
    handleStopAlarm,
    handleResetSessions,
    handleWorkMinutesChange,
    handleShortMinutesChange,
    handleLongMinutesChange,
    handleLongBreakToggle,
  };
};

export const PomodoroProvider = ({ children }: { children: ReactNode }) => {
  const value = usePomodoroLogic();
  return createElement(PomodoroContext.Provider, { value }, children);
};

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoro must be used within PomodoroProvider');
  }
  return context;
};
