import { openai } from './client';
import type { CompanyInfo } from '../../types';

/**
 * Optimizes a resume for a specific job description and company information using OpenAI's API.
 *
 * @param originalResume - The original resume content.
 * @param jobDescription - The job description for the targeted position.
 * @param companyInfo - Information about the company, including values and culture.
 * @returns A promise that resolves to the optimized resume as a string.
 */
export async function generateOptimizedResume(
  originalResume: string,
  jobDescription: string,
  companyInfo: CompanyInfo
): Promise<string> {
  console.log('🔄 generateOptimizedResume called');
  console.log('📥 Input Parameters:', {
    originalResume: originalResume.substring(0, 100) + '...', // Log first 100 characters for brevity
    jobDescription: jobDescription.substring(0, 100) + '...', // Log first 100 characters for brevity
    companyValues: companyInfo.values,
    companyCulture: companyInfo.culture,
  });

  try {
    console.log('🚀 Preparing to send request to OpenAI API');
    const prompt = `
      Create an optimized resume using the following information and sticking to the instructions provided:

      Original Resume:
      ${originalResume}

      Job Description:
      ${jobDescription}

      Company Values:
      ${Object.entries(companyInfo.values).map(([key, value]) => `${key}: ${value}`).join(', ')}

      Company Culture:
      ${companyInfo.culture}
      Instructions:
      1. Optimize this resume specifically for the provided job description, ensuring alignment with the company's stated values and culture. 
        - Highlight the most relevant achievements, skills, and experiences that directly match the job description.
        - Use industry-specific keywords and terminology from the job description to improve ATS compatibility.
        - Incorporate references to the company's values and culture, using language that demonstrates alignment (e.g., teamwork, innovation, adaptability).

      2. Structure the resume for ATS readability:
        - Use clean, standard formatting (e.g., bullet points, clear headers, no graphics or columns).
        - Prioritize clear section headings: "Professional Summary," "Skills," "Experience," "Education," and "Certifications" (if applicable).
        - Ensure correct use of keywords and phrases from the job description in each section without overstuffing.

      3. Enhance readability and relevance:
        - Write a compelling "Professional Summary" at the top of the resume, emphasizing your most impactful and relevant qualifications.
        - Focus on quantifiable results and achievements in the "Experience" section (e.g., "Increased revenue by 25% by developing new marketing strategies").
        - Tailor the "Skills" section to align with the role, grouping technical and soft skills effectively.

      4. Maintain concise yet impactful language:
        - Avoid generic phrases like "responsible for" and replace them with action verbs like "achieved," "led," or "implemented."
        - Ensure each bullet point is specific and measurable where possible (e.g., "Managed a team of 10 to deliver a 15% improvement in efficiency").

      6. Ensure ATS compatibility:
        - Provide the final resume in both plain-text and formatted versions (if applicable) for system compatibility.
        - Prioritize standard file formats (e.g., Word or PDF based on job requirements).

      Generate the optimized resume and provide an overview of the changes made to align with the job description, company values, and ATS best practices.
      Reply back with only the resume content. No preface or additional information needed.
    `;

    console.log('✉️ Generated Prompt:', prompt.substring(0, 300) + '...'); // Log first 300 characters for brevity

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      //model: "gpt-4o-mini-2024-07-18",
      model: "o1-mini",
    });

    console.log('✅ OpenAI API call successful');
    const optimizedResume = completion.choices[0]?.message?.content || '';

    console.log('📤 Optimized Resume:', optimizedResume.substring(0, 300) + '...'); // Log first 300 characters for brevity

    return optimizedResume;
  } catch (error) {
    console.error('❌ Error generating optimized resume:', error);
    throw new Error('Failed to generate optimized resume');
  }
}
