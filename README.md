# Pomodorus 🍅

Pomodoro timer construido con **React 19**, **TypeScript**, **Chakra UI v3** y **Vite 8**.

## Stack tecnológico

| Tecnología | Versión |
|---|---|
| React | ^19.2.6 |
| TypeScript | ~6.0.2 |
| Chakra UI | ^3.35.0 |
| Vite | ^8.0.12 |
| Bun (package manager) | 1.3.14 |
| Tailwind CSS | ^4.3.0 |
| Emotion | ^11.14.0 |
| React Icons | ^5.6.0 |
| React Compiler (Babel) | ^1.0.0 |

## Scripts

| Comando | Descripción |
|---|---|
| `bun run dev` | Inicia servidor de desarrollo |
| `bun run build` | Compila TypeScript + build de producción |
| `bun run lint` | Ejecuta ESLint |
| `bun run preview` | Previsualiza build de producción |
| `bun run deploy` | Publica en GitHub Pages |

## Estructura del proyecto

```
pomodorus/
├── public/
│   ├── favicon.svg
│   └── sw.js              # Service Worker (PWA)
├── src/
│   ├── assets/             # Imágenes estáticas
│   ├── components/
│   │   └── pomodoro/
│   │       ├── AlarmBanner.tsx       # Banner cuando suena la alarma
│   │       ├── AppShell.tsx          # Layout principal con tema dinámico
│   │       ├── CalendarModal.tsx     # Calendario mensual de sesiones
│   │       ├── DurationSettings.tsx  # Grid de sliders de tiempo
│   │       ├── DurationSlider.tsx    # Slider reutilizable
│   │       ├── HeaderBar.tsx         # Encabezado con badges
│   │       ├── LongBreakToggle.tsx   # Toggle de recreo largo
│   │       └── TimerPanel.tsx        # Temporizador, progreso y botones
│   ├── App.tsx              # Composición raíz
│   ├── Logic.ts             # Estado global, lógica del timer, persistencia
│   └── main.tsx             # Entry point con ChakraProvider
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tsconfig.app.json / tsconfig.node.json
```

## Funcionalidades

- **Ciclos Pomodoro**: trabajo → recreo corto, cada 4 trabajos → recreo largo
- **Temporizador visual** con barra de progreso y cuenta regresiva
- **Alarma sonora** mediante Web Audio API (oscilador, sin archivos externos)
- **Persistencia en localStorage**: guarda minutos, fase, sesiones y conteo diario
- **Tema dinámico**: paletas de color que cambian según la fase (rojo / verde / azul) y estado (activo / pausado)
- **Calendario de sesiones**: modal con vista mensual y conteo de sesiones completadas por día
- **Configuración flexible**: duración ajustable para trabajo, recreo corto y recreo largo (5–60 min, step 5)
- **Soporte PWA**: service worker registrado en producción

## Licencia

MIT
