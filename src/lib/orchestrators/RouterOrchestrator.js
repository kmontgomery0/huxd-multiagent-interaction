// Router Orchestrator: Selects the single most appropriate bird agent
// Routes based on time of day, user mood/keywords, and topic type

import { geminiGenerate } from '../gemini.js';
import { DoveAgent } from '../agents/DoveAgent.js';
import { OwlAgent } from '../agents/OwlAgent.js';
import { WrenAgent } from '../agents/WrenAgent.js';
import { RobinAgent } from '../agents/RobinAgent.js';

const SELECTION_SCHEMA = {
  type: 'OBJECT',
  properties: {
    agent: { type: 'STRING' },
    reasons: { type: 'STRING' }
  },
  required: ['agent', 'reasons']
};

export class RouterOrchestrator {
  constructor() {
    this.name = 'router';
    this.agentByName = {
      dove: new DoveAgent(),
      owl: new OwlAgent(),
      wren: new WrenAgent(),
      robin: new RobinAgent()
    };
  }

  async _respondWith(agentName, contents) {
    const agent = this.agentByName[agentName] || this.agentByName.wren;
    const res = await agent.respond(contents);
    return res?.text || '';
  }

  async orchestrate(contents) {
    // Get current hour to inform routing
    const currentHour = new Date().getHours();
    const timeContext = currentHour < 12 ? 'morning' : currentHour < 18 ? 'afternoon' : 'evening/night';

    const orchestratorPrompt = `You are the Orchestrator, responsible for routing each user query to the most suitable Songbird agent.

      Current time context: ${timeContext}

      Agents:
      - dove: Morning Dove — uplifting, progress-focused
      - owl: Owl — reflective, contextual
      - wren: Wren — factual, concise
      - robin: Robin — relatable, personal

      Routing logic:
      1. Time of day:
        - Morning → Dove or Wren
        - Evening/Night → Owl
      2. User tone or keywords:
        - "what happened", "explain", "details" → Wren
        - "worried", "tired", "heavy" → Dove or Robin
        - "why", "context", "meaning" → Owl or Robin
      3. Topic type:
        - Policy/technical → Wren or Owl
        - Human interest → Dove or Robin
        - Complex or developing → Owl

      Output strictly in JSON:
      {
        "agent": "owl",
        "reasons": "Evening query seeking context about a complex event"
      }`;


    const result = await geminiGenerate({
      contents,
      systemPrompt: orchestratorPrompt,
      config: { 
        responseMimeType: 'application/json', 
        responseSchema: SELECTION_SCHEMA 
      }
    });

    let agent = 'wren'; // Default to fact-finder
    let reasons = 'Defaulted to Wren (fact-finder)';
    
    try {
      const parsed = JSON.parse(result.text || '{}');
      const selectedAgent = String(parsed?.agent || '').toLowerCase();
      
      if (this.agentByName[selectedAgent]) {
        agent = selectedAgent;
      }
      if (parsed?.reasons) {
        reasons = String(parsed.reasons);
      }
    } catch (_) {
      // Keep defaults if parsing fails
    }

    const text = await this._respondWith(agent, contents);

    const frameSet = { 
      frames: { 
        bird: { value: agent, rationale: [reasons] },
        time: { value: timeContext, rationale: [`Current time: ${timeContext}`] },
        orchestrator: { value: 'router', rationale: ['Single-bird selection'] }
      } 
    };
    
    return { 
      assistantMessage: text || '', 
      frameSet, 
      agent, 
      reasons 
    };
  }
}
