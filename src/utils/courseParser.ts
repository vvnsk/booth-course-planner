import type { Course } from '../types/index';

export const parseBoothCourses = async (): Promise<Course[]> => {
  try {
    const response = await fetch('/data/booth_courses_prefixed.json');
    const boothCoursesData = await response.json();
    
    return boothCoursesData.map((courseData: any) => ({
      code: courseData.Course,
      title: courseData['Course Title'],
      units: 100, // Default to 100 units as most Booth courses are 100 units
      rating: Math.random() * 2 + 3, // Random rating between 3-5 for demo
      difficulty: Math.floor(Math.random() * 3) + 2 // Random difficulty 2-4 for demo
    }));
  } catch (error) {
    console.error('Error loading course data:', error);
    // Return sample data for development
    return getSampleCourses();
  }
};

const getSampleCourses = (): Course[] => {
  return [
    { code: 'BUSN 30000', title: 'Financial Accounting', units: 100, rating: 4.2, difficulty: 3 },
    { code: 'BUSN 33001', title: 'Microeconomics', units: 100, rating: 3.8, difficulty: 4 },
    { code: 'BUSN 41000', title: 'Statistics', units: 100, rating: 3.5, difficulty: 3 },
    { code: 'BUSN 35000', title: 'Finance', units: 100, rating: 4.0, difficulty: 3 },
    { code: 'BUSN 37000', title: 'Marketing', units: 100, rating: 4.3, difficulty: 2 },
    { code: 'BUSN 40000', title: 'Operations', units: 100, rating: 3.9, difficulty: 3 },
    { code: 'BUSN 42001', title: 'Strategy', units: 100, rating: 4.1, difficulty: 4 },
    { code: 'BUSN 38001', title: 'Leadership', units: 100, rating: 4.4, difficulty: 2 },
    { code: 'BUSN 33050', title: 'Economy', units: 100, rating: 3.7, difficulty: 3 },
    { code: 'BUSN 33305', title: 'Business Ethics', units: 100, rating: 4.0, difficulty: 2 }
  ];
};
