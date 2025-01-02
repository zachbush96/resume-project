import { Router } from 'express';
import fetch from 'node-fetch';

const router = Router();

const DEFAULT_INSTRUCTIONS = `You are an AI interviewer. Your role is to conduct professional job interviews, 
ask relevant questions, and provide constructive feedback. Be polite, professional, and encouraging while 
maintaining a natural conversation flow.`;

router.post('/rtc-connect', async (req, res) => {
  try {
    const body = await new Promise<string>((resolve) => {
      let data = '';
      req.on('data', chunk => { data += chunk; });
      req.on('end', () => { resolve(data); });
    });

    // Validate that we received valid SDP data
    if (!body.includes('v=0')) {
      throw new Error('Invalid SDP format');
    }

    const url = new URL('https://api.openai.com/v1/realtime');
    url.searchParams.set('model', 'gpt-4o-mini-realtime-preview-2024-12-17');
    url.searchParams.set('instructions', DEFAULT_INSTRUCTIONS);
    url.searchParams.set('voice', 'ash');

    const response = await fetch(url.toString(), {
      method: 'POST',
      body,
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/sdp',
      },
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const sdp = await response.text();
    
    // Validate the response SDP
    if (!sdp.includes('v=0')) {
      throw new Error('Invalid SDP response from OpenAI');
    }

    res.set('Content-Type', 'application/sdp').send(sdp);
  } catch (error) {
    console.error('RTC connection error:', error);
    res.status(500).json({ error: 'Failed to establish RTC connection' });
  }
});

export default router; 