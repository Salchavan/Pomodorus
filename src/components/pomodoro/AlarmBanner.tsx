import { Box, Button, HStack, Stack, Text } from '@chakra-ui/react';
import { phaseLabels, usePomodoro } from '../../Logic';

export const AlarmBanner = () => {
  const { alarmActive, pendingPhase, tone, handleStopAlarm } = usePomodoro();

  if (!alarmActive) {
    return null;
  }

  return (
    <Box
      bg={`${tone.accent}22`}
      borderRadius='20px'
      p='5'
      borderWidth='1px'
      borderColor={`${tone.accent}88`}
    >
      <Stack gap='3'>
        <Text fontWeight='600'>Alarma sonando. Detenla para continuar.</Text>
        <HStack gap='3' flexWrap='wrap'>
          <Button
            onClick={handleStopAlarm}
            bg={tone.accent}
            color='#0E0E0E'
            _hover={{ bg: tone.accentSoft, color: '#0E0E0E' }}
          >
            Apagar alarma
          </Button>
          {pendingPhase && (
            <Text fontSize='sm' color={tone.muted}>
              Siguiente: {phaseLabels[pendingPhase]}
            </Text>
          )}
        </HStack>
      </Stack>
    </Box>
  );
};
