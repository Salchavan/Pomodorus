import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { formatTime, usePomodoro } from '../../Logic';

export const TimerPanel = () => {
  const {
    remainingSeconds,
    workSessions,
    progress,
    tone,
    primaryActionLabel,
    handlePrimaryAction,
    handleRestart,
    handleSkip,
    handleResetSessions,
  } = usePomodoro();

  return (
    <Box
      flex='3'
      minH='0'
      bg={tone.surface}
      borderRadius={{ base: '20px', md: '24px' }}
      p={{ base: '4', md: '6' }}
      boxShadow='0 20px 40px rgba(0, 0, 0, 0.25)'
      borderWidth='1px'
      borderColor={`${tone.accent}33`}
    >
      <Flex direction='column' height='100%' justify='space-between'>
        <HStack justify='space-between' flexWrap='wrap' gap='3'>
          <Flex direction='column' justify='center' height={200}>
            <Text fontSize='sm' color={tone.muted}>
              Tiempo restante
            </Text>
            <Text
              fontSize={{ base: '9xl', md: '9xl' }}
              fontWeight='600'
              lineHeight='1.1'
            >
              {formatTime(remainingSeconds)}
            </Text>
          </Flex>
          <Flex
            direction='column'
            align={{ base: 'flex-start', md: 'flex-end' }}
            justify='center'
          >
            <HStack gap='2'>
              <Text fontSize='sm' color={tone.muted}>
                Sesiones
              </Text>
              <Button
                size='2xs'
                variant='outline'
                borderColor={`${tone.accent}55`}
                color={tone.text}
                _hover={{ bg: `${tone.accent}22` }}
                onClick={handleResetSessions}
              >
                Reiniciar
              </Button>
            </HStack>
            <Text fontSize='2xl' fontWeight='600'>
              {workSessions}
            </Text>
          </Flex>
        </HStack>

        <Box>
          <Box
            h='8px'
            bg={`${tone.accent}22`}
            borderRadius='full'
            overflow='hidden'
          >
            <Box
              h='100%'
              bg={tone.accent}
              width={`${progress}%`}
              transition='width 0.4s ease'
            />
          </Box>
          <HStack
            justify='space-between'
            mt='1'
            fontSize='sm'
            color={tone.muted}
          >
            <Text>0%</Text>
            <Text>{progress}%</Text>
          </HStack>
        </Box>

        <HStack gap='3' flexWrap='wrap'>
          <Button
            size='md'
            onClick={handlePrimaryAction}
            bg={tone.accent}
            color='#0E0E0E'
            _hover={{ bg: tone.accentSoft, color: '#0E0E0E' }}
            _active={{ bg: tone.accentSoft }}
          >
            {primaryActionLabel}
          </Button>
          <Button
            size='md'
            onClick={handleRestart}
            variant='outline'
            borderColor={`${tone.accent}66`}
            color={tone.text}
            _hover={{ bg: `${tone.accent}22` }}
          >
            Reiniciar
          </Button>
          <Button
            size='md'
            onClick={handleSkip}
            variant='outline'
            borderColor={`${tone.accent}66`}
            color={tone.text}
            _hover={{ bg: `${tone.accent}22` }}
          >
            Saltar
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};
