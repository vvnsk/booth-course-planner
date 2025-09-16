import React, { useState, useMemo } from 'react';
import { Paper, TextInput, Stack, ScrollArea, Group, Badge, ActionIcon, Divider, Text } from '@mantine/core';
import { IconSearch, IconFilter } from '@tabler/icons-react';
import { CourseCard } from './CourseCard';
import { usePlanner } from '../contexts/PlannerContext';

export const CourseSearch: React.FC = () => {
  const {
    availableCourses,
    foundationCourses,
    flmbeCourses,
    concentrationCourseSets,
    categorizeCourse,
    getConcentrationDisplayName,
    addCourseToQuarter,
    quarters
  } = usePlanner();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
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

    // Apply category filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(course => {
        const category = categorizeCourse(course);
        return category === selectedFilter;
      });
    }
    
    return filtered;
  }, [availableCourses, searchTerm, selectedFilter, categorizeCourse]);

  // Handle adding course to first available quarter
  const handleAddCourse = (course: any) => {
    const firstQuarter = quarters[0];
    if (firstQuarter) {
      addCourseToQuarter(firstQuarter.id, course);
    }
  };
  
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
        
        {/* Search Row */}
        <Group gap="sm" wrap="nowrap">
          <TextInput
            placeholder="Search courses by code or title..."
            leftSection={<IconSearch size={16} />}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
            size="sm"
            style={{ flex: 1, minWidth: '200px' }}
          />
          <Badge variant="light" color="blue">
            {filteredCourses.length} courses
          </Badge>
          <ActionIcon
            variant="light"
            color="gray"
            size="lg"
            onClick={() => setShowFilters(!showFilters)}
            style={{ cursor: 'pointer' }}
          >
            <IconFilter size={18} />
          </ActionIcon>
        </Group>

        {/* Filter Badges (collapsible) */}
        {showFilters && (
          <Group gap="xs" wrap="wrap">
            <Badge
              variant={selectedFilter === 'all' ? 'filled' : 'light'}
              color="blue"
              style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              onClick={() => setSelectedFilter('all')}
            >
              All
            </Badge>
            <Badge
              variant={selectedFilter === 'foundation' ? 'filled' : 'light'}
              color="green"
              style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              onClick={() => setSelectedFilter('foundation')}
            >
              Foundation
            </Badge>
            <Badge
              variant={selectedFilter === 'flmbe' ? 'filled' : 'light'}
              color="orange"
              style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              onClick={() => setSelectedFilter('flmbe')}
            >
              FLMBE
            </Badge>
            {Object.keys(concentrationCourseSets).map((concentration) => (
              <Badge
                key={concentration}
                variant={selectedFilter === concentration ? 'filled' : 'light'}
                color="purple"
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => setSelectedFilter(concentration)}
              >
                {getConcentrationDisplayName(concentration)}
              </Badge>
            ))}
            <Badge
              variant={selectedFilter === 'other' ? 'filled' : 'light'}
              color="gray"
              style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              onClick={() => setSelectedFilter('other')}
            >
              Other
            </Badge>
          </Group>
        )}
        
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
                <div key={course.code} style={{ minWidth: '250px' }}>
                  <CourseCard
                    course={course}
                    isDraggable={true}
                    showDetails={true}
                    onAdd={() => handleAddCourse(course)}
                  />
                </div>
              ))
            )}
          </Group>
        </ScrollArea>
      </Stack>
    </Paper>
  );
};
