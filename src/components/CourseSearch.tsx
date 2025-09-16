import React, { useState, useMemo, useEffect } from 'react';
import { Paper, TextInput, Stack, ScrollArea, Group, Badge, ActionIcon, Divider, Text } from '@mantine/core';
import { IconSearch, IconPlus, IconFilter } from '@tabler/icons-react';
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
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [degreeRequirements, setDegreeRequirements] = useState<any>(null);
  const [concentrationsData, setConcentrationsData] = useState<any>(null);

  // Load data files
  useEffect(() => {
    const loadData = async () => {
      try {
        const [degreeResp, concentrationsResp] = await Promise.all([
          fetch('/data/degree_requirements.json'),
          fetch('/data/concentrations.json')
        ]);
        
        const degreeData = await degreeResp.json();
        const concentrationsDataLoaded = await concentrationsResp.json();
        
        console.log('Loaded degree requirements:', degreeData);
        console.log('Loaded concentrations:', concentrationsDataLoaded);
        
        setDegreeRequirements(degreeData);
        setConcentrationsData(concentrationsDataLoaded);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, []);
  
  // Foundation course codes (from degree requirements data)
  const foundationCourses = useMemo(() => {
    if (!degreeRequirements) return new Set();
    
    const foundationCoursesList: string[] = [];
    const newCurriculum = degreeRequirements.curricula.find((c: any) => c.name === 'New Curriculum');
    
    if (newCurriculum) {
      const foundations = newCurriculum.components.find((c: any) => c.component === 'Foundations');
      if (foundations) {
        foundations.areas.forEach((area: any) => {
          foundationCoursesList.push(...area.basic_courses);
          foundationCoursesList.push(...(area.approved_substitutes || []));
        });
      }
    }
    
    console.log('Foundation courses loaded:', foundationCoursesList.length, foundationCoursesList.slice(0, 5));
    return new Set(foundationCoursesList);
  }, [degreeRequirements]);

  // FLMBE course codes (from degree requirements data)
  const flmbeCourses = useMemo(() => {
    if (!degreeRequirements) return new Set();
    
    const flmbeCoursesList: string[] = [];
    const newCurriculum = degreeRequirements.curricula.find((c: any) => c.name === 'New Curriculum');
    
    if (newCurriculum) {
      const flmbe = newCurriculum.components.find((c: any) => c.component === 'Functions, Leadership and Management, and the Business Environment');
      if (flmbe) {
        flmbe.areas.forEach((area: any) => {
          if (area.lines) {
            area.lines.forEach((line: any) => {
              flmbeCoursesList.push(...line.basic_courses);
              flmbeCoursesList.push(...(line.approved_substitutes || []));
            });
          }
        });
      }
    }
    
    return new Set(flmbeCoursesList);
  }, [degreeRequirements]);

  // Concentration course codes by specific concentration (from concentrations data)
  const concentrationCourseSets = useMemo(() => {
    if (!concentrationsData) return {};
    
    const sets: { [key: string]: Set<string> } = {};
    
    Object.entries(concentrationsData.concentrations).forEach(([name, data]: [string, any]) => {
      const coursesList: string[] = [];
      
      if (data.requirements) {
        data.requirements.forEach((req: any) => {
          if (req.eligible_courses) {
            coursesList.push(...req.eligible_courses);
          }
        });
      }
      
      // Convert concentration names to camelCase keys
      let key = name.toLowerCase()
        .replace(/\s+/g, '')
        .replace(/&/g, 'And')
        .replace(/,/g, '');
      
      // Handle specific concentration name mappings
      if (name === 'Applied Artificial Intelligence') key = 'appliedAI';
      else if (name === 'Behavioral Science') key = 'behavioralScience';
      else if (name === 'Business Analytics') key = 'businessAnalytics';
      else if (name === 'Marketing Management') key = 'marketing';
      else if (name === 'Operations Management') key = 'operations';
      else if (name === 'Strategic Management') key = 'strategy';
      else if (name === 'Business, Society and Sustainability') key = 'sustainability';
      else if (name === 'Econometrics and Statistics') key = 'econometrics';
      else if (name === 'International Business') key = 'international';
      else if (name === 'General Management') key = 'general';
      else if (name === 'Healthcare') key = 'healthcare';
      else if (name === 'Analytic Finance') key = 'analyticFinance';
      
      sets[key] = new Set(coursesList);
    });
    
    console.log('Concentration sets loaded:', Object.keys(sets).length, Object.keys(sets));
    Object.entries(sets).forEach(([name, courseSet]) => {
      console.log(`${name}: ${courseSet.size} courses`);
    });
    
    return sets;
  }, [concentrationsData]);

  // Helper function to get display name for concentration
  const getConcentrationDisplayName = (key: string) => {
    const displayNames: { [key: string]: string } = {
      'appliedAI': 'Applied Artificial Intelligence',
      'behavioralScience': 'Behavioral Science',
      'businessAnalytics': 'Business Analytics',
      'marketing': 'Marketing Management',
      'operations': 'Operations Management',
      'strategy': 'Strategic Management',
      'sustainability': 'Business, Society & Sustainability',
      'econometrics': 'Econometrics and Statistics',
      'international': 'International Business',
      'general': 'General Management',
      'healthcare': 'Healthcare',
      'analyticFinance': 'Analytic Finance'
    };
    
    return displayNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };
  const categorizeCourse = useMemo(() => (course: Course) => {
    if (foundationCourses.has(course.code)) return 'foundation';
    if (flmbeCourses.has(course.code)) return 'flmbe';
    
    // Check each concentration
    for (const [concentration, courseSet] of Object.entries(concentrationCourseSets)) {
      if (courseSet.has(course.code)) return concentration;
    }
    
    return 'other';
  }, [foundationCourses, flmbeCourses, concentrationCourseSets]);
  
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
      
      // Debug: log the filtering results
      console.log(`Filter: ${selectedFilter}, Found ${filtered.length} courses`);
      if (filtered.length <= 10) {
        console.log('Courses:', filtered.map(c => c.code));
      }
    }
    
    return filtered; // Show all courses
  }, [availableCourses, searchTerm, selectedFilter, categorizeCourse]);
  
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
      </Stack>
    </Paper>
  );
};
