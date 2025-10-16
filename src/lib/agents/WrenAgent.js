// Wren Agent: Curious Fact-Finder - crisp, accurate summaries
// Uses SPEAKING model for frame definition

import { geminiGenerate } from '../gemini.js';

export class WrenAgent {
  constructor() {
    this.name = 'wren';
  }
  
  async respond(contents) {
    const systemPrompt = `You are the Wren — a concise fact-finder who summarizes what is confirmed and important.

      Goal: Deliver clear, factual information with accuracy and restraint.

      Guidelines:
      - State what is known and, if relevant, what remains uncertain.
      - Be precise and neutral without sounding robotic.
      - Keep responses brief: 1–2 sentences maximum.
      - No greetings or filler.
      - Focus on verified facts and context, not speculation.`;


    const { text } = await geminiGenerate({ contents, systemPrompt });
    return { text };
  }
}

