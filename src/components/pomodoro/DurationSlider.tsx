import { HStack, Slider, Stack, Text } from '@chakra-ui/react';
import type { Tone } from '../../Logic';

type DurationSliderProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  tone: Tone;
  min?: number;
  max?: number;
  step?: number;
};

export const DurationSlider = ({
  label,
  value,
  onChange,
  tone,
  min = 5,
  max = 60,
  step = 5,
}: DurationSliderProps) => {
  return (
    <Stack gap='2'>
      <HStack justify='space-between'>
        <Text fontWeight='600'>{label}</Text>
        <Text fontSize='sm' color={tone.muted}>
          {value} min
        </Text>
      </HStack>
      <Slider.Root
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(details) => onChange(details.value[0])}
      >
        <Slider.Control>
          <Slider.Track bg={`${tone.accent}22`} borderRadius='full'>
            <Slider.Range bg={tone.accent} />
          </Slider.Track>
          <Slider.Thumb
            index={0}
            bg={tone.accent}
            borderWidth='2px'
            borderColor={tone.accentSoft}
          />
        </Slider.Control>
      </Slider.Root>
      <HStack justify='space-between' fontSize='xs' color={tone.muted}>
        <Text>{min}</Text>
        <Text>{max}</Text>
      </HStack>
    </Stack>
  );
};
