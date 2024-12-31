import { generateOptimizedResume } from './resumeGenerator';
import { generateCoverLetter } from './coverLetterGenerator';
import { generateInterviewQuestions } from './interviewGenerator';
import type { UserInput, CompanyInfo, GeneratedContent } from '../../types';

/**
 * Generates optimized resume, cover letter, and interview questions based on user input and company information.
 *
 * @param input - The user input containing resume details, job description, and job title.
 * @param companyInfo - Information about the company for which the content is being generated.
 * @returns A promise that resolves to the generated content.
 */
export async function generateContent(
  input: UserInput,
  companyInfo: CompanyInfo
): Promise<GeneratedContent> {
  console.log('🔄 generateContent called');
  console.log('📥 Input:', JSON.stringify(input, null, 2));
  console.log('📥 Company Info:', JSON.stringify(companyInfo, null, 2));
  

  try {
    console.log('🚀 Starting to generate optimized resume...');
    const resumePromise = generateOptimizedResume(
      input.resume,
      input.jobDescription,
      companyInfo
    );

    console.log('🚀 Starting to generate cover letter...');
    const coverLetterPromise = generateCoverLetter(
      input.resume,
      input.jobDescription,
      companyInfo,
      input.jobTitle
    );

    console.log('🚀 Starting to generate interview questions...');
    const interviewQuestionsPromise = generateInterviewQuestions(
      input.resume,
      input.jobDescription,
      companyInfo
    );

    // Execute all promises in parallel
    const [resume, coverLetter, interviewQuestions] = await Promise.all([
      resumePromise,
      coverLetterPromise,
      interviewQuestionsPromise,
    ]);

    console.log('✅ Optimized resume generated');
    // Optionally, log resume content
    //console.log('📝 Resume:', resume);

    console.log('✅ Cover letter generated');
    // Optionally, log cover letter content
    //console.log('📝 Cover Letter:', coverLetter);

    console.log('✅ Interview questions generated');
    // Optionally, log interview questions
    //console.log('📝 Interview Questions:', interviewQuestions);

    const generatedContent: GeneratedContent = {
      resume,
      coverLetter,
      interviewQuestions,
      companyMissionStatement: companyInfo.missionStatement,
      //companyValues: companyInfo.values.join(', '),
      companyValues: Object.entries(companyInfo.values).map(([key, value]) => `${key}: ${value}`).join(', '),
      companyCulture: companyInfo.culture
    };

    console.log('📤 Generated Content:', JSON.stringify(generatedContent, null, 2));

    return generatedContent;
  } catch (error) {
    console.error('❌ Error generating content:', error);
    throw error; // Re-throw the error after logging
  }
}
