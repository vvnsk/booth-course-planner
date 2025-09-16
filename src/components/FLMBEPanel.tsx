import React from 'react';
import { Paper, Text, Stack, Group, Progress, Select, SimpleGrid, Badge } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import type { FLMBEArea } from '../types/index';

interface FLMBEBoxProps {
  area: FLMBEArea;
  onCourseSelect: (line: string, courseCode: string) => void;
}

const FLMBEBox: React.FC<FLMBEBoxProps> = ({ area, onCourseSelect }) => {
  const allEligibleCourses = [...area.basicCourses, ...area.approvedSubstitutes];
  
  const getGroupColor = (group: string) => {
    switch (group) {
      case 'Functions': return 'blue';
      case 'Leadership & Management': return 'green';
      case 'Business Environment': return 'orange';
      default: return 'gray';
    }
  };
  
  return (
    <Paper
      p="sm"
      radius="md"
      withBorder
      style={{
        backgroundColor: area.completed ? '#e8f5e8' : 'white',
        borderColor: area.completed ? '#4caf50' : '#dee2e6',
        minHeight: '140px'
      }}
    >
      <Stack gap="xs">
        <Group justify="space-between" align="center">
          <Stack gap={2}>
            <Badge size="xs" color={getGroupColor(area.group)}>
              {area.group}
            </Badge>
            <Text size="sm" fw={500}>
              {area.line}
            </Text>
          </Stack>
          {area.completed && (
            <IconCheck size={18} color="#4caf50" />
          )}
        </Group>
        
        <Select
          placeholder="Select course"
          value={area.selectedCourse || ''}
          onChange={(value) => value && onCourseSelect(area.line, value)}
          data={allEligibleCourses.map(course => ({
            value: course,
            label: course
          }))}
          size="xs"
        />
        
        <Text size="xs" c="dimmed" lineClamp={2}>
          Basic: {area.basicCourses.slice(0, 2).join(', ')}
          {area.basicCourses.length > 2 && '...'}
        </Text>
      </Stack>
    </Paper>
  );
};

interface FLMBEPanelProps {
  flmbeRequirements: FLMBEArea[];
  onCourseSelect: (line: string, courseCode: string) => void;
}

export const FLMBEPanel: React.FC<FLMBEPanelProps> = ({
  flmbeRequirements,
  onCourseSelect
}) => {
  const completedCount = flmbeRequirements.filter(req => req.completed).length;
  const requiredCount = 7; // Need 7 out of 8 areas
  const progressPercent = Math.min((completedCount / requiredCount) * 100, 100);
  
  // Group areas by category
  const functions = flmbeRequirements.filter(area => area.group === 'Functions');
  const leadership = flmbeRequirements.filter(area => area.group === 'Leadership & Management');
  const environment = flmbeRequirements.filter(area => area.group === 'Business Environment');
  
  return (
    <Paper
      shadow="sm"
      radius="md"
      p="lg"
      withBorder
      style={{ backgroundColor: '#f8f9fa' }}
    >
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Text size="lg" fw={600}>
            FLMBE Requirements
          </Text>
          <Text size="sm" c="dimmed">
            {completedCount}/{requiredCount} completed (7 of 8 required)
          </Text>
        </Group>
        
        <Progress
          value={progressPercent}
          color="blue"
          size="sm"
          radius="xl"
        />
        
        {/* Functions */}
        <Stack gap="sm">
          <Text size="md" fw={500} c="blue">
            Functions ({functions.filter(f => f.completed).length}/{functions.length})
          </Text>
          <SimpleGrid cols={2} spacing="sm">
            {functions.map((area) => (
              <FLMBEBox
                key={area.line}
                area={area}
                onCourseSelect={onCourseSelect}
              />
            ))}
          </SimpleGrid>
        </Stack>
        
        {/* Leadership & Management */}
        <Stack gap="sm">
          <Text size="md" fw={500} c="green">
            Leadership & Management ({leadership.filter(l => l.completed).length}/{leadership.length})
          </Text>
          <SimpleGrid cols={2} spacing="sm">
            {leadership.map((area) => (
              <FLMBEBox
                key={area.line}
                area={area}
                onCourseSelect={onCourseSelect}
              />
            ))}
          </SimpleGrid>
        </Stack>
        
        {/* Business Environment */}
        <Stack gap="sm">
          <Text size="md" fw={500} c="orange">
            Business Environment ({environment.filter(e => e.completed).length}/{environment.length})
          </Text>
          <SimpleGrid cols={2} spacing="sm">
            {environment.map((area) => (
              <FLMBEBox
                key={area.line}
                area={area}
                onCourseSelect={onCourseSelect}
              />
            ))}
          </SimpleGrid>
        </Stack>
      </Stack>
    </Paper>
  );
};
