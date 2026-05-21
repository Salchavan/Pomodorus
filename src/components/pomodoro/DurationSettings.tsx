import { Box, SimpleGrid } from '@chakra-ui/react';
import {
  MINUTES_MAX,
  MINUTES_MIN,
  MINUTES_STEP,
  usePomodoro,
} from '../../Logic';
import { DurationSlider } from './DurationSlider';

export const DurationSettings = () => {
  const {
    tone,
    workMinutes,
    shortMinutes,
    longMinutes,
    handleWorkMinutesChange,
    handleShortMinutesChange,
    handleLongMinutesChange,
  } = usePomodoro();

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: '2', md: '6' }}>
      <Box
        bg={tone.surface}
        borderRadius='16px'
        p='3'
        borderWidth='1px'
        borderColor={`${tone.accent}22`}
      >
        <DurationSlider
          label='Trabajo (min)'
          value={workMinutes}
          onChange={handleWorkMinutesChange}
          tone={tone}
          min={MINUTES_MIN}
          max={MINUTES_MAX}
          step={MINUTES_STEP}
        />
      </Box>
      <Box
        bg={tone.surface}
        borderRadius='16px'
        p='3'
        borderWidth='1px'
        borderColor={`${tone.accent}22`}
      >
        <DurationSlider
          label='Recreo corto (min)'
          value={shortMinutes}
          onChange={handleShortMinutesChange}
          tone={tone}
          min={MINUTES_MIN}
          max={MINUTES_MAX}
          step={MINUTES_STEP}
        />
      </Box>
      <Box
        bg={tone.surface}
        borderRadius='16px'
        p='3'
        borderWidth='1px'
        borderColor={`${tone.accent}22`}
      >
        <DurationSlider
          label='Recreo largo (min)'
          value={longMinutes}
          onChange={handleLongMinutesChange}
          tone={tone}
          min={MINUTES_MIN}
          max={MINUTES_MAX}
          step={MINUTES_STEP}
        />
      </Box>
    </SimpleGrid>
  );
};
