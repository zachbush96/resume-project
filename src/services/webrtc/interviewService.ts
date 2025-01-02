import { InterviewQuestion } from '../../types';

interface WebRTCFunctions {
  askQuestion: (question: string) => Promise<{ success: boolean, response: string }>;
  evaluateAnswer: (answer: string) => Promise<{ success: boolean, feedback: string }>;
  getNextQuestion: () => Promise<{ success: boolean, question: InterviewQuestion }>;
}

export class InterviewWebRTCService {
  private peerConnection: RTCPeerConnection;
  private dataChannel: RTCDataChannel;
  private audioElement: HTMLAudioElement | null = null;

  constructor(private questions: InterviewQuestion[]) {
    this.peerConnection = new RTCPeerConnection();
    this.setupPeerConnection();
    this.dataChannel = this.peerConnection.createDataChannel('interview');
    this.setupDataChannel();
  }

  private setupPeerConnection() {
    this.peerConnection.ontrack = (event) => {
      if (!this.audioElement) {
        this.audioElement = document.createElement('audio');
        this.audioElement.autoplay = true;
        this.audioElement.controls = true;
        document.body.appendChild(this.audioElement);
      }
      this.audioElement.srcObject = event.streams[0];
    };
  }

  private setupDataChannel() {
    this.dataChannel.addEventListener('open', () => {
      this.configureInterviewSession();
    });

    this.dataChannel.addEventListener('message', this.handleMessage.bind(this));
  }

  private configureInterviewSession() {
    const event = {
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        tools: [
          {
            type: 'function',
            name: 'askQuestion',
            description: 'Asks an interview question',
            parameters: {
              type: 'object',
              properties: {
                question: { type: 'string', description: 'The interview question to ask' }
              }
            }
          },
          {
            type: 'function',
            name: 'evaluateAnswer',
            description: 'Evaluates the candidate\'s answer',
            parameters: {
              type: 'object',
              properties: {
                answer: { type: 'string', description: 'The candidate\'s answer to evaluate' }
              }
            }
          }
        ]
      }
    };
    this.dataChannel.send(JSON.stringify(event));
  }

  private async handleMessage(event: MessageEvent) {
    const msg = JSON.parse(event.data);
    if (msg.type === 'response.function_call_arguments.done') {
      // Handle function calls here
      const result = await this.handleFunctionCall(msg);
      this.sendFunctionResult(msg.call_id, result);
    }
  }

  private async handleFunctionCall(msg: any) {
    const args = JSON.parse(msg.arguments);
    switch (msg.name) {
      case 'askQuestion':
        return { success: true, response: 'Question asked successfully' };
      case 'evaluateAnswer':
        return { success: true, feedback: 'Answer evaluation completed' };
      default:
        return { success: false, error: 'Unknown function' };
    }
  }

  private sendFunctionResult(callId: string, result: any) {
    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'function_call_output',
        call_id: callId,
        output: JSON.stringify(result)
      }
    };
    this.dataChannel.send(JSON.stringify(event));
  }

  public async initialize() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => 
        this.peerConnection.addTransceiver(track, { direction: 'sendrecv' })
      );

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      const response = await fetch('http://localhost:5000/api/rtc-connect', {
        method: 'POST',
        body: offer.sdp,
        headers: {
          'Content-Type': 'application/sdp'
        }
      });

      const answer = await response.text();
      await this.peerConnection.setRemoteDescription({
        sdp: answer,
        type: 'answer'
      });

      return true;
    } catch (error) {
      console.error('Failed to initialize WebRTC:', error);
      return false;
    }
  }
} 