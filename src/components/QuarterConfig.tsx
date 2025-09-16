import React, { useState } from 'react';
import { Paper, Text, Group, Button, Select, NumberInput, Stack, Title } from '@mantine/core';
import { IconPlus, IconRefresh } from '@tabler/icons-react';
import { usePlanner } from '../contexts/PlannerContext';

export const QuarterConfig: React.FC = () => {
  const { addQuarter, resetQuarters } = usePlanner();
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [startSeason, setStartSeason] = useState<'Autumn' | 'Winter' | 'Spring' | 'Summer'>('Autumn');

  const seasons = [
    { value: 'Autumn', label: 'Autumn' },
    { value: 'Winter', label: 'Winter' },
    { value: 'Spring', label: 'Spring' },
    { value: 'Summer', label: 'Summer' }
  ];

  const handleResetQuarters = () => {
    resetQuarters(startYear, startSeason);
  };

  return (
    <Paper p="md" withBorder style={{ backgroundColor: '#f8f9fa' }}>
      <Stack gap="md">
        <Title order={4}>Quarter Configuration</Title>
        
        <Group align="end" gap="md">
          <NumberInput
            label="Starting Year"
            value={startYear}
            onChange={(value) => setStartYear(value as number)}
            min={new Date().getFullYear() - 5}
            max={new Date().getFullYear() + 10}
            style={{ flex: 1 }}
          />
          
          <Select
            label="Starting Season"
            value={startSeason}
            onChange={(value) => setStartSeason(value as 'Autumn' | 'Winter' | 'Spring' | 'Summer')}
            data={seasons}
            style={{ flex: 1 }}
          />
          
          <Button
            leftSection={<IconRefresh size={16} />}
            onClick={handleResetQuarters}
            variant="light"
            color="blue"
          >
            Reset Schedule
          </Button>
        </Group>
        
        <Group justify="space-between" align="center">
          <Text size="sm" c="dimmed">
            Add or remove quarters to customize your academic plan
          </Text>
          
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={addQuarter}
            variant="filled"
            color="green"
            size="sm"
          >
            Add Quarter
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};
