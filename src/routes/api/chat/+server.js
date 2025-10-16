import { json } from '@sveltejs/kit';
import { RouterOrchestrator } from '$lib/orchestrators/RouterOrchestrator.js';
import { SynthesizerOrchestrator } from '$lib/orchestrators/SynthesizerOrchestrator.js';

/**
 * Handle chat POST requests for a single-turn pipeline execution.
 *
 * Parameters: ({ request }) SvelteKit request wrapper.
 * Returns: JSON response with pipeline output or error.
 */
export async function POST({ request }) {
  const body = await request.json();
  const { history, orchestratorType = 'router', apiKey } = body || {};

  if (!Array.isArray(history)) {
    return json({ error: 'history array is required' }, { status: 400 });
  }

  if (!apiKey || !apiKey.trim()) {
    return json({ error: 'API key is required' }, { status: 400 });
  }

  try {
    // Select orchestrator based on type
    let orchestrator;
    if (orchestratorType === 'synthesizer') {
      orchestrator = new SynthesizerOrchestrator(apiKey.trim());
    } else {
      orchestrator = new RouterOrchestrator(apiKey.trim()); // Default to router
    }

    const contents = history.map((m) => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] }));
    
    const { assistantMessage, frameSet, agent, reasons } = await orchestrator.orchestrate(contents);
    
    return json({ 
      assistantMessage, 
      replierInput: { 
        frameSet, 
        contextCount: history.length, 
        agent, 
        reasons,
        orchestratorType 
      } 
    });
  } catch (err) {
    const msg = String(err?.message || err || '').toLowerCase();
    if (msg.includes('api key') || msg.includes('401') || msg.includes('unauthorized')) {
      return json({ error: 'Invalid API key. Please check your Gemini API key.' }, { status: 401 });
    }
    return json({ error: 'Pipeline error', details: String(err?.message || err) }, { status: 500 });
  }
}
