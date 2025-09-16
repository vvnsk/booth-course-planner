import React from 'react';
import { Card, Text, Badge, Group, ActionIcon, Stack, Rating } from '@mantine/core';
import { IconTrash, IconGripVertical } from '@tabler/icons-react';
import type { CourseCardProps } from '../types/index';

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onRemove,
  isDraggable = true,
  showDetails = true
}) => {
  return (
    <Card
      shadow="sm"
      padding="xs"
      radius="md"
      withBorder
      style={{
        cursor: isDraggable ? 'grab' : 'default',
        minHeight: '80px'
      }}
    >
      <Group justify="space-between" align="flex-start" gap="xs">
        {isDraggable && (
          <ActionIcon variant="subtle" color="gray" size="sm">
            <IconGripVertical size={16} />
          </ActionIcon>
        )}
        
        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" align="flex-start">
            <Text size="sm" fw={600} c="blue" truncate>
              {course.code}
            </Text>
            {course.units && (
              <Badge size="xs" variant="light" color="gray">
                {course.units}
              </Badge>
            )}
          </Group>
          
          <Text size="xs" c="dimmed" lineClamp={2}>
            {course.title}
          </Text>
          
          {showDetails && (
            <Group gap="xs" mt={4}>
              {course.rating && (
                <Group gap={4}>
                  <Text size="xs" c="dimmed">Rating:</Text>
                  <Rating size="xs" value={course.rating} readOnly fractions={2} />
                </Group>
              )}
              
              {course.difficulty && (
                <Group gap={4}>
                  <Text size="xs" c="dimmed">Diff:</Text>
                  <Badge size="xs" color={course.difficulty > 3 ? 'red' : course.difficulty > 2 ? 'yellow' : 'green'}>
                    {course.difficulty}/5
                  </Badge>
                </Group>
              )}
            </Group>
          )}
          
          {course.prerequisites && course.prerequisites.length > 0 && (
            <Text size="xs" c="orange">
              Prereq: {course.prerequisites.join(', ')}
            </Text>
          )}
        </Stack>
        
        {onRemove && (
          <ActionIcon
            variant="subtle"
            color="red"
            size="sm"
            onClick={onRemove}
          >
            <IconTrash size={16} />
          </ActionIcon>
        )}
      </Group>
    </Card>
  );
};
