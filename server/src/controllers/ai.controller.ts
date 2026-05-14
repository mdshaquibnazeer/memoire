import { Request, Response, NextFunction } from 'express';

// ============================================
// GENERATE AI LOVE MESSAGE
// ============================================

export const generateLoveMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { personOneName, personTwoName, occasion, tone, yearsTogeter, details } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured' });
    }

    const prompt = `Write a heartfelt, personalized ${occasion || 'love'} message.

Person 1: ${personOneName || 'them'}
Person 2: ${personTwoName || 'their partner'}
${yearsTogeter ? `Years together: ${yearsTogeter}` : ''}
${details ? `Special details: ${details}` : ''}
Tone: ${tone || 'romantic and heartfelt'}

Write a beautiful, unique message (3-4 sentences) that feels genuine and personal. 
Avoid clichés. Make it emotional and cinematic.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json() as any;
    const message = data.content?.[0]?.text || '';

    res.json({ message });
  } catch (error) {
    next(error);
  }
};
