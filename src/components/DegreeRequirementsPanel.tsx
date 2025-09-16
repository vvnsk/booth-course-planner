import React, { useState } from 'react';
import { Paper, Text, Stack, Group, Progress, Tooltip, ActionIcon, Collapse } from '@mantine/core';
import { IconCheck, IconCircle, IconCircleCheck, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { usePlanner } from '../contexts/PlannerContext';
import type { FoundationRequirement } from '../types/index';

interface RequirementBoxProps {
  requirement: FoundationRequirement;
}

const RequirementBox: React.FC<RequirementBoxProps> = ({ requirement }) => {
  const { selectFoundationCourse } = usePlanner();
  const allEligibleCourses = [...requirement.basicCourses, ...requirement.approvedSubstitutes];
  
  const tooltipContent = (
    <Stack gap="xs" style={{ maxWidth: 300 }}>
      <Text size="sm" fw={500}>{requirement.area}</Text>
      {requirement.selectedCourse && (
        <Text size="xs" c="green">
          Selected: {requirement.selectedCourse}
        </Text>
      )}
      <Text size="xs" fw={500}>Basic Courses:</Text>
      <Text size="xs">
        {requirement.basicCourses.join(', ')}
      </Text>
      {requirement.approvedSubstitutes.length > 0 && (
        <>
          <Text size="xs" fw={500}>Approved Substitutes:</Text>
          <Text size="xs">
            {requirement.approvedSubstitutes.join(', ')}
          </Text>
        </>
      )}
    </Stack>
  );
  
  return (
    <Tooltip
      label={tooltipContent}
      multiline
      withArrow
      position="top"
      styles={{
        tooltip: {
          maxWidth: 350,
          wordWrap: 'break-word'
        }
      }}
    >
      <Paper
        p="md"
        radius="md"
        withBorder
        style={{
          backgroundColor: requirement.completed ? '#e8f5e8' : 'white',
          borderColor: requirement.completed ? '#4caf50' : '#dee2e6',
          minHeight: '50px',
          cursor: 'pointer'
        }}
      >
        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Text size="sm" fw={600} lineClamp={2} style={{ flex: 1 }}>
              {requirement.area}
            </Text>
            {requirement.completed ? (
              <IconCircleCheck size={24} color="#4caf50" />
            ) : (
              <IconCircle size={24} color="#dee2e6" />
            )}
          </Group>
          
          {requirement.selectedCourse && (
            <Text size="xs" c="green" fw={500} lineClamp={1}>
              {requirement.selectedCourse}
            </Text>
          )}
        </Stack>
      </Paper>
    </Tooltip>
  );
};

export const DegreeRequirementsPanel: React.FC = () => {
  const { foundationRequirements } = usePlanner();
  const [isExpanded, setIsExpanded] = useState(true);
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
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              {completedCount}/{totalCount} completed
            </Text>
            <ActionIcon
              variant="light"
              color="gray"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
            </ActionIcon>
          </Group>
        </Group>
        
        <Progress
          value={progressPercent}
          color="green"
          size="sm"
          radius="xl"
        />
        
        <Collapse in={isExpanded}>
          <Stack gap="md">
            <Text size="md" fw={500} mt="md">
              Foundation ({completedCount}/{totalCount})
            </Text>
            
            <Group grow align="stretch">
              {foundationRequirements.map((requirement) => (
                <RequirementBox
                  key={requirement.area}
                  requirement={requirement}
                />
              ))}
            </Group>
          </Stack>
        </Collapse>
      </Stack>
    </Paper>
  );
};
