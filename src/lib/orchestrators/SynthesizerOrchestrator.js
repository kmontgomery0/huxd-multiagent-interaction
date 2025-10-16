// Synthesizer Orchestrator: Combines insights from multiple agents into a cohesive response
// This orchestrator gathers perspectives from relevant agents and weaves them together

import { geminiGenerate } from '../gemini.js';
import { MentorAgent } from '../agents/MentorAgent.js';
import { SkepticAgent } from '../agents/SkepticAgent.js';
import { EnthusiastAgent } from '../agents/EnthusiastAgent.js';
import { PragmatistAgent } from '../agents/PragmatistAgent.js';

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
  constructor() {
    this.name = 'synthesizer';
    this.agentByName = {
      mentor: new MentorAgent(),
      skeptic: new SkepticAgent(),
      enthusiast: new EnthusiastAgent(),
      pragmatist: new PragmatistAgent()
    };
  }

  async orchestrate(contents) {
    // Step 1: Determine which agents should contribute
    const selectionPrompt = `You are selecting which advisory perspectives are most relevant for this conversation.
        
        Available agents:
        - "mentor": Patient teacher who explains concepts and builds understanding
        - "skeptic": Critical thinker who questions assumptions and probes logic
        - "enthusiast": Energetic advocate who explores possibilities and momentum
        - "pragmatist": Practical advisor focused on concrete action steps

        Analyze the conversation and select 2-3 agents whose perspectives would be most valuable.
        Consider:
        - What does the user need? (understanding, validation, inspiration, action)
        - What would add the most value? (avoid redundancy)
        - Which perspectives complement each other well?

        Output as JSON:
        {
          "agents": ["mentor", "skeptic"],
          "reasons": "User needs both explanation and critical validation"
        }`;

    const selectionResult = await geminiGenerate({
      contents,
      systemPrompt: selectionPrompt,
      config: { 
        responseMimeType: 'application/json',
        responseSchema: AGENT_SELECTION_SCHEMA
      }
    });

    let selectedAgents = ['pragmatist', 'mentor'];
    let selectionReasons = 'Default selection';

    try {
      const parsed = JSON.parse(selectionResult.text || '{}');
      if (Array.isArray(parsed.agents) && parsed.agents.length > 0) {
        selectedAgents = parsed.agents
          .filter(a => this.agentByName[a])
          .slice(0, 3); // Max 3 agents
      }
      if (parsed.reasons) {
        selectionReasons = String(parsed.reasons);
      }
    } catch (_) {}

    // Step 2: Get responses from each selected agent
    const agentResponses = await Promise.all(
      selectedAgents.map(async (agentName) => {
        const agent = this.agentByName[agentName];
        const res = await agent.respond(contents);
        return {
          agent: agentName,
          response: res.text || ''
        };
      })
    );

    // Step 3: Synthesize the responses into a cohesive message
    const synthesisPrompt = `You are synthesizing multiple advisory perspectives into one cohesive response.
        
        You have received input from ${selectedAgents.length} different advisors, each with their own lens:
        ${agentResponses.map(ar => `\n[${ar.agent.toUpperCase()}]: ${ar.response}`).join('\n')}

        Your task:
        1. Create a unified response that weaves together these perspectives naturally
        2. Maintain the distinct voice/value of each perspective—don't flatten them
        3. Structure the response so different angles complement rather than compete
        4. Keep it conversational and coherent, not like a list of separate opinions
        5. Aim for 2-4 paragraphs total
        6. You can use transitions like "That said...", "At the same time...", "Building on that..."

        Do NOT:
        - Simply concatenate the responses
        - Label sections by agent name
        - Make it sound like a committee report
        - Lose the distinct character of each perspective

        Synthesize these viewpoints into a single, nuanced response that honors each lens.`;

    const lastUserMessage = contents[contents.length - 1];
    const synthesisContents = [lastUserMessage]; // Just use the user's message for synthesis context

    const synthesisResult = await geminiGenerate({
      contents: synthesisContents,
      systemPrompt: synthesisPrompt
    });

    const frameSet = {
      frames: {
        personas: { 
          value: selectedAgents.join(', '), 
          rationale: [selectionReasons] 
        },
        orchestrator: { 
          value: 'synthesizer', 
          rationale: ['Multi-agent synthesis'] 
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

