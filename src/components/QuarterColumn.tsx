import React, { useState } from 'react';
import { Paper, Text, Stack, Group, Badge, ScrollArea, ActionIcon, Collapse } from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconTrash } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { CourseCard } from './CourseCard';
import type { QuarterColumnProps } from '../types/index';

export const QuarterColumn: React.FC<QuarterColumnProps> = ({
  quarter,
  onRemoveCourse,
  onDropCourse,
  onDeleteQuarter
}) => {
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const totalUnits = quarter.courses.reduce((sum, course) => sum + (course.units || 100), 0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDropZoneActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set to false if we're leaving the entire quarter column
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDropZoneActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropZoneActive(false);
    
    try {
      const courseData = e.dataTransfer.getData('application/json');
      if (courseData) {
        const course = JSON.parse(courseData);
        onDropCourse(course);
      }
    } catch (error) {
      console.error('Error parsing dropped course data:', error);
    }
  };
  
  return (
    <Paper
      shadow="sm"
      radius="md"
      p={isMobile ? "sm" : "md"}
      withBorder
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        minHeight: '70px',
        width: '100%',
        backgroundColor: isDropZoneActive ? '#e3f2fd' : '#f8f9fa',
        border: isDropZoneActive ? '2px solid #2196f3' : '1px solid #dee2e6',
        transition: 'all 0.2s ease'
      }}
    >
      <Stack gap="sm">
        {/* Quarter Header */}
        <Group justify="space-between" align="center">
          <Stack gap={2}>
            <Text size={isMobile ? "xs" : "sm"} fw={600}>
              {quarter.season} {quarter.year}
            </Text>
            <Text size="xs" c="dimmed">
              {quarter.name}
            </Text>
          </Stack>
          
          <Group gap="xs">
            <Badge size={isMobile ? "xs" : "sm"} variant="light" color="blue">
              {totalUnits} units
            </Badge>
            <ActionIcon
              variant="light"
              color="red"
              size={isMobile ? "xs" : "sm"}
              onClick={() => onDeleteQuarter?.(quarter.id)}
              title="Delete Quarter"
            >
              <IconTrash size={isMobile ? 14 : 16} />
            </ActionIcon>
            <ActionIcon
              variant="light"
              color="gray"
              size={isMobile ? "xs" : "sm"}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <IconChevronUp size={isMobile ? 14 : 16} /> : <IconChevronDown size={isMobile ? 14 : 16} />}
            </ActionIcon>
          </Group>
        </Group>
        
        {/* Course List */}
        <Collapse in={isExpanded}>
          <ScrollArea scrollbars="x" style={{ minHeight: isMobile ? '60px' : '80px' }}>
            {quarter.courses.length === 0 ? (
              <Paper
                p={isMobile ? "md" : "lg"}
                radius="md"
                style={{
                  border: isDropZoneActive ? '2px solid #2196f3' : '2px dashed #ced4da',
                  backgroundColor: isDropZoneActive ? '#e3f2fd' : 'white',
                  textAlign: 'center',
                  minHeight: isMobile ? '60px' : '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <Text 
                  size="sm" 
                  c={isDropZoneActive ? 'blue' : 'dimmed'}
                  fw={isDropZoneActive ? 600 : 400}
                >
                  {isDropZoneActive ? 'Drop course here' : 'Drop courses here'}
                </Text>
              </Paper>
            ) : (
              <Group gap="xs" wrap={isMobile ? "wrap" : "nowrap"} style={{ minWidth: isMobile ? 'auto' : 'fit-content' }}>
                {quarter.courses.map((course, index) => (
                  <div key={`${course.code}-${index}`} style={{ minWidth: isMobile ? '100%' : '200px' }}>
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
        </Collapse>
      </Stack>
    </Paper>
  );
};
