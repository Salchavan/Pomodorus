import { Badge, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { phaseLabels, usePomodoro } from '../../Logic';
import { CalendarModal } from './CalendarModal';

export const HeaderBar = () => {
  const { phase, isActive, tone } = usePomodoro();

  return (
    <HStack justify='space-between' align='center' flexWrap='wrap' gap='2'>
      <Stack gap='0'>
        <Heading size={{ base: 'md', md: 'lg' }} letterSpacing='-0.02em'>
          Pomodoro Focus
        </Heading>
        <Text color={tone.muted} fontSize='sm'>
          Ajusta tus tiempos y mantente en ritmo.
        </Text>
      </Stack>
      <HStack gap='2' flexWrap='wrap'>
        <CalendarModal />
        <Badge
          bg={tone.accent}
          color='#0E0E0E'
          px='2'
          py='0.5'
          borderRadius='full'
          fontWeight='600'
          fontSize='xs'
        >
          {phaseLabels[phase]}
        </Badge>
        <Badge
          bg={isActive ? '#F6E2C5' : tone.surface}
          color={isActive ? '#3E2A10' : tone.muted}
          px='2'
          py='0.5'
          borderRadius='full'
          fontWeight='600'
          fontSize='xs'
        >
          {isActive ? 'Activo' : 'Pausado'}
        </Badge>
      </HStack>
    </HStack>
  );
};
