import React, { useState } from 'react';
import { Card, Text, Badge, Group, ActionIcon, Stack, Modal, Title, Divider } from '@mantine/core';
import { IconTrash, IconGripVertical, IconPlus, IconInfoCircle } from '@tabler/icons-react';
import { useMediaQuery, useDisclosure } from '@mantine/hooks';
import type { CourseCardProps } from '../types/index';

// Helper function to aggregate quarters and show typical offering patterns
const getQuarterBadges = (quartersOffered: string[]): string[] => {
  const seasonCounts = {
    'Autumn': 0,
    'Winter': 0,
    'Spring': 0,
    'Summer': 0
  };

  // Count occurrences of each season
  quartersOffered.forEach(quarter => {
    const season = quarter.split(' ')[0];
    if (season in seasonCounts) {
      seasonCounts[season as keyof typeof seasonCounts]++;
    }
  });

  // Return seasons that appear at least once, prioritizing more frequent offerings
  const result: string[] = [];
  const totalYears = new Set(quartersOffered.map(q => q.split(' ')[1])).size;
  
  Object.entries(seasonCounts).forEach(([season, count]) => {
    if (count > 0) {
      // If a season appears in most years or multiple times, include it
      if (count >= Math.max(1, Math.floor(totalYears * 0.5))) {
        result.push(season);
      }
    }
  });

  // If no season meets the threshold, show the most frequent seasons
  if (result.length === 0) {
    const maxCount = Math.max(...Object.values(seasonCounts));
    Object.entries(seasonCounts).forEach(([season, count]) => {
      if (count === maxCount && count > 0) {
        result.push(season);
      }
    });
  }

  return result.length > 0 ? result : ['Varies'];
};

// Helper function to get color for quarter badges
const getQuarterColor = (quarter: string): string => {
  switch (quarter) {
    case 'Autumn': return 'orange';
    case 'Winter': return 'blue';
    case 'Spring': return 'green';
    case 'Summer': return 'yellow';
    default: return 'gray';
  }
};

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onRemove,
  onAdd,
  isDraggable = true,
  showDetails = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
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
          <Stack gap="xs">
            <ActionIcon variant="subtle" color="gray" size="sm">
              <IconGripVertical size={14} />
            </ActionIcon>
            <ActionIcon 
              variant="subtle" 
              color="blue" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
            >
              <IconInfoCircle size={14} />
            </ActionIcon>
            {onAdd && (
              <ActionIcon
                variant="subtle"
                color="green"
                size="sm"
                onClick={onAdd}
              >
                <IconPlus size={16} />
              </ActionIcon>
            )}
          </Stack>
        )}
        
        <Stack gap={isMobile ? 2 : 4} style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" align="flex-start">
            <Text size={isMobile ? "xs" : "sm"} fw={600} c="blue" truncate>
              {course.code}
            </Text>
            {isMobile && course.quartersOffered && course.quartersOffered.length > 0 && (
              <Group gap={2}>
                {getQuarterBadges(course.quartersOffered).slice(0, 2).map((quarter, index) => (
                  <Badge key={index} size="xs" color={getQuarterColor(quarter)}>
                    {quarter.charAt(0)}
                  </Badge>
                ))}
              </Group>
            )}
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
              {course.quartersOffered && course.quartersOffered.length > 0 && (
                <Group gap={4}>
                  {getQuarterBadges(course.quartersOffered).map((quarter, index) => (
                    <Badge key={index} size="xs" color={getQuarterColor(quarter)}>
                      {quarter}
                    </Badge>
                  ))}
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
          {isMobile && onAdd && (
            <ActionIcon
              variant="subtle"
              color="green"
              size="xs"
              onClick={onAdd}
            >
              <IconPlus size={14} />
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
      
      <Modal
        opened={opened}
        onClose={close}
        title={<Title order={3}>{course.code}</Title>}
        size="md"
        centered
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        styles={{
          inner: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            position: 'fixed',
            overflow: 'auto'
          },
          content: {
            position: 'relative'
          }
        }}
      >
        <Stack gap="md">
          <div>
            <Title order={4} size="h5" c="blue">
              {course.title}
            </Title>
          </div>
          
          <Divider />
          
          {course.units && (
            <Group>
              <Text fw={500}>Units:</Text>
              <Badge variant="light" color="gray">
                {course.units}
              </Badge>
            </Group>
          )}
          
          {course.quartersOffered && course.quartersOffered.length > 0 && (
            <div>
              <Text fw={500} mb="xs">Quarters Offered:</Text>
              <Group gap="xs">
                {getQuarterBadges(course.quartersOffered).map((quarter, index) => (
                  <Badge key={index} color={getQuarterColor(quarter)}>
                    {quarter}
                  </Badge>
                ))}
              </Group>
              <Text size="xs" c="dimmed" mt="xs">
                Based on historical data: {course.quartersOffered.join(', ')}
              </Text>
            </div>
          )}
          
          {course.prerequisites && course.prerequisites.length > 0 && (
            <div>
              <Text fw={500} mb="xs">Prerequisites:</Text>
              <Text c="orange">
                {course.prerequisites.join(', ')}
              </Text>
            </div>
          )}
          
          {course.description && (
            <div>
              <Text fw={500} mb="xs">Description:</Text>
              <Text size="sm">
                {course.description}
              </Text>
            </div>
          )}
        </Stack>
      </Modal>
    </Card>
  );
};
