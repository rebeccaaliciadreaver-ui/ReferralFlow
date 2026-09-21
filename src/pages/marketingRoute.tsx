import type { UserProfile } from '../types/marketing';
import MarketingPage from './marketing';

// Replace this adapter with the authenticated profile from the host app.
export function MarketingRoute({ profile }: { profile: UserProfile }) {
  return <MarketingPage profile={profile} />;
}
