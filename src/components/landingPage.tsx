import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrainCog,
  FileText,
  Briefcase,
  MessageSquare,
  //Sparkles,
  //CheckCircle,
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface StepProps {
  number: string;
  title: string;
  description: string;
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/signin');
  };

  const handleSignUp = () => {
    navigate('/signin');
  };

  const handleGetStarted = () => {
    navigate('/signin');
  };

  const handleStartTrial = () => {
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      {/* Header */}
      <header className="bg-white shadow-md w-full">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BrainCog className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">Job Getter AI</h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleLogin}
              className="px-4 py-2 text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Login
            </button>
            <button
              onClick={handleSignUp}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Land Your Dream Job with AI-Powered Applications
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Let AI help you craft the perfect resume, cover letter, and interview responses.
          Stand out from the crowd with tailored applications that get past ATS systems.
        </p>
        <button
          onClick={handleGetStarted}
          className="px-8 py-4 bg-indigo-600 text-white text-lg rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
        >
          Get Started For Free
        </button>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Job Getter AI?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileText className="h-8 w-8 text-indigo-600" />}
              title="Smart Resume Optimization"
              description="Our AI analyzes job descriptions and optimizes your resume with relevant keywords and achievements that ATS systems love."
            />
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8 text-indigo-600" />}
              title="Personalized Cover Letters"
              description="Generate compelling cover letters that match company values and highlight your most relevant experiences."
            />
            <FeatureCard
              icon={<Briefcase className="h-8 w-8 text-indigo-600" />}
              title="Interview Preparation"
              description="Get AI-generated interview questions and suggested responses based on the company's culture and job requirements."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <Step
              number="1"
              title="Paste Your Resume"
              description="Upload your existing resume and the job description you're interested in."
            />
            <Step
              number="2"
              title="AI Analysis"
              description="Our AI analyzes the job requirements and company culture to optimize your application."
            />
            <Step
              number="3"
              title="Get Tailored Materials"
              description="Receive your optimized resume, custom cover letter, and interview preparation materials."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-20 text-center text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of successful job seekers who have used Job Getter AI to secure their ideal positions.
          </p>
          <button
            onClick={handleStartTrial}
            className="px-8 py-4 bg-white text-indigo-600 text-lg rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 Job Getter AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="p-6 bg-gray-50 rounded-lg text-center">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Step: React.FC<StepProps> = ({ number, title, description }) => (
  <div className="flex items-start gap-6 bg-white/80 p-6 rounded-lg">
    <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
      {number}
    </div>
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

export default LandingPage;
