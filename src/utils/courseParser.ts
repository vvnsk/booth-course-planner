import type { Course } from '../types/index';

// Function to parse CSV data
const parseCSV = (csvText: string): any[] => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    return obj;
  });
};

// Function to extract quarters from course evaluation data
const extractCourseQuarters = async (): Promise<Map<string, string[]>> => {
  try {
    const response = await fetch('/data/course_evaluation.csv');
    const csvText = await response.text();
    const evaluationData = parseCSV(csvText);
    
    const courseQuarters = new Map<string, Set<string>>();
    
    evaluationData.forEach(row => {
      const courseName = row['Course Name']?.toString();
      const term = row.Term;
      
      if (courseName && term) {
        // Extract course code from "Course Name" field (e.g., "33501 02" -> "33501")
        const courseCode = courseName.split(' ')[0];
        
        if (!courseQuarters.has(courseCode)) {
          courseQuarters.set(courseCode, new Set());
        }
        
        // Parse term to extract season and year
        const termParts = term.split(' ');
        if (termParts.length === 2) {
          const [season, year] = termParts;
          courseQuarters.get(courseCode)?.add(`${season} ${year}`);
        }
      }
    });
    
    // Convert Sets to sorted arrays
    const result = new Map<string, string[]>();
    courseQuarters.forEach((quarters, course) => {
      result.set(course, Array.from(quarters).sort());
    });
    
    return result;
  } catch (error) {
    console.error('Error loading course evaluation data:', error);
    return new Map();
  }
};

export const parseBoothCourses = async (): Promise<Course[]> => {
  try {
    const [coursesResponse, quartersMap] = await Promise.all([
      fetch('/data/booth_courses_prefixed.json'),
      extractCourseQuarters()
    ]);
    
    const boothCoursesData = await coursesResponse.json();
    
    return boothCoursesData.map((courseData: any) => {
      const courseCode = courseData.Course;
      // Extract just the numeric part for matching with evaluation data
      const numericCode = courseCode.replace('BUSN ', '');
      const quartersOffered = quartersMap.get(numericCode) || [];
      
      return {
        code: courseCode,
        title: courseData['Course Title'],
        units: 100, // Default to 100 units as most Booth courses are 100 units
        quartersOffered
      };
    });
  } catch (error) {
    console.error('Error loading course data:', error);
    // Return sample data for development
    return getSampleCourses();
  }
};

const getSampleCourses = (): Course[] => {
  return [
    { code: 'BUSN 30000', title: 'Financial Accounting', units: 100, quartersOffered: ['Autumn 2020', 'Autumn 2021', 'Autumn 2022'] },
    { code: 'BUSN 33001', title: 'Microeconomics', units: 100, quartersOffered: ['Autumn 2020', 'Autumn 2021', 'Spring 2021'] },
    { code: 'BUSN 41000', title: 'Statistics', units: 100, quartersOffered: ['Autumn 2020', 'Autumn 2021', 'Autumn 2022'] },
    { code: 'BUSN 35000', title: 'Finance', units: 100, quartersOffered: ['Autumn 2020', 'Autumn 2021'] },
    { code: 'BUSN 37000', title: 'Marketing', units: 100, quartersOffered: ['Autumn 2020', 'Autumn 2021', 'Autumn 2022'] },
    { code: 'BUSN 40000', title: 'Operations', units: 100, quartersOffered: ['Autumn 2020', 'Autumn 2021', 'Autumn 2022'] },
    { code: 'BUSN 42001', title: 'Strategy', units: 100, quartersOffered: ['Autumn 2020', 'Autumn 2021', 'Autumn 2022'] },
    { code: 'BUSN 38001', title: 'Leadership', units: 100, quartersOffered: ['Autumn 2020', 'Autumn 2021', 'Autumn 2022'] },
    { code: 'BUSN 33050', title: 'Economy', units: 100, quartersOffered: ['Autumn 2022', 'Autumn 2023'] },
    { code: 'BUSN 33305', title: 'Business Ethics', units: 100, quartersOffered: ['Spring 2021', 'Spring 2022'] }
  ];
};
