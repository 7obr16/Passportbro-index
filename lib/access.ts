/** Slug of the free sample country — always fully accessible, no signup required. */
export const FREE_COUNTRY_SLUG = "philippines";

type UserLike = { has_paid?: boolean | null; email?: string | null } | null | undefined;

const ADMIN_EMAILS = new Set(["emilio.arnold99@googlemail.com"]);

/**
 * Returns true when a user is allowed to see premium content for a country.
 *
 * Rules (evaluated in order):
 *  0. Development bypass — grants full access in local dev so the paywall
 *     never blocks testing. Has zero effect in production.
 *  1. Philippines is the free sample — always accessible.
 *  2. A signed-in user whose profile has `has_paid = true` gets full access.
 *  3. Everyone else is locked.
 */
export const hasAccess = (user: UserLike, countrySlug: string): boolean => {
  if (process.env.NODE_ENV === "development") return true;
  if (countrySlug === FREE_COUNTRY_SLUG) return true;
  if (user?.email && ADMIN_EMAILS.has(user.email)) return true;
  if (user?.has_paid === true) return true;
  return false;
};

/** Canonical alias — preferred name going forward. Identical logic to hasAccess. */
export const hasAccessToCountry = hasAccess;
