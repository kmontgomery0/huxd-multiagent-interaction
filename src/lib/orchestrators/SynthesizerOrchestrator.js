// Synthesizer Orchestrator: Blends multiple bird voices into one cozy, tweet-like message
// Creates a unified daily insight by merging 2-3 agents

import { geminiGenerate } from '../gemini.js';
import { DoveAgent } from '../agents/DoveAgent.js';
import { OwlAgent } from '../agents/OwlAgent.js';
import { WrenAgent } from '../agents/WrenAgent.js';
import { RobinAgent } from '../agents/RobinAgent.js';

const AGENT_SELECTION_SCHEMA = {
  type: 'OBJECT',
  properties: {
    agents: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    reasons: { type: 'STRING' }
  },
  required: ['agents', 'reasons']
};

export class SynthesizerOrchestrator {
  constructor(apiKey = null) {
    this.name = 'synthesizer';
    this.apiKey = apiKey;
    this.agentByName = {
      dove: new DoveAgent(),
      owl: new OwlAgent(),
      wren: new WrenAgent(),
      robin: new RobinAgent()
    };
  }

  async orchestrate(contents) {
    // Get current hour for time-aware synthesis
    const currentHour = new Date().getHours();
    const timeContext = currentHour < 12 ? 'morning' : currentHour < 18 ? 'afternoon' : 'evening';
    const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

    // Step 1: Determine which birds should contribute
    const selectionPrompt = `You are the Synthesizer, choosing which Songbird agents should contribute to a blended response.

      Current time: ${timeContext}

      Agents:
      - dove: uplifting
      - owl: reflective
      - wren: factual
      - robin: relatable

      Selection rules:
      1. Always include Wren for factual grounding.
      2. Add 1–2 complementary voices:
        - Morning → add Dove
        - Evening → add Owl
        - Community or human-interest → add Robin
        - Complex topics → add Owl
      3. Avoid redundancy (e.g., Dove + Robin).

      Output strictly in JSON:
      {
        "agents": ["wren", "dove"],
        "reasons": "Morning update combining factual clarity with optimism"
      }`;


    const selectionResult = await geminiGenerate({
      contents,
      systemPrompt: selectionPrompt,
      config: { 
        responseMimeType: 'application/json',
        responseSchema: AGENT_SELECTION_SCHEMA
      },
      apiKey: this.apiKey
    });

    let selectedAgents = ['wren', 'dove']; // Default morning combo
    let selectionReasons = 'Default morning selection';

    try {
      const parsed = JSON.parse(selectionResult.text || '{}');
      if (Array.isArray(parsed.agents) && parsed.agents.length > 0) {
        selectedAgents = parsed.agents
          .filter(a => this.agentByName[a])
          .slice(0, 3); // Max 3 birds
      }
      if (parsed.reasons) {
        selectionReasons = String(parsed.reasons);
      }
    } catch (_) {}

    // Step 2: Get responses from each selected bird
    const birdResponses = await Promise.all(
      selectedAgents.map(async (agentName) => {
        const agent = this.agentByName[agentName];
        const res = await agent.respond(contents, this.apiKey);
        return {
          bird: agentName,
          response: res.text || ''
        };
      })
    );

    // Step 3: Synthesize into one cozy, tweet-like message
    const synthesisPrompt = `You are creating a unified, tweet-like news update from multiple Songbird perspectives.

        Time: ${timeContext}
        
        Bird contributions:
        ${birdResponses.map(br => `[${br.bird.toUpperCase()}]: ${br.response}`).join('\n')}

        Your task:
        1. Blend these into ONE cohesive message that feels like a cozy news tweet
        2. Keep it SHORT: 2-3 sentences maximum (like a tweet or gentle notification)
        3. CRITICAL: NO greetings ("Good morning", "Hello", "Good evening") — jump straight to the news content
        4. Use natural transitions, not labeled sections
        5. Maintain the warm, conversational tone but focus on the actual news
        6. Include 1-2 relevant emojis naturally (🕊️ 🌙 🌅 🌱 etc.)
        
        Example format:
        "[Wren fact]. [Owl wisdom] — a reminder that [insight]. 🌙"
        
        OR
        
        "[Wren fact]. [Dove uplift] 🌱."

        Create your blended message now — keep it SHORT, warm, and digestible. NO greetings, just deliver the news insight directly.`;

    const lastUserMessage = contents[contents.length - 1];
    const synthesisContents = [lastUserMessage];

    const synthesisResult = await geminiGenerate({
      contents: synthesisContents,
      systemPrompt: synthesisPrompt,
      apiKey: this.apiKey
    });

    const frameSet = {
      frames: {
        birds: { 
          value: selectedAgents.join(', '), 
          rationale: [selectionReasons] 
        },
        time: {
          value: timeContext,
          rationale: [`${greeting} synthesis`]
        },
        orchestrator: { 
          value: 'synthesizer', 
          rationale: ['Multi-bird blend'] 
        }
      }
    };

    return {
      assistantMessage: synthesisResult.text || '',
      frameSet,
      agent: selectedAgents.join('+'),
      reasons: selectionReasons
    };
  }
}
