import React, { useState, useMemo } from 'react';
import { Paper, TextInput, Stack, ScrollArea, Group, Badge, ActionIcon, Divider, Text } from '@mantine/core';
import { IconSearch, IconPlus } from '@tabler/icons-react';
import { CourseCard } from './CourseCard';
import type { Course } from '../types/index';

interface CourseSearchProps {
  availableCourses: Course[];
  onAddCourse: (course: Course) => void;
}

export const CourseSearch: React.FC<CourseSearchProps> = ({
  availableCourses,
  onAddCourse
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter courses based on search term
  const filteredCourses = useMemo(() => {
    let filtered = availableCourses;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(course => 
        course.code.toLowerCase().includes(term) ||
        course.title.toLowerCase().includes(term)
      );
    }
    
    return filtered; // Show all courses
  }, [availableCourses, searchTerm]);
  
  return (
    <Paper
      shadow="sm"
      radius="md"
      p="md"
      withBorder
      style={{
        height: '100%',
        backgroundColor: '#f8f9fa'
      }}
    >
      <Stack gap="md" style={{ height: '100%' }}>
        <Group justify="space-between" align="center">
          <Text size="lg" fw={600}>
            Course Catalog
          </Text>
          <Badge variant="light" color="blue">
            {filteredCourses.length} courses
          </Badge>
        </Group>
        
        {/* Search Input */}
        <TextInput
          placeholder="Search courses by code or title..."
          leftSection={<IconSearch size={16} />}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
          size="sm"
        />
        
        <Divider />
        
        {/* Course List */}
        <ScrollArea style={{ flex: 1 }} scrollbars="x">
          <Group gap="md" wrap="nowrap" style={{ minWidth: 'fit-content' }}>
            {filteredCourses.length === 0 ? (
              <Text size="sm" c="dimmed" ta="center" p="xl" style={{ width: '100%' }}>
                No courses found matching your criteria
              </Text>
            ) : (
              filteredCourses.map((course) => (
                <Group key={course.code} gap="xs" align="stretch" wrap="nowrap" style={{ minWidth: '300px' }}>
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <CourseCard
                      course={course}
                      isDraggable={true}
                      showDetails={true}
                    />
                  </div>
                  <ActionIcon
                    variant="light"
                    color="green"
                    size="lg"
                    onClick={() => onAddCourse(course)}
                    style={{ alignSelf: 'center' }}
                  >
                    <IconPlus size={18} />
                  </ActionIcon>
                </Group>
              ))
            )}
          </Group>
        </ScrollArea>
        
        <Divider />
        
        <Text size="xs" c="dimmed" ta="center">
          Drag courses to quarters or click + to add
        </Text>
      </Stack>
    </Paper>
  );
};
