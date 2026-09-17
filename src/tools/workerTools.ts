import { DecisionMaker, Prospect, TargetCriteria } from '../types';
import { SEEDED_PROSPECTS } from '../data/seedData';

export interface ToolExecutionResult<T> {
  toolName: string;
  input: Record<string, unknown>;
  output: T;
  executionTimeMs: number;
  success: boolean;
  statusMessage: string;
}

export class WorkerToolProvider {
  /**
   * Tool: researchCompanies
   * Discovers candidate companies matching specific industry, size, and location criteria.
   */
  async researchCompanies(criteria: TargetCriteria): Promise<ToolExecutionResult<{ totalFound: number; companies: Array<{ name: string; industry: string; employees: number; location: string }> }>> {
    const start = Date.now();
    // Simulate real-time lookup or pull from candidate pool
    const candidates = SEEDED_PROSPECTS.map((p) => ({
      name: p.company,
      industry: p.industry,
      employees: p.employeeCount,
      location: p.location,
    }));

    return {
      toolName: 'researchCompanies',
      input: { criteria },
      output: {
        totalFound: 32,
        companies: candidates.slice(0, 10),
      },
      executionTimeMs: Date.now() - start + 450,
      success: true,
      statusMessage: `Discovered 32 potential companies matching ${criteria.industry} (${criteria.companySize}) in ${criteria.location}`,
    };
  }

  /**
   * Tool: researchCompany
   * Deep dive on specific company facility signals, operational expansions, and fleet profile.
   */
  async researchCompany(companyId: string): Promise<ToolExecutionResult<Partial<Prospect>>> {
    const start = Date.now();
    const prospect = SEEDED_PROSPECTS.find((p) => p.id === companyId) || SEEDED_PROSPECTS[0];

    return {
      toolName: 'researchCompany',
      input: { companyId, companyName: prospect.company },
      output: {
        company: prospect.company,
        website: prospect.website,
        employeeCount: prospect.employeeCount,
        operationalSignals: prospect.operationalSignals,
        companySummary: prospect.companySummary,
      },
      executionTimeMs: Date.now() - start + 320,
      success: true,
      statusMessage: `Retrieved operational profile and expansion signals for ${prospect.company}`,
    };
  }

  /**
   * Tool: analyzeFit
   * Evaluates company against target ICP, assessing operational complexity, growth signals, and software adoption readiness.
   */
  async analyzeFit(company: Prospect, criteria: TargetCriteria): Promise<ToolExecutionResult<{ fitScore: number; fitAssessment: 'High fit' | 'Medium fit' | 'Low fit' | 'Disqualified'; reasons: string[]; frictionPoints?: string[] }>> {
    const start = Date.now();
    const isTargetSize = company.employeeCount >= 50 && company.employeeCount <= 500;
    const isIndustryMatch = company.industry.toLowerCase().includes('logistics') || company.industry.toLowerCase().includes('freight') || company.industry.toLowerCase().includes('transport');

    let fitScore = company.fitScore;
    let fitAssessment = company.fitAssessment;

    if (!isTargetSize && company.employeeCount > 1000) {
      fitScore = 20;
      fitAssessment = 'Disqualified';
    } else if (isTargetSize && isIndustryMatch) {
      fitScore = Math.max(75, company.fitScore);
      fitAssessment = fitScore > 85 ? 'High fit' : 'Medium fit';
    }

    return {
      toolName: 'analyzeFit',
      input: {
        companyName: company.company,
        headcount: company.employeeCount,
        industry: company.industry,
        targetIndustry: criteria.industry,
      },
      output: {
        fitScore,
        fitAssessment,
        reasons: company.reasonsForQualification.length > 0 ? company.reasonsForQualification : [
          'Headcount matches target ICP range',
          'Active regional logistics operations',
          'Multi-facility operations detected',
        ],
        frictionPoints: company.frictionPoints,
      },
      executionTimeMs: Date.now() - start + 280,
      success: true,
      statusMessage: `Assessed ${company.company}: ${fitAssessment} (${fitScore}/100)`,
    };
  }

  /**
   * Tool: findDecisionMaker
   * Identifies highest authority operational persona matching target job title.
   */
  async findDecisionMaker(company: Prospect, targetTitle: string): Promise<ToolExecutionResult<DecisionMaker>> {
    const start = Date.now();
    const decisionMaker: DecisionMaker = {
      id: `dm-${company.id}`,
      name: company.relevantPerson || 'Alex Vance',
      jobTitle: company.jobTitle || targetTitle,
      department: 'Operations',
      email: `${company.relevantPerson.toLowerCase().replace(/\s+/g, '.')}@${company.website}`,
      linkedinSnippet: `https://linkedin.com/in/${company.relevantPerson.toLowerCase().replace(/\s+/g, '-')}`,
      backgroundSummary: `Oversees regional fleet operations, warehouse cross-docking, and carrier dispatch workflows at ${company.company}.`,
      tenureYears: 4,
    };

    return {
      toolName: 'findDecisionMaker',
      input: { companyName: company.company, targetTitle },
      output: decisionMaker,
      executionTimeMs: Date.now() - start + 350,
      success: true,
      statusMessage: `Identified ${decisionMaker.name} (${decisionMaker.jobTitle}) at ${company.company}`,
    };
  }

  /**
   * Tool: generateOutreach
   * Crafts personalized, high-conversion B2B email referencing specific operational news and pains.
   */
  async generateOutreach(company: Prospect, decisionMaker: DecisionMaker, criteria: TargetCriteria): Promise<ToolExecutionResult<{ subject: string; body: string; label: string }>> {
    const start = Date.now();

    const subject = company.personalizedOutreach?.subject || `Operational dispatch efficiency at ${company.company}`;
    const body = company.personalizedOutreach?.body || `Hi ${decisionMaker.name.split(' ')[0]},\n\nI noticed ${company.company}'s recent operations and growth across ${company.location}.\n\nWhen scaling regional logistics, dispatch and operations teams often face bottlenecks tracking load status across multiple depots.\n\nWe built our platform specifically to help multi-facility operators automate driver tracking and cut dock dwell time.\n\nWould you be open to a 10-minute conversation next week?\n\nBest regards,\nAlex Mercer`;

    return {
      toolName: 'generateOutreach',
      input: {
        company: company.company,
        recipient: decisionMaker.name,
        role: decisionMaker.jobTitle,
        signals: company.operationalSignals,
      },
      output: {
        subject,
        body,
        label: 'Prepared by Worker',
      },
      executionTimeMs: Date.now() - start + 480,
      success: true,
      statusMessage: `Generated personalized outreach for ${decisionMaker.name} at ${company.company}`,
    };
  }
}

export const workerToolProvider = new WorkerToolProvider();
