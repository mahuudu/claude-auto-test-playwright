// Canonical schema for docs/crawl/<feature>/<page>/crawl-data.json
// crawl.js writes the skeleton; Claude fills in the analysis fields.

export interface CrawlData {
  crawledAt: string;
  url: string;
  title: string;
  metaDescription: string;
  pageType: 'landing' | 'login' | 'dashboard' | 'product' | 'blog' | 'checkout' | 'other';
  purpose: string;
  headings: Array<{ level: 'H1' | 'H2' | 'H3'; text: string }>;
  interactiveElements: {
    buttons: Array<{ text: string; purpose: string }>;
    links: Array<{ text: string; href: string; purpose: string }>;
    inputs: Array<{ type: string; label: string; placeholder: string }>;
    forms: Array<{ purpose: string; fields: string[] }>;
  };
  keyFeatures: string[];
  testableScenarios: string[];
  potentialIssues: string[];
}
