import React from 'react';
import type { UserInput } from '../types';

interface Props {
  onSubmit: (data: UserInput) => void;
  initialData: UserInput | null;
  defaultResume: string;
}

// Array that holds multiple example job descriptions, company names, and job titles
const examples = [
  {
    jobDescription: 'We are looking for a motivated and experienced Used Car Salesman to join our team. The ideal candidate will have a strong sales background, excellent customer service skills, and a passion for cars. Responsibilities include greeting customers, showing them vehicles, negotiating prices, and closing deals. If you are a self-starter with a positive attitude, we want to hear from you!',
    companyName: 'CarMax',
    jobTitle: 'Used Car Salesman',
  },
  {
    jobDescription: 'We are seeking a talented and experienced Software Engineer to join our team. The ideal candidate will have a strong technical background, excellent problem-solving skills, and a passion for software development. Responsibilities include designing, developing, and testing software applications, as well as collaborating with other team members to deliver high-quality products. If you are a team player with a growth mindset, we want to hear from you!',
    companyName: 'Google',
    jobTitle: 'Software Engineer',
  },
  {
    jobDescription: 'We are looking for a creative and detail-oriented Graphic Designer to join our team. The ideal candidate will have a strong design background, excellent communication skills, and a passion for visual storytelling. Responsibilities include creating visual assets for print and digital media, collaborating with other team members to develop creative concepts, and delivering high-quality designs on time. If you are a problem solver with an eye for design, we want to hear from you!',
    companyName: 'Adobe',
    jobTitle: 'Graphic Designer',
  },
  {
    jobDescription: 'We are seeking a dynamic and results-driven Marketing Manager to join our team. The ideal candidate will have a strong marketing background, excellent leadership skills, and a passion for driving business growth. Responsibilities include developing and implementing marketing strategies, managing marketing campaigns, analyzing market trends, and collaborating with other team members to achieve marketing goals. If you are a strategic thinker with a track record of success, we want to hear from you!',
    companyName: 'Proctor & Gamble',
    jobTitle: 'Marketing Manager',
  },
  {
    jobDescription: 'We are looking for a motivated and experienced Customer Service Representative to join our team. The ideal candidate will have a strong customer service background, excellent communication skills, and a passion for helping others. Responsibilities include answering customer inquiries, resolving customer issues, processing orders, and providing exceptional service at all times. If you are a team player with a positive attitude, we want to hear from you!',
    companyName: 'Amazon',
    jobTitle: 'Customer Service Representative',
  },
];

// Helper function to select a random example
const getRandomExample = () => {
  return examples[Math.floor(Math.random() * examples.length)];
};

export function UserInputForm({ onSubmit, initialData, defaultResume }: Props) {
  const [formData, setFormData] = React.useState<UserInput>(() => 
    initialData || {
      resume: defaultResume,
      jobDescription: '',
      companyName: '',
      jobTitle: ''
    }
  );

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  React.useEffect(() => {
    // Set random example data on component mount
    const randomExample = getRandomExample();
    setFormData((prev) => ({
      ...prev,
      jobDescription: randomExample.jobDescription,
      companyName: randomExample.companyName,
      jobTitle: randomExample.jobTitle,
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/90 p-6 rounded-lg shadow-lg border-2 border-amber-900">
      <div className="space-y-4">
        <div>
          <label className="block text-amber-900 font-semibold mb-2">Resume</label>
          <textarea
            className="w-full p-2 border-2 border-amber-700 rounded-md bg-amber-50"
            rows={6}
            value={formData.resume}
            onChange={(e) => setFormData((prev) => ({ ...prev, resume: e.target.value }))}
            placeholder="Paste your resume here..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-amber-900 font-semibold mb-2">Company Name</label>
            <input
              type="text"
              className="w-full p-2 border-2 border-amber-700 rounded-md bg-amber-50"
              value={formData.companyName}
              onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-amber-900 font-semibold mb-2">Job Title</label>
            <input
              type="text"
              className="w-full p-2 border-2 border-amber-700 rounded-md bg-amber-50"
              value={formData.jobTitle}
              onChange={(e) => setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-amber-900 font-semibold mb-2">Job Description</label>
          <textarea
            className="w-full p-2 border-2 border-amber-700 rounded-md bg-amber-50"
            rows={4}
            value={formData.jobDescription}
            onChange={(e) => setFormData((prev) => ({ ...prev, jobDescription: e.target.value }))}
            placeholder="Paste the job description here..."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-amber-800 text-amber-50 py-2 px-4 rounded-md hover:bg-amber-900 transition-colors"
        >
          Generate Application Materials
        </button>
      </div>
    </form>
  );
}
