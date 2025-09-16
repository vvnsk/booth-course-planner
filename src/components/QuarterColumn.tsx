import React from 'react';
import { Paper, Text, Stack, Group, Badge, ActionIcon, ScrollArea } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { CourseCard } from './CourseCard';
import type { QuarterColumnProps } from '../types/index';

export const QuarterColumn: React.FC<QuarterColumnProps> = ({
  quarter,
  onAddCourse,
  onRemoveCourse,
  onDropCourse
}) => {
  const totalUnits = quarter.courses.reduce((sum, course) => sum + (course.units || 100), 0);
  
  return (
    <Paper
      shadow="sm"
      radius="md"
      p="md"
      withBorder
      style={{
        minHeight: '150px',
        width: '100%',
        backgroundColor: '#f8f9fa'
      }}
    >
      <Stack gap="sm">
        {/* Quarter Header */}
        <Group justify="space-between" align="center">
          <Stack gap={2}>
            <Text size="sm" fw={600}>
              {quarter.season} {quarter.year}
            </Text>
            <Text size="xs" c="dimmed">
              {quarter.name}
            </Text>
          </Stack>
          
          <Group gap="xs">
            <Badge size="sm" variant="light" color="blue">
              {totalUnits} units
            </Badge>
            <ActionIcon
              variant="light"
              color="green"
              size="sm"
              onClick={() => {
                // TODO: Open course selection modal
                console.log('Add course to', quarter.name);
              }}
            >
              <IconPlus size={16} />
            </ActionIcon>
          </Group>
        </Group>
        
        {/* Course List */}
        <ScrollArea scrollbars="x" style={{ minHeight: '80px' }}>
          {quarter.courses.length === 0 ? (
            <Paper
              p="lg"
              radius="md"
              style={{
                border: '2px dashed #ced4da',
                backgroundColor: 'white',
                textAlign: 'center',
                minHeight: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text size="sm" c="dimmed">
                Drop courses here or click + to add
              </Text>
            </Paper>
          ) : (
            <Group gap="xs" wrap="nowrap" style={{ minWidth: 'fit-content' }}>
              {quarter.courses.map((course, index) => (
                <div key={`${course.code}-${index}`} style={{ minWidth: '200px' }}>
                  <CourseCard
                    course={course}
                    onRemove={() => onRemoveCourse(course.code)}
                    isDraggable={true}
                    showDetails={false}
                  />
                </div>
              ))}
            </Group>
          )}
        </ScrollArea>
      </Stack>
    </Paper>
  );
};
