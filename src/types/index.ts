// Course and Academic Data Types
export interface CourseEvaluation {
  courseName: string;
  courseTitle: string;
  firstName: string;
  lastName: string;
  term: string;
  invitedCount: number;
  respondentCount: number;
  responseRatio: number;
  hoursPerWeek: number;
  clarityRating: number;
  interestRating: number;
  usefulnessRating: number;
  overallRating: number;
  recommendationRating: number;
}

export interface ProfessorOffering {
  firstName: string;
  lastName: string;
  fullName: string;
  schedule: string; // e.g., "85", "81", "01"
  quarter: string; // e.g., "Autumn 2020"
  ratings: {
    clarity: number;
    interest: number;
    usefulness: number;
    overall: number;
    recommendation: number;
    hoursPerWeek: number;
  };
  responseInfo: {
    invited: number;
    responded: number;
    responseRatio: number;
  };
}

export interface CourseEvaluationSummary {
  courseCode: string;
  professors: ProfessorOffering[];
  aggregateRatings: {
    clarity: number;
    interest: number;
    usefulness: number;
    overall: number;
    recommendation: number;
    hoursPerWeek: number;
  };
}

export interface Course {
  code: string;
  title: string;
  units: number;
  prerequisites?: string[];
  quartersOffered?: string[];
  description?: string;
  evaluationData?: CourseEvaluationSummary;
}

export interface Quarter {
  id: string;
  name: string;
  year: number;
  season: 'Autumn' | 'Winter' | 'Spring' | 'Summer';
  courses: Course[];
}

// Degree Requirements Types
export interface FoundationRequirement {
  area: string;
  basicCourses: string[];
  approvedSubstitutes: string[];
  completed: boolean;
  selectedCourse?: string;
}

export interface FLMBEArea {
  group: 'Functions' | 'Leadership & Management' | 'Business Environment';
  line: string;
  basicCourses: string[];
  approvedSubstitutes: string[];
  completed: boolean;
  selectedCourse?: string;
}

export interface ConcentrationRequirement {
  type: 'elective_bucket' | 'bucket' | 'core';
  name?: string;
  minUnits: number;
  maxUnits?: number;
  eligibleCourses: string[];
  completedCourses: string[];
  unitsCompleted: number;
}

export interface Concentration {
  name: string;
  requirements: ConcentrationRequirement[];
  totalUnitsRequired: number;
  totalUnitsCompleted: number;
  isCompleted: boolean;
}

// App State Types
export interface PlannerState {
  quarters: Quarter[];
  availableCourses: Course[];
  foundationRequirements: FoundationRequirement[];
  flmbeRequirements: FLMBEArea[];
  concentrations: Concentration[];
  selectedConcentrations: string[];
}

// Export/Import Types
export interface ExportablePlannerData {
  version: string;
  exportDate: string;
  quarters: Quarter[];
}

// Progress Tracking
export interface ProgressSummary {
  foundationsComplete: number;
  foundationsTotal: number;
  flmbeComplete: number;
  flmbeTotal: number;
  totalUnits: number;
  concentrationProgress: { [key: string]: number };
}

// UI Component Props
export interface CourseCardProps {
  course: Course;
  onRemove?: () => void;
  onAdd?: () => void;
  isDraggable?: boolean;
  showDetails?: boolean;
}

export interface QuarterColumnProps {
  quarter: Quarter;
  onRemoveCourse: (courseCode: string) => void;
  onDropCourse: (course: Course) => void;
  onDeleteQuarter?: (quarterId: string) => void;
}

export interface RequirementBoxProps {
  title: string;
  isCompleted: boolean;
  selectedCourse?: string;
  eligibleCourses: string[];
  onCourseSelect: (courseCode: string) => void;
}
