import React from 'react';
import { Paper, Text, Stack, Group, Progress, Select } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import type { FoundationRequirement } from '../types/index';

interface RequirementBoxProps {
  requirement: FoundationRequirement;
  onCourseSelect: (area: string, courseCode: string) => void;
}

const RequirementBox: React.FC<RequirementBoxProps> = ({ requirement, onCourseSelect }) => {
  const allEligibleCourses = [...requirement.basicCourses, ...requirement.approvedSubstitutes];
  
  return (
    <Paper
      p="md"
      radius="md"
      withBorder
      style={{
        backgroundColor: requirement.completed ? '#e8f5e8' : 'white',
        borderColor: requirement.completed ? '#4caf50' : '#dee2e6',
        minHeight: '120px'
      }}
    >
      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <Text size="sm" fw={600}>
            {requirement.area}
          </Text>
          {requirement.completed && (
            <IconCheck size={20} color="#4caf50" />
          )}
        </Group>
        
        <Select
          placeholder="Select a course"
          value={requirement.selectedCourse || ''}
          onChange={(value) => value && onCourseSelect(requirement.area, value)}
          data={allEligibleCourses.map(course => ({
            value: course,
            label: course
          }))}
          size="sm"
        />
        
        <Text size="xs" c="dimmed">
          Basic: {requirement.basicCourses.join(', ')}
        </Text>
      </Stack>
    </Paper>
  );
};

interface DegreeRequirementsPanelProps {
  foundationRequirements: FoundationRequirement[];
  onCourseSelect: (area: string, courseCode: string) => void;
}

export const DegreeRequirementsPanel: React.FC<DegreeRequirementsPanelProps> = ({
  foundationRequirements,
  onCourseSelect
}) => {
  const completedCount = foundationRequirements.filter(req => req.completed).length;
  const totalCount = foundationRequirements.length;
  const progressPercent = (completedCount / totalCount) * 100;
  
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
            Degree Requirements
          </Text>
          <Text size="sm" c="dimmed">
            {completedCount}/{totalCount} completed
          </Text>
        </Group>
        
        <Progress
          value={progressPercent}
          color="green"
          size="sm"
          radius="xl"
        />
        
        <Text size="md" fw={500} mt="md">
          Foundation ({completedCount}/{totalCount})
        </Text>
        
        <Group grow align="stretch">
          {foundationRequirements.map((requirement) => (
            <RequirementBox
              key={requirement.area}
              requirement={requirement}
              onCourseSelect={onCourseSelect}
            />
          ))}
        </Group>
      </Stack>
    </Paper>
  );
};
