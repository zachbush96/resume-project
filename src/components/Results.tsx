import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { InterviewQuestion } from '../types';

interface Props {
  resume: string;
  coverLetter: string;
  interviewQuestions: InterviewQuestion[];
  companyMissionStatement?: string;
  companyValues?: string;
  companyCulture?: string;
}

export function Results({ 
  resume, 
  coverLetter, 
  interviewQuestions, 
  companyMissionStatement, 
  companyValues, 
  companyCulture 
}: Props) {
  return (
    <div className="space-y-6">
      {/* Company Information Sections */}
      {companyMissionStatement && (
        <section className="bg-white/90 p-6 rounded-lg shadow-lg border-2 border-amber-900">
          <h2 className="text-xl font-bold text-amber-900 mb-4">Company Mission Statement</h2>
          <div className="bg-amber-50 p-4 rounded-md">
            <p className="text-amber-800">{companyMissionStatement}</p>
          </div>
        </section>
      )}

      {companyValues && (
        <section className="bg-white/90 p-6 rounded-lg shadow-lg border-2 border-amber-900">
          <h2 className="text-xl font-bold text-amber-900 mb-4">Company Values</h2>
          <div className="bg-amber-50 p-4 rounded-md">
            <p className="text-amber-800">{companyValues}</p>
          </div>
        </section>
      )}

      {companyCulture && (
        <section className="bg-white/90 p-6 rounded-lg shadow-lg border-2 border-amber-900">
          <h2 className="text-xl font-bold text-amber-900 mb-4">Company Culture</h2>
          <div className="bg-amber-50 p-4 rounded-md">
            <p className="text-amber-800">{companyCulture}</p>
          </div>
        </section>
      )}

      {/* Resume Section */}
      <section className="bg-white/90 p-6 rounded-lg shadow-lg border-2 border-amber-900">
        <h2 className="text-xl font-bold text-amber-900 mb-4">Optimized Resume</h2>
        <div className="bg-amber-50 p-4 rounded-md prose prose-amber max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{resume}</ReactMarkdown>
        </div>
      </section>

      {/* Cover Letter Section */}
      <section className="bg-white/90 p-6 rounded-lg shadow-lg border-2 border-amber-900">
        <h2 className="text-xl font-bold text-amber-900 mb-4">Tailored Cover Letter</h2>
        <div className="bg-amber-50 p-4 rounded-md prose prose-amber max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{coverLetter}</ReactMarkdown>
        </div>
      </section>

      {/* Interview Questions Section */}
      <section className="bg-white/90 p-6 rounded-lg shadow-lg border-2 border-amber-900">
        <h2 className="text-xl font-bold text-amber-900 mb-4">Interview Preparation</h2>
        <div className="space-y-4">
          {interviewQuestions.map((q, i) => (
            <div key={i} className="bg-amber-50 p-4 rounded-md">
              <h3 className="font-bold text-amber-900">Q: {q.question}</h3>
              <p className="mt-2 text-amber-800">Suggested Answer: {q.suggestedAnswer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
