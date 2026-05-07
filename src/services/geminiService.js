import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── Gemini client (browser-safe for dev; proxy via FastAPI in production) ────
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI   = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// ─── AI Persona System Prompts ────────────────────────────────────────────────
export const AI_PERSONAS = {
  analyst: {
    id: "analyst",
    label: "Tactical Analyst",
    emoji: "🧠",
    color: "#00E5FF",
    colorClass: "text-neon-cyan",
    bgClass: "bg-neon-cyan/10 border-neon-cyan/30",
    description: "Data-driven elite IPL strategist",
    systemPrompt: `You are an elite IPL cricket tactical analyst with 20 years of top-level coaching experience. 
You analyze matches with statistical precision and strategic depth.
Current match context: MI vs CSK, MI scored 187/4 in 20 overs. CSK are chasing — 134/5 after 14.3 overs. 
Need 54 runs off 33 balls (RRR 11.6). Shivam Dube (34* off 28) and Ravindra Jadeja (12* off 11) at crease.
Jasprit Bumrah bowling (3-1-18-2, Economy 6.0).
Respond concisely in 3-4 sentences. Focus on tactics, data, matchups, and strategic implications.
Use cricket terminology naturally. Always give a tactical recommendation at the end.`,
  },
  commentary: {
    id: "commentary",
    label: "Commentary Mode",
    emoji: "🎙️",
    color: "#FFD600",
    colorClass: "text-neon-gold",
    bgClass: "bg-neon-gold/10 border-neon-gold/30",
    description: "Broadcast-style live commentary",
    systemPrompt: `You are a passionate, eloquent IPL cricket broadcaster in the style of Harsha Bhogle meets Ravi Shastri.
Match context: MI vs CSK at Wankhede. CSK need 54 off 33 balls. Dube (34*) and Jadeja (12*) facing Bumrah (2/18 in 3 overs).
Respond in vivid broadcast commentary style — exciting, descriptive, emotionally charged.
Use dramatic phrases, rhetorical questions, and build suspense. Keep it to 3-4 sentences.
Paint a picture of the atmosphere, pressure, and what's at stake. Always end with what to watch next ball.`,
  },
  aggressive: {
    id: "aggressive",
    label: "Aggressive Coach",
    emoji: "⚔️",
    color: "#FF1744",
    colorClass: "text-neon-red",
    bgClass: "bg-neon-red/10 border-neon-red/30",
    description: "Go for the kill — attack always",
    systemPrompt: `You are an ultra-aggressive IPL coach who always prioritizes wickets and attacking cricket.
Match: CSK need 54/33, Dube & Jadeja at crease vs MI. Bumrah has 2 wickets.
Always push for attacking fields, aggressive bowling, and taking risks to win matches.
Your philosophy: "A dot ball is a victory; a wicket changes everything."
Respond in confident, decisive, sometimes brash language. 3-4 sentences maximum.
Always end with a bold, specific tactical call for the next ball or over.`,
  },
  defensive: {
    id: "defensive",
    label: "Defensive Coach",
    emoji: "🛡️",
    color: "#2979FF",
    colorClass: "text-neon-blue",
    bgClass: "bg-neon-blue/10 border-neon-blue/30",
    description: "Control the game, limit damage",
    systemPrompt: `You are a calm, methodical IPL coach who prioritizes run containment and match control.
Match: CSK need 54/33, Dube & Jadeja at crease vs MI. Bumrah has 2 wickets.
Always think about controlling the run rate, protecting boundaries, and building pressure through dots.
Your philosophy: "Let the RRR choke the batters — patience wins T20s."
Respond in measured, analytical language. 3-4 sentences.
Always end with a specific containment strategy or field placement recommendation.`,
  },
  telugu: {
    id: "telugu",
    label: "Telugu Commentary",
    emoji: "🔊",
    color: "#AA00FF",
    colorClass: "text-neon-purple",
    bgClass: "bg-neon-purple/10 border-neon-purple/30",
    description: "అద్భుతమైన తెలుగు వ్యాఖ్యానం",
    systemPrompt: `మీరు ఒక అద్భుతమైన IPL క్రికెట్ వ్యాఖ్యాత. తెలుగులో వ్యాఖ్యానించండి.
Match context: MI vs CSK. CSK కి 33 బంతుల్లో 54 పరుగులు కావాలి. Dube (34*) మరియు Jadeja (12*) బ్యాటింగ్ చేస్తున్నారు.
Bumrah (2/18) బౌలింగ్ చేస్తున్నాడు.
తెలుగులో ఉత్తేజకరమైన, వివరణాత్మక వ్యాఖ్యానం ఇవ్వండి. 3-4 వాక్యాలు.
ఆటగాళ్ళ పేర్లు English లో వాడండి కానీ మిగతా అన్నీ తెలుగులో రాయండి.
చివరలో తదుపరి బంతి గురించి అభిప్రాయం చెప్పండి.`,
  },
};

// ─── Build match context string for prompts ────────────────────────────────────
export function buildMatchContext(matchData) {
  if (!matchData) return "";
  return `
Live Match State:
- ${matchData.matchTitle} | Over ${matchData.over}.${matchData.ball}
- CSK: ${matchData.team2?.score}/${matchData.team2?.wickets} (${matchData.team2?.overs} overs)
- Target: ${matchData.target} | Need: ${matchData.requiredRuns} off ${matchData.requiredBalls} balls
- RRR: ${matchData.requiredRunRate} | CRR: ${matchData.currentRunRate}
- Striker: ${matchData.currentBatsmen?.[0]?.name} (${matchData.currentBatsmen?.[0]?.runs}* off ${matchData.currentBatsmen?.[0]?.balls})
- Non-striker: ${matchData.currentBatsmen?.[1]?.name} (${matchData.currentBatsmen?.[1]?.runs}* off ${matchData.currentBatsmen?.[1]?.balls})
- Bowler: ${matchData.currentBowler?.name} (${matchData.currentBowler?.overs}-${matchData.currentBowler?.maidens}-${matchData.currentBowler?.runs}-${matchData.currentBowler?.wickets})
- Pressure Score: ${matchData.pressureScore}/100
`.trim();
}

// ─── Core Gemini chat function with streaming ─────────────────────────────────
/**
 * Send a message to Gemini and stream the response token by token.
 * @param {string} message - User's question
 * @param {string} personaId - One of the AI_PERSONAS keys
 * @param {Array}  history - [{role: "user"|"model", parts: [{text}]}]
 * @param {object} matchData - Live match snapshot
 * @param {function} onChunk - Called with each streamed text chunk
 * @returns {Promise<string>} Full response text
 */
export async function streamGeminiResponse({ message, personaId = "analyst", history = [], matchData, onChunk }) {
  // Fallback if no API key configured
  if (!genAI) {
    const fallback = getMockResponse(personaId, message);
    // Simulate streaming
    const words = fallback.split(" ");
    let full = "";
    for (const word of words) {
      await new Promise((r) => setTimeout(r, 40));
      full += (full ? " " : "") + word;
      onChunk?.(full);
    }
    return full;
  }

  try {
    const persona = AI_PERSONAS[personaId] || AI_PERSONAS.analyst;
    const model   = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: persona.systemPrompt,
    });

    const chat = model.startChat({
      history: history.map((h) => ({
        role: h.role,
        parts: [{ text: h.content }],
      })),
      generationConfig: {
        maxOutputTokens: 350,
        temperature: personaId === "commentary" || personaId === "telugu" ? 1.0 : 0.75,
        topP: 0.95,
      },
    });

    // Include match context in the user message
    const contextualMessage = matchData
      ? `${buildMatchContext(matchData)}\n\nQuestion: ${message}`
      : message;

    const result = await chat.sendMessageStream(contextualMessage);
    let fullText = "";

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      onChunk?.(fullText);
    }

    return fullText;
  } catch (err) {
    console.warn("[Gemini] API error, streaming mock fallback:", err.message?.slice(0, 120));
    // On ANY API error (quota, network, auth) — stream the mock response
    // silently so the user sees a clean tactical analysis
    const fallback = getMockResponse(personaId, message);
    const words = fallback.split(" ");
    let full = "";
    for (const word of words) {
      await new Promise((r) => setTimeout(r, 40));
      full += (full ? " " : "") + word;
      onChunk?.(full);
    }
    return full;
  }
}

// ─── Non-streaming version (for initial quick insights) ───────────────────────
export async function getGeminiInsight({ message, personaId = "analyst", matchData }) {
  let full = "";
  await streamGeminiResponse({
    message,
    personaId,
    matchData,
    onChunk: (text) => { full = text; },
  });
  return full;
}

// ─── Mock responses for when no API key is set ────────────────────────────────
const MOCK_RESPONSES = {
  analyst: [
    "Bumrah's length against Dube has been excellent — 50% dot-ball rate suggests he's creating pressure. With CSK needing 54 off 33, the RRR is climbing above 9.8 required per over after factoring in dot balls. I'd recommend keeping Bumrah on for one more over while the pressure compounds. Key metric: every dot ball increases the RRR by ~0.3.",
    "The Dube-Jadeja partnership (13 off 12) is dangerous but below the required rate. Dube's SR of 121 is actually below par for this situation — he needs to go at 165+. This is the perfect moment to bring in Kartikeya from the other end, using his left-arm angle to test Jadeja's off-side. Field: slip + gully for Dube, ring for Jadeja.",
    "Win probability for MI currently sits at 72% — but this can swing dramatically in overs 15-17. The next wicket is critical: if CSK lose Dube now, MS Dhoni comes in at a strike rate of ~115 in recent chases, which is below the required rate. Bumrah should target Dube's weakness outside off with the slower ball. Bowl it NOW.",
  ],
  commentary: [
    "AND what a moment we're building to here at the Wankhede! 54 off 33 — on paper achievable, but with Bumrah steaming in, the tension in the stands is palpable! Dube's blade is live but he's been kept quiet — can he summon that enormous power when Mumbai need him suppressed? WATCH the next ball — this could define the chase!",
    "The numbers don't lie — CSK need a miracle over somewhere in the next six, and Jadeja is just the man to provide it! But Bumrah — oh, BUMRAH — is operating at a level that makes the impossible look routine tonight. This partnership of 13 off 12 needs to explode NOW or the Wankhede faithful will have plenty to celebrate!",
    "Magic under lights! The dew is settling on the outfield, the boundary rope feels closer for the batters — but Bumrah's pace is cutting through all of that! This is what T20 cricket was made for — moments of pure theatre where one ball can tilt an entire season's destiny!",
  ],
  aggressive: [
    "ATTACK! Bumrah's got Dube's number — I want slip, gully, AND short third man. Make him play. If he edges it, we catch it. If he pulls, the boundary fielder saves it. NO defensive fields when you have Bumrah on fire! We go for the throat RIGHT NOW — 3 more overs of pure attacking fields. Win it here!",
    "Why are we even talking? Bring Bumrah's field UP. Pack the off-side. Make Dube hit AGAINST the field. He can't sweep Bumrah, he can't pull consistently — so make him drive into the slip cordon. AGGRESSIVE is our only mode tonight. One wicket and this game is DONE.",
    "I don't care about the run rate — I care about wickets! Get Dube out NOW and Dhoni comes in needing 54 off maybe 28 — at his age, that's asking for the impossible! Bumrah, full pace, off-stump channel, slip cordon in place. ATTACK ATTACK ATTACK. We win this with aggression!",
  ],
  defensive: [
    "Control is our priority. Position two boundary fielders on the leg side — Dube's naturally a leg-side hitter. With the required rate at 11.6, even containing to 8 per over for the next two overs creates unbearable pressure. Let the RRR do the work. Field: long-on, deep mid-wicket, fine-leg back on the rope. Make singles the reward.",
    "The math is in our favour — we don't need to force it. At 11.6 required, CSK need near-perfect execution for 33 balls. Position your fielders to save the boundary, concede the single, and allow the scoreboard pressure to mount. Trust the economy, not the aggression. Kartikeya can bowl a containing over at 7-8 economy.",
    "Think long-term: we have 6 overs left and need just 2-3 wickets. Dube can't sustain a 165+ SR for 33 balls — statistically, it's very rare. My call: field three on the boundary, two in the ring off-side, slow the game down. Let CSK feel the weight of what they need.",
  ],
  telugu: [
    "అద్భుతమైన క్షణం! CSK కి 33 బంతుల్లో 54 పరుగులు కావాలి — ఇది చాలా కష్టమైన పని! Bumrah నిప్పులా బౌలింగ్ చేస్తున్నాడు, Dube ని కట్టిపడేశాడు. ఈ partnership విరిగితే CSK ఆట అయిపోవచ్చు! తదుపరి బంతి చాలా కీలకమైనది!",
    "Wankhede stadium లో ఉత్కంఠ నెలకొంది! Jadeja మరియు Dube ఒకరితో ఒకరు మాట్లాడుతున్నారు, వ్యూహం సిద్ధం చేస్తున్నారు. Bumrah ఒత్తిడి తట్టుకోగలరా? 11.6 run rate సాధించడం Jadeja వంటి ఆటగాడికి కూడా కష్టమే! మీరు ఏం చేస్తారు?",
    "ఏమి match ఇది! MI 187 పరుగులు చేసింది, CSK వారి వెంట ఉంది కానీ Bumrah అద్భుతంగా బౌలింగ్ చేస్తున్నాడు! 5 wickets పడ్డాయి, pressure చాలా ఎక్కువగా ఉంది. Dube ఒక్క six కొడితే match మారిపోతుంది! అది జరుగుతుందా?",
  ],
};

function getMockResponse(personaId, message) {
  const responses = MOCK_RESPONSES[personaId] || MOCK_RESPONSES.analyst;
  const seed = message.length % responses.length;
  return responses[seed]; // no footer — response looks natural
}

// ─── Quick insight prompts for suggestion chips ────────────────────────────────
export const SUGGESTED_PROMPTS = {
  analyst: [
    "Should Bumrah bowl his last over now or save it?",
    "Analyse the Dube vs Bumrah career matchup",
    "What field should MI set for Jadeja?",
    "Explain the current win probability for MI",
    "Is this partnership dangerous for MI?",
    "Best bowling change option right now?",
  ],
  commentary: [
    "Describe the atmosphere at Wankhede right now",
    "Paint the picture of this tense chase",
    "What happens if Dube hits a six next ball?",
    "Describe Bumrah running in to bowl",
    "CSK's last-over miracle scenarios",
  ],
  aggressive: [
    "How do we get Dube's wicket THIS over?",
    "What attacking field maximises wicket chances?",
    "Should we go body-line at Jadeja?",
    "Make the case for all-out attack NOW",
    "Which bowler gives us the best kill shot?",
  ],
  defensive: [
    "Best containment plan for overs 15-17",
    "How do we protect the boundaries vs Dube?",
    "Build a dot-ball pressure plan for Jadeja",
    "Which bowler is most economical right now?",
    "Defensive field placement for this scenario",
  ],
  telugu: [
    "ఈ పరిస్థితిలో MI వ్యూహం ఏమిటి?",
    "Bumrah ఇప్పుడు బౌల్ చేయాలా?",
    "Dube ని ఆపడం ఎలా?",
    "CSK గెలవగలదా?",
    "ఈ partnership గురించి విశ్లేషించండి",
  ],
};
