import React, { useState } from 'react';
import { Card, Text, Badge, Group, ActionIcon, Stack, Rating } from '@mantine/core';
import { IconTrash, IconGripVertical, IconPlus } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import type { CourseCardProps } from '../types/index';

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onRemove,
  onAdd,
  isDraggable = true,
  showDetails = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleDragStart = (e: React.DragEvent) => {
    if (!isDraggable) return;
    
    // Store course data for the drop handler
    e.dataTransfer.setData('application/json', JSON.stringify(course));
    e.dataTransfer.effectAllowed = 'copy';
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <Card
      shadow="sm"
      padding={isMobile ? "xs" : "xs"}
      radius="md"
      withBorder
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        cursor: isDraggable ? (isDragging ? 'grabbing' : 'grab') : 'default',
        minHeight: isMobile ? '60px' : '80px',
        opacity: isDragging ? 0.5 : 1,
        transition: 'opacity 0.2s ease'
      }}
    >
      <Group justify="space-between" align="flex-start" gap={isMobile ? "xs" : "xs"}>
        {isDraggable && !isMobile && (
          <ActionIcon variant="subtle" color="gray" size="sm">
            <IconGripVertical size={14} />
          </ActionIcon>
        )}
        
        <Stack gap={isMobile ? 2 : 4} style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" align="flex-start">
            <Text size={isMobile ? "xs" : "sm"} fw={600} c="blue" truncate>
              {course.code}
            </Text>
            {course.units && (
              <Badge size="xs" variant="light" color="gray">
                {course.units}
              </Badge>
            )}
          </Group>
          
          <Text size="xs" c="dimmed" lineClamp={isMobile ? 1 : 2}>
            {course.title}
          </Text>
          
          {showDetails && !isMobile && (
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
          
          {course.prerequisites && course.prerequisites.length > 0 && !isMobile && (
            <Text size="xs" c="orange">
              Prereq: {course.prerequisites.join(', ')}
            </Text>
          )}
        </Stack>
        
        <Stack gap="xs">
          {onAdd && (
            <ActionIcon
              variant="subtle"
              color="green"
              size={isMobile ? "xs" : "sm"}
              onClick={onAdd}
            >
              <IconPlus size={isMobile ? 14 : 16} />
            </ActionIcon>
          )}
          
          {onRemove && (
            <ActionIcon
              variant="subtle"
              color="red"
              size={isMobile ? "xs" : "sm"}
              onClick={onRemove}
            >
              <IconTrash size={isMobile ? 14 : 16} />
            </ActionIcon>
          )}
        </Stack>
      </Group>
    </Card>
  );
};
