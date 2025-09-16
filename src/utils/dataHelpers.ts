import type { Course, FoundationRequirement, FLMBEArea, Concentration, ConcentrationRequirement, Quarter } from '../types/index';

export const initializeFoundationRequirements = (): FoundationRequirement[] => {
  return [
    {
      area: 'Financial Accounting',
      basicCourses: ['BUSN 30000'],
      approvedSubstitutes: ['BUSN 30116', 'BUSN 30120', 'BUSN 30122', 'BUSN 30130', 'BUSN 30131'],
      completed: false
    },
    {
      area: 'Microeconomics',
      basicCourses: ['BUSN 33001', 'BUSN 33002', 'BUSN 33101'],
      approvedSubstitutes: ['BUSN 33230', 'ECON 30100', 'ECON 30200'],
      completed: false
    },
    {
      area: 'Statistics',
      basicCourses: ['BUSN 41000', 'BUSN 41100'],
      approvedSubstitutes: [
        'BUSN 41202', 'BUSN 41203', 'BUSN 41204', 'BUSN 41206', 'BUSN 41207',
        'BUSN 41215', 'BUSN 41201', 'BUSN 41301', 'BUSN 41305', 'BUSN 41813',
        'BUSN 41814', 'BUSN 41901', 'BUSN 41902', 'BUSN 41903', 'BUSN 41910', 'BUSN 41916'
      ],
      completed: false
    }
  ];
};

export const initializeFLMBERequirements = (): FLMBEArea[] => {
  return [
    // Functions
    {
      group: 'Functions',
      line: 'Finance',
      basicCourses: ['BUSN 35000', 'BUSN 35001', 'BUSN 35200'],
      approvedSubstitutes: [
        'BUSN 34101', 'BUSN 34901', 'BUSN 34902', 'BUSN 34903', 'BUSN 34904',
        'BUSN 35100', 'BUSN 35120', 'BUSN 35130', 'BUSN 35150',
        'BUSN 35201', 'BUSN 35210', 'BUSN 35214'
      ],
      completed: false
    },
    {
      group: 'Functions',
      line: 'Marketing',
      basicCourses: ['BUSN 37000', 'BUSN 37110'],
      approvedSubstitutes: [
        'BUSN 37101', 'BUSN 37103', 'BUSN 37105', 'BUSN 37106', 'BUSN 37107',
        'BUSN 37200', 'BUSN 37201', 'BUSN 37202', 'BUSN 37208', 'BUSN 37209',
        'BUSN 37301', 'BUSN 37304', 'BUSN 37703', 'BUSN 37704'
      ],
      completed: false
    },
    {
      group: 'Functions',
      line: 'Operations',
      basicCourses: ['BUSN 40000'],
      approvedSubstitutes: ['BUSN 40101', 'BUSN 40108', 'BUSN 40110'],
      completed: false
    },
    {
      group: 'Functions',
      line: 'Strategy',
      basicCourses: ['BUSN 42001'],
      approvedSubstitutes: ['BUSN 39001', 'BUSN 39101', 'BUSN 42116', 'BUSN 42135', 'BUSN 42715'],
      completed: false
    },
    // Leadership & Management
    {
      group: 'Leadership & Management',
      line: 'Decisions',
      basicCourses: ['BUSN 30005', 'BUSN 30001', 'BUSN 36106', 'BUSN 38002', 'BUSN 38120'],
      approvedSubstitutes: ['BUSN 36109'],
      completed: false
    },
    {
      group: 'Leadership & Management',
      line: 'People',
      basicCourses: ['BUSN 33032', 'BUSN 38001', 'BUSN 38003', 'BUSN 39002'],
      approvedSubstitutes: ['BUSN 31403', 'BUSN 38122'],
      completed: false
    },
    // Business Environment
    {
      group: 'Business Environment',
      line: 'Economy',
      basicCourses: ['BUSN 33050', 'BUSN 33040', 'BUSN 33112'],
      approvedSubstitutes: ['BUSN 33401', 'BUSN 33403', 'BUSN 33501', 'BUSN 33502', 'BUSN 33503', 'BUSN 33520'],
      completed: false
    },
    {
      group: 'Business Environment',
      line: 'Society',
      basicCourses: ['BUSN 33305', 'BUSN 33471', 'BUSN 37212', 'BUSN 38119'],
      approvedSubstitutes: [
        'BUSN 30133', 'BUSN 33251', 'BUSN 34113', 'BUSN 34117',
        'BUSN 38115', 'BUSN 38126', 'BUSN 42201'
      ],
      completed: false
    }
  ];
};

export const initializeConcentrations = (): Concentration[] => {
  return [
    {
      name: 'Finance',
      totalUnitsRequired: 400,
      totalUnitsCompleted: 0,
      isCompleted: false,
      requirements: [
        {
          type: 'bucket',
          name: 'Asset Pricing',
          minUnits: 100,
          eligibleCourses: ['BUSN 34901', 'BUSN 34902', 'BUSN 35000', 'BUSN 35100', 'BUSN 35120', 'BUSN 35130'],
          completedCourses: [],
          unitsCompleted: 0
        },
        {
          type: 'bucket',
          name: 'Corporate Finance',
          minUnits: 100,
          eligibleCourses: ['BUSN 34101', 'BUSN 34903', 'BUSN 35200', 'BUSN 35201', 'BUSN 35210', 'BUSN 35213'],
          completedCourses: [],
          unitsCompleted: 0
        },
        {
          type: 'elective_bucket',
          name: 'Finance Electives',
          minUnits: 200,
          eligibleCourses: ['BUSN 30130', 'BUSN 30131', 'BUSN 35118', 'BUSN 35126', 'BUSN 35136', 'BUSN 35150'],
          completedCourses: [],
          unitsCompleted: 0
        }
      ]
    },
    {
      name: 'Marketing Management',
      totalUnitsRequired: 400,
      totalUnitsCompleted: 0,
      isCompleted: false,
      requirements: [
        {
          type: 'core',
          name: 'Marketing Core',
          minUnits: 100,
          eligibleCourses: ['BUSN 37000', 'BUSN 37110'],
          completedCourses: [],
          unitsCompleted: 0
        },
        {
          type: 'elective_bucket',
          name: 'Marketing Electives',
          minUnits: 300,
          eligibleCourses: ['BUSN 37101', 'BUSN 37103', 'BUSN 37105', 'BUSN 37200', 'BUSN 37201', 'BUSN 37301'],
          completedCourses: [],
          unitsCompleted: 0
        }
      ]
    },
    {
      name: 'Business Analytics',
      totalUnitsRequired: 500,
      totalUnitsCompleted: 0,
      isCompleted: false,
      requirements: [
        {
          type: 'bucket',
          name: 'Data Science',
          minUnits: 100,
          eligibleCourses: ['BUSN 41201', 'BUSN 41204'],
          completedCourses: [],
          unitsCompleted: 0
        },
        {
          type: 'bucket',
          name: 'Decision Models',
          minUnits: 100,
          eligibleCourses: ['BUSN 36106', 'BUSN 36109'],
          completedCourses: [],
          unitsCompleted: 0
        },
        {
          type: 'elective_bucket',
          name: 'Analytics Electives',
          minUnits: 300,
          eligibleCourses: ['BUSN 32100', 'BUSN 32120', 'BUSN 35126', 'BUSN 37103', 'BUSN 40108'],
          completedCourses: [],
          unitsCompleted: 0
        }
      ]
    },
    {
      name: 'Strategic Management',
      totalUnitsRequired: 400,
      totalUnitsCompleted: 0,
      isCompleted: false,
      requirements: [
        {
          type: 'elective_bucket',
          name: 'Strategy Electives',
          minUnits: 400,
          eligibleCourses: ['BUSN 32200', 'BUSN 39001', 'BUSN 42001', 'BUSN 42116', 'BUSN 42135', 'BUSN 42715'],
          completedCourses: [],
          unitsCompleted: 0
        }
      ]
    }
  ];
};

export const updateFoundationProgress = (
  requirements: FoundationRequirement[],
  allCourses: Course[]
): FoundationRequirement[] => {
  return requirements.map(req => {
    const eligibleCourses = [...req.basicCourses, ...req.approvedSubstitutes];
    const hasCompletedCourse = allCourses.some(course => 
      eligibleCourses.includes(course.code)
    );
    
    return {
      ...req,
      completed: hasCompletedCourse,
      selectedCourse: hasCompletedCourse 
        ? allCourses.find(course => eligibleCourses.includes(course.code))?.code
        : req.selectedCourse
    };
  });
};

export const updateFLMBEProgress = (
  requirements: FLMBEArea[],
  allCourses: Course[]
): FLMBEArea[] => {
  return requirements.map(req => {
    const eligibleCourses = [...req.basicCourses, ...req.approvedSubstitutes];
    const hasCompletedCourse = allCourses.some(course => 
      eligibleCourses.includes(course.code)
    );
    
    return {
      ...req,
      completed: hasCompletedCourse,
      selectedCourse: hasCompletedCourse 
        ? allCourses.find(course => eligibleCourses.includes(course.code))?.code
        : req.selectedCourse
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

export const createDefaultQuarters = (): Quarter[] => {
  const currentYear = new Date().getFullYear();
  const quarters: Quarter[] = [];
  
  // Create 8 quarters (2 years)
  for (let year = 0; year < 2; year++) {
    const seasons: Array<'Autumn' | 'Winter' | 'Spring' | 'Summer'> = ['Autumn', 'Winter', 'Spring', 'Summer'];
    seasons.forEach((season, index) => {
      quarters.push({
        id: `${currentYear + year}-${season}`,
        name: `${season} ${currentYear + year}`,
        year: currentYear + year,
        season,
        courses: []
      });
    });
  }
  
  return quarters;
};
