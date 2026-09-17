import { DecisionMaker, Prospect, TargetCriteria } from '../types';

export interface AIConfig {
  liveAiAvailable: boolean;
  model: string;
  mode: string;
}

export class AIService {
  private configCache: AIConfig | null = null;

  async getConfig(): Promise<AIConfig> {
    if (this.configCache) return this.configCache;
    try {
      const res = await fetch('/api/worker/config');
      if (res.ok) {
        this.configCache = await res.json();
        return this.configCache!;
      }
    } catch {
      // Offline / client-only fallback
    }
    return { liveAiAvailable: false, model: 'demo-mode', mode: 'deterministic' };
  }

  async generatePlan(goal: string, criteria: TargetCriteria, forceDemoMode = false) {
    if (forceDemoMode) {
      return {
        source: 'demo_mode',
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
      };
    }

    try {
      const res = await fetch('/api/worker/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, criteria }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Network call to /api/worker/plan failed, using client demo fallback', e);
    }

    return {
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
    };
  }

  async evaluateProspect(company: Prospect, criteria: TargetCriteria, forceDemoMode = false) {
    if (forceDemoMode) {
      return {
        fitScore: company.fitScore,
        fitAssessment: company.fitAssessment,
        reasons: company.reasonsForQualification,
        recommendedApproach: company.recommendedApproach,
      };
    }

    try {
      const res = await fetch('/api/worker/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, criteria }),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    return {
      fitScore: company.fitScore,
      fitAssessment: company.fitAssessment,
      reasons: company.reasonsForQualification,
      recommendedApproach: company.recommendedApproach,
    };
  }

  async generateOutreach(company: Prospect, decisionMaker: DecisionMaker, forceDemoMode = false) {
    if (forceDemoMode && company.personalizedOutreach) {
      return {
        subject: company.personalizedOutreach.subject,
        body: company.personalizedOutreach.body,
        label: 'Prepared by Worker',
      };
    }

    try {
      const res = await fetch('/api/worker/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, decisionMaker }),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    return {
      subject: company.personalizedOutreach?.subject || `Operational dispatch efficiency at ${company.company}`,
      body: company.personalizedOutreach?.body || `Hi ${decisionMaker.name.split(' ')[0]},\n\nI noticed ${company.company}'s expansion in ${company.location}.\n\nWould you be open to a 10-minute briefing?\n\nBest regards,\nAlex Mercer`,
      label: 'Prepared by Worker',
    };
  }
}

export const aiService = new AIService();
