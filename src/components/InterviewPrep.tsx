import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserTokenBalance, deductToken } from '../services/tokenService';
import { auth } from '../firebase';
import { TokenPurchase } from './TokenPurchase';
import { InterviewWebRTCService } from '../services/webrtc/interviewService';
import { Mic, MicOff, Play, Square } from 'lucide-react';

interface Props {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function InterviewPrep({ onSubmit, isLoading = false }: Props) {
  const [currentBalance, setCurrentBalance] = React.useState<number>(0);
  const [showPurchase, setShowPurchase] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [interviewService, setInterviewService] = React.useState<InterviewWebRTCService | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchBalance = async () => {
      if (auth.currentUser) {
        const balance = await getUserTokenBalance(auth.currentUser.uid);
        setCurrentBalance(balance);
      }
    };
    fetchBalance();
  }, []);

  const startInterview = async () => {
    try {
      if (!auth.currentUser) {
        navigate('/signin');
        return;
      }

      if (currentBalance < 1) {
        setShowPurchase(true);
        return;
      }

      const success = await deductToken(auth.currentUser.uid);
      if (!success) {
        setShowPurchase(true);
        return;
      }

      setCurrentBalance(prev => prev - 1);
      
      // Initialize WebRTC service with error handling
      const service = new InterviewWebRTCService([]);
      const initialized = await service.initialize();
      
      if (initialized) {
        setInterviewService(service);
        setIsRecording(true);
      } else {
        throw new Error('Failed to initialize WebRTC service');
      }
    } catch (error) {
      console.error('Failed to start interview:', error);
      // Add user-friendly error handling here
    }
  };

  const stopInterview = () => {
    setIsRecording(false);
    // Cleanup WebRTC
    if (interviewService) {
      // Add cleanup logic here
      setInterviewService(null);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-amber-900">AI Interview Practice</h2>
        <span className="text-amber-700">Tokens: {currentBalance}</span>
      </div>

      {showPurchase ? (
        <TokenPurchase 
          currentBalance={currentBalance} 
          onSuccess={() => {
            setShowPurchase(false);
            if (auth.currentUser) {
              getUserTokenBalance(auth.currentUser.uid).then(setCurrentBalance);
            }
          }}
        />
      ) : (
        <div className="space-y-6">
          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="text-amber-800">
              Practice your interview skills with our AI interviewer. 
              Speak naturally and receive real-time feedback.
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            {!isRecording ? (
              <button
                onClick={startInterview}
                disabled={isLoading}
                className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Play className="w-5 h-5" />
                Start Interview
              </button>
            ) : (
              <button
                onClick={stopInterview}
                className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Square className="w-5 h-5" />
                End Interview
              </button>
            )}
          </div>

          <div className="flex justify-center">
            {isRecording ? (
              <div className="flex items-center gap-2 text-green-600">
                <Mic className="w-5 h-5 animate-pulse" />
                <span>Recording...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-400">
                <MicOff className="w-5 h-5" />
                <span>Not Recording</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
