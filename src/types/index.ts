// Course and Academic Data Types
export interface Course {
  code: string;
  title: string;
  units: number;
  prerequisites?: string[];
  rating?: number;
  difficulty?: number;
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
  isDraggable?: boolean;
  showDetails?: boolean;
}

export interface QuarterColumnProps {
  quarter: Quarter;
  onAddCourse: (course: Course) => void;
  onRemoveCourse: (courseCode: string) => void;
  onDropCourse: (course: Course) => void;
}

export interface RequirementBoxProps {
  title: string;
  isCompleted: boolean;
  selectedCourse?: string;
  eligibleCourses: string[];
  onCourseSelect: (courseCode: string) => void;
}
