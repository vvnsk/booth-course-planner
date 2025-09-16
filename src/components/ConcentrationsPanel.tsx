import React from 'react';
import { Paper, Text, Stack, Group, Progress, Badge, SimpleGrid, Accordion, Tooltip } from '@mantine/core';
import { IconCheck, IconTarget, IconCircle, IconCircleCheck } from '@tabler/icons-react';
import type { Concentration, ConcentrationRequirement } from '../types/index';

interface ConcentrationRequirementBoxProps {
  requirement: ConcentrationRequirement;
  concentrationName: string;
  onCourseAdd?: (concentrationName: string, requirementName: string, courseCode: string) => void;
}

const ConcentrationRequirementBox: React.FC<ConcentrationRequirementBoxProps> = ({
  requirement,
  concentrationName,
  onCourseAdd
}) => {
  const progressPercent = Math.min((requirement.unitsCompleted / requirement.minUnits) * 100, 100);
  const isCompleted = requirement.unitsCompleted >= requirement.minUnits;
  
  const tooltipContent = (
    <Stack gap="xs" style={{ maxWidth: 350 }}>
      <Text size="sm" fw={500}>{requirement.name || requirement.type}</Text>
      <Text size="xs">
        Units: {requirement.unitsCompleted}/{requirement.minUnits}
      </Text>
      
      {requirement.completedCourses.length > 0 && (
        <>
          <Text size="xs" fw={500}>Completed Courses:</Text>
          <Text size="xs">
            {requirement.completedCourses.join(', ')}
          </Text>
        </>
      )}
      
      <Text size="xs" fw={500}>Eligible Courses (showing first 10):</Text>
      <Text size="xs">
        {requirement.eligibleCourses.slice(0, 10).join(', ')}
        {requirement.eligibleCourses.length > 10 && '...'}
      </Text>
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
          maxWidth: 400,
          wordWrap: 'break-word'
        }
      }}
    >
      <Paper
        p="sm"
        radius="md"
        withBorder
        style={{
          backgroundColor: isCompleted ? '#e8f5e8' : 'white',
          borderColor: isCompleted ? '#4caf50' : '#dee2e6',
          cursor: 'pointer',
          minHeight: '90px'
        }}
      >
        <Stack gap="xs">
          <Group justify="space-between" align="center">
            <Text size="sm" fw={500} lineClamp={2} style={{ flex: 1 }}>
              {requirement.name || requirement.type}
            </Text>
            {isCompleted ? (
              <IconCircleCheck size={18} color="#4caf50" />
            ) : (
              <IconCircle size={18} color="#dee2e6" />
            )}
          </Group>
          
          <Progress
            value={progressPercent}
            color={isCompleted ? 'green' : 'blue'}
            size="xs"
            radius="xl"
          />
          
          <Text size="xs" c="dimmed">
            {requirement.unitsCompleted}/{requirement.minUnits} units
          </Text>
          
          {requirement.completedCourses.length > 0 && (
            <Group gap={4}>
              {requirement.completedCourses.slice(0, 3).map((course, idx) => (
                <Badge key={idx} size="xs" variant="light">
                  {course}
                </Badge>
              ))}
              {requirement.completedCourses.length > 3 && (
                <Text size="xs" c="dimmed">+{requirement.completedCourses.length - 3} more</Text>
              )}
            </Group>
          )}
        </Stack>
      </Paper>
    </Tooltip>
  );
};

interface ConcentrationCardProps {
  concentration: Concentration;
  isSelected: boolean;
  onToggleSelection: (name: string) => void;
  onCourseAdd?: (concentrationName: string, requirementName: string, courseCode: string) => void;
}

const ConcentrationCard: React.FC<ConcentrationCardProps> = ({
  concentration,
  isSelected,
  onToggleSelection,
  onCourseAdd
}) => {
  const progressPercent = Math.min((concentration.totalUnitsCompleted / concentration.totalUnitsRequired) * 100, 100);
  
  return (
    <Paper
      p="md"
      radius="md"
      withBorder
      style={{
        backgroundColor: isSelected ? '#e3f2fd' : 'white',
        borderColor: isSelected ? '#2196f3' : '#dee2e6',
        cursor: 'pointer'
      }}
      onClick={() => onToggleSelection(concentration.name)}
    >
      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <IconTarget size={18} color={isSelected ? '#2196f3' : '#666'} />
            <Text size="md" fw={600}>
              {concentration.name}
            </Text>
          </Group>
          {concentration.isCompleted && (
            <Badge color="green" variant="light">
              Complete
            </Badge>
          )}
        </Group>
        
        <Progress
          value={progressPercent}
          color={concentration.isCompleted ? 'green' : 'blue'}
          size="sm"
          radius="xl"
        />
        
        <Text size="sm" c="dimmed">
          {concentration.totalUnitsCompleted}/{concentration.totalUnitsRequired} units completed
        </Text>
        
        {isSelected && (
          <Stack gap="xs" mt="sm">
            {concentration.requirements.map((requirement, idx) => (
              <ConcentrationRequirementBox
                key={idx}
                requirement={requirement}
                concentrationName={concentration.name}
                onCourseAdd={onCourseAdd}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

interface ConcentrationsPanelProps {
  concentrations: Concentration[];
  selectedConcentrations: string[];
  onToggleConcentration: (name: string) => void;
  onCourseAdd?: (concentrationName: string, requirementName: string, courseCode: string) => void;
}

export const ConcentrationsPanel: React.FC<ConcentrationsPanelProps> = ({
  concentrations,
  selectedConcentrations,
  onToggleConcentration,
  onCourseAdd
}) => {
  const selectedConcentrationObjects = concentrations.filter(c => 
    selectedConcentrations.includes(c.name)
  );
  
  const completedCount = selectedConcentrationObjects.filter(c => c.isCompleted).length;
  
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
            Concentrations
          </Text>
          <Text size="sm" c="dimmed">
            {completedCount}/{selectedConcentrations.length} completed
          </Text>
        </Group>
        
        <Text size="sm" c="dimmed">
          Click to select/deselect concentrations. You can pursue multiple concentrations.
        </Text>
        
        <Accordion variant="separated" radius="md">
          <Accordion.Item value="available">
            <Accordion.Control>
              <Text fw={500}>Available Concentrations ({concentrations.length})</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <SimpleGrid cols={2} spacing="sm">
                {concentrations.slice(0, 8).map((concentration) => (
                  <ConcentrationCard
                    key={concentration.name}
                    concentration={concentration}
                    isSelected={selectedConcentrations.includes(concentration.name)}
                    onToggleSelection={onToggleConcentration}
                    onCourseAdd={onCourseAdd}
                  />
                ))}
              </SimpleGrid>
            </Accordion.Panel>
          </Accordion.Item>
          
          {selectedConcentrations.length > 0 && (
            <Accordion.Item value="selected">
              <Accordion.Control>
                <Text fw={500}>Selected Concentrations ({selectedConcentrations.length})</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="md">
                  {selectedConcentrationObjects.map((concentration) => (
                    <ConcentrationCard
                      key={concentration.name}
                      concentration={concentration}
                      isSelected={true}
                      onToggleSelection={onToggleConcentration}
                      onCourseAdd={onCourseAdd}
                    />
                  ))}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          )}
        </Accordion>
      </Stack>
    </Paper>
  );
};
