import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy Gemini Client Initialization with telemetry header
  let aiClient: GoogleGenAI | null = null;
  function getAIClient(): GoogleGenAI | null {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return null;
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // Resilient multi-tier model invocation with automatic retry & fallback
  async function generateWithModelFallback(
    ai: GoogleGenAI,
    contents: string,
    config: Record<string, unknown> = {}
  ): Promise<{ text: string; modelUsed: string }> {
    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let lastError: unknown = null;

    for (const model of candidateModels) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents,
            config,
          });
          if (response.text) {
            return { text: response.text, modelUsed: model };
          }
        } catch (err: unknown) {
          lastError = err;
          const errMsg = (err && typeof err === 'object' && 'message' in err) ? String((err as Record<string, unknown>).message) : String(err);
          const isCapacityIssue = errMsg.includes('503') || errMsg.includes('UNAVAILABLE') || errMsg.includes('high demand') || errMsg.includes('429');

          if (isCapacityIssue && attempt === 1) {
            await new Promise((r) => setTimeout(r, 600));
            continue;
          }
          break; // Try next candidate model
        }
      }
    }

    throw lastError;
  }

  // Health and Config Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/worker/config', (req, res) => {
    const hasKey = !!process.env.GEMINI_API_KEY;
    res.json({
      liveAiAvailable: hasKey,
      model: 'Staff OS Autonomous Core',
      mode: hasKey ? 'live_ready' : 'demo_mode_only',
      capabilities: ['structured_planning', 'prospect_evaluation', 'personalized_outreach'],
    });
  });

  // API: Generate structured worker plan
  app.post('/api/worker/plan', async (req, res) => {
    const { goal, criteria } = req.body;
    const ai = getAIClient();

    if (!ai) {
      // Deterministic structured fallback
      return res.json({
        source: 'demo_engine',
        plan: {
          objective: goal || 'Research and qualify B2B logistics prospects',
          phases: [
            { step: 1, name: 'Plan & Decompose', description: 'Validate target criteria and define qualification rules.' },
            { step: 2, name: 'Discover Companies', description: 'Scan business registries for companies matching ICP.' },
            { step: 3, name: 'Evaluate Fit', description: 'Score operations size, growth signals, and software need.' },
            { step: 4, name: 'Identify Decision Makers', description: 'Pinpoint VP Operations and logistics directors.' },
            { step: 5, name: 'Personalize Outreach', description: 'Synthesize facility expansion news into tailored emails.' },
            { step: 6, name: 'Human Approval', description: 'Pause execution for supervisor review and confirmation.' },
          ],
          scoringMatrix: { industryMatch: 35, headcountMatch: 25, growthSignal: 25, buyerAuthority: 15 },
        },
      });
    }

    try {
      const prompt = `You are the planning engine for Staff OS, an operating system for autonomous B2B AI staff.
Goal: "${goal}"
Target Criteria:
Industry: ${criteria?.industry || 'Logistics'}
Company Size: ${criteria?.companySize || '50-500 employees'}
Location: ${criteria?.location || 'United States'}
Target Title: ${criteria?.targetTitle || 'VP Operations'}

Return a structured JSON execution plan for this autonomous worker.
JSON format:
{
  "objective": string,
  "phases": [
    { "step": number, "name": string, "description": string }
  ],
  "scoringMatrix": { "industryMatch": number, "headcountMatch": number, "growthSignal": number, "buyerAuthority": number }
}`;

      const { text, modelUsed } = await generateWithModelFallback(ai, prompt, {
        responseMimeType: 'application/json',
      });

      const parsed = JSON.parse(text || '{}');
      return res.json({ source: 'live_engine', plan: parsed });
    } catch {
      console.warn('[Staff OS API] Model service high demand, activated deterministic fallback plan');
      return res.json({
        source: 'demo_fallback',
        plan: {
          objective: goal,
          phases: [
            { step: 1, name: 'Plan & Decompose', description: 'Validate target criteria and define qualification rules.' },
            { step: 2, name: 'Discover Companies', description: 'Scan business registries for companies matching ICP.' },
            { step: 3, name: 'Evaluate Fit', description: 'Score operations size, growth signals, and software need.' },
            { step: 4, name: 'Identify Decision Makers', description: 'Pinpoint VP Operations and logistics directors.' },
            { step: 5, name: 'Personalize Outreach', description: 'Synthesize facility expansion news into tailored emails.' },
            { step: 6, name: 'Human Approval', description: 'Pause execution for supervisor review and confirmation.' },
          ],
        },
      });
    }
  });

  // API: Evaluate prospect company
  app.post('/api/worker/evaluate', async (req, res) => {
    const { company, criteria } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        source: 'demo_engine',
        fitScore: company?.fitScore || 88,
        fitAssessment: company?.fitAssessment || 'High fit',
        reasons: company?.reasonsForQualification || ['Matches target industry & headcount', 'Operational growth signals detected'],
        recommendedApproach: company?.recommendedApproach || 'Highlight dispatch automation and dwell-time reduction.',
      });
    }

    try {
      const prompt = `Evaluate this company for Staff OS prospect qualification.
Company: ${company?.company || 'Acme Logistics'}
Industry: ${company?.industry || 'Logistics'}
Headcount: ${company?.employeeCount || 200}
Location: ${company?.location || 'Texas, USA'}
Signals: ${JSON.stringify(company?.operationalSignals || [])}
Target Criteria: ${JSON.stringify(criteria || {})}

Return JSON:
{
  "fitScore": number (0-100),
  "fitAssessment": "High fit" | "Medium fit" | "Low fit" | "Disqualified",
  "reasons": string[],
  "frictionPoints": string[],
  "recommendedApproach": string
}`;

      const { text, modelUsed } = await generateWithModelFallback(ai, prompt, {
        responseMimeType: 'application/json',
      });

      const parsed = JSON.parse(text || '{}');
      return res.json({ source: 'live_engine', ...parsed });
    } catch {
      console.warn('[Staff OS API] Model service high demand, activated deterministic prospect evaluation');
      return res.json({
        source: 'demo_fallback',
        fitScore: company?.fitScore || 88,
        fitAssessment: company?.fitAssessment || 'High fit',
        reasons: company?.reasonsForQualification || ['Matches target criteria'],
        recommendedApproach: company?.recommendedApproach || 'Highlight operational efficiency.',
      });
    }
  });

  // API: Generate personalized outreach
  app.post('/api/worker/outreach', async (req, res) => {
    const { company, decisionMaker } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        source: 'demo_engine',
        subject: `Operational dispatch efficiency for ${company?.company}`,
        body: `Hi ${decisionMaker?.name?.split(' ')[0] || 'there'},\n\nI noticed ${company?.company}'s recent facility growth and active regional freight operations across ${company?.location}.\n\nWhen scaling dispatch operations, cross-depot load status tracking can quickly become a manual bottleneck for operations teams.\n\nWe built our logistics software specifically to automate multi-facility status updates and reduce dock turnaround times by up to 28%.\n\nWould you be open to a brief 10-minute conversation next week to see how peer operators are streamlining dispatch?\n\nBest regards,\nAlex Mercer`,
        label: 'Prepared by AI Staff',
      });
    }

    try {
      const prompt = `You are an autonomous AI sales researcher drafting a high-converting, professional, consultative B2B email.
Company: ${company?.company}
Location: ${company?.location}
Signals: ${JSON.stringify(company?.operationalSignals || [])}
Recipient: ${decisionMaker?.name} (${decisionMaker?.jobTitle})
Product being offered: Cloud logistics dispatch & fleet visibility software that eliminates manual status check calls and reduces dock dwell times.

Rules:
- Concise (under 120 words).
- Specific hook about their recent operations or expansion.
- Clear, low-friction call-to-action (10-minute conversation).
- No generic buzzwords.
- Professional consultative tone.

Return JSON:
{
  "subject": string,
  "body": string,
  "hookUsed": string
}`;

      const { text, modelUsed } = await generateWithModelFallback(ai, prompt, {
        responseMimeType: 'application/json',
      });

      const parsed = JSON.parse(text || '{}');
      return res.json({
        source: 'live_engine',
        subject: parsed.subject,
        body: parsed.body,
        label: 'Prepared by Staff Member',
      });
    } catch {
      console.warn('[Staff OS API] Model service high demand, activated deterministic outreach draft');
      return res.json({
        source: 'demo_fallback',
        subject: `Operational dispatch efficiency for ${company?.company}`,
        body: `Hi ${decisionMaker?.name?.split(' ')[0] || 'there'},\n\nI noticed ${company?.company}'s operational growth across ${company?.location}.\n\nWould you be open to a 10-minute briefing on how multi-depot carriers are reducing dock turnaround times?\n\nBest regards,\nAlex Mercer`,
        label: 'Prepared by Staff Member',
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Staff OS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
