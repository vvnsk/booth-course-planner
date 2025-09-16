import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import type { Course, Quarter, FoundationRequirement, FLMBEArea, Concentration } from '../types';
import { parseBoothCourses } from '../utils/courseParser';
import {
  initializeFoundationRequirements,
  initializeFLMBERequirements,
  initializeConcentrations,
  createDefaultQuarters,
  updateFoundationProgress,
  updateFLMBEProgress,
  updateConcentrationProgress,
  getAllCoursesFromQuarters
} from '../utils/dataHelpers';

// Context types
interface PlannerContextType {
  // Data
  quarters: Quarter[];
  availableCourses: Course[];
  foundationRequirements: FoundationRequirement[];
  flmbeRequirements: FLMBEArea[];
  concentrations: Concentration[];
  selectedConcentrations: string[];
  allSelectedCourses: Course[];
  degreeRequirements: any;
  concentrationsData: any;
  
  // Loading states
  isLoading: boolean;
  dataLoaded: boolean;
  
  // Actions
  addCourseToQuarter: (quarterId: string, course: Course) => void;
  removeCourseFromQuarter: (quarterId: string, courseCode: string) => void;
  selectFoundationCourse: (area: string, courseCode: string) => void;
  selectFLMBECourse: (line: string, courseCode: string) => void;
  toggleConcentration: (name: string) => void;
  addConcentrationCourse: (concentrationName: string, requirementName: string, courseCode: string) => void;
  
  // Quarter management actions
  addQuarter: () => void;
  deleteQuarter: (quarterId: string) => void;
  resetQuarters: (startYear: number, startSeason: 'Autumn' | 'Winter' | 'Spring' | 'Summer') => void;
  
  // Course categorization helpers
  foundationCourses: Set<string>;
  flmbeCourses: Set<string>;
  concentrationCourseSets: { [key: string]: Set<string> };
  categorizeCourse: (course: Course) => string;
  getConcentrationDisplayName: (key: string) => string;
}

// Create context
const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

// Provider component
interface PlannerProviderProps {
  children: ReactNode;
}

export const PlannerProvider: React.FC<PlannerProviderProps> = ({ children }) => {
  // State
  const [quarters, setQuarters] = useState<Quarter[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [foundationRequirements, setFoundationRequirements] = useState<FoundationRequirement[]>([]);
  const [flmbeRequirements, setFlmbeRequirements] = useState<FLMBEArea[]>([]);
  const [concentrations, setConcentrations] = useState<Concentration[]>([]);
  const [selectedConcentrations, setSelectedConcentrations] = useState<string[]>([]);
  const [degreeRequirements, setDegreeRequirements] = useState<any>(null);
  const [concentrationsData, setConcentrationsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load all data in parallel
        const [courses, degreeResp, concentrationsResp] = await Promise.all([
          parseBoothCourses(),
          fetch('/data/degree_requirements.json'),
          fetch('/data/concentrations.json')
        ]);
        
        const degreeData = await degreeResp.json();
        const concentrationsDataLoaded = await concentrationsResp.json();
        
        // Remove duplicate courses based on course code
        const uniqueCourses = courses.filter((course, index, self) => 
          index === self.findIndex(c => c.code === course.code)
        );
        
        if (uniqueCourses.length !== courses.length) {
          console.log(`Removed ${courses.length - uniqueCourses.length} duplicate courses from source data`);
        }
        
        // Initialize requirements using already-loaded JSON data
        const [foundationReqs, flmbeReqs, concentrationReqs] = await Promise.all([
          initializeFoundationRequirements(degreeData),
          initializeFLMBERequirements(degreeData),
          initializeConcentrations(concentrationsDataLoaded)
        ]);
        
        // Set the data
        setAvailableCourses(uniqueCourses);
        setQuarters(createDefaultQuarters());
        setFoundationRequirements(foundationReqs);
        setFlmbeRequirements(flmbeReqs);
        setConcentrations(concentrationReqs);
        setDegreeRequirements(degreeData);
        setConcentrationsData(concentrationsDataLoaded);
        
        setDataLoaded(true);
        console.log('All data loaded successfully');
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Calculate selected courses
  const allSelectedCourses = useMemo(() => getAllCoursesFromQuarters(quarters), [quarters]);

  // Update progress when quarters change
  useEffect(() => {
    if (dataLoaded) {
      setFoundationRequirements(prev => updateFoundationProgress(prev, allSelectedCourses));
      setFlmbeRequirements(prev => updateFLMBEProgress(prev, allSelectedCourses));
      setConcentrations(prev => updateConcentrationProgress(prev, allSelectedCourses));
    }
  }, [allSelectedCourses, dataLoaded]);

  // Course categorization helpers
  const foundationCourses = useMemo(() => {
    if (!degreeRequirements) return new Set<string>();
    
    const foundationCoursesList: string[] = [];
    const newCurriculum = degreeRequirements.curricula?.find((c: any) => c.name === 'New Curriculum');
    
    if (newCurriculum) {
      const foundations = newCurriculum.components?.find((c: any) => c.component === 'Foundations');
      if (foundations) {
        foundations.areas?.forEach((area: any) => {
          foundationCoursesList.push(...(area.basic_courses || []));
          foundationCoursesList.push(...(area.approved_substitutes || []));
        });
      }
    }
    
    return new Set(foundationCoursesList);
  }, [degreeRequirements]);

  const flmbeCourses = useMemo(() => {
    if (!degreeRequirements) return new Set<string>();
    
    const flmbeCoursesList: string[] = [];
    const newCurriculum = degreeRequirements.curricula?.find((c: any) => c.name === 'New Curriculum');
    
    if (newCurriculum) {
      const flmbe = newCurriculum.components?.find((c: any) => 
        c.component === 'Functions, Leadership and Management, and the Business Environment'
      );
      if (flmbe) {
        flmbe.areas?.forEach((area: any) => {
          if (area.lines) {
            area.lines.forEach((line: any) => {
              flmbeCoursesList.push(...(line.basic_courses || []));
              flmbeCoursesList.push(...(line.approved_substitutes || []));
            });
          }
        });
      }
    }
    
    return new Set(flmbeCoursesList);
  }, [degreeRequirements]);

  const concentrationCourseSets = useMemo(() => {
    if (!concentrationsData) return {};
    
    const sets: { [key: string]: Set<string> } = {};
    
    Object.entries(concentrationsData.concentrations || {}).forEach(([name, data]: [string, any]) => {
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
      const nameMap: { [key: string]: string } = {
        'Applied Artificial Intelligence': 'appliedAI',
        'Behavioral Science': 'behavioralScience',
        'Business Analytics': 'businessAnalytics',
        'Marketing Management': 'marketing',
        'Operations Management': 'operations',
        'Strategic Management': 'strategy',
        'Business, Society and Sustainability': 'sustainability',
        'Econometrics and Statistics': 'econometrics',
        'International Business': 'international',
        'General Management': 'general',
        'Healthcare': 'healthcare',
        'Analytic Finance': 'analyticFinance'
      };
      
      key = nameMap[name] || key;
      sets[key] = new Set(coursesList);
    });
    
    return sets;
  }, [concentrationsData]);

  const getConcentrationDisplayName = (key: string): string => {
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

  const categorizeCourse = (course: Course): string => {
    if (foundationCourses.has(course.code)) return 'foundation';
    if (flmbeCourses.has(course.code)) return 'flmbe';
    
    // Check each concentration
    for (const [concentration, courseSet] of Object.entries(concentrationCourseSets)) {
      if (courseSet.has(course.code)) return concentration;
    }
    
    return 'other';
  };

  // Action handlers
  const addCourseToQuarter = (quarterId: string, course: Course) => {
    setQuarters(prev => prev.map(quarter => 
      quarter.id === quarterId 
        ? { ...quarter, courses: [...quarter.courses, course] }
        : quarter
    ));
  };

  const removeCourseFromQuarter = (quarterId: string, courseCode: string) => {
    setQuarters(prev => prev.map(quarter => 
      quarter.id === quarterId 
        ? { ...quarter, courses: quarter.courses.filter(c => c.code !== courseCode) }
        : quarter
    ));
  };

  const selectFoundationCourse = (area: string, courseCode: string) => {
    const course = availableCourses.find(c => c.code === courseCode);
    if (course) {
      setFoundationRequirements(prev => prev.map(req => 
        req.area === area 
          ? { ...req, selectedCourse: courseCode, completed: true }
          : req
      ));
    }
  };

  const selectFLMBECourse = (line: string, courseCode: string) => {
    const course = availableCourses.find(c => c.code === courseCode);
    if (course) {
      setFlmbeRequirements(prev => prev.map(req => 
        req.line === line 
          ? { ...req, selectedCourse: courseCode, completed: true }
          : req
      ));
    }
  };

  const toggleConcentration = (name: string) => {
    setSelectedConcentrations(prev => 
      prev.includes(name) 
        ? prev.filter(c => c !== name)
        : [...prev, name]
    );
  };

  const addConcentrationCourse = (concentrationName: string, requirementName: string, courseCode: string) => {
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

  // Quarter management functions
  const addQuarter = () => {
    setQuarters(prev => {
      if (prev.length === 0) return prev;
      
      const lastQuarter = prev[prev.length - 1];
      const seasons: Array<'Autumn' | 'Winter' | 'Spring' | 'Summer'> = ['Autumn', 'Winter', 'Spring', 'Summer'];
      const currentSeasonIndex = seasons.indexOf(lastQuarter.season);
      
      let nextSeason: 'Autumn' | 'Winter' | 'Spring' | 'Summer';
      let nextYear = lastQuarter.year;
      
      if (currentSeasonIndex === seasons.length - 1) {
        nextSeason = seasons[0];
        nextYear += 1;
      } else {
        nextSeason = seasons[currentSeasonIndex + 1];
      }
      
      const newQuarter: Quarter = {
        id: `${nextYear}-${nextSeason}`,
        name: `${nextSeason} ${nextYear}`,
        year: nextYear,
        season: nextSeason,
        courses: []
      };
      
      return [...prev, newQuarter];
    });
  };

  const deleteQuarter = (quarterId: string) => {
    setQuarters(prev => prev.filter(quarter => quarter.id !== quarterId));
  };

  const resetQuarters = (startYear: number, startSeason: 'Autumn' | 'Winter' | 'Spring' | 'Summer') => {
    setQuarters(createDefaultQuarters(startYear, startSeason));
  };

  const contextValue: PlannerContextType = {
    // Data
    quarters,
    availableCourses,
    foundationRequirements,
    flmbeRequirements,
    concentrations,
    selectedConcentrations,
    allSelectedCourses,
    degreeRequirements,
    concentrationsData,
    
    // Loading states
    isLoading,
    dataLoaded,
    
    // Actions
    addCourseToQuarter,
    removeCourseFromQuarter,
    selectFoundationCourse,
    selectFLMBECourse,
    toggleConcentration,
    addConcentrationCourse,
    
    // Quarter management actions
    addQuarter,
    deleteQuarter,
    resetQuarters,
    
    // Helpers
    foundationCourses,
    flmbeCourses,
    concentrationCourseSets,
    categorizeCourse,
    getConcentrationDisplayName
  };

  return (
    <PlannerContext.Provider value={contextValue}>
      {children}
    </PlannerContext.Provider>
  );
};

// Hook to use the context
export const usePlanner = (): PlannerContextType => {
  const context = useContext(PlannerContext);
  if (context === undefined) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
};
