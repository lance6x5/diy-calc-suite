import { describe, it, expect } from 'vitest';
import { buildIssueUrl, trimEnvironment, ISSUES_URL } from './feedback.js';

describe('feedback URL builder', () => {
  it('builds a bug report URL with version and environment', () => {
    const url = new URL(buildIssueUrl('bug', { version: '1.1.0', userAgent: 'Mozilla/5.0  (X11; Linux)' }));
    expect(`${url.origin}${url.pathname}`).toBe(`${ISSUES_URL}/new`);
    expect(url.searchParams.get('template')).toBe('bug_report.yml');
    expect(url.searchParams.get('title')).toBe('[Bug]: ');
    expect(url.searchParams.get('version')).toBe('1.1.0');
    expect(url.searchParams.get('environment')).toBe('Mozilla/5.0 (X11; Linux)');
  });

  it('builds a feature request URL without environment', () => {
    const url = new URL(buildIssueUrl('feature', { version: '1.1.0', userAgent: 'UA' }));
    expect(url.searchParams.get('template')).toBe('feature_request.yml');
    expect(url.searchParams.get('title')).toBe('[Feature]: ');
    expect(url.searchParams.get('version')).toBe('1.1.0');
    expect(url.searchParams.has('environment')).toBe(false);
  });

  it('URL-encodes values and keeps URLs short', () => {
    const raw = buildIssueUrl('bug', { version: '1.1.0', userAgent: 'a&b=c '.repeat(100) });
    expect(raw).not.toContain('a&b=c');
    expect(raw.length).toBeLessThan(600);
    expect(trimEnvironment('x'.repeat(500)).length).toBeLessThanOrEqual(160);
  });
});
