import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Text, 
  Badge, 
  Group, 
  ActionIcon, 
  Stack, 
  Modal, 
  Title, 
  Divider, 
  Table, 
  ScrollArea,
  Loader,
  Alert
} from '@mantine/core';
import { IconTrash, IconGripVertical, IconPlus, IconInfoCircle, IconAlertCircle } from '@tabler/icons-react';
import { useMediaQuery, useDisclosure } from '@mantine/hooks';
import type { CourseCardProps, CourseEvaluationSummary } from '../types/index';
import { loadCourseEvaluations, getCourseEvaluationSummary } from '../utils/evaluationHelpers';

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

// Helper function to get color for ratings
const getRatingColor = (rating: number): string => {
  if (rating >= 4.5) return 'green';
  if (rating >= 4.0) return 'teal';
  if (rating >= 3.5) return 'blue';
  if (rating >= 3.0) return 'yellow';
  return 'red';
};

// Helper function to format rating display
const formatRating = (rating: number): string => {
  return rating > 0 ? rating.toFixed(1) : 'N/A';
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
  const [evaluationData, setEvaluationData] = useState<CourseEvaluationSummary | null>(null);
  const [isLoadingEvaluations, setIsLoadingEvaluations] = useState(false);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Load evaluation data when modal is opened
  useEffect(() => {
    if (opened && !evaluationData && !isLoadingEvaluations) {
      loadEvaluationData();
    }
  }, [opened]);

  const loadEvaluationData = async () => {
    setIsLoadingEvaluations(true);
    setEvaluationError(null);
    
    try {
      const evaluations = await loadCourseEvaluations();
      const summary = getCourseEvaluationSummary(course.code, evaluations);
      setEvaluationData(summary);
    } catch (error) {
      console.error('Failed to load evaluation data:', error);
      setEvaluationError('Failed to load course evaluation data');
    } finally {
      setIsLoadingEvaluations(false);
    }
  };

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
        size="calc(90vw)"
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
            position: 'relative',
            maxWidth: '1400px'
          }
        }}
      >
        <Stack gap="md">
          <div>
            <Group justify="space-between" align="flex-start" mb="xs">
              <div style={{ flex: 1 }}>
                <Title order={4} size="h5" c="blue" mb="xs">
                  {course.title}
                </Title>
                {course.units && (
                  <Group gap="xs" mb="xs">
                    <Text size="sm" fw={500}>Units:</Text>
                    <Badge variant="light" color="gray">
                      {course.units}
                    </Badge>
                  </Group>
                )}
              </div>
              <Group gap="md" align="flex-start">
                {course.quartersOffered && course.quartersOffered.length > 0 && (
                  <div>
                    <Text size="sm" fw={500} mb={4}>Quarters Offered:</Text>
                    <Group gap="xs">
                      {getQuarterBadges(course.quartersOffered).map((quarter, index) => (
                        <Badge key={index} color={getQuarterColor(quarter)} size="sm">
                          {quarter}
                        </Badge>
                      ))}
                    </Group>
                    <Text size="xs" c="dimmed" mt={4}>
                      Based on historical data: {course.quartersOffered.join(', ')}
                    </Text>
                  </div>
                )}
              </Group>
            </Group>
          </div>
          
          <Divider />
          
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

          {/* Course Evaluation Section */}
          <div>
            <Title order={5} mb="md">Course Evaluations</Title>
            
            {isLoadingEvaluations && (
              <Group>
                <Loader size="sm" />
                <Text size="sm" c="dimmed">Loading evaluation data...</Text>
              </Group>
            )}
            
            {evaluationError && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
                {evaluationError}
              </Alert>
            )}
            
            {evaluationData && !isLoadingEvaluations && (
              <>
                {evaluationData.professors.length > 0 ? (
                  <>
                    {/* Aggregate Ratings Summary */}
                    <div style={{ marginBottom: '1rem' }}>
                      <Text fw={500} mb="xs">Overall Course Ratings:</Text>
                      <Group gap="md">
                        <Badge color={getRatingColor(evaluationData.aggregateRatings.overall)} variant="filled">
                          Overall: {formatRating(evaluationData.aggregateRatings.overall)}
                        </Badge>
                        <Badge color={getRatingColor(evaluationData.aggregateRatings.recommendation)} variant="filled">
                          Recommend: {formatRating(evaluationData.aggregateRatings.recommendation)}
                        </Badge>
                        <Badge color="gray" variant="filled">
                          Hours/Week: {formatRating(evaluationData.aggregateRatings.hoursPerWeek)}
                        </Badge>
                      </Group>
                    </div>

                    {/* Professor Evaluations Table */}
                    <ScrollArea>
                      <Table striped highlightOnHover withTableBorder>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Professor</Table.Th>
                            <Table.Th>Schedule</Table.Th>
                            <Table.Th>Quarter</Table.Th>
                            <Table.Th>Overall</Table.Th>
                            <Table.Th>Recommend</Table.Th>
                            <Table.Th>Clarity</Table.Th>
                            <Table.Th>Interest</Table.Th>
                            <Table.Th>Useful</Table.Th>
                            <Table.Th>Hrs/Week</Table.Th>
                            <Table.Th>Response Rate</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {evaluationData.professors
                            .sort((a, b) => {
                              // Sort by quarter (latest first)
                              const parseQuarter = (quarter: string) => {
                                const [season, year] = quarter.split(' ');
                                const seasonOrder = { 'Spring': 3, 'Winter': 2, 'Autumn': 1, 'Summer': 4 };
                                return parseInt(year) * 10 + (seasonOrder[season as keyof typeof seasonOrder] || 0);
                              };
                              return parseQuarter(b.quarter) - parseQuarter(a.quarter);
                            })
                            .map((professor, index) => (
                            <Table.Tr key={index}>
                              <Table.Td>
                                <Text size="sm" fw={500}>
                                  {professor.fullName}
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <Badge size="sm" variant="light">
                                  {professor.schedule}
                                </Badge>
                              </Table.Td>
                              <Table.Td>
                                <Text size="sm">
                                  {professor.quarter}
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <Badge 
                                  size="sm" 
                                  color={getRatingColor(professor.ratings.overall)}
                                  variant="filled"
                                >
                                  {formatRating(professor.ratings.overall)}
                                </Badge>
                              </Table.Td>
                              <Table.Td>
                                <Badge 
                                  size="sm" 
                                  color={getRatingColor(professor.ratings.recommendation)}
                                  variant="filled"
                                >
                                  {formatRating(professor.ratings.recommendation)}
                                </Badge>
                              </Table.Td>
                              <Table.Td>
                                <Text size="sm">
                                  {formatRating(professor.ratings.clarity)}
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <Text size="sm">
                                  {formatRating(professor.ratings.interest)}
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <Text size="sm">
                                  {formatRating(professor.ratings.usefulness)}
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <Text size="sm">
                                  {formatRating(professor.ratings.hoursPerWeek)}
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <Text size="xs" c="dimmed">
                                  {professor.responseInfo.responded}/{professor.responseInfo.invited}
                                  {professor.responseInfo.responseRatio > 0 && 
                                    ` (${professor.responseInfo.responseRatio.toFixed(0)}%)`
                                  }
                                </Text>
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                      </Table>
                    </ScrollArea>

                    <Text size="xs" c="dimmed" mt="md">
                      * Ratings are on a 1-5 scale. Response rate shows students who responded out of those invited.
                    </Text>
                  </>
                ) : (
                  <Text c="dimmed" size="sm">
                    No evaluation data available for this course.
                  </Text>
                )}
              </>
            )}
          </div>
        </Stack>
      </Modal>
    </Card>
  );
};
