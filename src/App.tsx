import React, { useState } from 'react';
import { 
  AppShell, 
  Container, 
  Title, 
  ScrollArea, 
  Grid, 
  Stack,
  Paper,
  LoadingOverlay,
  Collapse
} from '@mantine/core';
import './App.css';

// Context
import { PlannerProvider, usePlanner } from './contexts/PlannerContext';

// Components
import { QuarterColumn } from './components/QuarterColumn';
import { QuarterConfig } from './components/QuarterConfig';
import { CourseSearch } from './components/CourseSearch';
import { DegreeRequirementsPanel } from './components/DegreeRequirementsPanel';
import { FLMBEPanel } from './components/FLMBEPanel';
import { ConcentrationsPanel } from './components/ConcentrationsPanel';
import { Navbar } from './components/Navbar';

// Main App component that uses the context
const AppContent: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    quarters,
    foundationRequirements,
    flmbeRequirements,
    concentrations,
    selectedConcentrations,
    allSelectedCourses,
    isLoading,
    addCourseToQuarter,
    removeCourseFromQuarter,
    deleteQuarter,
    selectFoundationCourse,
    selectFLMBECourse,
    toggleConcentration,
    addConcentrationCourse,
    exportSchedule,
    importSchedule
  } = usePlanner();

  if (isLoading) {
    return (
      <AppShell padding="md">
        <Container size="100%" p={0}>
          <LoadingOverlay visible={true} />
        </Container>
      </AppShell>
    );
  }

  return (
    <AppShell padding="md">
      <Container size="100%" p={0}>
        <Stack gap="lg">
          {/* Navbar */}
          <Navbar
            totalUnits={allSelectedCourses.length * 100}
            foundationCompleted={foundationRequirements.filter(r => r.completed).length}
            flmbeCompleted={flmbeRequirements.filter(r => r.completed).length}
            onSettingsClick={() => setShowSettings(!showSettings)}
            showSettings={showSettings}
            onExportSchedule={exportSchedule}
            onImportSchedule={importSchedule}
          />

          {/* Quarter Configuration - Collapsible */}
          <Collapse in={showSettings}>
            <QuarterConfig />
          </Collapse>

          {/* Course Catalog - Top Section */}
          <CourseSearch />

          <Grid>
            {/* Left Column - Quarters */}
            <Grid.Col span={6}>
              <Paper p="md" withBorder style={{ backgroundColor: '#f8f9fa' }}>
                <Title order={3} mb="md">Quarterly Schedule</Title>
                <ScrollArea>
                  <Stack gap="md">
                    {quarters.map((quarter) => (
                      <QuarterColumn
                        key={quarter.id}
                        quarter={quarter}
                        onAddCourse={(course) => addCourseToQuarter(quarter.id, course)}
                        onRemoveCourse={(courseCode) => removeCourseFromQuarter(quarter.id, courseCode)}
                        onDropCourse={(course) => addCourseToQuarter(quarter.id, course)}
                        onDeleteQuarter={deleteQuarter}
                      />
                    ))}
                  </Stack>
                </ScrollArea>
              </Paper>
            </Grid.Col>

            {/* Right Column - Requirements */}
            <Grid.Col span={6}>
              <Stack gap="md">
                <DegreeRequirementsPanel />
                
                <FLMBEPanel />
                
                <ConcentrationsPanel />
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </AppShell>
  );
};

function App() {
  return (
    <PlannerProvider>
      <AppContent />
    </PlannerProvider>
  );
}

export default App;
