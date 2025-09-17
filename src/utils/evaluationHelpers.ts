import type { CourseEvaluation, ProfessorOffering, CourseEvaluationSummary } from '../types/index';

// Cache for loaded evaluation data
let evaluationCache: CourseEvaluation[] | null = null;
let cacheLoadPromise: Promise<CourseEvaluation[]> | null = null;

export const parseCourseEvaluationCSV = (csvText: string): CourseEvaluation[] => {
  const lines = csvText.split('\n');
  const data = lines.slice(1);
  
  return data
    .filter(line => line.trim()) // Remove empty lines
    .map(line => {
      // Parse CSV line with proper handling of quoted values
      const values = parseCSVLine(line);
      
      return {
        courseName: values[0] || '',
        courseTitle: values[1] || '',
        firstName: values[2] || '',
        lastName: values[3] || '',
        term: values[4] || '',
        invitedCount: parseInt(values[5]) || 0,
        respondentCount: parseInt(values[6]) || 0,
        responseRatio: parseFloat(values[7]) || 0,
        hoursPerWeek: parseFloat(values[8]) || 0,
        clarityRating: parseFloat(values[9]) || 0,
        interestRating: parseFloat(values[10]) || 0,
        usefulnessRating: parseFloat(values[11]) || 0,
        overallRating: parseFloat(values[12]) || 0,
        recommendationRating: parseFloat(values[13]) || 0,
      };
    });
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

export const extractCourseCode = (courseName: string): string => {
  // Convert course names like "33501 02" to "BUSN 33501"
  const match = courseName.match(/^(\d+)\s+(\d+)$/);
  if (match) {
    return `BUSN ${match[1]}`;
  }
  return courseName;
};

export const extractScheduleCode = (courseName: string): string => {
  // Extract the schedule code (e.g., "02", "81", "85") from course names like "33501 02"
  const match = courseName.match(/^(\d+)\s+(\d+)$/);
  if (match) {
    return match[2];
  }
  return '';
};

export const createCourseEvaluationSummary = (
  courseCode: string,
  evaluations: CourseEvaluation[]
): CourseEvaluationSummary => {
  // Filter evaluations for this specific course
  const courseEvaluations = evaluations.filter(
    evaluation => extractCourseCode(evaluation.courseName) === courseCode
  );
  
  if (courseEvaluations.length === 0) {
    return {
      courseCode,
      professors: [],
      aggregateRatings: {
        clarity: 0,
        interest: 0,
        usefulness: 0,
        overall: 0,
        recommendation: 0,
        hoursPerWeek: 0,
      }
    };
  }
  
  // Group by professor and schedule
  const professorMap = new Map<string, ProfessorOffering[]>();
  
  courseEvaluations.forEach(evaluation => {
    const professorKey = `${evaluation.firstName} ${evaluation.lastName}`;
    const schedule = extractScheduleCode(evaluation.courseName);
    
    if (!professorMap.has(professorKey)) {
      professorMap.set(professorKey, []);
    }
    
    const existingOffering = professorMap.get(professorKey)?.find(
      offering => offering.schedule === schedule && offering.quarter === evaluation.term
    );
    
    if (!existingOffering) {
      professorMap.get(professorKey)?.push({
        firstName: evaluation.firstName,
        lastName: evaluation.lastName,
        fullName: `${evaluation.firstName} ${evaluation.lastName}`,
        schedule: schedule,
        quarter: evaluation.term,
        ratings: {
          clarity: evaluation.clarityRating,
          interest: evaluation.interestRating,
          usefulness: evaluation.usefulnessRating,
          overall: evaluation.overallRating,
          recommendation: evaluation.recommendationRating,
          hoursPerWeek: evaluation.hoursPerWeek,
        },
        responseInfo: {
          invited: evaluation.invitedCount,
          responded: evaluation.respondentCount,
          responseRatio: evaluation.responseRatio,
        }
      });
    }
  });
  
  // Flatten all professor offerings
  const allProfessors: ProfessorOffering[] = [];
  professorMap.forEach(offerings => {
    allProfessors.push(...offerings);
  });
  
  // Calculate aggregate ratings
  const totalOfferings = allProfessors.length;
  const aggregateRatings = {
    clarity: totalOfferings > 0 ? allProfessors.reduce((sum, prof) => sum + prof.ratings.clarity, 0) / totalOfferings : 0,
    interest: totalOfferings > 0 ? allProfessors.reduce((sum, prof) => sum + prof.ratings.interest, 0) / totalOfferings : 0,
    usefulness: totalOfferings > 0 ? allProfessors.reduce((sum, prof) => sum + prof.ratings.usefulness, 0) / totalOfferings : 0,
    overall: totalOfferings > 0 ? allProfessors.reduce((sum, prof) => sum + prof.ratings.overall, 0) / totalOfferings : 0,
    recommendation: totalOfferings > 0 ? allProfessors.reduce((sum, prof) => sum + prof.ratings.recommendation, 0) / totalOfferings : 0,
    hoursPerWeek: totalOfferings > 0 ? allProfessors.reduce((sum, prof) => sum + prof.ratings.hoursPerWeek, 0) / totalOfferings : 0,
  };
  
  return {
    courseCode,
    professors: allProfessors,
    aggregateRatings
  };
};

export const loadCourseEvaluations = async (): Promise<CourseEvaluation[]> => {
  // Return cached data if available
  if (evaluationCache) {
    return evaluationCache;
  }
  
  // Return existing promise if loading is in progress
  if (cacheLoadPromise) {
    return cacheLoadPromise;
  }
  
  // Start loading and cache the promise
  cacheLoadPromise = (async () => {
    try {
      const response = await fetch('/data/course_evaluation.csv');
      const csvText = await response.text();
      const data = parseCourseEvaluationCSV(csvText);
      evaluationCache = data;
      return data;
    } catch (error) {
      console.error('Failed to load course evaluations:', error);
      cacheLoadPromise = null; // Reset promise on error to allow retry
      return [];
    }
  })();
  
  return cacheLoadPromise;
};

export const getCourseEvaluationSummary = (
  courseCode: string,
  allEvaluations: CourseEvaluation[]
): CourseEvaluationSummary => {
  return createCourseEvaluationSummary(courseCode, allEvaluations);
};
