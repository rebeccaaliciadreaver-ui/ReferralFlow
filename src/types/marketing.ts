export type MarketingChannelId = 'product_hunt' | 'direct_outreach' | 'short_form_video';

export interface UserProfile {
  id: string;
  displayName: string;
  avatarUrl?: string;
}

export interface MarketingChannel {
  id: MarketingChannelId;
  name: string;
  priority: 'must_have' | 'high' | 'experimental';
  payoff: string;
  description: string;
}

export interface MarketingKpi {
  id: 'weekly_signups' | 'challenge_completions' | 'referral_links_sent';
  label: string;
  event: string;
  target: number;
  period: 'week';
}

export interface MarketingEvent {
  name: string;
  channel?: MarketingChannelId;
  occurredAt: string;
  metadata?: Record<string, string | number | boolean>;
}

export const marketingChannels: MarketingChannel[] = [
  { id: 'product_hunt', name: 'Product Hunt + SaaS communities', priority: 'must_have', payoff: 'Launch momentum', description: 'The neon UI and gamification loop are designed for a visual launch.' },
  { id: 'direct_outreach', name: 'Direct outreach to loyalty/growth managers', priority: 'high', payoff: 'Fastest path to customers', description: 'Use the MarketplaceKPI positioning with a short Loom demo and targeted LinkedIn messages.' },
  { id: 'short_form_video', name: 'Short-form video', priority: 'high', payoff: 'Visual reach', description: 'Show confetti, tier progress, and the LP counter in Reels and TikTok clips.' },
];

export const marketingKpis: MarketingKpi[] = [
  { id: 'weekly_signups', label: 'Weekly new signups', event: 'user.signed_up', target: 50, period: 'week' },
  { id: 'challenge_completions', label: 'Challenge completions', event: 'challenge.completed', target: 200, period: 'week' },
  { id: 'referral_links_sent', label: 'Referral links sent', event: 'referral.link_sent', target: 80, period: 'week' },
];
