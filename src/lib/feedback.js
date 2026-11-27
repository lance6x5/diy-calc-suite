// Builds pre-filled GitHub "new issue" URLs for in-app feedback.
// The app is static: no tokens and no API calls. The user submits the issue
// with their own GitHub account. Only the app version and a trimmed browser
// string go into the URL, never any user data from the app.

export const REPO_URL = 'https://github.com/lance6x5/diy-calc-suite';
export const ISSUES_URL = `${REPO_URL}/issues`;

const MAX_ENV_LENGTH = 160;

/** Trim and collapse a user-agent string so the URL stays short. */
export function trimEnvironment(ua = '') {
  const clean = String(ua).replace(/\s+/g, ' ').trim();
  return clean.length > MAX_ENV_LENGTH ? `${clean.slice(0, MAX_ENV_LENGTH - 1)}…` : clean;
}

/**
 * Build a new-issue URL for the given kind ('bug' or 'feature').
 * @param {'bug'|'feature'} kind
 * @param {{ version?: string, userAgent?: string }} [opts]
 */
export function buildIssueUrl(kind, { version = '', userAgent = '' } = {}) {
  const isBug = kind === 'bug';
  const params = new URLSearchParams();
  params.set('template', isBug ? 'bug_report.yml' : 'feature_request.yml');
  params.set('title', isBug ? '[Bug]: ' : '[Feature]: ');
  if (version) params.set('version', version);
  if (isBug) {
    const env = trimEnvironment(userAgent);
    if (env) params.set('environment', env);
  }
  return `${ISSUES_URL}/new?${params.toString()}`;
}
