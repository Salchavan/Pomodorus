import { Global } from '@emotion/react';
import { Box, Stack } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { usePomodoro } from '../../Logic';

type AppShellProps = {
  children: ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => {
  const { tone } = usePomodoro();

  return (
    <>
      <Global
        styles={`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: 'Sora', sans-serif;
            background: ${tone.background};
          }

          ::selection {
            background: ${tone.accentSoft};
            color: #1B0D0F;
          }
        `}
      />
      <Box
        height='100vh'
        overflow='hidden'
        bgGradient={`radial-gradient(1200px circle at 10% 10%, ${tone.surface}, transparent 45%), radial-gradient(900px circle at 90% 20%, ${tone.accent}33, transparent 40%), linear-gradient(180deg, ${tone.background}, ${tone.background})`}
        color={tone.text}
        px={{ base: '3', md: '5' }}
        py={{ base: '2', md: '3' }}
      >
        <Box maxW='980px' mx='auto' height='100%'>
          <Stack gap={{ base: '4', md: '5' }} height='100%'>
            {children}
          </Stack>
        </Box>
      </Box>
    </>
  );
};
