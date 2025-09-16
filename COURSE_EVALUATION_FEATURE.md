## Course Evaluation Feature

The Course Evaluation feature has been successfully implemented in the CourseCard component. Here's how it works:

### Features Added:

1. **Course Evaluation Data Loading**: The app can now load and parse course evaluation data from the CSV file.

2. **Professor Information Table**: When clicking the info (ⓘ) button on any course card, a modal opens showing:
   - Course details (existing functionality)
   - **New: Course evaluation table** with the following columns:
     - Professor name
     - Schedule code (85, 81, 01, etc.)
     - Quarter offered
     - Overall rating (color-coded)
     - Recommendation rating (color-coded)
     - Clarity rating
     - Interest rating
     - Usefulness rating
     - Hours per week
     - Response rate information

3. **Aggregate Ratings**: Above the detailed table, there's a summary showing:
   - Overall course rating (average across all professors)
   - Overall recommendation rating
   - Average hours per week

4. **Color-Coded Ratings**: Ratings are color-coded for easy interpretation:
   - Green (4.5+): Excellent
   - Teal (4.0-4.4): Very Good
   - Blue (3.5-3.9): Good
   - Yellow (3.0-3.4): Fair
   - Red (<3.0): Poor

### Technical Implementation:

- **Types**: Added `CourseEvaluation`, `ProfessorOffering`, and `CourseEvaluationSummary` interfaces
- **Utilities**: Created `evaluationHelpers.ts` with functions to parse CSV data and create summaries
- **Caching**: Implemented intelligent caching to avoid reloading CSV data multiple times
- **Error Handling**: Graceful error handling with user-friendly messages

### Testing the Feature:

1. Start the development server: `npm run dev`
2. Open the application in your browser
3. Find a course in the course search (e.g., "Financial Accounting" - BUSN 30000)
4. Click the info (ⓘ) button on any course card
5. Scroll down in the modal to see the "Course Evaluations" section
6. The table will load evaluation data automatically

### Data Mapping:

The system automatically maps course codes between different formats:
- Course names like "30000 03" in the CSV → "BUSN 30000" in the app
- Schedule codes (03, 81, 85) are preserved and displayed
- Quarter information is extracted from the "Term" field

### Performance:

- Evaluation data is loaded only when needed (when a modal is opened)
- Data is cached after first load to improve performance
- Large tables use Mantine's ScrollArea for optimal display on all screen sizes

### Mobile Responsiveness:

- Tables are horizontally scrollable on mobile devices
- Modal sizes adjust appropriately for different screen sizes
- Touch-friendly interface elements
