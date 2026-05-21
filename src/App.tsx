import { useEffect } from 'react';
import { PomodoroProvider, usePomodoro } from './Logic';
import { type Phase } from './Logic';
import { AlarmBanner } from './components/pomodoro/AlarmBanner';
import { AppShell } from './components/pomodoro/AppShell';
import { DurationSettings } from './components/pomodoro/DurationSettings';
import { HeaderBar } from './components/pomodoro/HeaderBar';
import { LongBreakToggle } from './components/pomodoro/LongBreakToggle';
import { TimerPanel } from './components/pomodoro/TimerPanel';

const base = import.meta.env.BASE_URL;

const faviconMap: Record<Phase, string> = {
  work: `${base}tomato-red.svg`,
  'short-break': `${base}tomato-green.svg`,
  'long-break': `${base}tomato-blue.svg`,
};

const FaviconUpdater = () => {
  const { phase } = usePomodoro();

  useEffect(() => {
    const existing = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (existing) {
      existing.remove();
    }
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = `${faviconMap[phase]}?v=${Date.now()}`;
    document.head.appendChild(link);
  }, [phase]);

  return null;
};

export const App = () => (
  <PomodoroProvider>
    <FaviconUpdater />
    <AppShell>
      <HeaderBar />
      <TimerPanel />
      <DurationSettings />
      <LongBreakToggle />
      <AlarmBanner />
    </AppShell>
  </PomodoroProvider>
);
