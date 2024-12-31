import { openai } from './client';
import type { CompanyInfo } from '../../types';

/**
 * Generates a personalized cover letter using OpenAI's API.
 *
 * @param resume - The candidate's resume content.
 * @param jobDescription - The job description for the targeted position.
 * @param companyInfo - Information about the company, including mission, values, and culture.
 * @param jobTitle - The job title of the targeted position.
 * @returns A promise that resolves to the generated cover letter as a string.
 */
export async function generateCoverLetter(
  resume: string,
  jobDescription: string,
  companyInfo: CompanyInfo,
  jobTitle: string
): Promise<string> {
  console.log('🔄 generateCoverLetter called');
  console.log('📥 Input Parameters:', {
    resume: resume.substring(0, 100) + '...', // Log first 100 characters of the resume for brevity
    jobDescription: jobDescription.substring(0, 100) + '...', // Log first 100 characters for brevity
    jobTitle,
    companyInfo,
  });

  try {
    console.log('🚀 Preparing to send request to OpenAI API');
    const prompt = `
      Write a compelling cover letter for the ${jobTitle} position.

      Company Mission: ${companyInfo.missionStatement}
      Company Values: ${Object.entries(companyInfo.values).map(([key, value]) => `${key}: ${value}`).join(', ')}
      Company Culture: ${companyInfo.culture}

      Job Description:
      ${jobDescription}

      Candidate's Background:
      ${resume}

      Create a personalized cover letter that:
      1. Shows enthusiasm for the company's mission
      2. Aligns with company values
      3. Highlights relevant experience
      4. Demonstrates cultural fit
      5. Skip any details if they're empty instead of using placeholder content.
      6. Use natural language, tone, and sentence structure.
      7. Include specific details from both the resume and job description to show genuine interest and fit
    `;

    console.log('✉️ Generated Prompt:', prompt.substring(0, 300) + '...'); // Log first 300 characters for brevity

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4o-mini-2024-07-18",
    });

    console.log('✅ OpenAI API call successful');
    const coverLetter = completion.choices[0]?.message?.content || '';
    console.log('📤 Generated Cover Letter:', coverLetter.substring(0, 300) + '...'); // Log first 300 characters for brevity

    return coverLetter;
  } catch (error) {
    console.error('❌ Error generating cover letter:', error);
    throw new Error('Failed to generate cover letter');
  }
}
