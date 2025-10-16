// Router Orchestrator: Selects the single most appropriate agent for the context
// This orchestrator analyzes the conversation and routes to exactly one agent

import { geminiGenerate } from '../gemini.js';
import { MentorAgent } from '../agents/MentorAgent.js';
import { SkepticAgent } from '../agents/SkepticAgent.js';
import { EnthusiastAgent } from '../agents/EnthusiastAgent.js';
import { PragmatistAgent } from '../agents/PragmatistAgent.js';

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
      mentor: new MentorAgent(),
      skeptic: new SkepticAgent(),
      enthusiast: new EnthusiastAgent(),
      pragmatist: new PragmatistAgent()
    };
  }

  async _respondWith(agentName, contents) {
    const agent = this.agentByName[agentName] || this.agentByName.pragmatist;
    const res = await agent.respond(contents);
    return res?.text || '';
  }

  async orchestrate(contents) {
    const orchestratorPrompt = `You are a routing system for a multi-perspective advisory panel.
        Your job is to analyze the conversation and select the SINGLE most appropriate agent to respond.

        Available agents:
        - "mentor": Patient teacher who explains concepts and builds understanding through structured guidance
        - "skeptic": Critical thinker who questions assumptions and probes for logical rigor
        - "enthusiast": Energetic advocate who explores possibilities and builds momentum
        - "pragmatist": Practical advisor who focuses on concrete action steps and real-world constraints

        Routing guidelines:
        1. Analyze the user's latest message AND recent conversation context
        2. Consider what the user needs most right now:
           - Understanding/learning → mentor
           - Critical examination/validation → skeptic
           - Inspiration/possibilities → enthusiast
           - Action plan/next steps → pragmatist
        3. Weight the latest message heavily, but use conversation history for context
        4. Consider emotional tone: confusion/questions → mentor; doubt/concerns → skeptic; 
           excitement/ideas → enthusiast; stuck/overwhelmed → pragmatist
        5. Choose ONE agent—the best match for this moment

        Output ONLY as structured JSON:
        {
          "agent": "mentor",
          "reasons": "User asking how something works; needs structured explanation"
        }`;

    const result = await geminiGenerate({
      contents,
      systemPrompt: orchestratorPrompt,
      config: { 
        responseMimeType: 'application/json', 
        responseSchema: SELECTION_SCHEMA 
      }
    });

    let agent = 'pragmatist';
    let reasons = 'Defaulted to pragmatist';
    
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
        persona: { value: agent, rationale: [reasons] },
        orchestrator: { value: 'router', rationale: ['Single-agent routing'] }
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

