<script>
  import { onMount } from 'svelte';
  
  let input = '';
  let messages = [];
  let debugOpen = false;
  let replierInput = null; // { frameSet, contextCount, agent, reasons, orchestratorType }
  let isLoading = false;
  let errorMsg = '';
  let orchestratorType = 'router'; // 'router' or 'synthesizer'
  let timeOfDay = 'sunrise'; // 'sunrise', 'midday', 'sunset', 'dusk', 'night'
  let timeSlider = 0; // 0 = sunrise, 1 = midday, 2 = sunset, 3 = dusk, 4 = night
  let currentDateTime = new Date();

  $: {
    const times = ['sunrise', 'midday', 'sunset', 'dusk', 'night'];
    timeOfDay = times[timeSlider];
    if (typeof document !== 'undefined') {
      document.body.className = timeOfDay;
      console.log('Time of day set to:', timeOfDay);
    }
  }

  function getInitialGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "good morning! 🌅 what would you like to explore today?";
    } else if (hour >= 12 && hour < 17) {
      return "good afternoon! ☀️ what's on your mind today?";
    } else if (hour >= 17 && hour < 21) {
      return "good evening! 🌆 what topics interest you tonight?";
    } else {
      return "good evening! 🌙 what would you like to learn about?";
    }
  }

  onMount(() => {
    // Set initial slider position based on current time
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) {
      timeSlider = 0; // sunrise
    } else if (hour >= 10 && hour < 16) {
      timeSlider = 1; // midday
    } else if (hour >= 16 && hour < 19) {
      timeSlider = 2; // sunset
    } else if (hour >= 19 && hour < 22) {
      timeSlider = 3; // dusk
    } else {
      timeSlider = 4; // night
    }
    
    document.body.className = timeOfDay;
    
    // Update date/time every second
    const interval = setInterval(() => {
      currentDateTime = new Date();
    }, 1000);
    
    return () => clearInterval(interval);
  });

  function formatDate(date) {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  }

  function getBirdInfo(agent) {
    if (!agent) return null;
    const birdMap = {
      dove: { emoji: '🕊️', vibe: 'uplifting', color: '#fbbf24' },
      owl: { emoji: '🦉', vibe: 'reflective', color: '#8b5cf6' },
      wren: { emoji: '🐦', vibe: 'factual', color: '#3b82f6' },
      robin: { emoji: '🐦', vibe: 'relatable', color: '#ef4444' }
    };
    // Handle blended mode where multiple birds might be listed (separated by +, comma, or space)
    const birds = agent.toLowerCase().split(/[+,\s]+/).filter(b => birdMap[b]);
    if (birds.length === 0) return null;
    if (birds.length === 1) return birdMap[birds[0]];
    // For multiple birds, return array and create pie chart
    return { 
      isBlended: true, 
      birds: birds.map(b => birdMap[b]), 
      colors: birds.map(b => birdMap[b].color) 
    };
  }

  function createPieChartGradient(colors) {
    if (!colors || colors.length === 0) return '';
    if (colors.length === 1) return colors[0];
    
    const segmentSize = 100 / colors.length;
    let gradientParts = [];
    
    for (let i = 0; i < colors.length; i++) {
      const start = i * segmentSize;
      const end = (i + 1) * segmentSize;
      gradientParts.push(`${colors[i]} ${start}% ${end}%`);
    }
    
    return `conic-gradient(${gradientParts.join(', ')})`;
  }

  async function send() {
    const content = input.trim();
    if (!content) return;
    messages = [...messages, { role: 'user', content }];
    input = '';
    isLoading = true;
    errorMsg = '';
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: messages, orchestratorType })
    });
    const data = await res.json();
    if (!res.ok || data?.error) {
      errorMsg = data?.error || 'Request failed';
      isLoading = false;
      return;
    }
    if (data.assistantMessage) {
      messages = [...messages, { 
        role: 'assistant', 
        content: data.assistantMessage, 
        agent: data.replierInput?.agent 
      }];
      replierInput = data.replierInput || null;
    }
    isLoading = false;
  }

  function clearChat() {
    messages = [];
    replierInput = null;
    errorMsg = '';
  }
</script>

<style>
  :global(:root) {
    --card: #ffffff;
    --card-muted: #f8fafc;
    --border: #e5e7eb;
    --text: #0f172a;
    --muted: #64748b;
    --primary: #2563eb;
    --primary-600: #1d4ed8;
  }

  :global(html, body) {
    height: 100%;
    margin: 0;
    font-family: 'Nunito', 'Rounded Mplus 1c', 'Varela Round', ui-rounded, system-ui, -apple-system, sans-serif;
    text-transform: lowercase;
    transition: background 0.8s ease, color 0.8s ease;
  }

  /* Sunrise: yellow/orange/pink */
  :global(body.sunrise) {
    background: linear-gradient(180deg, #fef3c7 0%, #fbbf24 30%, #fb923c 60%, #f97316 100%);
    background-attachment: fixed;
    color: #000000;
  }

  /* Midday: bright blue sky */
  :global(body.midday) {
    background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 40%, #2563eb 100%);
    background-attachment: fixed;
    color: #000000;
  }

  /* Sunset: orange/pink/purple */
  :global(body.sunset) {
    background: linear-gradient(180deg, #fb923c 0%, #f472b6 40%, #ec4899 70%, #c026d3 100%);
    background-attachment: fixed;
    color: #000000;
  }

  /* Dusk: purple to blue to black */
  :global(body.dusk) {
    background: linear-gradient(180deg, #7c3aed 0%, #3b82f6 40%, #1e3a8a 70%, #0f172a 100%);
    background-attachment: fixed;
    color: #ffffff;
  }

  /* Night: dark purple/black */
  :global(body.night) {
    background: linear-gradient(180deg, #1e1b4b 0%, #0f172a 50%, #020617 100%);
    background-attachment: fixed;
    color: #ffffff;
  }

  :global(*), :global(*::before), :global(*::after) { box-sizing: border-box; }

  .container { max-width: 920px; margin: 3rem auto; padding: 0 2rem; }
  
  h1 { letter-spacing: 0.5px; margin: 0 0 0.5rem 0; font-weight: 700; font-size: 2rem; }
  :global(body.sunrise) h1,
  :global(body.midday) h1,
  :global(body.sunset) h1 { color: #78350f; }
  :global(body.dusk) h1,
  :global(body.night) h1 { color: #ffffff; }

  .subtle { font-size: 1rem; margin-bottom: 1.5rem; }
  :global(body.sunrise) .subtle,
  :global(body.midday) .subtle,
  :global(body.sunset) .subtle { color: #92400e; }
  :global(body.dusk) .subtle,
  :global(body.night) .subtle { color: #cccccc; }

  .row { display: flex; gap: 0.75rem; align-items: center; }
  .chat {
    border-radius: 20px;
    padding: 1.75rem;
    min-height: 400px;
    max-height: 700px;
    overflow-y: auto;
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    -webkit-overflow-scrolling: touch;
    backdrop-filter: blur(10px);
  }
  .flexcol { display: flex; flex-direction: column; gap: 0.4rem; }
  .bubble { 
    padding: 0.65rem 1rem; 
    border-radius: 16px; 
    margin: 0.2rem 0; 
    max-width: 75%; 
    white-space: pre-wrap; 
    line-height: 1.5;
    font-size: 0.95rem;
    position: relative;
  }
  .user { 
    background: rgba(147, 197, 253, 0.25); 
    color: #1e3a8a; 
    align-self: flex-end; 
    border: 1px solid rgba(147, 197, 253, 0.4);
    text-transform: none;
  }
  .assistant { 
    background: rgba(255, 255, 255, 0.9); 
    color: #0f172a; 
    align-self: flex-start; 
    border: 1px solid rgba(229, 231, 235, 0.6);
    text-transform: none;
    display: flex;
    gap: 0.75rem;
    align-items: start;
  }
  
  .welcome {
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid rgba(245, 158, 11, 0.3);
    display: flex;
    align-items: center;
    font-style: italic;
    opacity: 1;
    padding: 1rem 1.25rem;
  }
  
  .welcome .message-content {
    width: 100%;
    text-align: center;
  }
  
  .bubble:hover { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); }
  
  .bird-circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
    border: 2px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    position: relative;
  }

  .pie-chart-circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    flex-shrink: 0;
    border: 2px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    position: relative;
  }
  
  .message-content {
    flex: 1;
    padding-top: 0.15rem;
  }

  .bird-legend {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .bird-legend-circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
    border: 2px solid rgba(0, 0, 0, 0.15);
    cursor: help;
    position: relative;
    transition: transform 0.2s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  }

  .bird-legend-circle:hover {
    transform: scale(1.15);
  }

  .bird-tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    font-size: 0.75rem;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: 100;
    text-transform: none;
  }

  .bird-legend-circle:hover .bird-tooltip {
    opacity: 1;
  }

  .bird-tooltip strong {
    display: block;
    margin-bottom: 0.15rem;
  }
  
  .meta { color: var(--muted); font-size: 0.75rem; margin-bottom: 0.25rem; opacity: 0.7; }

  .toolbar { display: flex; gap: 1.25rem; align-items: center; justify-content: space-between; margin: 1.25rem 0 2rem 0; }

  input[type="text"] {
    padding: 0.9rem 1.1rem; 
    border-radius: 16px; 
    border: 2px solid rgba(255, 255, 255, 0.5); 
    background: rgba(255, 255, 255, 0.9);
    outline: none; 
    transition: all .2s ease;
    font-size: 0.95rem;
    text-transform: none;
  }
  input[type="text"]:focus { 
    border-color: var(--primary); 
    box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
    background: rgba(255, 255, 255, 1);
  }

  :global(button) { 
    padding: 0.8rem 1.25rem; 
    border: 2px solid transparent; 
    border-radius: 16px; 
    background: var(--primary); 
    color: white; 
    cursor: pointer; 
    font-weight: 600;
    transition: all 0.2s ease;
    font-size: 0.9rem;
  }
  :global(button:hover) { 
    background: var(--primary-600); 
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37,99,235,0.3);
  }
  :global(button.secondary) { 
    background: rgba(255, 255, 255, 0.9); 
    color: var(--text); 
    border-color: rgba(255, 255, 255, 0.5);
  }
  :global(button.secondary:hover) { 
    background: rgba(255, 255, 255, 1);
    border-color: rgba(229, 231, 235, 0.8);
  }

  button {
    position: relative;
  }

  .button-tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    font-size: 0.75rem;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: 100;
    text-transform: none;
  }

  button:hover .button-tooltip {
    opacity: 1;
  }


  .debug { 
    background: rgba(255, 255, 255, 0.9); 
    border: 2px dashed rgba(229, 231, 235, 0.6); 
    padding: 1.25rem; 
    margin-top: 1.25rem; 
    border-radius: 16px; 
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; 
    font-size: 0.85rem;
    text-transform: none;
  }

  .error {
    background: rgba(254, 226, 226, 0.9);
    color: #7f1d1d;
    border: 2px solid rgba(254, 202, 202, 0.6);
    padding: 1rem 1.25rem;
    border-radius: 16px;
    margin: 1rem 0 1.25rem 0;
    text-transform: none;
  }

  .typing { display: inline-flex; gap: 6px; align-items: center; }
  .dot { width: 7px; height: 7px; background: #a3aab8; border-radius: 50%; animation: blink 1.4s infinite both; }
  .dot:nth-child(2) { animation-delay: .2s; }
  .dot:nth-child(3) { animation-delay: .4s; }
  @keyframes blink { 0%, 80%, 100% { opacity: 0.2; } 40% { opacity: 1; } }

  .theme-label {
    font-size: 0.9rem;
    font-weight: 600;
  }

  :global(body.sunrise) .theme-label,
  :global(body.midday) .theme-label,
  :global(body.sunset) .theme-label { color: #78350f; }
  :global(body.dusk) .theme-label,
  :global(body.night) .theme-label { color: #cccccc; }

  .time-slider-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
  }

  .time-slider-container label {
    font-size: 0.85rem;
    font-weight: 600;
    white-space: nowrap;
  }

  :global(body.sunrise) .time-slider-container label,
  :global(body.midday) .time-slider-container label,
  :global(body.sunset) .time-slider-container label { color: #78350f; }
  :global(body.dusk) .time-slider-container label,
  :global(body.night) .time-slider-container label { color: #cccccc; }

  input[type="range"] {
    flex: 1;
    height: 8px;
    border-radius: 10px;
    background: linear-gradient(to right, 
      #fbbf24 0%, 
      #3b82f6 25%, 
      #ec4899 50%, 
      #7c3aed 75%, 
      #0f172a 100%
    );
    outline: none;
    appearance: none;
    -webkit-appearance: none;
  }

  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    border: 3px solid var(--primary);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  input[type="range"]::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    border: 3px solid var(--primary);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  .time-label {
    font-size: 0.85rem;
    font-weight: 600;
    min-width: 70px;
    text-align: center;
    padding: 0.4rem 0.8rem;
    border-radius: 12px;
  }

  :global(body.sunrise) .time-label,
  :global(body.midday) .time-label,
  :global(body.sunset) .time-label { 
    background: rgba(255, 255, 255, 0.6);
    color: #78350f;
  }
  :global(body.dusk) .time-label,
  :global(body.night) .time-label { 
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }

  .datetime-display {
    text-align: left;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    min-width: 180px;
  }

  :global(body.sunrise) .datetime-display,
  :global(body.midday) .datetime-display,
  :global(body.sunset) .datetime-display {
    background: rgba(255, 255, 255, 0.3);
    border: 2px solid rgba(255, 255, 255, 0.4);
  }

  :global(body.dusk) .datetime-display,
  :global(body.night) .datetime-display {
    background: rgba(255, 255, 255, 0.08);
    border: 2px solid rgba(255, 255, 255, 0.15);
  }

  .datetime-display .date {
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 0.15rem;
  }

  :global(body.sunrise) .datetime-display .date,
  :global(body.midday) .datetime-display .date,
  :global(body.sunset) .datetime-display .date { color: #78350f; }
  :global(body.dusk) .datetime-display .date,
  :global(body.night) .datetime-display .date { color: #ffffff; }

  .datetime-display .time {
    font-size: 1.1rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
  }

  :global(body.sunrise) .datetime-display .time,
  :global(body.midday) .datetime-display .time,
  :global(body.sunset) .datetime-display .time { color: #92400e; }
  :global(body.dusk) .datetime-display .time,
  :global(body.night) .datetime-display .time { color: #e5e7eb; }

  .datetime-slider-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 640px) {
    .bubble { max-width: 92%; }
    .toolbar { gap: 0.75rem; flex-wrap: wrap; }
    .container { margin: 1.5rem auto; padding: 0 1.25rem; }
    h1 { font-size: 1.5rem; }
  }
</style>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="container">
  <h1>news nest</h1>
  <div class="subtle">your cozy, unbiased guide to current events</div>
  
  <!-- Date/Time and Slider Row -->
  <div class="datetime-slider-row">
    <!-- Date and Time Display -->
    <div class="datetime-display">
      <div class="date">{formatDate(currentDateTime)}</div>
      <div class="time">{formatTime(currentDateTime)}</div>
    </div>

    <!-- Time of Day Slider -->
    <div class="time-slider-container">
      <input 
        id="time-slider"
        type="range" 
        min="0" 
        max="4" 
        step="1"
        bind:value={timeSlider}
        aria-label="Select time of day"
      />
      <div class="time-label">
        {['sunrise', 'midday', 'sunset', 'dusk', 'night'][timeSlider]}
      </div>
    </div>
  </div>

  <div class="toolbar">
    <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
      <span class="theme-label">mode:</span>
      <button
        class={orchestratorType === 'router' ? '' : 'secondary'}
        on:click={() => orchestratorType = 'router'}
      >
        single voice
        <div class="button-tooltip">
          one bird responds based on your query (dove, owl, wren, or robin)
        </div>
      </button>
      <button
        class={orchestratorType === 'synthesizer' ? '' : 'secondary'}
        on:click={() => orchestratorType = 'synthesizer'}
      >
        blended tweet
        <div class="button-tooltip">
          2-3 birds respond together in one cozy, tweet-like message
        </div>
      </button>
    </div>
    
    <div class="bird-legend">
      <div class="bird-legend-circle" style="background-color: #fbbf24;">
        🕊️
        <div class="bird-tooltip">
          <strong>dove</strong>
          uplifting • highlights progress
        </div>
      </div>
      <div class="bird-legend-circle" style="background-color: #8b5cf6;">
        🦉
        <div class="bird-tooltip">
          <strong>owl</strong>
          reflective • provides context
        </div>
      </div>
      <div class="bird-legend-circle" style="background-color: #3b82f6;">
        🐦
        <div class="bird-tooltip">
          <strong>wren</strong>
          factual • verifies information
        </div>
      </div>
      <div class="bird-legend-circle" style="background-color: #ef4444;">
        🐦
        <div class="bird-tooltip">
          <strong>robin</strong>
          relatable • connects to daily life
        </div>
      </div>
    </div>
  </div>

  {#if errorMsg}
    <div class="error" role="alert">
      {errorMsg}
    </div>
  {/if}

  <div class="chat flexcol">
    {#if messages.length === 0}
      <div class="bubble assistant welcome">
        <div class="message-content">
          {getInitialGreeting()}
        </div>
      </div>
    {/if}
    {#each messages as m, i}
      {#if m.role === 'user'}
        <div class="bubble user">
          {m.content}
        </div>
      {:else}
        {@const birdInfo = getBirdInfo(m.agent)}
        <div class="bubble assistant">
          {#if birdInfo}
            {#if birdInfo.isBlended}
              <div class="pie-chart-circle" style="background: {createPieChartGradient(birdInfo.colors)};"></div>
            {:else}
              <div class="bird-circle" style="background-color: {birdInfo.color};">
                {birdInfo.emoji}
              </div>
            {/if}
          {/if}
          <div class="message-content">
            {m.content}
          </div>
        </div>
      {/if}
    {/each}
    {#if isLoading}
      <div class="bubble assistant">
        <div class="typing" aria-label="Assistant is typing">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
    {/if}
  </div>

  <div class="row" style="margin-top: 0.75rem;">
    <input type="text"
      placeholder="Ask about any current event or news topic..."
      bind:value={input}
      on:keydown={(e) => e.key === 'Enter' && send()}
      style="flex: 1; padding: 0.6rem; border-radius: 6px; border: 1px solid #ddd;"
    />
    <button on:click={send}>send</button>
  </div>

  {#if debugOpen}
    <div class="debug">
      <div><strong>messages:</strong> {messages.length}</div>
      {#if replierInput}
        <div style="margin-top: 0.5rem;">
          <div><strong>mode:</strong> {replierInput.orchestratorType || 'router'}</div>
          <div><strong>context count:</strong> {replierInput.contextCount}</div>
          <div><strong>bird(s) selected:</strong> {replierInput.agent || 'n/a'}</div>
          <div><strong>selection reason:</strong> {replierInput.reasons || 'n/a'}</div>
          <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.5rem; margin-top: 0.35rem;">
            {#each Object.entries(replierInput.frameSet?.frames || {}) as [name, p]}
              <div><strong>{name}:</strong> {p?.value}</div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}

</div>
