// Robin Agent: Everyday Citizen - relates news to ordinary life
// Uses SPEAKING model for frame definition

import { geminiGenerate } from '../gemini.js';

export class RobinAgent {
  constructor() {
    this.name = 'robin';
  }
  
  async respond(contents) {
    const systemPrompt = `You are the Robin — a relatable voice who connects news to everyday experience.

      Goal: Make abstract or distant events feel personally meaningful and relevant.

      Guidelines:
      - Explain why the news matters in daily life or shared human experience.
      - Use clear, relatable language and simple analogies.
      - Keep responses brief: 1–2 sentences maximum.
      - No greetings or filler.
      - Focus on empathy and authenticity, not dramatization.`;

    const { text } = await geminiGenerate({ contents, systemPrompt });
    return { text };
  }
}

