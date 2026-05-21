import { PomodoroProvider } from './Logic';
import { AlarmBanner } from './components/pomodoro/AlarmBanner';
import { AppShell } from './components/pomodoro/AppShell';
import { DurationSettings } from './components/pomodoro/DurationSettings';
import { HeaderBar } from './components/pomodoro/HeaderBar';
import { LongBreakToggle } from './components/pomodoro/LongBreakToggle';
import { TimerPanel } from './components/pomodoro/TimerPanel';

export const App = () => (
  <PomodoroProvider>
    <AppShell>
      <HeaderBar />
      <TimerPanel />
      <DurationSettings />
      <LongBreakToggle />
      <AlarmBanner />
    </AppShell>
  </PomodoroProvider>
);
