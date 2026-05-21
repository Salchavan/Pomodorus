import { Checkbox, HStack, Stack, Text } from '@chakra-ui/react';
import { usePomodoro } from '../../Logic';

export const LongBreakToggle = () => {
  const { tone, longBreakEnabled, handleLongBreakToggle } = usePomodoro();

  return (
    <HStack
      justify='space-between'
      flexWrap='wrap'
      gap='4'
      bg={tone.surface}
      borderRadius='16px'
      p='3'
      borderWidth='1px'
      borderColor={`${tone.accent}22`}
    >
      <Stack gap='1'>
        <Text fontWeight='600'>Recreo largo</Text>
        <Text fontSize='sm' color={tone.muted}>
          Activalo para usar un recreo largo cada 4 sesiones.
        </Text>
      </Stack>
      <Checkbox.Root
        checked={longBreakEnabled}
        onCheckedChange={(details) =>
          handleLongBreakToggle(details.checked === true)
        }
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control
          borderColor={`${tone.accent}88`}
          bg={longBreakEnabled ? tone.accent : 'transparent'}
          color='#0E0E0E'
        >
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Label>Usar recreo largo</Checkbox.Label>
      </Checkbox.Root>
    </HStack>
  );
};
