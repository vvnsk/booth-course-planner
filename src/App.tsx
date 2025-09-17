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
  Collapse,
  Text,
  Anchor,
  Center
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
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

// Test utilities (for development)
import './utils/evaluationTestUtils';

// Main App component that uses the context
const AppContent: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const {
    quarters,
    foundationRequirements,
    flmbeRequirements,
    allSelectedCourses,
    isLoading,
    addCourseToQuarter,
    removeCourseFromQuarter,
    deleteQuarter,
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
    <AppShell padding={isMobile ? "xs" : "md"}>
      <Container size="100%" p={0}>
        <Stack gap={isMobile ? "md" : "lg"}>
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
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper p={isMobile ? "sm" : "md"} withBorder style={{ backgroundColor: '#f8f9fa' }}>
                <Title order={3} mb="md">Quarterly Schedule</Title>
                <ScrollArea>
                  <Stack gap="md">
                    {quarters.map((quarter) => (
                      <QuarterColumn
                        key={quarter.id}
                        quarter={quarter}
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
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="md">
                <DegreeRequirementsPanel />
                
                <FLMBEPanel />
                
                <ConcentrationsPanel />
              </Stack>
            </Grid.Col>
          </Grid>

          {/* Footer */}
          <Paper p="md" withBorder style={{ backgroundColor: '#f8f9fa', marginTop: 'auto' }}>
            <Center>
              <Stack gap="xs" align="center">
                <Text size="sm" c="dimmed">
                  © {new Date().getFullYear()}{' '}
                  <Anchor 
                    href="https://vinnakota.me/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    c="blue"
                    td="none"
                    style={{ fontWeight: 500 }}
                  >
                    Sai Krishna Vinnakota
                  </Anchor>
                  . All rights reserved.
                </Text>
                <Text size="xs" c="dimmed">
                  Notice data inconsistencies or bugs? Report them at{' '}
                  <Anchor 
                    href="https://github.com/vvnsk/booth-course-planner/issues" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    c="blue"
                    td="none"
                  >
                    https://github.com/vvnsk/booth-course-planner/issues
                  </Anchor>
                </Text>
              </Stack>
            </Center>
          </Paper>
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
