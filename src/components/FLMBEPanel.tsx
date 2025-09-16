import React, { useState } from 'react';
import { Paper, Text, Stack, Group, Progress, SimpleGrid, Badge, Tooltip, ActionIcon, Collapse } from '@mantine/core';
import { IconCheck, IconCircle, IconCircleCheck, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { usePlanner } from '../contexts/PlannerContext';
import type { FLMBEArea } from '../types/index';

interface FLMBEBoxProps {
  area: FLMBEArea;
}

const FLMBEBox: React.FC<FLMBEBoxProps> = ({ area }) => {
  const { selectFLMBECourse } = usePlanner();
  const allEligibleCourses = [...area.basicCourses, ...area.approvedSubstitutes];
  
  const getGroupColor = (group: string) => {
    switch (group) {
      case 'Functions': return 'blue';
      case 'Leadership & Management': return 'green';
      case 'Business Environment': return 'orange';
      default: return 'gray';
    }
  };

  const tooltipContent = (
    <Stack gap="xs" style={{ maxWidth: 300 }}>
      <Text size="sm" fw={500}>{area.line}</Text>
      {area.selectedCourse && (
        <Text size="xs" c="green">
          Selected: {area.selectedCourse}
        </Text>
      )}
      <Text size="xs" fw={500}>Basic Courses:</Text>
      <Text size="xs">
        {area.basicCourses.join(', ')}
      </Text>
      {area.approvedSubstitutes.length > 0 && (
        <>
          <Text size="xs" fw={500}>Approved Substitutes:</Text>
          <Text size="xs">
            {area.approvedSubstitutes.join(', ')}
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
        p="sm"
        radius="md"
        withBorder
        style={{
          backgroundColor: area.completed ? '#e8f5e8' : 'white',
          borderColor: area.completed ? '#4caf50' : '#dee2e6',
          minHeight: '80px',
          cursor: 'pointer'
        }}
      >
        <Stack gap="xs">
          <Group justify="space-between" align="center">
            <Stack gap={2} style={{ flex: 1 }}>
              <Badge size="xs" color={getGroupColor(area.group)}>
                {area.group}
              </Badge>
              <Text size="sm" fw={500} lineClamp={2}>
                {area.line}
              </Text>
            </Stack>
            <Group gap="xs">
              {area.completed ? (
                <IconCircleCheck size={20} color="#4caf50" />
              ) : (
                <IconCircle size={20} color="#dee2e6" />
              )}
            </Group>
          </Group>
          
          {area.selectedCourse && (
            <Text size="xs" c="green" fw={500} lineClamp={1}>
              {area.selectedCourse}
            </Text>
          )}
        </Stack>
      </Paper>
    </Tooltip>
  );
};

export const FLMBEPanel: React.FC = () => {
  const { flmbeRequirements } = usePlanner();
  const [isExpanded, setIsExpanded] = useState(true);
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
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              {completedCount}/{requiredCount} completed (7 of 8 required)
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
          color="blue"
          size="sm"
          radius="xl"
        />
        
        <Collapse in={isExpanded}>
          <Stack gap="md">
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
                  />
                ))}
              </SimpleGrid>
            </Stack>
          </Stack>
        </Collapse>
      </Stack>
    </Paper>
  );
};
