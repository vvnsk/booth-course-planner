import React, { useState, useMemo } from 'react';
import { Paper, TextInput, Stack, ScrollArea, Group, Badge, ActionIcon, Divider, Text } from '@mantine/core';
import { IconSearch, IconFilter } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
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
  const [forceUpdate, setForceUpdate] = useState(0); // Force re-render mechanism
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  // Debug function to log course categorization
  const debugCategorization = () => {
    const categories = {
      foundation: 0,
      flmbe: 0,
      other: 0,
      concentrations: {} as { [key: string]: number }
    };

    availableCourses.forEach(course => {
      const category = categorizeCourse(course);
      if (category === 'foundation') {
        categories.foundation++;
      } else if (category === 'flmbe') {
        categories.flmbe++;
      } else if (category === 'other') {
        categories.other++;
      } else {
        // It's a concentration
        categories.concentrations[category] = (categories.concentrations[category] || 0) + 1;
      }
    });

    console.log('Course categorization:', categories);
    console.log('Foundation courses set size:', foundationCourses.size);
    console.log('FLMBE courses set size:', flmbeCourses.size);
    console.log('Concentration sets:', Object.keys(concentrationCourseSets).map(key => 
      `${key}: ${concentrationCourseSets[key].size}`
    ));
  };

  // Run debug on mount and when data changes
  React.useEffect(() => {
    if (availableCourses.length > 0) {
      debugCategorization();
    }
  }, [availableCourses, foundationCourses, flmbeCourses, concentrationCourseSets]);
  
  // Filter courses based on search term
  const filteredCourses = useMemo(() => {
    // Early return if no courses available
    if (!availableCourses.length) {
      return [];
    }

    let filtered = [...availableCourses]; // Create a copy to avoid mutation
    
    console.log(`Starting with ${availableCourses.length} total courses`);
    console.log(`Selected filter: "${selectedFilter}"`);
    
    // Apply category filter first
    if (selectedFilter !== 'all') {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(course => {
        const category = categorizeCourse(course);
        return category === selectedFilter;
      });
      console.log(`Filter: ${selectedFilter}, Filtered from ${beforeFilter} to ${filtered.length} courses`);
      
      // Sample some results for debugging
      if (filtered.length > 0) {
        console.log(`Sample filtered courses: ${filtered.slice(0, 3).map(c => c.code).join(', ')}`);
      }
    }
    
    // Apply search filter
    if (searchTerm) {
      const beforeSearch = filtered.length;
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(course => 
        course.code.toLowerCase().includes(term) ||
        course.title.toLowerCase().includes(term)
      );
      console.log(`Search: "${searchTerm}", Filtered from ${beforeSearch} to ${filtered.length} courses`);
    }
    
    // Remove duplicates based on course code
    const uniqueCourses = filtered.filter((course, index, self) => 
      index === self.findIndex(c => c.code === course.code)
    );
    
    if (uniqueCourses.length !== filtered.length) {
      console.log(`Removed ${filtered.length - uniqueCourses.length} duplicate courses`);
    }
    
    console.log(`Final result: ${uniqueCourses.length} courses`);
    return uniqueCourses;
  }, [availableCourses, searchTerm, selectedFilter, categorizeCourse, forceUpdate]);

  // Handle filter change
  const handleFilterChange = (newFilter: string) => {
    console.log(`\n=== FILTER CHANGE ===`);
    console.log(`Changing filter from "${selectedFilter}" to "${newFilter}"`);
    
    // Debug: Show sample courses for the new filter
    if (newFilter !== 'all' && availableCourses.length > 0) {
      const sampleCourses = availableCourses
        .filter(course => categorizeCourse(course) === newFilter)
        .slice(0, 5);
      console.log(`Sample courses for filter "${newFilter}":`, sampleCourses.map(c => `${c.code}: ${categorizeCourse(c)}`));
    }
    
    setSelectedFilter(newFilter);
    setForceUpdate(prev => prev + 1); // Force re-render
    console.log(`======================\n`);
  };

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
      p={isMobile ? "sm" : "md"}
      withBorder
      style={{
        height: '100%',
        overflow: 'auto',
        maxHeight: isMobile ? '350px' : isTablet ? '500px' : '600px',
        backgroundColor: '#f8f9fa'
      }}
    >
      <Stack gap={isMobile ? "sm" : "md"} style={{ height: '100%' }}>
        
        {/* Search Row */}
        <Group gap="sm" wrap={isMobile ? "wrap" : "nowrap"}>
          <TextInput
            placeholder={isMobile ? "Search courses..." : "Search courses by code or title..."}
            leftSection={<IconSearch size={16} />}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
            size="sm"
            style={{ flex: 1, minWidth: isMobile ? '100%' : '200px' }}
          />
          <Group gap="xs" wrap="nowrap">
            <Badge variant="light" color="blue" size={isMobile ? "xs" : "sm"}>
              {filteredCourses.length} courses
            </Badge>
            <ActionIcon
              variant="light"
              color="gray"
              size={isMobile ? "md" : "lg"}
              onClick={() => setShowFilters(!showFilters)}
              style={{ cursor: 'pointer' }}
            >
              <IconFilter size={isMobile ? 16 : 18} />
            </ActionIcon>
          </Group>
        </Group>

        {/* Filter Badges (collapsible) */}
        {showFilters && (
          <Group gap="xs" wrap="wrap">
            <Badge
              variant={selectedFilter === 'all' ? 'filled' : 'light'}
              color="blue"
              size={isMobile ? "xs" : "sm"}
              style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              onClick={() => handleFilterChange('all')}
            >
              All
            </Badge>
            <Badge
              variant={selectedFilter === 'foundation' ? 'filled' : 'light'}
              color="green"
              size={isMobile ? "xs" : "sm"}
              style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              onClick={() => handleFilterChange('foundation')}
            >
              Foundation
            </Badge>
            <Badge
              variant={selectedFilter === 'flmbe' ? 'filled' : 'light'}
              color="orange"
              size={isMobile ? "xs" : "sm"}
              style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              onClick={() => handleFilterChange('flmbe')}
            >
              FLMBE
            </Badge>
            {Object.keys(concentrationCourseSets).map((concentration) => (
              <Badge
                key={concentration}
                variant={selectedFilter === concentration ? 'filled' : 'light'}
                color="purple"
                size={isMobile ? "xs" : "sm"}
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleFilterChange(concentration)}
              >
                {isMobile ? concentration.slice(0, 8) + (concentration.length > 8 ? '...' : '') : getConcentrationDisplayName(concentration)}
              </Badge>
            ))}
            <Badge
              variant={selectedFilter === 'other' ? 'filled' : 'light'}
              color="gray"
              size={isMobile ? "xs" : "sm"}
              style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              onClick={() => handleFilterChange('other')}
            >
              Other
            </Badge>
          </Group>
        )}
        
        <Divider />
        
        {/* Course List */}
        <ScrollArea style={{ flex: 1 }} scrollbars="x">
          <Group gap={isMobile ? "sm" : "md"} wrap={isMobile ? "wrap" : "nowrap"} style={{ minWidth: isMobile ? 'auto' : 'fit-content' }}>
            {filteredCourses.length === 0 ? (
              <Text size="sm" c="dimmed" ta="center" p={isMobile ? "md" : "xl"} style={{ width: '100%' }}>
                No courses found matching your criteria
              </Text>
            ) : (
              filteredCourses.map((course, index) => (
                <div key={`${course.code}-${index}-${course.title?.slice(0, 10) || ''}`} style={{ minWidth: isMobile ? '100%' : '250px' }}>
                  <CourseCard
                    course={course}
                    isDraggable={true}
                    showDetails={!isMobile}
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
