export type Service = {
  slug: string
  icon: 'shield' | 'bot' | 'flask' | 'landmark' | 'workflow' | 'graduation'
  title: string
  summary: string
  deliverables: string[]
}

/** Consulting offerings — shared by the home page and /services */
export const services: Service[] = [
  {
    slug: 'risk-analysis',
    icon: 'shield',
    title: 'Risk analysis',
    summary:
      'AI-assisted risk reviews for treasuries, LP positions and protocols: concentration, liquidity depth, impermanent loss, validator and counterparty exposure, stress-tested against real on-chain history.',
    deliverables: ['Position & treasury risk reports', 'Scenario and stress tests', 'Automated risk alerts'],
  },
  {
    slug: 'ai-integration',
    icon: 'bot',
    title: 'AI integration',
    summary:
      'We wire AI into the tools your team already uses: RPC nodes, indexers, block explorers, spreadsheets and internal APIs. Built with tool use and MCP servers, so answers come from your data, not guesswork.',
    deliverables: ['Custom MCP servers & tools', 'Internal research assistants', 'Slack / dashboard integrations'],
  },
  {
    slug: 'data-science',
    icon: 'flask',
    title: 'On-chain data science',
    summary:
      'From raw blocks to decisions. Data pipelines, statistical modelling, anomaly detection and forecasting, with AI speeding up exploration while our analysts verify every number.',
    deliverables: ['Data pipelines & warehouses', 'Models, forecasts & anomaly detection', 'Dashboards like ours'],
  },
  {
    slug: 'governance-intelligence',
    icon: 'landmark',
    title: 'Governance intelligence',
    summary:
      'Proposal summaries, impact analysis and validator scorecards, generated with AI and reviewed by people who have voted on hundreds of proposals as an active validator.',
    deliverables: ['Proposal briefs & impact analysis', 'Validator scoring', 'Voting-policy support'],
  },
  {
    slug: 'workflow-automation',
    icon: 'workflow',
    title: 'Workflow automation',
    summary:
      'Hand the repetitive work to agents: daily treasury reports, reconciliation, research digests and monitoring that flags only what needs a human.',
    deliverables: ['Scheduled reports & digests', 'Agentic monitoring', 'Human-in-the-loop review flows'],
  },
  {
    slug: 'enablement',
    icon: 'graduation',
    title: 'Team enablement',
    summary:
      'Workshops that get analysts, traders and engineers productive with AI: prompting for analysis, evaluating outputs, and safe patterns for working with financial data.',
    deliverables: ['Hands-on workshops', 'Prompt & evaluation playbooks', 'Ongoing office hours'],
  },
]

export const process = [
  {
    step: '01',
    title: 'Discover',
    body: 'We map your workflows, data sources and risk questions, and find where AI will save the most time or catch the most risk.',
  },
  {
    step: '02',
    title: 'Prototype',
    body: 'Within a couple of weeks you get a working prototype on your real data, so you can judge the value before committing further.',
  },
  {
    step: '03',
    title: 'Integrate',
    body: 'We harden it: connect your systems, add evaluations and guardrails, and fit it into how your team already works.',
  },
  {
    step: '04',
    title: 'Hand off',
    body: 'Documentation, training and optional ongoing support, so your team owns the result.',
  },
]
