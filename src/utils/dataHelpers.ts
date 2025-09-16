import type { Course, FoundationRequirement, FLMBEArea, Concentration, ConcentrationRequirement, Quarter, ExportablePlannerData } from '../types/index';

export const initializeFoundationRequirements = async (degreeData: any): Promise<FoundationRequirement[]> => {
  if (!degreeData) {
    throw new Error('Failed to load degree requirements data');
  }

  // Use the new curriculum (effective Autumn 2021)
  const newCurriculum = degreeData.curricula.find((c: any) => c.name === 'New Curriculum');
  const foundationsComponent = newCurriculum?.components.find((c: any) => c.component === 'Foundations');
  
  if (!foundationsComponent) {
    throw new Error('Foundations component not found in degree requirements');
  }

  return foundationsComponent.areas.map((area: any) => ({
    area: area.line,
    basicCourses: area.basic_courses,
    approvedSubstitutes: area.approved_substitutes,
    completed: false
  }));
};

export const initializeFLMBERequirements = async (degreeData: any): Promise<FLMBEArea[]> => {
  if (!degreeData) {
    throw new Error('Failed to load degree requirements data');
  }

  // Use the new curriculum (effective Autumn 2021)
  const newCurriculum = degreeData.curricula.find((c: any) => c.name === 'New Curriculum');
  const flmbeComponent = newCurriculum?.components.find((c: any) => c.short_name === 'FLMBE');
  
  if (!flmbeComponent) {
    throw new Error('FLMBE component not found in degree requirements');
  }

  const flmbeAreas: FLMBEArea[] = [];
  
  // Process each group in the FLMBE component
  flmbeComponent.areas.forEach((areaGroup: any) => {
    const groupName = areaGroup.group;
    if (areaGroup.lines) {
      areaGroup.lines.forEach((line: any) => {
        flmbeAreas.push({
          group: groupName as 'Functions' | 'Leadership & Management' | 'Business Environment',
          line: line.line,
          basicCourses: line.basic_courses,
          approvedSubstitutes: line.approved_substitutes,
          completed: false
        });
      });
    }
  });

  return flmbeAreas;
};

export const initializeConcentrations = async (concentrationsData?: any): Promise<Concentration[]> => {
  // If concentrationsData is not provided, fetch it
  if (!concentrationsData) {
    try {
      const response = await fetch('/data/concentrations.json');
      concentrationsData = await response.json();
    } catch (error) {
      console.error('Failed to load concentrations:', error);
      concentrationsData = null;
    }
  }
  
  if (!concentrationsData) {
    throw new Error('Failed to load concentrations data');
  }

  const concentrations: Concentration[] = [];
  
  // Convert JSON data to our concentration format
  for (const [name, data] of Object.entries(concentrationsData.concentrations)) {
    const concentrationData = data as any;
    
    // Skip concentrations that don't have a simple requirements structure
    if (!concentrationData.requirements || name === 'General Management' || name === 'Healthcare') {
      continue;
    }
    
    const requirements: ConcentrationRequirement[] = concentrationData.requirements.map((req: any) => ({
      type: req.type as 'elective_bucket' | 'bucket' | 'core',
      name: req.name || `${name} Requirement`,
      minUnits: req.min_units,
      maxUnits: req.max_units,
      eligibleCourses: req.eligible_courses || [],
      completedCourses: [],
      unitsCompleted: 0
    }));
    
    const totalUnitsRequired = requirements.reduce((sum, req) => sum + req.minUnits, 0);
    
    concentrations.push({
      name,
      totalUnitsRequired,
      totalUnitsCompleted: 0,
      isCompleted: false,
      requirements
    });
  }
  
  return concentrations;
};

export const updateFoundationProgress = (
  requirements: FoundationRequirement[],
  allCourses: Course[]
): FoundationRequirement[] => {
  return requirements.map(req => {
    const eligibleCourses = [...req.basicCourses, ...req.approvedSubstitutes];
    const completedCourse = allCourses.find(course => 
      eligibleCourses.includes(course.code)
    );
    
    return {
      ...req,
      completed: !!completedCourse,
      selectedCourse: completedCourse?.code || undefined
    };
  });
};

export const updateFLMBEProgress = (
  requirements: FLMBEArea[],
  allCourses: Course[]
): FLMBEArea[] => {
  return requirements.map(req => {
    const eligibleCourses = [...req.basicCourses, ...req.approvedSubstitutes];
    const completedCourse = allCourses.find(course => 
      eligibleCourses.includes(course.code)
    );
    
    return {
      ...req,
      completed: !!completedCourse,
      selectedCourse: completedCourse?.code || undefined
    };
  });
};

export const updateConcentrationProgress = (
  concentrations: Concentration[],
  allCourses: Course[]
): Concentration[] => {
  return concentrations.map(concentration => {
    const updatedRequirements = concentration.requirements.map(req => {
      const completedCourses = allCourses
        .filter(course => req.eligibleCourses.includes(course.code))
        .map(course => course.code);
      
      const unitsCompleted = completedCourses.length * 100; // Assuming 100 units per course
      
      return {
        ...req,
        completedCourses,
        unitsCompleted
      };
    });
    
    const totalUnitsCompleted = updatedRequirements.reduce(
      (sum, req) => sum + req.unitsCompleted, 0
    );
    
    const isCompleted = totalUnitsCompleted >= concentration.totalUnitsRequired;
    
    return {
      ...concentration,
      requirements: updatedRequirements,
      totalUnitsCompleted,
      isCompleted
    };
  });
};

export const getAllCoursesFromQuarters = (quarters: Quarter[]): Course[] => {
  return quarters.flatMap(quarter => quarter.courses);
};

export const createDefaultQuarters = (
  startYear?: number,
  startSeason?: 'Autumn' | 'Winter' | 'Spring' | 'Summer'
): Quarter[] => {
  const currentYear = startYear || new Date().getFullYear();
  const currentSeason = startSeason || 'Autumn';
  const quarters: Quarter[] = [];
  
  const seasons: Array<'Autumn' | 'Winter' | 'Spring' | 'Summer'> = ['Autumn', 'Winter', 'Spring', 'Summer'];
  const startSeasonIndex = seasons.indexOf(currentSeason);
  
  // Create 8 quarters (2 years) starting from the specified season and year
  let year = currentYear;
  let seasonIndex = startSeasonIndex;
  
  for (let i = 0; i < 8; i++) {
    const season = seasons[seasonIndex];
    quarters.push({
      id: `${year}-${season}`,
      name: `${season} ${year}`,
      year,
      season,
      courses: []
    });
    
    // Move to next season
    seasonIndex++;
    if (seasonIndex >= seasons.length) {
      seasonIndex = 0;
      year++;
    }
  }
  
  return quarters;
};

// Export/Import Functions
export const exportPlannerData = (
  quarters: Quarter[]
): ExportablePlannerData => {
  return {
    version: '1.0',
    exportDate: new Date().toISOString(),
    quarters
  };
};

export const downloadPlannerData = (data: ExportablePlannerData, filename?: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `booth-course-plan-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const validateImportedData = (data: any): data is ExportablePlannerData => {
  return (
    data &&
    typeof data.version === 'string' &&
    typeof data.exportDate === 'string' &&
    Array.isArray(data.quarters)
  );
};

export const importPlannerData = (file: File): Promise<ExportablePlannerData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        const data = JSON.parse(jsonString);
        
        if (validateImportedData(data)) {
          resolve(data);
        } else {
          reject(new Error('Invalid file format. Please select a valid Booth Course Planner export file.'));
        }
      } catch (error) {
        reject(new Error('Failed to parse JSON file. Please check the file format.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };
    
    reader.readAsText(file);
  });
};
