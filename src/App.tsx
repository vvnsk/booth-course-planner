import React, { useState, useEffect, useMemo } from 'react';
import { 
  AppShell, 
  Container, 
  Title, 
  ScrollArea, 
  Grid, 
  Stack,
  Paper
} from '@mantine/core';
import './App.css';

// Components
import { QuarterColumn } from './components/QuarterColumn';
import { CourseSearch } from './components/CourseSearch';
import { DegreeRequirementsPanel } from './components/DegreeRequirementsPanel';
import { FLMBEPanel } from './components/FLMBEPanel';
import { ConcentrationsPanel } from './components/ConcentrationsPanel';
import { Navbar } from './components/Navbar';

// Types
import type { Course, Quarter, FoundationRequirement, FLMBEArea, Concentration } from './types';

// Utilities
import { parseBoothCourses } from './utils/courseParser';
import {
  initializeFoundationRequirements,
  initializeFLMBERequirements,
  initializeConcentrations,
  createDefaultQuarters,
  updateFoundationProgress,
  updateFLMBEProgress,
  updateConcentrationProgress,
  getAllCoursesFromQuarters
} from './utils/dataHelpers';

function App() {
  // State
  const [quarters, setQuarters] = useState<Quarter[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [foundationRequirements, setFoundationRequirements] = useState<FoundationRequirement[]>([]);
  const [flmbeRequirements, setFlmbeRequirements] = useState<FLMBEArea[]>([]);
  const [concentrations, setConcentrations] = useState<Concentration[]>([]);
  const [selectedConcentrations, setSelectedConcentrations] = useState<string[]>([]);

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      const courses = await parseBoothCourses();
      const defaultQuarters = createDefaultQuarters();
      
      setAvailableCourses(courses);
      setQuarters(defaultQuarters);
      setFoundationRequirements(initializeFoundationRequirements());
      setFlmbeRequirements(initializeFLMBERequirements());
      setConcentrations(initializeConcentrations());
    };
    
    loadData();
  }, []);

  // Update progress when quarters change
  const allSelectedCourses = useMemo(() => getAllCoursesFromQuarters(quarters), [quarters]);

  useEffect(() => {
    setFoundationRequirements(prev => updateFoundationProgress(prev, allSelectedCourses));
    setFlmbeRequirements(prev => updateFLMBEProgress(prev, allSelectedCourses));
    setConcentrations(prev => updateConcentrationProgress(prev, allSelectedCourses));
  }, [allSelectedCourses]);

  // Handlers
  const handleAddCourseToQuarter = (quarterId: string, course: Course) => {
    setQuarters(prev => prev.map(quarter => 
      quarter.id === quarterId 
        ? { ...quarter, courses: [...quarter.courses, course] }
        : quarter
    ));
  };

  const handleRemoveCourseFromQuarter = (quarterId: string, courseCode: string) => {
    setQuarters(prev => prev.map(quarter => 
      quarter.id === quarterId 
        ? { ...quarter, courses: quarter.courses.filter(c => c.code !== courseCode) }
        : quarter
    ));
  };

  const handleFoundationCourseSelect = (area: string, courseCode: string) => {
    const course = availableCourses.find(c => c.code === courseCode);
    if (course) {
      setFoundationRequirements(prev => prev.map(req => 
        req.area === area 
          ? { ...req, selectedCourse: courseCode, completed: true }
          : req
      ));
    }
  };

  const handleFLMBECourseSelect = (line: string, courseCode: string) => {
    const course = availableCourses.find(c => c.code === courseCode);
    if (course) {
      setFlmbeRequirements(prev => prev.map(req => 
        req.line === line 
          ? { ...req, selectedCourse: courseCode, completed: true }
          : req
      ));
    }
  };

  const handleToggleConcentration = (name: string) => {
    setSelectedConcentrations(prev => 
      prev.includes(name) 
        ? prev.filter(c => c !== name)
        : [...prev, name]
    );
  };

  const handleConcentrationCourseAdd = (concentrationName: string, requirementName: string, courseCode: string) => {
    const course = availableCourses.find(c => c.code === courseCode);
    if (course) {
      setConcentrations(prev => prev.map(conc => 
        conc.name === concentrationName 
          ? {
              ...conc,
              requirements: conc.requirements.map(req => 
                (req.name || req.type) === requirementName
                  ? {
                      ...req,
                      completedCourses: [...req.completedCourses, courseCode],
                      unitsCompleted: req.unitsCompleted + 100
                    }
                  : req
              )
            }
          : conc
      ));
    }
  };

  return (
    <AppShell padding="md">
      <Container size="100%" p={0}>
        <Stack gap="lg">
          {/* Navbar */}
          <Navbar
            totalUnits={allSelectedCourses.length * 100}
            foundationCompleted={foundationRequirements.filter(r => r.completed).length}
            flmbeCompleted={flmbeRequirements.filter(r => r.completed).length}
          />

          {/* Course Catalog - Top Section */}
          <CourseSearch
            availableCourses={availableCourses}
            onAddCourse={(course) => {
              // Add to first available quarter or create logic for quarter selection
              const firstQuarter = quarters[0];
              if (firstQuarter) {
                handleAddCourseToQuarter(firstQuarter.id, course);
              }
            }}
          />

          <Grid>
            {/* Left Column - Quarters */}
            <Grid.Col span={6}>
              <Paper p="md" withBorder style={{ backgroundColor: '#f8f9fa' }}>
                <Title order={3} mb="md">Quarterly Schedule</Title>
                <ScrollArea>
                  <Stack gap="md">
                    {quarters.slice(0, 8).map((quarter) => (
                      <QuarterColumn
                        key={quarter.id}
                        quarter={quarter}
                        onAddCourse={(course) => handleAddCourseToQuarter(quarter.id, course)}
                        onRemoveCourse={(courseCode) => handleRemoveCourseFromQuarter(quarter.id, courseCode)}
                        onDropCourse={(course) => handleAddCourseToQuarter(quarter.id, course)}
                      />
                    ))}
                  </Stack>
                </ScrollArea>
              </Paper>
            </Grid.Col>

            {/* Right Column - Requirements */}
            <Grid.Col span={6}>
              <Stack gap="md">
                <DegreeRequirementsPanel
                  foundationRequirements={foundationRequirements}
                  onCourseSelect={handleFoundationCourseSelect}
                />
                
                <FLMBEPanel
                  flmbeRequirements={flmbeRequirements}
                  onCourseSelect={handleFLMBECourseSelect}
                />
                
                <ConcentrationsPanel
                  concentrations={concentrations}
                  selectedConcentrations={selectedConcentrations}
                  onToggleConcentration={handleToggleConcentration}
                  onCourseAdd={handleConcentrationCourseAdd}
                />
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </AppShell>
  );
}

export default App;
