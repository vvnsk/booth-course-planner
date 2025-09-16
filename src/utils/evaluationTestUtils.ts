import { loadCourseEvaluations, getCourseEvaluationSummary } from './evaluationHelpers';

// Test function to verify evaluation data loading
export const testEvaluationLoading = async () => {
  console.log('🧪 Testing course evaluation loading...');
  
  try {
    // Load all evaluations
    const evaluations = await loadCourseEvaluations();
    console.log(`✅ Loaded ${evaluations.length} evaluation records`);
    
    // Test with Financial Accounting (BUSN 30000)
    const testCourse = 'BUSN 30000';
    const summary = getCourseEvaluationSummary(testCourse, evaluations);
    
    console.log(`📊 Evaluation summary for ${testCourse}:`);
    console.log(`   - Number of professor offerings: ${summary.professors.length}`);
    console.log(`   - Aggregate overall rating: ${summary.aggregateRatings.overall.toFixed(2)}`);
    console.log(`   - Aggregate recommendation: ${summary.aggregateRatings.recommendation.toFixed(2)}`);
    console.log(`   - Average hours per week: ${summary.aggregateRatings.hoursPerWeek.toFixed(1)}`);
    
    if (summary.professors.length > 0) {
      console.log('🎓 Professors:');
      summary.professors.forEach((prof, index) => {
        console.log(`   ${index + 1}. ${prof.fullName} (${prof.schedule}) - Overall: ${prof.ratings.overall.toFixed(1)}`);
      });
    }
    
    return summary;
  } catch (error) {
    console.error('❌ Error testing evaluation loading:', error);
    return null;
  }
};

// Add this to window for easy browser console testing
if (typeof window !== 'undefined') {
  (window as any).testEvaluations = testEvaluationLoading;
}
