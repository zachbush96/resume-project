import { openai } from './client';
import type { CompanyInfo, InterviewQuestion } from '../../types';

/**
 * Generates a list of likely interview questions and suggested answers based on the resume, job description, and company information.
 *
 * @param resume - The candidate's resume content.
 * @param jobDescription - The job description for the targeted position.
 * @param companyInfo - Information about the company, including values and culture.
 * @returns A promise that resolves to an array of interview questions and suggested answers.
 */
export async function generateInterviewQuestions(
  resume: string,
  jobDescription: string,
  companyInfo: CompanyInfo
): Promise<InterviewQuestion[]> {
  console.log('🔄 generateInterviewQuestions called');
  console.log('📥 Input Parameters:', {
    resume: resume.substring(0, 100) + '...', // Log first 100 characters for brevity
    jobDescription: jobDescription.substring(0, 100) + '...', // Log first 100 characters for brevity
    companyValues: companyInfo.values,
    companyCulture: companyInfo.culture,
  });

  try {
    console.log('🚀 Preparing to send request to OpenAI API');
    const prompt = `
      Generate 5 interview questions and suggested answers based on the provided information. Ensure the questions cover the following categories: 1. Technical/role-specific 2. Cultural fit 3. Behavioral 4. Company value alignment. Format the output as a JSON array with 'question' and 'suggestedAnswer' fields.":

      Resume:
      ${resume}

      Job Description:
      ${jobDescription}

      Company Values:
      ${Object.entries(companyInfo.values).map(([key, value]) => `${key}: ${value}`).join(', ')}

      Company Culture:
      ${companyInfo.culture}

      Generate 5 likely interview questions and suggested answers. Format as JSON array with 'question' and 'suggestedAnswer' fields.
      Include:
      1. Technical/role-specific questions
      2. Cultural fit questions
      3. Behavioral questions
      4. Company value alignment questions
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
    const content = completion.choices[0]?.message?.content || '[]';

    let parsedQuestions;

    console.log('📤 Raw Response Content:', content.substring(0, 300) + '...'); // Log first 300 characters for brevity
   try {
      // Strip out any surrounding markdown-style backticks
      const sanitizedContent = content.replace(/```json|```/g, '').trim();
      parsedQuestions = JSON.parse(sanitizedContent);
      console.log('📋 Parsed Interview Questions:', parsedQuestions);
    } catch (parseError) {
      console.error("❌ Error Parsing JSON response: ", parseError);
      console.error("Raw API Response: ", content);
      parsedQuestions = content; // Fallback to raw content for debugging
    }

    
    //const parsedQuestions: InterviewQuestion[] = JSON.parse(content);
    //console.log('📋 Parsed Interview Questions:', parsedQuestions);

    return parsedQuestions;
  } catch (error) {
    console.error('❌ Error generating interview questions:', error);
    throw new Error('Failed to generate interview questions');
  }
}
