import {
  Box,
  Button,
  Dialog,
  HStack,
  IconButton,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { formatDateKey, usePomodoro } from '../../Logic';

type CalendarCell = {
  date: Date;
  inMonth: boolean;
};

const WEEK_DAYS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
const CALENDAR_ROWS = 6;
const CALENDAR_COLUMNS = 7;
const GOLD_BASE = '#C9A54D';
const GOLD_GLOW = '#F7D27E';
const GOLD_DEEP = '#7f621f';

const buildCalendar = (baseDate: Date): CalendarCell[] => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const startDate = new Date(year, month, 1 - startOffset);

  return Array.from(
    { length: CALENDAR_ROWS * CALENDAR_COLUMNS },
    (_, index) => {
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + index);
      return {
        date: cellDate,
        inMonth: cellDate.getMonth() === month,
      };
    },
  );
};

export const CalendarModal = () => {
  const { tone, workSessionsByDate } = usePomodoro();
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  const monthLabel = useMemo(
    () =>
      currentMonth.toLocaleString('es-ES', {
        month: 'long',
        year: 'numeric',
      }),
    [currentMonth],
  );

  const calendarDays = useMemo(
    () => buildCalendar(currentMonth),
    [currentMonth],
  );

  const todayKey = formatDateKey(new Date());

  const monthTotal = useMemo(() => {
    const currentMonthIndex = currentMonth.getMonth();
    return calendarDays.reduce((total, cell) => {
      if (cell.date.getMonth() !== currentMonthIndex) {
        return total;
      }
      const key = formatDateKey(cell.date);
      return total + (workSessionsByDate[key] ?? 0);
    }, 0);
  }, [calendarDays, currentMonth, workSessionsByDate]);

  const handlePrevMonth = () => {
    setCurrentMonth(
      (previous) =>
        new Date(previous.getFullYear(), previous.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      (previous) =>
        new Date(previous.getFullYear(), previous.getMonth() + 1, 1),
    );
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger
        aria-label='Ver calendario'
        bg={tone.surface}
        borderWidth='1px'
        borderColor={`${tone.accent}55`}
        borderRadius='14px'
        minW='44px'
        minH='44px'
        px='3'
        _hover={{ bg: `${tone.accent}22` }}
      >
        <FiCalendar size={22} />
      </Dialog.Trigger>
      <Dialog.Backdrop bg='blackAlpha.600' />
      <Dialog.Positioner>
        <Dialog.Content
          bg={tone.surface}
          color={tone.text}
          borderRadius='24px'
          borderWidth='1px'
          borderColor={`${tone.accent}55`}
          p='5'
          w={{ base: '92vw', md: '70vw' }}
          maxW='70vw'
          h='80vh'
          maxH='80vh'
          overflow='hidden'
          display='flex'
          flexDirection='column'
        >
          <Dialog.Header>
            <Stack gap='1'>
              <Dialog.Title fontSize='xl' fontWeight='600'>
                Calendario de ciclos
              </Dialog.Title>
              <Dialog.Description color={tone.muted} fontSize='sm'>
                Total del mes: {monthTotal}
              </Dialog.Description>
            </Stack>
          </Dialog.Header>
          <Dialog.Body overflow='hidden' flex='1'>
            <Stack gap='4' mt='4'>
              <HStack justify='space-between' flexWrap='wrap' gap='3'>
                <HStack gap='2'>
                  <IconButton
                    aria-label='Mes anterior'
                    variant='outline'
                    borderColor={`${tone.accent}55`}
                    color={tone.text}
                    _hover={{ bg: `${tone.accent}22` }}
                    onClick={handlePrevMonth}
                  >
                    <FiChevronLeft />
                  </IconButton>
                  <IconButton
                    aria-label='Mes siguiente'
                    variant='outline'
                    borderColor={`${tone.accent}55`}
                    color={tone.text}
                    _hover={{ bg: `${tone.accent}22` }}
                    onClick={handleNextMonth}
                  >
                    <FiChevronRight />
                  </IconButton>
                </HStack>
                <Text fontWeight='600' textTransform='capitalize'>
                  {monthLabel}
                </Text>
                <Button
                  variant='outline'
                  borderColor={`${tone.accent}55`}
                  color={tone.text}
                  _hover={{ bg: `${tone.accent}22` }}
                  onClick={handleToday}
                >
                  Hoy
                </Button>
              </HStack>

              <SimpleGrid columns={7} gap='2' fontSize='sm' color={tone.muted}>
                {WEEK_DAYS.map((day) => (
                  <Text key={day} textAlign='center' fontWeight='600'>
                    {day}
                  </Text>
                ))}
              </SimpleGrid>

              <SimpleGrid columns={7} gap='0'>
                {calendarDays.map((cell, index) => {
                  const key = formatDateKey(cell.date);
                  const count = workSessionsByDate[key] ?? 0;
                  const isToday = key === todayKey;
                  const isActiveMonth = cell.inMonth;
                  const isCompleted = count > 0 && isActiveMonth;
                  const isRowStart = index % CALENDAR_COLUMNS === 0;
                  const isRowEnd =
                    index % CALENDAR_COLUMNS === CALENDAR_COLUMNS - 1;
                  const prevCell = !isRowStart ? calendarDays[index - 1] : null;
                  const nextCell = !isRowEnd ? calendarDays[index + 1] : null;
                  const prevCompleted =
                    !!prevCell &&
                    prevCell.inMonth &&
                    (workSessionsByDate[formatDateKey(prevCell.date)] ?? 0) > 0;
                  const nextCompleted =
                    !!nextCell &&
                    nextCell.inMonth &&
                    (workSessionsByDate[formatDateKey(nextCell.date)] ?? 0) > 0;
                  const radiusLeft =
                    isCompleted && prevCompleted ? '0' : '14px';
                  const radiusRight =
                    isCompleted && nextCompleted ? '0' : '14px';

                  return (
                    <Box
                      key={key}
                      p='2'
                      minH='64px'
                      borderTopLeftRadius={radiusLeft}
                      borderBottomLeftRadius={radiusLeft}
                      borderTopRightRadius={radiusRight}
                      borderBottomRightRadius={radiusRight}
                      borderWidth='1px'
                      borderColor={
                        isCompleted
                          ? GOLD_BASE
                          : isToday
                            ? tone.accent
                            : `${tone.accent}22`
                      }
                      bg={
                        isCompleted
                          ? `linear-gradient(135deg, ${GOLD_GLOW}, ${GOLD_BASE})`
                          : isActiveMonth
                            ? `${tone.accent}12`
                            : 'transparent'
                      }
                      boxShadow={
                        isCompleted
                          ? `0 0 10px ${GOLD_GLOW}66, 0 0 18px ${GOLD_GLOW}33`
                          : 'none'
                      }
                      opacity={isActiveMonth ? 1 : 0.35}
                    >
                      <HStack gap='2' align='center' height='100%'>
                        <Text
                          fontSize='sm'
                          fontWeight='400'
                          color={isCompleted ? GOLD_DEEP : tone.text}
                        >
                          {cell.date.getDate()}
                        </Text>
                        <Box
                          flex='1'
                          display='flex'
                          alignItems='center'
                          justifyContent='center'
                        >
                          <Text
                            fontSize={count > 0 ? '4xl' : '2xl'}
                            fontWeight={count > 0 ? '700' : '500'}
                            color={count > 0 ? GOLD_DEEP : tone.muted}
                          >
                            {count}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  );
                })}
              </SimpleGrid>
            </Stack>
          </Dialog.Body>
          <Dialog.Footer mt='4'>
            <Dialog.CloseTrigger
              borderRadius='full'
              px='5'
              py='2'
              bg={tone.accent}
              color='#0E0E0E'
              _hover={{ bg: tone.accentSoft }}
            >
              Cerrar
            </Dialog.CloseTrigger>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
