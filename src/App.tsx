import React from 'react';
import { Layout } from './components/Layout';
import { UserInputForm } from './components/UserInputForm';
import { ProcessingStatus } from './components/ProcessingStatus';
import { Results } from './components/Results';
import { Sidebar } from './components/Sidebar';
import { getCompanyInfo } from './services/companyService';
import { generateContent } from './services/ai/contentGenerator';
import type { UserInput, ProcessStatus, GeneratedContent, SavedGeneration } from './types';
import { auth, provider } from './firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { getUserResume, getUserGenerations } from './services/userService';
import { useNavigate } from 'react-router-dom';



const STORAGE_KEY = 'jobgetter_generations';

export default function App() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<ProcessStatus>({
    resume: false,
    coverLetter: false,
    interview: false
  });
  const [results, setResults] = React.useState<GeneratedContent | null>(null);
  const [generations, setGenerations] = React.useState<SavedGeneration[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedGeneration, setSelectedGeneration] = React.useState<string | null>(null);
  const [currentInput, setCurrentInput] = React.useState<UserInput | null>(null);
  const [user, setUser] = React.useState<any>(null);
  const [defaultResume, setDefaultResume] = React.useState<string>('');


  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        // Fetch user's default resume from Firestore or local storage
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);


  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(generations));
  }, [generations]);

  const handleSubmit = async (data: UserInput) => {
    setIsProcessing(true);
    setError(null);
    setResults(null);
    setStatus({ resume: false, coverLetter: false, interview: false });
    setCurrentInput(data);
    
    try {
      const companyInfo = await getCompanyInfo(data.companyName);
      const generatedContent = await generateContent(data, companyInfo);
      
      setStatus({ resume: true, coverLetter: true, interview: true });
      setResults(generatedContent);

      // Save the generation
      const newGeneration: SavedGeneration = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        input: data,
        output: generatedContent,
        userId: user.uid
      };
      setGenerations(prev => [newGeneration, ...prev]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      console.error('Error generating content:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerationSelect = (generation: SavedGeneration) => {
    setSelectedGeneration(generation.id);
    setCurrentInput(generation.input);
    setResults(generation.output);
    setError(null);
    setIsProcessing(false);
  };

  const handleGenerationDelete = (id: string) => {
    setGenerations(prev => prev.filter(gen => gen.id !== id));
    if (selectedGeneration === id) {
      setSelectedGeneration(null);
      setResults(null);
      setCurrentInput(null);
    }
  };

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      
      // Fetch user's default resume
      const defaultResume = await getUserResume();
      setDefaultResume(defaultResume);

      // Fetch user's generations
      const userGenerations = await getUserGenerations(result.user.uid);
      setGenerations(userGenerations);
      navigate('/app');
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <Layout
      sidebar={
        <Sidebar
          generations={generations}
          onSelect={handleGenerationSelect}
          onDelete={handleGenerationDelete}
          selectedId={selectedGeneration}
        />
      }
    >
      <div>
        {user ? (
          <div>
            {/*<h1>Welcome, {user.displayName}</h1> */}
            {/* <button onClick={handleSignOut}>Sign Out</button> */}
            {/* Render User Input Form with defaultResume */}
          </div>
        ) : (
          <button onClick={handleSignIn}>Sign In with Google</button>
        )}
      </div>
      
      <div className="max-w-4xl mx-auto space-y-6">
        <UserInputForm 
          onSubmit={handleSubmit} 
          initialData={currentInput} 
          defaultResume={defaultResume}
        />
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {isProcessing && <ProcessingStatus status={status} />}
        
        {results && (
          <Results
            resume={results.resume}
            coverLetter={results.coverLetter}
            interviewQuestions={results.interviewQuestions}
            companyMissionStatement={results.companyMissionStatement}
            companyValues={results.companyValues}
            companyCulture={results.companyCulture}
          />
        )}
      </div>
    </Layout>
  );
}